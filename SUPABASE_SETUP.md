# Supabase Kurulum Rehberi (MCP ile)

Bu dosya, Supabase projesinin MCP araçları ile kurulumu için gereken adımları içerir.

## Gereksinimler

1. Supabase hesabı ve projesi
2. Supabase Project URL ve Anon Key
3. MCP araçları erişimi

## Adımlar

### 1. Supabase Projesi Oluşturma
- Supabase Dashboard'a gidin
- Yeni proje oluşturun
- Project URL ve Anon Key'i alın

### 2. Environment Variables
`.env` dosyasını oluşturun ve şunları ekleyin:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Veritabanı Şeması
`database/schema.sql` dosyasındaki SQL komutlarını Supabase SQL Editor'da çalıştırın.

### 4. Storage Bucket
- Supabase Dashboard > Storage
- `cv-files` adında public bucket oluşturun
- Storage policies'leri ayarlayın

### 5. Kullanıcı Oluşturma
- Supabase Auth ile kullanıcı oluşturun
- `users` tablosuna ekleyin ve `role='admin'` yapın
- User ID'lerini `src/config/constants.ts` dosyasında güncelleyin

