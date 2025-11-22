```markdown
# Profil Digital — Simple & Elegan (disesuaikan)

Perubahan yang saya buat:
- Menaruh pemutar musik di paling bawah halaman (footer).
- Menambahkan semua subseksi Beranda yang Anda minta, masing-masing dengan ikon yang sesuai:
  - Kegiatan Pengembangan Diri
  - Pengalaman Organisasi dan Profesi
  - Kegiatan Pendampingan Rekan Sejawat
  - Kumpulan Karya Inovasi/Implementasi Pembelajaran Berbasis Teknologi
  - Prestasi dan Penghargaan
- Setiap subseksi bisa langsung Anda tulis di tempatnya (contenteditable) dan isi akan tersimpan otomatis di browser (localStorage).
- Menambahkan kemampuan mengganti dan menyimpan:
  - Foto profil (disimpan sebagai data URL di localStorage)
  - Background di belakang foto/nama (disimpan di localStorage)
  - Lagu (audio) — dapat diunggah dan disimpan di localStorage (perhatian: batas ukuran localStorage)
- Menambahkan ikon sosial media: YouTube, TikTok, Instagram, dan Email. Ada tombol "Edit Sosmed" untuk memasukkan link yang akan disimpan.
- Menambahkan tombol Reset untuk mengembalikan foto/background/audio ke kondisi default.
- Footer memuat copyright: "© zahrinadd"

Cara pakai singkat:
1. Simpan file-file:
   - index.html
   - styles.css
   - script.js
   - avatar.svg (opsional default)
   - song.mp3 (opsional default audio)
2. Buka index.html di browser.
3. Klik area teks (nama, instansi, subseksi) lalu ketik; perubahan tersimpan otomatis.
4. Untuk mengganti foto atau background klik "Ganti Foto" / "Ganti Background" lalu pilih file gambar.
5. Untuk mengganti lagu klik "Ganti Lagu" lalu pilih berkas audio (MP3/OGG). Setelah dipilih, audio akan disimpan di localStorage.
6. Untuk menyetel tautan sosmed klik "Edit Sosmed", masukkan URL/email lalu Simpan.

Catatan penting:
- Semua penyimpanan menggunakan localStorage di browser Anda. Artinya:
  - Data tersimpan hanya pada perangkat dan browser yang sama.
  - localStorage memiliki batas ukuran (biasanya ~5MB). Hindari mengunggah file audio/gambar terlalu besar agar tidak memenuhi kapasitas.
  - Jika ingin penyimpanan lintas perangkat, saya bisa bantu menambahkan ekspor/import (JSON) atau integrasi penyimpanan eksternal (Google Drive / server).
- Bila Anda ingin, saya bisa menambahkan:
  - Tombol "Ekspor Profil" untuk membuat file JSON dari semua isi agar bisa dipindahkan/backup.
  - Editor inline yang lebih kaya (toolbar, upload file per subseksi).
  - Integrasi galeri untuk 'Kumpulan Karya' dengan upload dan preview.

Selamat mengisi profil — beri tahu bila mau saya tambahkan fitur ekspor/import atau editor lebih lengkap.
```