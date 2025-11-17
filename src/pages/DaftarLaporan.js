// src/pages/DaftarLaporan.js
import React, { useState } from 'react';
// --- PERBAIKAN: Menghapus 'Check' dan 'Trash2' (karena sudah ada di AdminLayout) ---
import { CheckCircle, Clock, Loader, Phone, Paperclip, MessageSquare, X, Trash2 } from 'lucide-react'; 
import { kategoriOptions } from '../data/appData';

// (Komponen Modal tidak berubah)
const LaporanDetailModal = ({ laporan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Detail Laporan</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <h4 className="text-xl font-bold text-gray-800">{laporan.judul}</h4>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Lengkap
            </label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg border">
              {laporan.deskripsi}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-semibold text-gray-700 mb-1">Pelapor</h5>
              <p>{laporan.nama}</p>
              {laporan.telepon && (
                <p className="flex items-center space-x-1 mt-1">
                  <Phone size={14} />
                  <span>{laporan.telepon}</span>
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-semibold text-gray-700 mb-1">Kategori</h5>
              <p>{laporan.kategori}</p>
            </div>
          </div>

          {laporan.files && laporan.files.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-semibold text-gray-700 mb-2">Lampiran</h5>
              <div className="space-y-2">
                {laporan.files.map((file, index) => (
                  <a 
                    key={index} 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:underline"
                  >
                    <Paperclip size={16} />
                    <span>{file.originalname || file.filename || 'Lihat Lampiran'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
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

// --- KOMPONEN UTAMA HALAMAN ---
export default function DaftarLaporan({ laporan, onDelete, onUpdateStatus, onSetPriority }) {
  
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const getStatusInfo = (status) => {
    if (status === 'Selesai') {
      return { icon: <CheckCircle size={16} className="text-green-500" />, color: "text-green-700", label: "Selesai" };
    }
    if (status === 'Proses') {
      return { icon: <Loader size={16} className="text-blue-500 animate-spin" />, color: "text-blue-700", label: "Proses" };
    }
    return { icon: <Clock size={16} className="text-orange-500" />, color: "text-orange-700", label: "Pending" };
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-100 text-red-800';
      case 'Sedang':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const kategoriFilterOptions = ['Semua', ...kategoriOptions.map(kat => kat.split(' ')[0])];

  const filteredLaporan = laporan.filter(item => {
    if (filterKategori === 'Semua') return true;
    return item.kategori.startsWith(filterKategori);
  });

  return (
    <div className=""> 
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Daftar Laporan Masuk</h2>
        
        <div className="w-full md:w-auto">
          <label htmlFor="kategoriFilter" className="block text-sm font-medium text-gray-700 md:hidden mb-1">
            Filter Kategori
          </label>
          <select 
            id="kategoriFilter"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="w-full md:w-56 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {kategoriFilterOptions.map(kat => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* --- TAMPILAN MOBILE (KARTU) --- */}
      <div className="space-y-3 md:hidden">
        {filteredLaporan.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500 border border-gray-200">
            Tidak ada laporan untuk kategori "{filterKategori}".
          </div>
        )}
        {filteredLaporan.map(item => {
          const statusInfo = getStatusInfo(item.status);
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div 
                className="p-4" 
                onClick={() => setSelectedLaporan(item)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`inline-flex items-center space-x-2 text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityInfo(item.priority)}`}>
                    Prioritas: {item.priority || 'Rendah'}
                  </span>
                </div>
                
                <h3 className="text-base font-semibold text-gray-900">{item.judul}</h3>
                <p className="text-xs text-gray-600 mb-2 truncate">{item.deskripsi}</p>
                
                <div className="text-xs text-gray-500 space-y-0.5 border-t pt-2">
                  <p><span className="font-medium text-gray-700">Pelapor:</span> {item.nama}</p>
                  <p><span className="font-medium text-gray-700">Kategori:</span> {item.kategori.split(' ')[0]}</p>
                  {item.telepon && (
                     <p className="flex items-center space-x-1"><Phone size={12} className="text-gray-400" /><span>{item.telepon}</span></p>
                  )}
                  {item.files && item.files.length > 0 && (
                     <p className="flex items-center space-x-1 font-medium text-blue-600">
                      <Paperclip size={12} />
                      <span>{item.files.length} Lampiran</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-2 p-3 bg-gray-50 rounded-b-xl border-t">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium">Ubah Prioritas:</label>
                  <select
                    value={item.priority || 'Rendah'}
                    onChange={(e) => onSetPriority(item.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()} 
                    className="text-xs p-1 border border-gray-300 rounded w-full mt-1 bg-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
                
                <div className="flex flex-col space-y-2"> 
                  {item.status === 'pending' && (
                    <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(item.id, 'Proses'); }} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-semibold">
                      Proses
                    </button>
                  )}
                  {item.status === 'Proses' && (
                    <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(item.id, 'Selesai'); }} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs font-semibold">
                      Selesai
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- TAMPILAN DESKTOP (TABEL) --- */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laporan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLaporan.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  Tidak ada laporan untuk kategori "{filterKategori}".
                </td>
              </tr>
            )}
            {filteredLaporan.map(item => {
              const statusInfo = getStatusInfo(item.status);
              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center space-x-2 text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{item.nama}</div>
                    {item.telepon && (
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{item.telepon}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div 
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                      onClick={() => setSelectedLaporan(item)}
                    >
                      {item.judul}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{item.deskripsi}</div>
                    {item.files && item.files.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600 space-y-1">
                        {item.files.map((file, index) => (
                          <a 
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 hover:underline"
                          >
                            <Paperclip size={14} />
                            <span className="truncate">{file.originalname || file.filename || 'Lihat Lampiran'}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kategori}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.priority || 'Rendah'}
                      onChange={(e) => onSetPriority(item.id, e.target.value)}
                      className={`text-sm font-medium border-none rounded p-1 ${getPriorityInfo(item.priority)} focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Tinggi">Tinggi</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedLaporan(item)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-semibold"
                      title="Lihat Detail"
                    >
                      <MessageSquare size={16} />
                    </button>
                    {item.status === 'pending' && (
                      <button onClick={() => onUpdateStatus(item.id, 'Proses')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-semibold">
                        Proses
                      </button>
                    )}
                    {item.status === 'Proses' && (
                      <button onClick={() => onUpdateStatus(item.id, 'Selesai')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs font-semibold">
                        Selesai
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(item.id)} 
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-semibold"
                    >
                      <Trash2 size={16} /> {/* <-- Ikon Hapus */}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedLaporan && (
        <LaporanDetailModal 
          laporan={selectedLaporan}
          onClose={() => setSelectedLaporan(null)}
        />
      )}
    </div>
  );
}