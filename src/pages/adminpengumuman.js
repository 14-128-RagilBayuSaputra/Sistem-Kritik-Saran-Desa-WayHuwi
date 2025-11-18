// src/pages/AdminPengumuman.js
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Image as ImageIcon, Trash2, Calendar, Upload, X, Edit2, AlertCircle } from 'lucide-react';

const emptyForm = {
  judul: '',
  isi: '',
  imageFiles: []
};

// --- KOMPONEN FORM (EDITOR) ---
const PengumumanEditor = ({ onSave, initialData, onCancel, setCurrentPage }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, imageFiles: initialData.imageFiles || [] });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Cek jumlah file saat ini + file baru
    if (formData.imageFiles.length + files.length > 10) {
       alert("Maksimal hanya boleh upload 10 lampiran!");
       return;
    }
    
    setFormData(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files]
    }));
    if (errors.imageFiles) setErrors(prev => ({ ...prev, imageFiles: null }));
    e.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.judul.trim()) newErrors.judul = 'Judul wajib diisi.';
    if (!formData.isi.trim()) newErrors.isi = 'Isi pengumuman wajib diisi.';
    if (!formData.imageFiles || formData.imageFiles.length === 0) {
      newErrors.imageFiles = 'Minimal satu gambar wajib diupload.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const dataToSave = { ...formData, imageFiles: formData.imageFiles };
      await onSave(dataToSave);
      
      if (!isEditMode) setFormData(emptyForm);
      
      if (setCurrentPage) {
        setCurrentPage('pengumuman_sukses');
      } else {
        alert(isEditMode ? 'Pengumuman berhasil diperbarui!' : 'Pengumuman berhasil dipublikasikan!');
      }
    } catch (err) {
      console.error("Gagal menyimpan pengumuman:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {isEditMode ? <Edit2 size={24} className="text-blue-600"/> : <Send size={24} className="text-blue-600"/>}
          {isEditMode ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        </h2>
        {isEditMode && (
          <button onClick={onCancel} className="text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded-md transition">
            Batal Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* --- LAYOUT GRID 2 KOLOM (Perbaikan UI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: UPLOAD GAMBAR */}
          <div className="md:col-span-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Gambar <span className="text-red-500">*</span></label>
            
            {/* Area Dropzone */}
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative group ${errors.imageFiles ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50 hover:bg-blue-100'}`}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <Upload className={`mb-2 ${errors.imageFiles ? 'text-red-400' : 'text-blue-500'}`} size={32} />
                <p className="text-sm font-medium text-gray-700">Klik untuk Upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 10MB)</p>
              </div>
            </div>
            {errors.imageFiles && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.imageFiles}</p>}

            {/* Preview List Gambar */}
            {formData.imageFiles && formData.imageFiles.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gambar Terpilih ({formData.imageFiles.length})</h4>
                {formData.imageFiles.map((file, index) => {
                  let src, name;
                  if (file instanceof File) {
                    src = URL.createObjectURL(file);
                    name = file.name;
                  } else {
                    src = file.url; // Jika data dari server
                    name = `Gambar ${index + 1}`;
                  }

                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={src} alt="Preview" className="w-10 h-10 object-cover rounded bg-white border" />
                        <span className="text-xs text-gray-700 truncate max-w-[120px]">{name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition">
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* KOLOM KANAN: INPUT TEKS */}
          <div className="md:col-span-8 flex flex-col gap-5">
            {/* Input Judul */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Pengumuman <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.judul ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                placeholder="Contoh: Kerja Bakti Hari Minggu"
              />
              {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
            </div>

            {/* Input Isi (Textarea) */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Pengumuman <span className="text-red-500">*</span></label>
              <textarea 
                name="isi"
                value={formData.isi}
                onChange={handleChange}
                rows="6"
                className={`w-full flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none ${errors.isi ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                placeholder="Tuliskan detail pengumuman di sini..."
              ></textarea>
              {errors.isi && <p className="text-red-500 text-xs mt-1">{errors.isi}</p>}
            </div>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg shadow-md hover:shadow-lg transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader size={20} className="animate-spin" /> : (isEditMode ? <Edit2 size={18} /> : <Send size={18} />)}
            <span>{isEditMode ? 'Simpan Perubahan' : 'Publikasikan Sekarang'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// --- KOMPONEN UTAMA HALAMAN ---
export default function AdminPengumuman({ allPengumuman, onAddPengumuman, onDeletePengumuman, onEditPengumuman, setCurrentPage }) {
  const [editingPengumuman, setEditingPengumuman] = useState(null);
  const editorRef = useRef(null);

  const formatTanggal = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSave = async (data) => { 
    try {
      if (editingPengumuman) {
        await onEditPengumuman(editingPengumuman._id, data); 
        setEditingPengumuman(null); 
      } else {
        await onAddPengumuman(data); 
      }
    } catch (err) {
      // Error handling
    }
  };
  
  const handleEditClick = (pengumuman) => {
    setEditingPengumuman({ ...pengumuman, imageFiles: pengumuman.imageFiles || [] });
    if (editorRef.current) editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Pengumuman</h1>
        <p className="text-gray-500 text-sm">Buat dan atur informasi publik untuk warga desa</p>
      </div>

      <div ref={editorRef}>
        <PengumumanEditor 
          key={editingPengumuman ? editingPengumuman.id : 'new'} 
          onSave={handleSave}
          initialData={editingPengumuman}
          onCancel={() => setEditingPengumuman(null)}
          setCurrentPage={setCurrentPage} 
        />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          📋 Daftar Pengumuman Terbit
        </h3>
        
        {allPengumuman.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-3"><ImageIcon size={32} className="text-gray-400"/></div>
            <p className="text-gray-500">Belum ada pengumuman yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allPengumuman.map(pengumuman => (
              // --- LIST ITEM (Perbaikan Layout: Flexbox agar tidak vertikal) ---
              <div key={pengumuman.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                
                {/* Gambar Kiri (Fixed Width) */}
                <div className="w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-200 relative group cursor-pointer">
                  {pengumuman.imageFiles && pengumuman.imageFiles.length > 0 ? (
                    <img 
                      src={pengumuman.imageFiles[0].url} 
                      alt={pengumuman.judul} 
                      className="w-full h-full object-cover transition group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  {/* Overlay Tanggal */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Calendar size={12}/> {formatTanggal(pengumuman.createdAt)}
                  </div>
                </div>

                {/* Konten Kanan (Flex-1) */}
                <div className="p-6 flex flex-col flex-1 justify-between min-w-0">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{pengumuman.judul}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {pengumuman.isi}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleEditClick(pengumuman)} 
                      className="flex items-center gap-1 px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 text-sm font-medium transition border border-yellow-200"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => onDeletePengumuman(pengumuman._id)}
                      className="flex items-center gap-1 px-4 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium transition border border-red-200"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}