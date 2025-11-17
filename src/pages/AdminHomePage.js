// src/pages/AdminHomePage.js
import React from 'react';
import { FileText, BarChart3, CheckCircle } from 'lucide-react';

export default function AdminHomePage({ laporan = [] }) { 
  
  // --- PERBAIKAN DI SINI ---
  // Ubah 'Pending' (huruf besar) menjadi 'pending' (huruf kecil)
  const totalLaporanDesa = laporan.length;
  const totalSelesai = laporan.filter(l => l.status === 'Selesai').length;
  const totalProses = laporan.filter(l => l.status === 'Proses').length;
  const totalPending = laporan.filter(l => l.status === 'pending').length; // <-- PERBAIKAN
  // --- BATAS PERBAIKAN ---

  const tingkatRespon = totalLaporanDesa > 0 
    ? ((totalSelesai / totalLaporanDesa) * 100).toFixed(0) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
        <h2 className="text-lg md:text-2xl font-bold mb-1">Selamat Datang, Admin!</h2>
        <p className="text-xs md:text-sm text-blue-100">Kelola semua laporan dan aspirasi warga di sini.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">Laporan Menunggu</h3>
            <FileText className="text-orange-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalPending}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan perlu ditinjau</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">Laporan Diproses</h3>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalProses}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan sedang dikerjakan</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">Tingkat Respon</h3>
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{tingkatRespon}%</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan terselesaikan</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Panduan Mengelola Laporan</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Buka "Daftar Laporan"</h4>
              <p className="text-sm text-gray-600">Lihat semua laporan yang masuk dari warga.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Tinjau Laporan</h4>
              <p className="text-sm text-gray-600">Periksa isi laporan. Jika mengandung SARA/Toxic, gunakan tombol Hapus.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Update Status Laporan</h4>
              <p className="text-sm text-gray-600">Klik ikon "Proses" jika laporan valid, atau "Selesai" jika sudah ditangani.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Cek Transparansi</h4>
              <p className="text-sm text-gray-600">Pastikan data di halaman transparansi sudah ter-update secara otomatis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}