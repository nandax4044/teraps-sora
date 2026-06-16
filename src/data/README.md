# Panduan Pengaturan Game Case Opening (chests.json)

Semua element pada game **Case Opening / Unboxing Chest** dikonfigurasi penuh menggunakan file `/src/data/chests.json`. Anda dapat mengedit, menambah, menghapus chest, maupun mengubah rarity item secara langsung tanpa perlu melakukan modifikasi kode utama React.

## Parameter Konfigurasi Chest

Setiap objek chest di dalam array `"chests"` memiliki field berikut:

| Field | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `id` | string | ID unik lowercase untuk navigasi dan routing | `"fishing"` |
| `name` | string | Nama tampilan utama chest | `"Fishing Chest"` |
| `price` | number | Biaya coin untuk membuka chest ini | `100` |
| `icon` | string | Karakter Emoji fallback jika gambar PNG belum di-upload | `"🎣"` |
| `color` | string | Gradient background Tailwind untuk kartu chest | `"from-cyan-500 to-blue-600"` |
| `background` | string | CSS background inline styling untuk Game Page | `"linear-gradient(135deg, #0b1a26 0%, #112d42 100%)"` |
| `image` | string | Lokasi/path dari asset PNG logo chest | `"/assets/chests/fishing.png"` |
| `items` | array | Koleksi item hadiah yang berada di dalam chest | *(lihat di bawah)* |

## Pengaturan Item Hadiah & Rarity

Setiap item hadiah di dalam properti `"items"` memiliki schema sebagai berikut:

```json
{
  "name": "Golden Fishing Rod",
  "rarity": "Legendary",
  "chance": 4,
  "value": 450,
  "icon": "🎣",
  "color": "#eab308",
  "image": "/assets/items/fishing_gold_rod.png"
}
```

### Penjelasan Parameter Item:
1. `name`: Nama item hadiah.
2. `rarity`: Level kelangkaan item. Mempengaruhi border warna, glow, dan animasi efek. Pilihan yang didukung:
   - `Common` (Gray glow/border)
   - `Rare` (Blue glow/border)
   - `Epic` (Purple glow/border)
   - `Legendary` (Gold spin shine & high anim effect)
   - `Mythic` (Red neon flashing pulse & cosmic stars particle)
3. `chance`: Peluang persentase drop rate item (weighted probability). Contoh: `60` berarti peluang 60%, `1` berarti peluang 1%. Sistem akan menumpuk kumulatif persentase secara otomatis sehingga akurat secara matematis.
4. `value`: Nilai koin dari item ini. Dapat dijual oleh pemain untuk menambah saldo balance.
5. `icon`: Emoji fallback agar game tetap tampil keren saat PNG belum di-upload.
6. `color`: Warna solid hex code untuk visualisasi.
7. `image`: Lokasi asset gambar PNG di dalam folder `/public/assets/items/...` atau `/assets/items/...`.
