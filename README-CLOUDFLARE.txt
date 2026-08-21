# Undangan Rizky & Dila — Cloudflare Pages + D1

Versi ini sudah tidak memakai Netlify Function/Netlify Blobs.
RSVP memakai Cloudflare Pages Functions + Cloudflare D1.

## 1. Buat database D1
Cloudflare Dashboard → Workers & Pages → D1 → Create database.
Nama bebas, misalnya: `rizky-dila-rsvp`.

## 2. Buat tabel
Buka database D1 → Console → jalankan isi `schema.sql`.

## 3. Hubungkan D1 ke Pages
Cloudflare Dashboard → Workers & Pages → pilih project undangan → Settings → Bindings → Add → D1 database.
Binding variable name HARUS:
`DB`
Pilih database `rizky-dila-rsvp`.

Setelah itu redeploy.

## 4. Upload
Upload isi folder ini ke GitHub lalu connect ke Cloudflare Pages, atau deploy lewat metode Pages yang lu pakai.
Tidak perlu Netlify Function.

Endpoint RSVP otomatis:
`/api/rsvp`

## Catatan
Semua foto sudah tetap ada di root dan HTML sudah diarahkan ke file lokal.
