/**
 * Supabase Setup Script
 * Bu script Supabase kurulumunu otomatikleştirmek için kullanılabilir
 * MCP araçları ile entegre edilebilir
 */

const fs = require('fs');
const path = require('path');

const SQL_FILES = [
  '01_schema.sql',
  '02_indexes.sql',
  '03_triggers.sql',
  '04_rls_policies.sql',
  '05_storage.sql',
];

async function setupSupabase() {
  console.log('🚀 Poludev Supabase Kurulumu Başlıyor...\n');

  const databaseDir = path.join(__dirname, '../database');
  
  for (const file of SQL_FILES) {
    const filePath = path.join(databaseDir, file);
    if (fs.existsSync(filePath)) {
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`📄 ${file} yüklendi`);
      // Burada MCP araçları ile SQL sorgusunu çalıştırabilirsiniz
      // await executeSQL(sql);
    }
  }

  console.log('\n✅ SQL dosyaları hazır!');
  console.log('\nYapılacaklar:');
  console.log('1. Supabase Dashboard > SQL Editor\'da database/ klasöründeki SQL dosyalarını sırayla çalıştırın');
  console.log('2. .env dosyasını oluşturun ve Supabase bilgilerinizi ekleyin');
  console.log('3. Supabase Auth ile kullanıcı oluşturun');
  console.log('4. Kullanıcı ID\'lerini src/config/constants.ts dosyasında güncelleyin');
}

if (require.main === module) {
  setupSupabase().catch(console.error);
}

module.exports = { setupSupabase, SQL_FILES };

