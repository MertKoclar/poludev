# Sitemap Kullanım Kılavuzu

`generateSitemap.ts` dosyasını kullanarak dinamik sitemap oluşturmanın 3 farklı yöntemi:

## 🚀 Yöntem 1: NPM Script ile Manuel Oluşturma (Önerilen)

Build sırasında veya manuel olarak sitemap oluşturmak için:

```bash
# Sadece sitemap oluştur
npm run generate:sitemap

# Sitemap oluştur ve ardından build yap
npm run build:with-sitemap
```

Bu komut:
- Veritabanından tüm aktif projeleri çeker
- Yayınlanmış blog yazılarını çeker
- Statik sayfaları ekler
- `public/sitemap.xml` dosyasını oluşturur

**Avantajlar:**
- ✅ Hızlı ve kolay
- ✅ Build sırasında otomatik çalıştırılabilir
- ✅ Statik dosya olarak sunulur (daha hızlı)

## 🌐 Yöntem 2: API Route ile Dinamik Sitemap

Vercel'de serverless function olarak çalışır. Her istekte güncel sitemap oluşturur.

**Kullanım:**
```
https://poludev.com/api/sitemap
```

**Avantajlar:**
- ✅ Her zaman güncel veri
- ✅ Veritabanı değişiklikleri anında yansır
- ✅ Cache ile optimize edilmiş

**Not:** `api/sitemap.js` dosyası Vercel'de otomatik olarak serverless function olarak çalışır.

## 🎛️ Yöntem 3: Admin Panelinden Manuel Oluşturma

Admin dashboard'da "Sitemap Oluştur" butonuna tıklayarak:

1. Admin paneline giriş yapın (`/admin`)
2. Dashboard'da "Sitemap Oluştur" butonuna tıklayın
3. Sitemap XML dosyası otomatik olarak indirilir
4. İndirilen dosyayı `public/sitemap.xml` konumuna kopyalayın

**Avantajlar:**
- ✅ Kullanıcı dostu arayüz
- ✅ İstediğiniz zaman manuel oluşturma
- ✅ Hemen indirme imkanı

## 📋 Sitemap İçeriği

Oluşturulan sitemap şunları içerir:

### Statik Sayfalar
- `/` - Ana sayfa (Priority: 1.0)
- `/about` - Hakkımda (Priority: 0.8)
- `/projects` - Projeler (Priority: 0.9)
- `/blog` - Blog (Priority: 0.9)
- `/cv/mert` - Mert'in CV'si (Priority: 0.7)
- `/cv/mustafa` - Mustafa'nın CV'si (Priority: 0.7)

### Dinamik İçerik
- Tüm aktif projeler (`/projects/:id`)
- Yayınlanmış blog yazıları (`/blog/:slug`)

### Çok Dilli Destek
Her URL için Türkçe ve İngilizce alternatifler eklenir:
```xml
<xhtml:link rel="alternate" hreflang="en" href="..." />
<xhtml:link rel="alternate" hreflang="tr" href="..." />
```

## ⚙️ Yapılandırma

### Environment Variables

`.env` dosyanızda şunların tanımlı olması gerekir:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://poludev.com
```

### Vercel Deployment

Vercel'de deploy ederken:
1. Environment variables'ları Vercel dashboard'dan ekleyin
2. `api/sitemap.js` otomatik olarak serverless function olarak çalışır
3. `robots.txt` dosyasında sitemap URL'ini güncelleyin (isteğe bağlı)

## 🔄 Otomatik Güncelleme

### Build Hook ile Otomatik Güncelleme

`package.json`'da build script'ini güncelleyin:

```json
{
  "scripts": {
    "build": "npm run generate:sitemap && tsc -b && vite build"
  }
}
```

Bu sayede her build'de sitemap otomatik güncellenir.

### Cron Job ile Periyodik Güncelleme

Vercel Cron Jobs kullanarak haftalık güncelleme:

`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sitemap",
    "schedule": "0 0 * * 0"
  }]
}
```

## 📝 Notlar

- Sitemap dosyası maksimum 50,000 URL içerebilir
- Her URL için `lastmod`, `changefreq` ve `priority` değerleri otomatik ayarlanır
- Projeler ve blog yazıları için `updated_at` tarihi kullanılır
- Sadece aktif (`status: 'active'`) projeler ve yayınlanmış (`published: true`) blog yazıları eklenir

## 🐛 Sorun Giderme

### Sitemap oluşturulmuyor
- `.env` dosyasını kontrol edin
- Supabase bağlantısını test edin
- Konsol hatalarını kontrol edin

### API route çalışmıyor
- Vercel'de environment variables'ları kontrol edin
- `api/` klasörünün root'ta olduğundan emin olun
- Vercel logs'ları kontrol edin

### Admin panel butonu çalışmıyor
- Browser console'u kontrol edin
- Supabase bağlantısını kontrol edin
- Network tab'ında hataları kontrol edin

