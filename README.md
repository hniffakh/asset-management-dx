# DX Engineering Standards

> **INTERNAL USE ONLY**  
> Central repository for DX engineering standards, SOPs, governance, reusable templates, and technical guidelines.

## Tentang repository ini

`dx-dnia-governance` merupakan sumber acuan terpusat (*single source of truth*) untuk standar kerja, SOP, panduan teknis, checklist, dan template yang digunakan dalam aktivitas Digital Transformation (DX) di DENSO Indonesia.

Repository ini dibuat untuk memastikan proses kerja dilaksanakan secara konsisten, aman, terdokumentasi, dapat ditinjau, dan mudah digunakan kembali oleh project yang berbeda.

## Tujuan

- Menyatukan **standar** dan panduan engineering dalam satu lokasi resmi.
- **Mengurangi perbedaan proses** kerja antar-team dan antar-project.
- Menyediakan dokumen yang **mudah ditemukan** dan digunakan kembali.
- Menjaga **riwayat perubahan** dan persetujuan dokumen melalui Git.
- Mendukung **onboarding** karyawan, mentor, project owner, dan intern.
- **Memudahkan audit**, evaluasi, dan peningkatan standar secara berkala.

## Ruang lingkup

Repository ini dapat mencakup standar dan dokumentasi berikut:

| Area | Contoh isi |
|---|---|
| Git dan GitHub | Organization governance, repository settings, branch, commit, Pull Request, review, dan access control |
| Software Development | Struktur project, coding convention, testing, dependency management, dan release |
| Deployment dan Operations | Environment management, deployment, monitoring, logging, rollback, dan incident handling |
| Dokumentasi | Format dokumen, penamaan file, metadata, diagram, versioning, dan approval |
<!-- | IoT dan Automation | Arsitektur perangkat, komunikasi data, konfigurasi edge device, PLC integration, dan deployment | -->
<!-- | Data dan Database | Database convention, schema change, backup, retention, dan data handling | -->
<!-- | Cybersecurity | Credential handling, secrets, access control, vulnerability handling, dan secure development | -->
<!-- | Project Management | Project initiation, handover, checklist, review, dan project closure | -->

Ruang lingkup dapat diperluas melalui Pull Request setelah mendapatkan review dari document owner atau DX Core.

## Struktur repository

```text
dx-dnia-governace/
├── README.md
├── CHANGELOG.md
├── docs/
│   ├── git-and-github/
│   ├── standard/
│   └── starter-kit/
└── templates/
    ├── backend/
    ├── frontend/
    └── github/
```

Ketentuan penggunaan folder:

- `docs/` berisi dokumen aktif berdasarkan area atau domain.
- `templates/` berisi template yang dapat digunakan kembali oleh project lain.
<!-- - `checklists/` berisi checklist operasional dan verifikasi. -->
<!-- - `references/` berisi referensi pendukung yang bukan standar utama. -->
<!-- - `archive/` berisi dokumen yang sudah tidak berlaku tetapi masih perlu dipertahankan sebagai riwayat. -->

<!-- Dokumentasi Git dan GitHub versi awal ditempatkan di:

```text
docs/git-and-github/
├── pdf/
└── editable/
``` -->
<!-- 
## Jenis dokumen

| Jenis | Fungsi |
|---|---|
| Standard | Menetapkan aturan atau ketentuan yang wajib diikuti |
| Template | Menyediakan format yang dapat digunakan kembali |
<!-- | SOP | Menjelaskan prosedur kerja langkah demi langkah | -->
<!-- | Guideline | Memberikan rekomendasi dan praktik yang disarankan | -->
<!-- | Checklist | Memastikan aktivitas atau verifikasi dilakukan secara lengkap | -->
<!-- | Reference | Memberikan informasi pendukung atau contoh | -->

<!-- ## Status dokumen

Setiap dokumen harus memiliki status yang jelas:

| Status | Arti |
|---|---|
| `Draft` | Masih dalam penyusunan dan belum menjadi acuan resmi |
| `In Review` | Sedang ditinjau oleh reviewer atau approver |
| `Approved` | Sudah disetujui dan berlaku sebagai acuan |
| `Deprecated` | Tidak disarankan untuk penggunaan baru dan sedang menunggu pengganti |
| `Archived` | Sudah tidak berlaku dan dipindahkan ke arsip |

Dokumen baru tidak boleh dinyatakan sebagai standar resmi sebelum berstatus `Approved`.

## Metadata dokumen

Setiap dokumen standar sebaiknya mencantumkan metadata berikut pada bagian awal:

```text
Document title   :
Document ID      :
Category         :
Owner            :
Approver         :
Status           : Draft / In Review / Approved / Deprecated / Archived
Version          :
Effective date   :
Next review date :
Classification   : INTERNAL USE ONLY -->
<!-- ``` --> -->

