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

  const handleDeleteLaporan = async (laporanId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${laporanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}` // <-- KIRIM TOKEN
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus laporan');
      }

      // Jika sukses di backend, update state di frontend
      setAllLaporan(allLaporan.filter(l => l.id !== laporanId));

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

  
  // --- FUNGSI PENGUMUMAN (TERHUBUNG KE BACKEND) ---
  
  const handleAddPengumuman = async (pengumumanBaru) => {
    try {
      const formData = new FormData();
      formData.append('judul', pengumumanBaru.judul);
      formData.append('isi', pengumumanBaru.isi);
      
      // 'imageFiles' sekarang berisi campuran objek File (baru) dan objek {url, filename} (lama)
      // Kita perlu memisahkan mereka
      const fileObjects = pengumumanBaru.imageFiles.filter(f => f instanceof File);
      
      for (const file of fileObjects) {
        // 'imageUrls' adalah nama field di backend
        formData.append('imageUrls', file); 
      }

      const response = await fetch('http://localhost:3001/api/pengumuman', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}` // <-- KIRIM TOKEN
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Gagal menambah pengumuman');

      const dataHasil = await response.json();
      const pengumumanDariDB = { ...dataHasil.data, id: dataHasil.data._id };

      setAllPengumuman(prev => [pengumumanDariDB, ...prev]);

    } catch (err) {
      console.error("Error di handleAddPengumuman:", err);
      alert("Gagal menambah pengumuman: " + err.message);
      throw err; // Lempar error agar form tidak reset
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
  
  // src/App.js - HANYA GANTI BAGIAN INI UNTUK FUNGSI handleEditPengumuman

// ... kode-kode Anda yang lain di App.js (seperti state, useEffects, fungsi handleAddLaporan, dll.) ...

  // --- PERBAIKAN PADA FUNGSI handleEditPengumuman ---
  // --- PERBAIKAN BESAR DI SINI ---
  // Fungsi Edit Pengumuman sekarang SELALU mengirim FormData
  const handleEditPengumuman = async (id, dataToUpdate) => {
    try {
      // 1. Selalu buat FormData, bahkan jika hanya edit teks
      const formData = new FormData();
      formData.append('judul', dataToUpdate.judul);
      formData.append('isi', dataToUpdate.isi);

      // 2. Pisahkan file lama (objek {url, filename}) dari file baru (objek File)
      const newFileObjects = dataToUpdate.imageFiles.filter(f => f instanceof File);
      const existingFileObjects = dataToUpdate.imageFiles.filter(f => !(f instanceof File));

      // 3. Tambahkan file BARU ke 'imageUrls' (sesuai nama field di backend)
      for (const file of newFileObjects) {
        formData.append('imageUrls', file); 
      }
      
      // 4. Tambahkan file LAMA (yang ingin disimpan) sebagai string JSON
      //    Backend akan membaca ini untuk tahu file mana yang tidak boleh dihapus
      formData.append('existingFiles', JSON.stringify(existingFileObjects));

      // 5. Kirim request sebagai FormData
      const response = await fetch(`http://localhost:3001/api/pengumuman/${id}`, {
        method: 'PUT',
        headers: {
          // JANGAN set 'Content-Type', biarkan browser menentukannya
          'Authorization': `Bearer ${adminToken}` 
        },
        body: formData // Kirim sebagai FormData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal mengedit pengumuman');
      }

      const dataHasil = await response.json();
      const pengumumanDariDB = { ...dataHasil.data, id: dataHasil.data._id };

      // 6. Update state frontend
      setAllPengumuman(prev => 
        prev.map(p => (p.id === id ? pengumumanDariDB : p))
      );
    } catch (err) {
      console.error("Error di handleEditPengumuman:", err);
      alert("Gagal mengedit pengumuman: " + err.message);
      throw err; // Lempar error agar form tidak reset
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