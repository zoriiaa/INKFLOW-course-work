import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import AccountSidebar from '../components/AccountSidebar.jsx';
import '../styles/Profile.css';

const API_BASE = 'http://localhost:5275/api';

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`profile-catalog-toast profile-catalog-toast--${type}`}>
            {message}
        </div>
    );
}

export default function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const showToast = (text, type) => setToast({ text, type });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE}/Auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return null;
                }
                return res.ok ? res.json() : null;
            })
            .then(data => {
                if (data) {
                    setForm({ email: data.email || '', username: data.username || '', password: '' });
                }
            })
            .catch(() => showToast('Не вдалося завантажити профіль', 'error'))
            .finally(() => setLoading(false));
    }, [navigate, token]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const save = async (e) => {
        e.preventDefault();
        if (!token) return;

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/Auth/me`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    username: form.username,
                    password: form.password.trim() ? form.password : null,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                showToast(text || 'Не вдалося зберегти зміни', 'error');
                return;
            }

            const data = await res.json();
            if (data.token) localStorage.setItem('token', data.token);
            if (data.profile) {
                setForm({ email: data.profile.email || '', username: data.profile.username || '', password: '' });
            }
            showToast('Зміни збережено', 'success');
        } catch {
            showToast("Помилка з'єднання", 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-page">
            <SiteHeader />
            <main className="profile-wrap">
                <AccountSidebar active="profile" />

                <section className="profile-main">
                    <h1>ОСОБИСТІ ДАНІ</h1>
                    {loading ? (
                        <p className="profile-loading">Завантаження...</p>
                    ) : (
                        <form onSubmit={save} className="profile-form">
                            <label htmlFor="profile-email">Email</label>
                            <input
                                id="profile-email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="profile-username">Ім'я</label>
                            <input
                                id="profile-username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="profile-password">Новий пароль</label>
                            <div className="profile-password-wrap">
                                <input
                                    id="profile-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Залиште порожнім, якщо не змінюєте"
                                />
                                <button
                                    type="button"
                                    className="profile-eye-btn"
                                    onClick={() => setShowPassword(p => !p)}
                                    aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <button type="submit" disabled={saving}>
                                {saving ? 'ЗБЕРІГАЄМО...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                            </button>
                        </form>
                    )}
                </section>
            </main>
            <SiteFooter />
            {toast && (
                <Toast message={toast.text} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}