# 🚀 Poludev - Portfolio Website

Modern, çok dilli ve dinamik bir portfolyo sitesi. Mert ve Mustafa'nın kişisel ve ortak profesyonel çalışmalarını sergiler.

![Poludev](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase&logoColor=white)

## ✨ Özellikler

### 🌐 Çoklu Dil Desteği
- Türkçe ve İngilizce dil desteği
- Otomatik dil algılama
- Dinamik içerik çevirisi

### 🎨 Modern UI/UX
- Dark/Light tema desteği
- Responsive tasarım (mobil, tablet, desktop)
- Smooth animasyonlar (Framer Motion)
- Modern gradient tasarımlar
- Drag & drop dosya yükleme

### 📱 Sayfalar
- **Ana Sayfa**: Hero section, öne çıkan projeler, istatistikler, hizmetler, teknolojiler
- **Hakkımızda**: Profil bilgileri, eğitim, deneyim, sertifikalar, referanslar
- **Projeler**: Proje listesi, filtreleme, sıralama, detay sayfaları
- **CV**: Dinamik CV görüntüleme ve indirme

### 🔐 Admin Paneli
- **Dashboard**: İstatistikler, son aktiviteler, hızlı işlemler, grafikler
- **Proje Yönetimi**: CRUD işlemleri, görsel yükleme, sürükle-bırak sıralama
- **Hakkımızda Yönetimi**: Profil, eğitim, deneyim, sertifikalar, referanslar yönetimi
- **CV Yönetimi**: CV versiyonları, yükleme, indirme, analitik
- **Site Ayarları**: Email, telefon, konum bilgileri yönetimi

### 📝 İçerik Yönetimi
- Rich Text Editor (HTML içerik düzenleme)
- Markdown Editor (Markdown format desteği)
- Görsel yükleme ve yönetimi
- Drag & drop ile sıralama

### 🔍 SEO Optimizasyonu
- Meta tags (title, description, keywords)
- Open Graph tags
- Twitter Card tags
- Structured Data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Canonical URLs
- Hreflang tags

### ⚡ Performans
- Lazy loading (React.lazy)
- Code splitting
- Optimized bundle size
- Preconnect/DNS-prefetch
- Image optimization

## 🛠️ Teknolojiler

### Frontend
- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool ve dev server (SWC ile)
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router DOM 7.9** - Client-side routing
- **Framer Motion 12.23** - Animasyonlar
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend, veritabanı ve kimlik doğrulama
- **PostgreSQL** - Veritabanı
- **Supabase Storage** - Dosya depolama

### Internationalization
- **React-i18next 16.3** - Çoklu dil desteği
- **i18next-browser-languagedetector** - Otomatik dil algılama

### Diğer
- **Recharts 3.4** - Veri görselleştirme (grafikler)
- **React Markdown 10.1** - Markdown render
- **Remark GFM 4.0** - GitHub Flavored Markdown

## 📁 Proje Yapısı

```
poludev/
├── public/                 # Statik dosyalar
│   ├── logo.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/            # Görseller ve diğer assetler
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   │   ├── admin/        # Admin paneli bileşenleri
│   │   ├── editor/       # Rich Text ve Markdown editörler
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── SEO.tsx
│   │   └── ...
│   ├── config/           # Yapılandırma dosyaları
│   │   ├── constants.ts
│   │   └── supabaseClient.ts
│   ├── context/          # React Context'ler
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Çoklu dil dosyaları
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── tr.json
│   │       └── en.json
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── admin/        # Admin paneli sayfaları
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectManagement.tsx
│   │   │   ├── AboutManagement.tsx
│   │   │   └── CVManagement.tsx
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── CV.tsx
│   │   └── Login.tsx
│   ├── types/            # TypeScript type tanımlamaları
│   │   └── index.ts
│   ├── utils/            # Yardımcı fonksiyonlar
│   │   ├── errorHandler.ts
│   │   └── generateSitemap.ts
│   ├── App.tsx           # Ana uygulama bileşeni
│   ├── main.tsx          # Giriş noktası
│   └── index.css         # Global stiller
├── database/             # Veritabanı şemaları ve migration'lar
│   ├── migrations/
│   └── schema.sql
├── scripts/              # Yardımcı scriptler
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Kurulum

### Gereksinimler

- **Node.js** 18+ 
- **npm** veya **yarn**
- **Supabase** hesabı

### Adımlar

1. **Depoyu klonlayın:**
```bash
git clone <repository-url>
cd poludev
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables oluşturun:**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve Supabase bilgilerinizi ekleyin:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Supabase veritabanını kurun:**
   - Supabase Dashboard'da yeni bir proje oluşturun
   - `database/` klasöründeki SQL dosyalarını Supabase SQL Editor'de çalıştırın
   - Storage bucket'ları oluşturun: `cv-files`, `project-images`, `profile-images`
   - RLS (Row Level Security) politikalarını etkinleştirin

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📦 Build ve Deploy

