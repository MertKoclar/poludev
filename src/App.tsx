import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Menu, X, Code, Smartphone, Zap, Check, ArrowRight,
  Send, Facebook, Twitter, Linkedin, Github, Users, Layers, TrendingUp
} from 'lucide-react';

// ====================================================================
// 1. TEMA CONTEXT (ThemeContext.jsx yerine burada tanımlanmıştır)
// Tema durumunu yöneten ve uygulama genelinde paylaşan Context
// ====================================================================

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Başlangıç temasını localStorage'dan veya sistem tercihinden al
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme;

      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    return 'light'; // Varsayılan tema
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    // Tema sınıfını HTML root elementine uygula
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// ====================================================================
// 2. TEMEL BİLEŞENLER (Header, HeroSection, vb. tek tek tanımlanmıştır)
// ====================================================================

// Tema Değiştirme Butonu (Header içinde kullanılır)
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 bg-orange-100/50 dark:bg-gray-800/50 text-orange-600 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white border border-orange-600 shadow-md dark:shadow-gray-700/50"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Tema Değiştir"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

// Navigasyon Bağlantıları
const NavLink = ({ to, children, setMenuOpen }) => (
  <motion.a
    href={to}
    onClick={() => setMenuOpen(false)}
    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition duration-300 px-3 py-2 text-sm lg:text-base"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.a>
);

