# Poludev - Portfolio Website

Modern, çok dilli ve dinamik bir portfolyo sitesi. Mert ve Mustafa'nın kişisel ve ortak profesyonel çalışmalarını sergiler.

## 🚀 Teknolojiler

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server (SWC ile)
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React-i18next** - Çoklu dil desteği (TR/EN)
- **Supabase** - Backend, veritabanı ve kimlik doğrulama
- **Framer Motion** - Animasyonlar

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageToggle.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Sayfa bileşenleri
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Login.tsx
│   ├── CV.tsx
│   └── admin/          # Admin paneli sayfaları
│       ├── Dashboard.tsx
│       ├── ProjectManagement.tsx
│       ├── AboutManagement.tsx
│       └── CVManagement.tsx
├── context/            # React Context'ler
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx
├── config/             # Yapılandırma dosyaları
│   └── supabaseClient.ts
├── i18n/               # Çoklu dil dosyaları
│   ├── config.ts
│   └── locales/
│       ├── tr.json
│       └── en.json
└── types/              # TypeScript type tanımlamaları
    └── index.ts
```

## 🛠️ Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Supabase veritabanını kurun:**
   - Supabase Dashboard'a gidin
   - SQL Editor'ı açın
   - `database/schema.sql` dosyasındaki SQL komutlarını çalıştırın
   - Storage bucket oluşturun (`cv-files`)
   - Storage policies oluşturun

5. **Development server'ı başlatın:**
```bash
npm run dev
```

6. **Build oluşturun:**
```bash
npm run build
```

## 📊 Veritabanı Şeması

### Tablolar

- **users**: Kullanıcı bilgileri (id, name, email, role, cv_url)
- **projects**: Proje bilgileri (çok dilli)
- **about_us**: Hakkımızda bilgileri (çok dilli)
- **site_content**: Site içeriği (çok dilli)

Detaylı şema için `database/schema.sql` dosyasına bakın.

## 🎨 Özellikler

### ✅ Tamamlanan

- [x] Proje kurulumu (Vite + React + TypeScript + SWC)
- [x] Tailwind CSS yapılandırması
- [x] React Router DOM routing
- [x] Çoklu dil desteği (TR/EN)
- [x] Tema yönetimi (Dark/Light mode)
- [x] Supabase entegrasyonu
- [x] Authentication (Email/Password)
- [x] Admin paneli
- [x] Framer Motion animasyonları
- [x] Responsive design

### 🚧 Yapılacaklar

Detaylı todo listesi için `TODO.md` dosyasına bakın.

## 🔐 Authentication

Admin paneline erişim için:
1. Supabase Auth ile kullanıcı oluşturun
2. `users` tablosuna kullanıcıyı ekleyin ve `role` alanını `'admin'` yapın
3. `/login` sayfasından giriş yapın

## 🌐 Çoklu Dil

Proje Türkçe ve İngilizce dil desteği içerir. Dil dosyaları `src/i18n/locales/` klasöründe bulunur.

## 🎭 Tema

Tema yönetimi `ThemeContext` ile yapılır. Kullanıcı tercihi localStorage'da saklanır.

## 📝 Notlar

- User ID'lerini (`mert-id`, `mustafa-id`) gerçek Supabase user ID'leri ile değiştirin
- Storage bucket'ını (`cv-files`) Supabase Dashboard'dan oluşturun
- RLS policies'leri test edin
- Environment variables'ları production'da güvenli bir şekilde saklayın

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir projedir.

## 👥 Yazanlar

- Mert
- Mustafa

## 🔗 Bağlantılar

- [Supabase](https://supabase.com)
- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
