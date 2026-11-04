# Contributing Guide

Dokumen ini berlaku untuk seluruh contributor pada repository internship.

## Core workflow

> Satu Issue atau satu scope pekerjaan = satu branch = satu Pull Request.

1. Perbarui `main`.
2. Buat branch baru dari `main`.
3. Kerjakan hanya scope yang disetujui.
4. Commit perubahan secara kecil dan jelas.
5. Push branch dan buat Pull Request.
6. Lakukan revisi reviewer pada branch dan PR yang sama.
7. Tunggu approval dan proses squash merge.

```bash
git switch main
git pull origin main
git switch -c feat/123-add-login-validation

git add .
git commit -m "feat(auth): add login validation"
git push -u origin feat/123-add-login-validation
```

## Branch naming

```text
<type>/<issue-number>-<short-description>
```

Contoh:

```text
feat/123-add-login-page
fix/145-invalid-sensor-reading
docs/152-update-installation-guide
refactor/158-simplify-parser
test/159-add-auth-unit-tests
chore/160-update-dependencies
```

Jangan menggunakan nama seperti `branch-gareth`, `development`, `final`, atau `test2`.

## Commit naming

```text
<type>(<optional-scope>): <short-description>
```

Tipe yang digunakan:

- `feat`: fitur atau capability baru.
- `fix`: perbaikan bug.
- `docs`: perubahan dokumentasi.
- `refactor`: restrukturisasi tanpa perubahan behavior.
- `test`: perubahan test.
- `chore`: maintenance, dependency, atau konfigurasi.

Contoh:

```text
feat(auth): add login validation
fix(sensor): handle empty serial response
docs: add installation guide
chore: update project dependencies
```

Gunakan deskripsi singkat dalam bahasa Inggris, huruf kecil setelah titik dua, tanpa titik di akhir, dan idealnya tidak lebih dari 72 karakter.

## Pull Request

- Gunakan standar judul yang sama dengan commit.
- Lengkapi Pull Request template.
- Tambahkan `Closes #<issue-number>` ketika Issue workflow aktif.
- Lampirkan cara pengujian dan bukti yang diperlukan.
- Jangan mencampurkan fitur berbeda dalam satu PR.
- Jangan membuat PR baru untuk revisi review biasa.

## Security

Jangan pernah commit:

```text
.env
*.pem
*.key
*.pfx
*.sql
*.bak
```

Credential, production data, token, dan private key juga dilarang. Gunakan `.env.example` dengan placeholder aman.

Jika credential terlanjur ter-commit, segera beri tahu DX Core dan pemilik credential. Credential harus di-revoke atau dirotasi; menghapus file saja tidak cukup.

## After merge

```bash
git switch main
git pull origin main
git branch -d feat/123-add-login-validation
git fetch --prune
```

Branch remote akan terhapus otomatis setelah merge. Pekerjaan berikutnya menggunakan branch baru dari `main` terbaru.

