// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import { notificationsData } from './data/appData';

const initialNotifications = notificationsData;

export default function App() {
  
  // --- STATE DATA ---
  const [allLaporan, setAllLaporan] = useState([]);
  const [allPengumuman, setAllPengumuman] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('allNotificationsData');
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  // --- STATE LOGIN (PINDAH DARI AdminLayout KE SINI) ---
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('adminToken')); // true jika ada token

  // --- EFEK UNTUK MENGAMBIL DATA SAAT MEMUAT ---
  useEffect(() => {
    // Fungsi untuk mengambil data laporan
    async function fetchLaporan() {
      try {
        const response = await fetch('http://localhost:3001/api/laporan');
        const data = await response.json();
        // Ganti ID lokal (angka) dengan _id dari MongoDB (string)
        const formattedData = data.map(item => ({ ...item, id: item._id }));
        setAllLaporan(formattedData); 
      } catch (err) {
        console.error("Gagal mengambil laporan:", err);
      }
    }

    // Fungsi untuk mengambil data pengumuman
    async function fetchPengumuman() {
      try {
        const response = await fetch('http://localhost:3001/api/pengumuman');
        const data = await response.json();
        // Ganti ID lokal (angka) dengan _id dari MongoDB (string)
        const formattedData = data.map(item => ({ ...item, id: item._id }));
        setAllPengumuman(formattedData); 
      } catch (err) {
        console.error("Gagal mengambil pengumuman:", err);
      }
    }

    fetchLaporan();
    fetchPengumuman();
  }, []); // <-- Array kosong berarti "jalankan satu kali saat memuat"

  // Efek notifikasi (tidak berubah)
  useEffect(() => {
    localStorage.setItem('allNotificationsData', JSON.stringify(notifications));
  }, [notifications]);

  
  // --- FUNGSI LOGIN (DARI AdminLayout) ---
  const handleLoginSuccess = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsLoggedIn(false);
  };

  
  // --- FUNGSI LAPORAN (TERHUBUNG KE BACKEND) ---
  
  const handleAddLaporan = async (laporanBaru) => {
    try {
      const formData = new FormData();
      formData.append('nama', laporanBaru.nama);
      formData.append('telepon', laporanBaru.telepon);
      formData.append('kategori', laporanBaru.kategori);
      formData.append('judul', laporanBaru.judul);
      formData.append('deskripsi', laporanBaru.deskripsi);
      
      if (laporanBaru.files && laporanBaru.files.length > 0) {
        laporanBaru.files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch('http://localhost:3001/api/laporan', {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal mengirim laporan');
      }

      const dataHasil = await response.json();
      const laporanDariDB = { ...dataHasil.data, id: dataHasil.data._id }; 

      setAllLaporan(prevLaporan => [laporanDariDB, ...prevLaporan]);

      const adminNotif = {
        id: Date.now() + 1,
        title: 'Laporan Baru Masuk',
        message: `Laporan "${laporanBaru.judul}" dari ${laporanBaru.nama} perlu ditinjau.`,
        status: 'proses',
        time: 'Baru saja'
      };
      setNotifications(prevNotifs => [adminNotif, ...prevNotifs]);

    } catch (err) {
      console.error("Error di handleAddLaporan:", err);
      throw err; 
    }
  };

  // Di dalam src/App.js

  const handleDeleteLaporan = async (laporanId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${laporanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      // --- PERBAIKAN DI SINI ---
      // Jika sukses (200) ATAU data sudah tidak ada (404),
      // kita tetap hapus dari layar agar sinkron.
      if (response.ok || response.status === 404) {
        setAllLaporan(prev => prev.filter(l => l.id !== laporanId));
        
        // Opsional: Beri tahu user jika itu sebenarnya 404 (hanya info)
        if (response.status === 404) {
           console.log("Data sudah tidak ada di server, menghapus dari tampilan...");
        }
      } else {
        // Jika error lain (misal 500 Server Error), baru kita lempar error
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal menghapus laporan');
      }

    } catch (err) {
      console.error("Error di handleDeleteLaporan:", err);
      alert("Gagal menghapus laporan: " + err.message);
    }
  };

  const handleUpdateStatus = async (laporanId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${laporanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` // <-- KIRIM TOKEN
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Gagal update status');
      
      const dataHasil = await response.json();
      
      // Update state dengan data baru dari server
      setAllLaporan(allLaporan.map(l => {
        if (l.id === laporanId) {
          return { ...dataHasil.data, id: dataHasil.data._id }; 
        }
        return l;
      }));
    } catch (err) {
      console.error("Error di handleUpdateStatus:", err);
      alert("Gagal update status: " + err.message);
    }
  };

  const handleSetPriority = async (laporanId, newPriority) => {
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${laporanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` // <-- KIRIM TOKEN
        },
        body: JSON.stringify({ priority: newPriority })
      });

      if (!response.ok) throw new Error('Gagal update prioritas');
      
      const dataHasil = await response.json();

      setAllLaporan(allLaporan.map(l => {
        if (l.id === laporanId) {
          return { ...dataHasil.data, id: dataHasil.data._id };
        }
        return l;
      }));
    } catch (err) {
      console.error("Error di handleSetPriority:", err);
      alert("Gagal update prioritas: " + err.message);
    }
  };

  // --- FUNGSI NOTIFIKASI ---
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prevNotifs => 
      prevNotifs.filter(notif => notif.id !== notificationId)
    );
  };
  const handleClearAllNotifications = () => setNotifications([]); 