// Header Bileşeni
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { name: 'Hizmetler', to: '#hizmetler' },
    { name: 'Teknolojiler', to: '#teknolojiler' },
    { name: 'İletişim', to: '#iletisim' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-3xl font-extrabold text-orange-600 tracking-wider"
            whileHover={{ scale: 1.05 }}
          >
            Poludev<span className="text-gray-900 dark:text-white">.</span>
          </motion.a>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              <NavLink key={link.name} to={link.to} setMenuOpen={() => {}}>{link.name}</NavLink>
            ))}
            <ThemeToggleButton />
          </nav>

          {/* Mobil Menü Butonu */}
          <div className="flex lg:hidden items-center space-x-3">
            <ThemeToggleButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-orange-600 hover:bg-orange-100 dark:hover:bg-gray-800 transition duration-300"
              aria-label="Menü Aç/Kapat"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden shadow-xl bg-white dark:bg-gray-800 border-t border-orange-500/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
              {links.map((link) => (
                <NavLink key={link.name} to={link.to} setMenuOpen={setIsMenuOpen}>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Hero Section Bileşeni
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Gelişmiş Arka Plan Efekti: Turuncu Degrade ve Desen */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-br from-orange-600/10 to-transparent absolute inset-0 mix-blend-multiply dark:mix-blend-lighten"></div>
        <div className="absolute inset-0 bg-[url('https://api.iconify.design/lucide/grip.svg?color=%23f97316&width=16&height=16')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" style={{ backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Dijital Geleceğiniz <span className="text-orange-600 dark:text-orange-400">Bizimle Başlar.</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Poludev, inovatif Full Stack ve Mobil çözümlerle işletmenizi dijital çağın zirvesine taşır. Hayalinizdeki yazılımı gerçeğe dönüştürmek için buradayız.
          </motion.p>
          
          <motion.a
            href="#iletisim"
            className="inline-flex items-center justify-center px-8 py-4 border-4 border-orange-600 text-base font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-orange-500/50"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(249, 115, 22, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Projenizi Başlatalım <ArrowRight className="ml-3 w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

// Hizmet Kartı Bileşeni
const ServiceCard = ({ icon, title, description, features, delay }) => {
    const Icon = icon;

    return (
        <motion.div
            id="hizmetler"
            className="group relative p-8 md:p-10 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 transition-all duration-500 border border-transparent dark:border-gray-700/50"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, delay: delay, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            
            // 3D Kalkma ve Parlama Efekti
            whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.4)", // Güçlü gölge
                y: -10 
            }}
            style={{ 
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}
        >
            {/* Parlama Efekti için Turuncu Kavis */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="p-3 bg-orange-100/70 dark:bg-orange-900/50 rounded-xl inline-flex mb-6 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
                
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-800 dark:text-gray-200 font-medium">
                            <Check className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <a href="#iletisim" className="mt-8 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-300">
                    Daha Fazla Bilgi <ArrowRight className="w-4 h-4 ml-2" />
                </a>
            </div>
        </motion.div>
    );
};

// Hizmetler Bölümü
const ServicesSection = () => {
    const services = [
        {
            icon: Code,
            title: 'Full Stack Web Geliştirme',
            description: 'Uçtan uca kapsamlı web uygulamaları için modern mimariler ve ölçeklenebilir çözümler sunuyoruz. Frontend (React) ve Backend (Node.js, Express) yetkinliklerimizle projenizi başarıya taşıyoruz.',
            features: [
                'Özel Mimariler ve API Gelişimi',
                'E-ticaret ve Kurumsal Çözümler',
                'Veritabanı Tasarımı ve Optimizasyonu',
            ],
            delay: 0.1,
        },
        {
            icon: Smartphone,
            title: 'Mobil Uygulama Geliştirme',
            description: 'iOS ve Android platformları için hızlı, estetik ve kullanıcı odaklı mobil deneyimler yaratıyoruz. Markanızın mobil dünyadaki varlığını güçlendirin.',
            features: [
                'Cross-Platform (Flutter) Uygulamalar',
                'Native Performans ve Deneyim',
                'API Entegrasyonu ve Yayınlama Desteği',
            ],
            delay: 0.3,
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-gray-900 transition-colors duration-500" id="hizmetler">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Çözüm Sunduğumuz Alanlar
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Dijital dönüşümünüzü hızlandıracak yenilikçi ve güvenilir yazılım hizmetleri.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Teknoloji Badge Bileşeni
const TechBadge = ({ icon, name, color, delay }) => {
    const Icon = icon;
    
    // Rastgele hafif bir yalpalanma animasyonu
    const hoverAnimation = {
        rotate: [-1, 1, -1, 0],
        scale: 1.05,
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        }
    };

    return (
        <motion.div
            className={`flex items-center space-x-3 p-4 rounded-xl shadow-lg border-b-4 border-${color}-600 bg-white dark:bg-gray-800 cursor-default`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay }}
            viewport={{ once: true }}
            whileHover={hoverAnimation}
        >
            <Icon className={`w-6 h-6 text-${color}-600`} />
            <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
        </motion.div>
    );
};

// Teknoloji Yığını Bölümü
const TechStackSection = () => {
    const technologies = [
        { icon: Zap, name: 'React', color: 'blue', delay: 0.1 },
        { icon: Code, name: 'Node.js', color: 'green', delay: 0.2 },
        { icon: Smartphone, name: 'Flutter', color: 'sky', delay: 0.3 },
        { icon: TrendingUp, name: 'TypeScript', color: 'blue', delay: 0.4 },
        { icon: Layers, name: 'Express.js', color: 'gray', delay: 0.5 },
        { icon: Users, name: 'MongoDB/PostgreSQL', color: 'yellow', delay: 0.6 },
    ];

    return (
        <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="teknolojiler">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Kullandığımız Teknoloji Yığını
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Projelerimizde en iyi performansı ve ölçeklenebilirliği sağlamak için modern ve kanıtlanmış araçları kullanıyoruz.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {technologies.map((tech) => (
                        <TechBadge key={tech.name} {...tech} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// İletişim Formu Bileşeni
const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Gönderiliyor...');
        // Mock Gönderim (Gerçek bir API çağrısı veya Firebase/Firestore kullanımı gereklidir)
        setTimeout(() => {
            console.log('Form verileri:', formData);
            setStatus('Mesajınız başarıyla iletildi! En kısa sürede size geri döneceğiz.');
            setFormData({ name: '', email: '', message: '' });
        }, 2000);
    };

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-gray-800 transition-colors duration-500" id="iletisim">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Hemen İletişime Geçin
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Projenizi detaylı konuşmak ve bir yol haritası belirlemek için bize yazın.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl bg-gray-50 dark:bg-gray-900 border-t-4 border-orange-600 transition-colors duration-500">
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <InputGroup label="Adınız ve Soyadınız" name="name" value={formData.name} onChange={handleChange} />
                        <InputGroup label="E-posta Adresiniz" name="email" type="email" value={formData.email} onChange={handleChange} />
                        
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mesajınız
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-600 focus:border-orange-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 shadow-inner"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full inline-flex items-center justify-center py-3 border border-transparent text-base font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Send className="w-5 h-5 mr-3" />
                            {status === 'Gönderiliyor...' ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                        </motion.button>
                    </motion.form>
                    
                    {status && status !== 'Gönderiliyor...' && (
                        <p className={`mt-4 text-center font-medium ${status.includes('başarıyla') ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

// Yardımcı Form Input Bileşeni
const InputGroup = ({ label, name, type = 'text', value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-600 focus:border-orange-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 shadow-inner"
        />
    </div>
);

// Footer Bileşeni
const Footer = () => {
    const socialLinks = [
        { icon: Linkedin, href: '#' },
        { icon: Github, href: '#' },
        { icon: Twitter, href: '#' },
        { icon: Facebook, href: '#' },
    ];

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <motion.p
                            className="text-lg font-bold text-orange-400"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Poludev <span className="text-gray-400">Yazılım Hizmetleri</span>
                        </motion.p>
                    </div>
                    
                    <div className="flex space-x-6">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-orange-600 transition duration-300"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                                aria-label={link.icon.name}
                            >
                                <link.icon className="w-6 h-6" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Poludev Yazılım Hizmetleri. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// ====================================================================
// ANA BİLEŞEN (App.jsx)
// Tüm Context ve Bileşenleri bir araya getirir.
// ====================================================================

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Header />
        <main>
          <HeroSection />
          <ServicesSection />
          <TechStackSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;