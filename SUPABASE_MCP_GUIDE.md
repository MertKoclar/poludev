# Supabase MCP Kurulum Rehberi

Bu rehber, MCP (Model Context Protocol) araçları kullanarak Supabase kurulumunu yapmanızı sağlar.

## 📋 Önkoşullar

1. Supabase projesi oluşturulmuş olmalı
2. Supabase Project URL ve Anon Key'e sahip olmalısınız
3. MCP araçlarına erişim olmalı

## 🚀 Adım Adım Kurulum

### 1. Environment Variables Ayarlama

`.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. SQL Dosyalarını Çalıştırma

MCP araçları ile aşağıdaki SQL dosyalarını sırayla Supabase'e yükleyin:

1. `database/01_schema.sql` - Tabloları oluşturur
2. `database/02_indexes.sql` - İndeksleri oluşturur
3. `database/03_triggers.sql` - Trigger'ları oluşturur
4. `database/04_rls_policies.sql` - RLS politikalarını oluşturur
5. `database/05_storage.sql` - Storage bucket ve politikalarını oluşturur

### 3. Kullanıcı Oluşturma

Supabase Dashboard > Authentication > Users bölümünden:

1. Mert için kullanıcı oluşturun
2. Mustafa için kullanıcı oluşturun
3. Her iki kullanıcının ID'sini kopyalayın

### 4. Kullanıcı ID'lerini Güncelleme

`src/config/constants.ts` dosyasını açın ve kullanıcı ID'lerini güncelleyin:

```typescript
export const USER_IDS = {
  MERT: 'gerçek-mert-user-id', // Supabase'den aldığınız ID
  MUSTAFA: 'gerçek-mustafa-user-id', // Supabase'den aldığınız ID
} as const;
```

### 5. Admin Rolü Atama

Supabase SQL Editor'da şu sorguyu çalıştırın (ID'leri gerçek ID'lerle değiştirin):

```sql
-- Mert'i admin yap
UPDATE users 
SET role = 'admin' 
WHERE id = 'mert-user-id';

-- Mustafa'yı admin yap
UPDATE users 
SET role = 'admin' 
WHERE id = 'mustafa-user-id';
```

Ya da INSERT ile direkt oluşturabilirsiniz (Auth'dan oluşturduktan sonra):

```sql
INSERT INTO users (id, name, email, role) VALUES
  ('mert-user-id', 'Mert', 'mert@example.com', 'admin'),
  ('mustafa-user-id', 'Mustafa', 'mustafa@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## 🔍 MCP Araçları ile Otomasyon

MCP araçlarını kullanarak SQL dosyalarını otomatik olarak çalıştırabilirsiniz:

```javascript
// MCP araçları ile SQL çalıştırma örneği
const sqlFiles = [
  'database/01_schema.sql',
  'database/02_indexes.sql',
  'database/03_triggers.sql',
  'database/04_rls_policies.sql',
  'database/05_storage.sql',
];

for (const file of sqlFiles) {
  const sql = fs.readFileSync(file, 'utf8');
  // MCP araçları ile SQL'i çalıştır
  await executeSQL(sql);
}
```

## ✅ Doğrulama

Kurulumu doğrulamak için:

1. Supabase Dashboard > Table Editor'da tabloların oluşturulduğunu kontrol edin
2. Storage > Buckets bölümünde `cv-files` bucket'ının olduğunu kontrol edin
3. Authentication > Users bölümünde kullanıcıların olduğunu kontrol edin
4. SQL Editor'da RLS politikalarının aktif olduğunu kontrol edin

## 🐛 Sorun Giderme

### Tablolar oluşmadıysa
- SQL dosyalarını tekrar kontrol edin
- Supabase projesinin aktif olduğundan emin olun
- SQL Editor'da hata mesajlarını kontrol edin

### RLS politikaları çalışmıyorsa
- `04_rls_policies.sql` dosyasını tekrar çalıştırın
- Policy'lerin doğru oluşturulduğunu Supabase Dashboard'dan kontrol edin

### Storage bucket oluşmadıysa
- `05_storage.sql` dosyasını tekrar çalıştırın
- Manuel olarak Storage > Buckets bölümünden oluşturabilirsiniz

## 📚 Ek Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/tables)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

