import React, { useState } from 'react';
import { UserCog, Save, Lock, User, AlertTriangle } from 'lucide-react';

export default function AdminSettings({ adminToken }) {
  const [formData, setFormData] = useState({
    newUsername: '',
    newPassword: '',
    currentPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- VALIDASI KETAT (BUG FIX) ---
    
    // 1. Cek Password Lama (Mutlak Wajib)
    if (!formData.currentPassword) {
      return alert("Mohon masukkan 'Password Saat Ini' untuk konfirmasi keamanan.");
    }

    // 2. Cek Username Baru & Password Baru (Keduanya Wajib Diisi)
    // Kita gunakan .trim() untuk memastikan user tidak cuma mengisi spasi
    if (!formData.newUsername.trim() || !formData.newPassword.trim()) {
      return alert("Gagal! Anda harus mengisi Username Baru DAN Password Baru.\n\nKedua kolom tersebut tidak boleh kosong.");
    }
    // --------------------------------

    if(!window.confirm("Apakah Anda yakin ingin mengubah Username & Password sekarang?")) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/admin/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Gagal update profil");

      alert("Berhasil! Username dan Password telah diperbarui.\nSistem akan logout otomatis, silakan login ulang.");
      
      // Logout paksa agar admin login dengan data baru
      localStorage.removeItem('adminToken');
      window.location.href = '/'; // Redirect ke halaman login

    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start pt-10">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-lg">
        
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <UserCog size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Pengaturan Akun</h1>
            <p className="text-sm text-gray-500">Perbarui Kredensial Admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Area Input Baru */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                <User size={16}/> Username Baru <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Masukkan username baru"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                <Lock size={16}/> Password Baru <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Masukkan password baru"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded">
            <AlertTriangle size={14} />
            <span>Kedua kolom di atas wajib diisi untuk melakukan perubahan.</span>
          </div>

          <hr className="border-gray-200" />

          {/* Konfirmasi Password Lama */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Konfirmasi Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Ketik password lama Anda disini"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none bg-gray-50 focus:bg-white transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Menyimpan...' : (
              <>
                <Save size={20} /> Simpan Perubahan
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}