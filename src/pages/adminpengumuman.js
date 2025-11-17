// src/pages/AdminPengumuman.js
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Image as ImageIcon, Trash2, Calendar, Upload, X, Edit2 } from 'lucide-react';

const emptyForm = {
  judul: '',
  isi: '',
  imageFiles: []
};

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setFormData(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files] 
    }));
    
    if (errors.imageFiles) {
      setErrors(prev => ({ ...prev, imageFiles: null }));
    }
    
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

    // --- PERBAIKAN: Validasi gambar sekarang berlaku untuk SEMUA (buat & edit) ---
    if (!formData.imageFiles || formData.imageFiles.length === 0) {
      newErrors.imageFiles = 'Pengumuman harus memiliki setidaknya satu gambar.';
    }
    // ------------------------------------------------------------------
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        imageFiles: formData.imageFiles 
      };

      await onSave(dataToSave); 
      
      if (!isEditMode) {
        setFormData(emptyForm); 
      }
      
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
    <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        </h2>
        {isEditMode && (
          <button 
            onClick={onCancel} 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Batal Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul Pengumuman <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.judul ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Contoh: Kerja Bakti Hari Minggu"
          />
          {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Gambar <span className="text-red-500">*</span>
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-colors ${errors.imageFiles ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}>
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-2">Tarik & lepas gambar, atau klik untuk memilih</p>
            <p className="text-xs text-gray-400 mb-4">Format: JPG, PNG (Max 10MB)</p>
            <input 
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-pengumuman"
            />
            <label 
              htmlFor="file-upload-pengumuman"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm"
            >
              Pilih File
            </label>
          </div>
          {errors.imageFiles && <p className="text-red-500 text-xs mt-1">{errors.imageFiles}</p>}

          {formData.imageFiles && formData.imageFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Gambar Terpilih:</h4>
              {formData.imageFiles.map((file, index) => {
                let src, name;
                if (file instanceof File) {
                  src = URL.createObjectURL(file);
                  name = file.name;
                } else {
                  src = file.url;
                  name = `Gambar ${index + 1} (Tersimpan)`;
                }

                return (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 min-w-0">
                    <img src={src} alt="Preview" className="w-10 h-10 object-cover rounded shadow-sm" />
                    <span className="text-sm text-gray-700 truncate">
                      {name}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)} 
                    className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea 
            name="isi"
            value={formData.isi}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isi ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Tuliskan isi pengumuman..."
          ></textarea>
          {errors.isi && <p className="text-red-500 text-xs mt-1">{errors.isi}</p>}
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400"
        >
          {isLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
          <span>{isEditMode ? 'Simpan Perubahan' : 'Publikasikan'}</span>
s      </button>
      </form>
    </div>
  );
};

/**
 * Komponen Halaman Utama yang menggabungkan Form dan Daftar
 */
export default function AdminPengumuman({ allPengumuman, onAddPengumuman, onDeletePengumuman, onEditPengumuman, setCurrentPage }) {
  
  const [editingPengumuman, setEditingPengumuman] = useState(null);
  const editorRef = useRef(null);

  const formatTanggal = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSave = async (data) => { 
    try {
      if (editingPengumuman) {
        await onEditPengumuman(editingPengumuman.id, data); 
        setEditingPengumuman(null); 
      } else {
        await onAddPengumuman(data); 
      }
    } catch (err) {
      // Error sudah ditangani di App.js
    }
  };
  
  const handleCancelEdit = () => {
    setEditingPengumuman(null); 
  };
  
  const handleEditClick = (pengumuman) => {
    // Pastikan imageFiles adalah array saat mengedit
    setEditingPengumuman({ ...pengumuman, imageFiles: pengumuman.imageFiles || [] });
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      
      <div ref={editorRef}>
        <PengumumanEditor 
          key={editingPengumuman ? editingPengumuman.id : 'new'} 
          onSave={handleSave}
          initialData={editingPengumuman}
          onCancel={handleCancelEdit}
          setCurrentPage={setCurrentPage} 
        />
      </div>


      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">
          Daftar Pengumuman Terbit
        </h2>
        
        {allPengumuman.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada pengumuman yang dipublikasikan.</p>
        ) : (
          <div className="space-y-4">
            {allPengumuman.map(pengumuman => (
              <div key={pengumuman.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                
                {pengumuman.imageFiles && pengumuman.imageFiles.length > 0 ? (
                  <img 
                    src={pengumuman.imageFiles[0].url} 
                    alt={pengumuman.judul} 
                    className="w-full md:w-32 h-32 md:h-20 object-cover rounded-md flex-shrink-0 bg-gray-100" 
                  />
                ) : (
                  <div className="w-full md:w-32 h-32 md:h-20 rounded-md flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{pengumuman.judul}</h3>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{pengumuman.isi}</p>
                </div>
                
                <div className="flex flex-col justify-between items-start md:items-end pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                  <span className="flex items-center space-x-1 text-xs text-gray-500 mb-2 md:mb-0">
                    <Calendar size={14} />
                    <span>{formatTanggal(pengumuman.createdAt)}</span>
                  </span>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditClick(pengumuman)} 
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => onDeletePengumuman(pengumuman.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
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