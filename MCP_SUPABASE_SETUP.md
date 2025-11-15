# Supabase MCP Kurulum Talimatları

MCP (Model Context Protocol) kullanarak Supabase kurulumunu otomatikleştirmek için:

## Kullanılabilir MCP Araçları

Supabase MCP server'ında genellikle şu araçlar bulunur:
- `run_sql` veya `execute_sql` - SQL sorgularını çalıştırır
- `create_bucket` - Storage bucket oluşturur
- `create_policy` - RLS veya Storage policy oluşturur
- `list_tables` - Tabloları listeler

## Otomatik Kurulum

`database/complete_schema.sql` dosyasındaki SQL komutları MCP araçları ile çalıştırılabilir.

### Adım 1: SQL Schema Yükleme

MCP aracı ile `database/complete_schema.sql` dosyasını Supabase'e yükleyin:

```javascript
// Örnek MCP kullanımı
await callMCPTool('supabase', 'run_sql', {
  sql: fs.readFileSync('database/complete_schema.sql', 'utf8')
});
```

### Adım 2: Doğrulama

Tabloların oluşturulduğunu kontrol edin:
- `users`
- `site_content`
- `projects`
- `about_us`

Storage bucket'ın oluşturulduğunu kontrol edin:
- `cv-files`

## Manuel Kurulum Alternatifi

Eğer MCP araçları çalışmazsa:
1. Supabase Dashboard > SQL Editor'a gidin
2. `database/complete_schema.sql` dosyasını açın
3. Tüm SQL'i kopyalayıp SQL Editor'a yapıştırın
4. "Run" butonuna tıklayın

