// src/pages/HomePage.js
import React, { useState } from 'react';
// --- TAMBAHAN: Impor ikon baru ---
import { FileText, BarChart3, CheckCircle, Calendar, Megaphone, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
// ---------------------------------

/**
 * --- BARU: Komponen Image Slider ---
 * Diperbaiki agar gambar tidak terdistorsi (object-contain)
 */
const ImageSlider = ({ imageFiles }) => {
  const images = imageFiles ? imageFiles.map(file => file.url) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e) => {
    e.stopPropagation(); // Hentikan event agar tidak membuka modal
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation(); // Hentikan event agar tidak membuka modal
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Jika tidak ada gambar, tampilkan placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video object-contain rounded-lg mb-3 bg-gray-100 flex items-center justify-center text-gray-400">
        <ImageIcon size={40} />
      </div>
    );
  }
  
  // Jika hanya 1 gambar, tampilkan tanpa tombol
  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt="Pengumuman" 
        // --- PERBAIKAN: Gunakan 'object-contain' dan 'max-h-96' (misalnya) agar gambar tidak terpotong ---
        className="w-full h-auto max-h-96 object-contain rounded-lg mb-3 bg-gray-100" 
      />
    );
  }

  // Jika lebih dari 1 gambar, tampilkan slider
  return (
    // --- PERBAIKAN: Gunakan 'aspect-video' untuk rasio dan 'bg-gray-900/10' agar placeholder lebih baik ---
    <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gray-900/10 group mb-3">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img 
            key={index} 
            src={src} 
            alt={`Pengumuman ${index + 1}`}
            className="w-full h-full object-contain flex-shrink-0" // <-- 'object-contain'
          />
        ))}
      </div>
      
      <button 
        onClick={goToPrevious} 
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNext} 
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
            className={`w-2 h-2 rounded-full cursor-pointer ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- BARU: Komponen Modal Detail Pengumuman ---
const PengumumanDetailModal = ({ pengumuman, onClose, formatTanggal }) => {
  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      {/* Konten Modal */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Detail Pengumuman</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Slider Gambar diletakkan di sini */}
          <ImageSlider imageFiles={pengumuman.imageFiles} />
          
          <h4 className="text-xl font-bold text-gray-800">{pengumuman.judul}</h4>
          
          <span className="flex items-center space-x-1 text-sm text-gray-500 -mt-2">
            <Calendar size={16} />
            <span>Dipublikasikan pada {formatTanggal(pengumuman.createdAt)}</span>
          </span>
          
          {/* ✅ GANTI DENGAN INI: */}
        <div className="border-t pt-4 mt-2">
          <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto border border-gray-100">
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words break-all leading-relaxed">
          {pengumuman.isi}
          </p>
        </div>
      </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
// ---------------------------------------------

/**
 * Komponen untuk menampilkan daftar pengumuman
 */
const PengumumanSection = ({ pengumuman = [], onSelectPengumuman, formatTanggal }) => {
  
  const pengumumanTerbaru = pengumuman.slice(0, 3);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
      <div className="flex items-center space-x-2 mb-4">
        <Megaphone className="text-blue-600" size={24} />
        <h3 className="text-base md:text-xl font-bold text-gray-800">
          Pengumuman Desa Terbaru
        </h3>
      </div>
      
      {pengumumanTerbaru.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          Belum ada pengumuman baru dari desa.
        </p>
      ) : (
        <div className="space-y-6">
          {pengumumanTerbaru.map(item => (
            // --- PERUBAHAN: Tambah onClick untuk membuka modal ---
           <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
              onClick={() => onSelectPengumuman(item)}
            >
            {/* -------------------------------------- */}

              {/* Konten di dalamnya (gambar, judul, dll) tetap sama */}
              <div className="w-full aspect-video rounded-lg mb-3 bg-gray-100 flex items-center justify-center overflow-hidden">
            {/* --- AWAL PERBAIKAN --- */}
            {item.imageFiles && item.imageFiles.length > 0 ? (
              <img 
                src={item.imageFiles[0].url} // <-- Ambil URL dari objek pertama
                alt={item.judul} 
                className="w-full h-full object-contain" 
              />
            ) : (
               <ImageIcon size={40} className="text-gray-400" />
            )}
            {/* --- AKHIR PERBAIKAN --- */}
          </div>
              
              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{item.judul}</h4>
              <span className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                <Calendar size={14} />
                <span>Dipublikasikan pada {formatTanggal(item.createdAt)}</span>
              </span>
              
              <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                {item.isi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function HomePage({ laporan = [], pengumuman = [] }) { 
  // --- TAMBAHAN: State untuk modal ---
  const [selectedPengumuman, setSelectedPengumuman] = useState(null);
  // ----------------------------------

  const totalLaporanDesa = laporan.length;
  const totalSelesai = laporan.filter(l => l.status === 'Selesai').length;
  const tingkatRespon = totalLaporanDesa > 0 
    ? ((totalSelesai / totalLaporanDesa) * 100).toFixed(0) 
    : 0;
    
  // Fungsi helper untuk memformat tanggal (agar bisa dipakai modal)
  const formatTanggal = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
        <h2 className="text-lg md:text-2xl font-bold mb-1">Selamat Datang, Warga!</h2>
        <p className="text-xs md:text-sm text-green-50">Sampaikan aspirasi Anda untuk kemajuan desa kita bersama</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">Laporan Desa</h3>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalLaporanDesa}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Total laporan warga</p>
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
      
      {/* --- PERUBAHAN: Teruskan props untuk modal --- */}
      <PengumumanSection 
        pengumuman={pengumuman} 
        onSelectPengumuman={setSelectedPengumuman}
        formatTanggal={formatTanggal}
      />
      {/* ------------------------------------------- */}

      {/* --- PERBAIKAN: Kode Panduan Penggunaan dikembalikan --- */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Panduan Penggunaan</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Pilih Kategori Permasalahan</h4>
              <p className="text-sm text-gray-600">Tentukan kategori yang sesuai dengan laporan Anda</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Isi Detail Laporan</h4>
              <p className="text-sm text-gray-600">Jelaskan permasalahan dengan jelas dan lengkap</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Lampirkan Bukti</h4>
              <p className="text-sm text-gray-600">Upload foto atau video sebagai bukti pendukung</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm md:text-base">Kirim dan Pantau</h4>
              <p className="text-sm text-gray-600">Dapatkan notifikasi perkembangan laporan Anda</p>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------- */}

      {/* --- TAMBAHAN: Render Modal jika ada pengumuman terpilih --- */}
      {selectedPengumuman && (
        <PengumumanDetailModal 
          pengumuman={selectedPengumuman}
          onClose={() => setSelectedPengumuman(null)}
          formatTanggal={formatTanggal}
        />
      )}
      {/* --------------------------------------------------------- */}
    </div>
  );
}