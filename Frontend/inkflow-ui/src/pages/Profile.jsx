import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import AccountSidebar from '../components/AccountSidebar.jsx';
import './Profile.css';

const API_BASE = 'http://localhost:5275/api';

export default function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

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
                    setForm({
                        email: data.email || '',
                        username: data.username || '',
                        password: '',
                    });
                }
            })
            .catch(() => setToast({ type: 'error', text: "Не вдалося завантажити профіль" }))
            .finally(() => setLoading(false));
    }, [navigate, token]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2600);
        return () => clearTimeout(t);
    }, [toast]);

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
                setToast({ type: 'error', text: text || 'Не вдалося зберегти зміни' });
                return;
            }

            const data = await res.json();
            if (data.token) localStorage.setItem('token', data.token);
            if (data.profile) {
                setForm({
                    email: data.profile.email || '',
                    username: data.profile.username || '',
                    password: '',
                });
            }
            setToast({ type: 'success', text: 'Зміни збережено' });
        } catch {
            setToast({ type: 'error', text: "Помилка з'єднання" });
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
                            <input
                                id="profile-password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Залиште порожнім, якщо не змінюєте"
                            />

                            <button type="submit" disabled={saving}>
                                {saving ? 'ЗБЕРІГАЄМО...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                            </button>
                        </form>
                    )}
                </section>
            </main>
            <SiteFooter />
            {toast && <div className={`profile-toast profile-toast--${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
