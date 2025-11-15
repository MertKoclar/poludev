# Supabase Auth Kullanıcısı Oluşturma

Ahmet Mert Koçlar için Supabase Auth sisteminde kullanıcı oluşturmanız gerekiyor.

## Adım 1: Supabase Dashboard'dan Manuel Oluşturma

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **Authentication** > **Users** seçin
4. **Add User** butonuna tıklayın
5. Bilgileri girin:
   - **Email**: mertkoclar@icloud.com
   - **Password**: Mert0101!
   - **Auto Confirm User**: ✅ (işaretli olsun)
6. **Create User** butonuna tıklayın
7. Oluşturulan kullanıcının **UUID**'sini kopyalayın

## Adım 2: User ID'yi Güncelleme

Auth kullanıcısının UUID'sini aldıktan sonra, `public.users` tablosundaki kaydı güncelleyin:

```sql
UPDATE public.users 
SET id = 'auth-users-uuid-buraya' 
WHERE email = 'mertkoclar@icloud.com';
```

## Alternatif: Admin API ile Programatik Oluşturma

Admin API kullanarak da oluşturabilirsiniz (Supabase Service Role Key gerekiyor):

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://mwttjzwfmvlbwhllcqgg.supabase.co',
  'YOUR_SERVICE_ROLE_KEY' // Supabase Dashboard > Settings > API > service_role key
);

const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email: 'mertkoclar@icloud.com',
  password: 'Mert0101!',
  email_confirm: true,
  user_metadata: {
    name: 'Ahmet Mert Koçlar'
  }
});

// Oluşturulan user ID ile public.users'ı güncelle
await supabaseAdmin
  .from('users')
  .update({ id: data.user.id })
  .eq('email', 'mertkoclar@icloud.com');
```