const handleAddPengumuman = async (dataPengumuman) => {
  try {
    const formData = new FormData();
    
    // 1. Masukkan data teks
    formData.append('judul', dataPengumuman.judul);
    formData.append('isi', dataPengumuman.isi);

    // 2. PERBAIKAN UTAMA DI SINI (JANGAN SALAH KETIK)
    // Backend meminta 'imageUrls', JANGAN pakai 'image' atau 'files'
    if (dataPengumuman.imageFiles && dataPengumuman.imageFiles.length > 0) {
      dataPengumuman.imageFiles.forEach((file) => {
        // INI KUNCINYA: Label harus persis 'imageUrls'
        formData.append('imageUrls', file); 
      });
    }

    // 3. Kirim ke Server
    const response = await fetch('http://localhost:3001/api/pengumuman', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}` 
        // JANGAN set Content-Type manual
      },
      body: formData
    });

    if (!response.ok) {
      // Supaya kita tahu error apa yang dibalas server (jika bukan 500)
      const errorText = await response.text();
      throw new Error(errorText || 'Gagal menambah pengumuman');
    }

    const savedData = await response.json();
    
    // Update State
    setAllPengumuman(prev => [savedData.data, ...prev]); 

    return savedData;
  } catch (error) {
    console.error("Error di handleAddPengumuman:", error);
    throw error; 
  }
};  

  const handleDeletePengumuman = async (pengumumanId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/pengumuman/${pengumumanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}` // <-- KIRIM TOKEN
        }
      });

      if (!response.ok) throw new Error('Gagal menghapus pengumuman');

      setAllPengumuman(allPengumuman.filter(p => p.id !== pengumumanId));

    } catch (err) {
      console.error("Error di handleDeletePengumuman:", err);
      alert("Gagal menghapus pengumuman: " + err.message);
    }
  };

const handleEditPengumuman = async (id, data) => {
  try {
    const formData = new FormData();

    // 1. Masukkan Data Teks Utama
    formData.append('judul', data.judul);
    formData.append('isi', data.isi);

    // 2. Pisahkan File: Mana yang LAMA (url), Mana yang BARU (file object)
    const fileLama = [];
    const fileBaru = [];

    if (data.imageFiles && data.imageFiles.length > 0) {
      data.imageFiles.forEach(item => {
        if (item instanceof File) {
          fileBaru.push(item);
        } else {
          fileLama.push(item);
        }
      });
    }

    // 3. Kirim List File Lama sebagai JSON String (agar server tahu apa yang harus dipertahankan)
    formData.append('existingFiles', JSON.stringify(fileLama));

    // 4. Kirim File Baru sebagai Binary (dengan nama 'imageUrls' agar server menerimanya)
    fileBaru.forEach(file => {
      formData.append('imageUrls', file);
    });

    // 5. Eksekusi Request ke Backend
    // Perhatikan: URL menggunakan ID yang valid
    console.log ('mengirim token:', adminToken)
    const response = await fetch(`http://localhost:3001/api/pengumuman/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`
        // Content-Type jangan di-set manual
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Gagal update pengumuman');
    }

    const savedData = await response.json();

    // 6. Update State di Layar
    setAllPengumuman(prev => prev.map(p => {
      // Cek apakah ID cocok (baik id biasa maupun _id)
      if (p.id === id || p._id === id) {
         // Kita ganti data lama dengan data baru dari server
         // PENTING: Kita tambahkan properti 'id' agar sesuai format aplikasi Anda
         return { ...savedData.data, id: savedData.data._id };
      }
      return p;
    }));
    // -------------------------------------------

    return savedData;
  } catch (error) {
    console.error("Error handleEdit:", error);
    throw error;
  }
};
  // --- BATAS PERBAIKAN ---

// ... sisa kode Anda di App.js (seperti block return dengan Routes dan Route) ...

  return (
    <Routes>
      {/* Rute untuk Admin */}
      <Route 
        path="/admin" 
        element={
          <AdminLayout 
            // Kirim state login dan fungsi-fungsinya
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            adminToken={adminToken} // <-- Kirim token
            
            laporan={allLaporan} 
            onDelete={handleDeleteLaporan}
            onUpdateStatus={handleUpdateStatus}
            onSetPriority={handleSetPriority}
            notifications={notifications}
            onDeleteNotification={handleDeleteNotification}
            onClearAllNotifications={handleClearAllNotifications}
            
            allPengumuman={allPengumuman}
            onAddPengumuman={handleAddPengumuman}
            onDeletePengumuman={handleDeletePengumuman}
            onEditPengumuman={handleEditPengumuman}
          />
        } 
      />
      
      {/* Rute untuk User (semua rute lain) */}
      <Route 
        path="*" 
        element={
          <UserLayout 
            onAddLaporan={handleAddLaporan} 
            laporanPublik={allLaporan}
            allPengumuman={allPengumuman}
          />
        } 
      />
    </Routes>
  );
}