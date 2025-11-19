import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle } from 'lucide-react'; // Tambah import icon

export default function AdminLogin({ onLoginSuccess }) {
  // State Login Biasa
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk Mode Lupa Password
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPass, setNewPass] = useState('');

  // --- HANDLER LOGIN BIASA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(data.token);
      } else {
        alert(data.error || 'Login gagal');
      }
    } catch (error) {
      alert('Terjadi kesalahan server');
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER RESET PASSWORD ---
  const handleReset = async (e) => {
    e.preventDefault();
    if (!recoveryCode || !newPass) return alert("Isi semua data!");
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/reset-password-force', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            recoveryCode: recoveryCode, 
            newPassword: newPass 
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("SUKSES! Password berhasil direset.\nSilakan login dengan password baru.");
        setIsResetMode(false); // Kembali ke mode login
        setPassword(''); // Bersihkan field
      } else {
        alert(data.error || 'Gagal reset password');
      }
    } catch (error) {
      alert('Terjadi kesalahan server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {isResetMode ? 'Pemulihan Akun' : 'Admin Panel'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isResetMode ? 'Masukkan Kode Rahasia untuk reset' : 'Masuk untuk mengelola sistem'}
          </p>
        </div>

        {/* --- FORM LOGIN BIASA --- */}
        {!isResetMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Masukkan username"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Memuat...' : 'Masuk'}
            </button>

            <div className="text-center mt-4">
                <button 
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Lupa Password?
                </button>
            </div>
          </form>
        ) : (
          
          /* --- FORM RESET PASSWORD --- */
          <form onSubmit={handleReset} className="space-y-6">
            <div className="bg-yellow-50 p-3 rounded-lg flex gap-2 text-yellow-800 text-xs mb-4 border border-yellow-200">
                <AlertCircle size={16} className="shrink-0"/>
                <span>Kode Pemulihan ada di file .env server (Hubungi Developer jika lupa).</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pemulihan (Recovery Code)</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  placeholder="Masukkan kode rahasia"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  placeholder="Password baru yang diinginkan"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </button>

            <div className="text-center mt-4">
                <button 
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="text-sm text-gray-600 hover:underline"
                >
                    Batal, kembali ke Login
                </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}