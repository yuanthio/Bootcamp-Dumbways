const items = [
    {
        id: 1,
        gambar: 'img/projects/gambar1.jpg',
        judul: "Aplikasi Kesehatan Online - 2022",
        durasi: "Durasi : 4 Bulan",
        text: "Sebuah aplikasi yang membantu pengguna melakukan konsultasi dengan dokter secara daring, serta memesan obat langsung dari apotek terdekat.",
        icon: ["fa-brands fa-android", "fa-brands fa-google-play", "fa-solid fa-heart-pulse"],
        deskripsi: "Aplikasi ini dirancang untuk memudahkan pasien berkonsultasi dengan dokter secara real-time melalui chat dan video call. Fitur tambahan meliputi pemesanan obat ke apotek terdekat, pengingat minum obat, serta penyimpanan riwayat kesehatan digital."
    },
    {
        id: 2,
        gambar: 'img/projects/gambar2.jpg',
        judul: "Platform E-Commerce Lokal - 2023",
        durasi: "Durasi : 6 Bulan",
        text: "Website belanja online untuk UMKM lokal dengan fitur katalog produk, pembayaran online, serta integrasi kurir otomatis.",
        icon: ["fa-brands fa-react", "fa-brands fa-node-js", "fa-solid fa-cart-shopping"],
        deskripsi: "Platform ini dibuat untuk mendukung UMKM lokal agar produknya bisa dijual secara daring. Memiliki fitur katalog produk, manajemen stok, integrasi pembayaran digital, serta sistem pengiriman otomatis dengan berbagai jasa kurir.",
    },
    {
        id: 3,
        gambar: 'img/projects/gambar3.jpg',
        judul: "Sistem Absensi Karyawan - 2024",
        durasi: "Durasi : 2 Bulan",
        text: "Aplikasi berbasis web untuk mencatat kehadiran karyawan menggunakan teknologi pengenalan wajah agar lebih aman dan cepat.",
        icon: ["fa-brands fa-js", "fa-brands fa-bootstrap", "fa-solid fa-user-check"],
        deskripsi: "Sistem absensi berbasis web yang memanfaatkan face recognition untuk memvalidasi identitas karyawan. Data absensi langsung terhubung dengan sistem HR, sehingga laporan kehadiran dapat diakses secara real-time dan transparan."
    },
    {
        id: 4,
        gambar: 'img/projects/gambar4.jpg',
        judul: "Aplikasi Pengelola Keuangan - 2023",
        durasi: "Durasi : 3 Bulan",
        text: "Aplikasi mobile yang membantu pengguna melacak pemasukan, pengeluaran, dan membuat laporan keuangan sederhana setiap bulan.",
        icon: ["fa-brands fa-java", "fa-brands fa-android", "fa-solid fa-wallet"],
        deskripsi: "Aplikasi mobile yang membantu pengguna mengatur keuangan pribadi. Dilengkapi dengan grafik visual, perhitungan anggaran otomatis, serta fitur laporan PDF yang bisa diunduh untuk memantau kondisi finansial bulanan.",
    },
    {
        id: 5,
        gambar: 'img/projects/gambar5.jpg',
        judul: "Platform Edukasi Online - 2021",
        durasi: "Durasi : 5 Bulan",
        text: "Website pembelajaran daring dengan fitur video interaktif, kuis otomatis, serta dashboard kemajuan belajar untuk siswa.",
        icon: ["fa-brands fa-vuejs", "fa-brands fa-laravel", "fa-solid fa-book-open"],
        deskripsi: "Website pembelajaran online dengan modul interaktif, kuis otomatis, forum diskusi antar siswa, dan dashboard perkembangan belajar. Guru juga dapat membuat kelas virtual serta memberikan tugas langsung dari sistem."
    }
];

const listProjects = document.querySelector(".list-projects");

const cards = items.map(i =>
    `<div class="col-lg-4 col-md-6">
        <div class="card">
                <img src="${i.gambar}" class="card-img-top img-fluid" alt="${i.judul}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${i.judul}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${i.durasi}</h6>
                    <p class="card-text my-4">${i.text}</p>
                    <div class="row mb-4">
                        ${i.icon.map(ic => `<i class="${ic} fs-3 me-3"></i>`).join("")}
                    </div>
                    <div class="row gx-1 gy-md-2 gy-sm-2 btns">
                        <div class="col-lg-6 d-grid">
                            <a class="btn btn-dark" href="detail.html" role="button"><i class="fa-solid fa-circle-info"></i> Detail</a>
                        </div>
                        <div class="col-lg-6 d-grid">
                            <a class="btn btn-dark" href="#" role="button"><i class="fa-solid fa-trash"></i> Hapus</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
).join("");

listProjects.innerHTML = cards;