### Production Build
```bash
npm run build
```

Build çıktısı `dist/` klasöründe oluşturulur.

### Preview
```bash
npm run preview
```

### Vercel Deployment
Proje Vercel'e deploy edilmeye hazırdır. Vercel otomatik olarak:
- Environment variables'ları algılar
- Build komutunu çalıştırır
- Production build'i deploy eder

## 🔧 Yapılandırma

### Supabase Yapılandırması

1. **Veritabanı Tabloları:**
   - `users` - Kullanıcı bilgileri
   - `projects` - Proje bilgileri
   - `about_us` - Hakkımızda bilgileri
   - `cv_versions` - CV versiyonları
   - `cv_downloads` - CV indirme takibi
   - `site_settings` - Site genel ayarları

2. **Storage Buckets:**
   - `cv-files` - CV dosyaları
   - `project-images` - Proje görselleri
   - `profile-images` - Profil fotoğrafları

3. **Authentication:**
   - Email/Password authentication
   - Admin kullanıcıları oluşturun
   - User ID'lerini `src/config/constants.ts` dosyasında güncelleyin

### Çoklu Dil Yapılandırması

Dil dosyaları `src/i18n/locales/` klasöründe bulunur:
- `tr.json` - Türkçe çeviriler
- `en.json` - İngilizce çeviriler

Yeni çeviri eklemek için ilgili dosyalara key-value çiftleri ekleyin.

## 📖 Kullanım

### Admin Paneli

1. `/login` sayfasından giriş yapın
2. Admin paneline erişmek için admin yetkisine sahip bir kullanıcı olmalısınız
3. Dashboard'dan genel istatistikleri görüntüleyin
4. Proje, Hakkımızda ve CV yönetimi sayfalarından içerikleri düzenleyin

### Proje Ekleme

1. Admin paneli > Proje Yönetimi
2. "Yeni Proje Ekle" butonuna tıklayın
3. Proje bilgilerini doldurun (başlık, açıklama, görsel, linkler, vb.)
4. Kaydet butonuna tıklayın

### CV Yükleme

1. Admin paneli > CV Yönetimi
2. Kullanıcı seçin (Mert veya Mustafa)
3. "Yeni Versiyon Yükle" sekmesine gidin
4. CV dosyasını seçin (PDF, DOCX, HTML)
5. Versiyon numarası ve açıklama ekleyin
6. Yükle butonuna tıklayın

## 🎨 Tema ve Renkler

Proje turuncu/amber renk paleti kullanmaktadır:
- Primary: Orange (#f97316)
- Secondary: Amber (#f59e0b)
- Dark mode desteği

Renkleri değiştirmek için `tailwind.config.js` veya doğrudan Tailwind CSS sınıflarını güncelleyin.

## 🔒 Güvenlik

- Row Level Security (RLS) politikaları aktif
- Admin yetkisi kontrolü
- Protected routes
- Environment variables ile hassas bilgilerin korunması
- Supabase authentication

## 📝 Scripts

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Linting
npm run lint
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje özel bir projedir.

## 👥 Geliştiriciler

- **Mert** - [GitHub](https://github.com/mertkoclar)
- **Mustafa** - [GitHub](https://github.com/MustafaSne)

## 📞 İletişim

- **Email**: poludevs@gmail.com
- **Website**: [poludev.com](https://poludev.com)

## 🙏 Teşekkürler

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