## Cara menggunakan repository

### Untuk pembaca

1. Pilih area yang relevan di dalam folder `docs/`.
2. Gunakan file pada `templates/` atau `docs/` jika tersedia.
3. Jika menemukan isi yang tidak sesuai, buat Issue atau hubungi document owner.

### Untuk contributor

Semua perubahan harus dilakukan melalui branch dan Pull Request. Jangan melakukan commit langsung ke `main`.
<!-- 
Alur perubahan:

```text
Issue atau change request
→ Buat branch
→ Perbarui dokumen
→ Buat Pull Request
→ Review dan approval
→ Squash and merge
```

Contoh penamaan:

```text
Branch : docs/123-update-github-workflow
Commit : docs(github): update repository onboarding workflow
PR     : docs(github): update repository onboarding workflow
```

Pull Request harus menjelaskan:

- Alasan perubahan.
- Dokumen atau proses yang terdampak.
- Ringkasan perubahan.
- Reviewer atau approver yang diperlukan.
- Tanggal berlaku jika perubahan sudah disetujui. -->

<!-- ## Review dan approval

| Peran | Tanggung jawab |
|---|---|
| Repository administrator | Mengelola permission, ruleset, dan konfigurasi repository |
| Document owner | Menjaga keakuratan, relevansi, dan jadwal review dokumen |
| Reviewer | Memeriksa isi, dampak, konsistensi, dan kelayakan teknis |
| Approver | Memberikan persetujuan sebelum dokumen dinyatakan berlaku |
| Contributor | Mengusulkan atau mengerjakan perubahan melalui Issue dan Pull Request |
| Reader | Menggunakan versi yang berlaku dan melaporkan ketidaksesuaian |

Document owner bertanggung jawab melakukan review berkala serta memperbarui status dokumen yang sudah tidak relevan. -->

<!-- ## Versioning dan perubahan dokumen

Gunakan format versi berikut:

```text
Major.Minor.Patch
```

Contoh:

- `v1.0.0`: versi pertama yang disetujui.
- `v1.1.0`: penambahan atau perubahan isi yang tidak mengubah tujuan utama.
- `v1.1.1`: koreksi kecil tanpa perubahan proses yang signifikan.
- `v2.0.0`: perubahan besar terhadap aturan, proses, atau ruang lingkup.

Setiap perubahan pada dokumen yang sudah berlaku harus dicatat di `CHANGELOG.md` atau riwayat revisi dokumen. -->

## Ketentuan keamanan

Repository ini bersifat `Private` dan hanya boleh diakses oleh pihak yang berwenang.

Dilarang menyimpan:

#### - Password, Personal Access Token, API key, atau private key.
#### - Production secret atau database connection string.
#### - Credential perangkat, server, PLC, maupun layanan eksternal.
#### - Data pribadi, data produksi, atau informasi rahasia yang tidak diperlukan dalam standar.
#### - Source code atau konfigurasi project yang tidak berkaitan dengan standardisasi.

Gunakan contoh dan placeholder untuk informasi sensitif, misalnya:
<!-- 
```text
<SERVER_HOST>
<DATABASE_NAME>
<API_TOKEN>
``` -->

## Hubungan dengan kebijakan perusahaan

Dokumen dalam repository ini merupakan acuan operasional untuk aktivitas DX dan engineering. Repository ini tidak menggantikan kebijakan resmi perusahaan, ketentuan Information Security, prosedur Quality, maupun aturan lain yang mempunyai otoritas lebih tinggi.

Jika terdapat perbedaan, kebijakan resmi perusahaan yang berlaku harus diprioritaskan dan dokumen di repository ini harus diperbarui melalui proses review.

<!-- ## Pemeliharaan repository

- Owner utama: **DX Core**.
- Visibility: **Private**.
- Default branch: **`main`**.
- Perubahan: melalui **Pull Request**.
- Merge method: **Squash and merge**.
- Review dokumen: sesuai jadwal pada metadata atau ketika terjadi perubahan proses.
- Dokumen tidak berlaku: tandai `Deprecated` sebelum dipindahkan ke `archive/`. -->

## Kontak dan usulan perubahan

Gunakan **Issues** untuk:

- Mengusulkan standar baru.
- Meminta perubahan atau klarifikasi dokumen.
- Melaporkan isi yang sudah tidak sesuai.
- Mencatat hasil review berkala.

Untuk perubahan yang mendesak atau berdampak luas, koordinasikan terlebih dahulu dengan **DX Core** dan document owner terkait.

---
<!-- 
**Classification:** INTERNAL USE ONLY  
**Repository owner:** DX Core  
**Initial document version:** v1.0.0 -->
