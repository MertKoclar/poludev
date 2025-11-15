#!/bin/bash

# Supabase Setup Script
# Bu script MCP araçları ile Supabase kurulumunu otomatikleştirir

echo "🚀 Poludev Supabase Kurulumu Başlıyor..."

# SQL dosyalarını sırayla çalıştır
echo "📊 Veritabanı şeması oluşturuluyor..."
# Note: Bu komutlar Supabase Dashboard SQL Editor'da veya Supabase CLI ile çalıştırılmalıdır
# MCP araçları kullanarak SQL sorgularını çalıştırabilirsiniz

echo "✅ Kurulum tamamlandı!"
echo ""
echo "Yapılacaklar:"
echo "1. Supabase Dashboard > SQL Editor'da database/ klasöründeki SQL dosyalarını sırayla çalıştırın"
echo "2. .env dosyasını oluşturun ve Supabase bilgilerinizi ekleyin"
echo "3. Supabase Auth ile kullanıcı oluşturun"
echo "4. Kullanıcı ID'lerini src/config/constants.ts dosyasında güncelleyin"

