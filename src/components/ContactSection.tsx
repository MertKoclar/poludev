import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { InputGroup } from './InputGroup';

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock API call function
    const submitFormToAPI = async (data: typeof formData) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate network errors (10% failure rate)
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }
        
        // Simulate successful response
        return { 
            success: true, 
            message: 'Mesajınız başarıyla iletildi! En kısa sürede size geri döneceğiz.' 
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Hata durumunu temizle
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Lütfen adınızı girin');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Lütfen e-posta adresinizi girin');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Lütfen geçerli bir e-posta adresi girin');
            return false;
        }
        if (!formData.message.trim()) {
            setError('Lütfen mesajınızı girin');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Formu doğrula
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError('');
        setStatus('');
        
        try {
            const response = await submitFormToAPI(formData);
            console.log('Form verileri:', formData);
            setStatus(response.message);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setError('Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            console.error('Form submission error:', err);
        } finally {
            setLoading(false);
        }
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
                        noValidate
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
                                rows={4}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-600 focus:border-orange-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 shadow-inner"
                                aria-describedby="message-error"
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 dark:text-red-400 text-sm font-medium p-2 rounded-lg bg-red-50 dark:bg-red-900/20" role="alert" aria-live="polite">
                                {error}
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center py-3 border border-transparent text-base font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            <Send className="w-5 h-5 mr-3" />
                            {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                        </motion.button>
                    </motion.form>
                    
                    {status && (
                        <div className={`mt-4 text-center font-medium p-3 rounded-lg ${status.includes('başarıyla') ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'}`} role="status" aria-live="polite">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;