# 🏠 Sistem Kritik & Saran Desa - Frontend Client

Repository ini adalah bagian **Frontend (Tampilan)** untuk Sistem Kritik & Saran Desa Wayhui. Dibangun menggunakan **React.js** dan **Tailwind CSS** untuk memberikan pengalaman pengguna yang responsif dan modern.

## ✨ Fitur Aplikasi

### 👤 Halaman Warga (Publik)
* **Dashboard:** Melihat statistik laporan dan pengumuman desa terbaru.
* **Kirim Aspirasi:** Form pengaduan dengan opsi lampiran bukti (Foto/Dokumen) dan fitur Anonim.
* **Transparansi:** Melihat grafik/tabel anggaran desa.
* **Detail Pengumuman:** Modal *popup* untuk melihat pengumuman dan slider foto.

### 🛡️ Panel Admin (Terproteksi)
* **Dashboard Admin:** Ringkasan statistik real-time.
* **Kelola Laporan:** Mengubah status (Pending -> Proses -> Selesai), menghapus laporan, dan melihat bukti.
* **Kelola Pengumuman:** Membuat, mengedit, dan menghapus berita desa.
* **Pengaturan Akun:** Mengubah Username dan Password Admin.

## 🛠️ Teknologi yang Digunakan

* [React.js](https://reactjs.org/) - Library UI
* [Tailwind CSS](https://tailwindcss.com/) - Styling Framework
* [Lucide React](https://lucide.dev/) - Ikon Modern
* [React Router](https://reactrouter.com/) - Navigasi Halaman

## 🚀 Instalasi & Menjalankan (Localhost)

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username-anda/frontend-kritik-saran-desa.git](https://github.com/14-128-RagilBayuSaputra/frontend-kritik-saran-desa.git)
    cd frontend-kritik-saran-desa
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi API URL**
    Pastikan URL Backend sudah sesuai.
    * Untuk Local: `http://localhost:3001`
    * Untuk Production: Ganti di `src/App.js` (atau `.env`) menjadi URL Vercel Backend Anda.

4.  **Jalankan Aplikasi**
    ```bash
    npm start
    # Website akan terbuka di http://localhost:3000
    ```

## 📱 Tampilan (Screenshots)

*(Opsional: Anda bisa menaruh screenshot aplikasi di sini nanti)*

## 🌐 Deployment

Frontend ini dioptimalkan untuk di-deploy ke **Vercel**.
Cukup sambungkan repository GitHub dan klik Deploy.

---
*Dibuat oleh Mahasiswa Teknik Informatika - Desa Wayhui*