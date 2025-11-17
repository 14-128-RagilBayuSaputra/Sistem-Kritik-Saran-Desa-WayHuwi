// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { LogIn, Loader } from 'lucide-react'; // <-- Impor Loader

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- State untuk loading

  // --- INI ADALAH FUNGSI BARU YANG TERHUBUNG KE BACKEND ---
  const handleLogin = async () => {
    setError(''); // Reset error
    setIsLoading(true); // Mulai loading

    try {
      // 1. Kirim data login ke backend Anda
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika server merespons dengan error (misal: 401 Gagal)
        throw new Error(data.error || 'Username atau password salah!');
      }

      // 2. Jika login berhasil, panggil onLoginSuccess (dari App.js)
      //    dan kirimkan token yang didapat dari backend
      onLoginSuccess(data.token); 

    } catch (err) {
      // Tangkap error dari fetch atau dari server
      setError(err.message);
    } finally {
      setIsLoading(false); // Berhenti loading
    }
  };
  // --- BATAS PERUBAHAN ---

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="/Logo Lampung selatan.png"
              alt="Logo Lampung Selatan"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Login Admin</h1>
          <p className="text-gray-600 text-sm">Sistem Kritik & Saran Desa</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading} // <-- Disable saat loading
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Masukkan username admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // <-- Disable saat loading
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          
          <button 
            onClick={handleLogin}
            disabled={isLoading} // <-- Disable saat loading
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm disabled:bg-gray-400"
          >
            {isLoading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}