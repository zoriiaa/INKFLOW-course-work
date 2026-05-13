import React, { useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import AccountSidebar from '../components/AccountSidebar.jsx';
import './Profile.css';

function parseJwt(token) {
    try {
        const base64 = token.split('.')[1];
        const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
        return payload;
    } catch {
        return {};
    }
}

export default function Profile() {
    const token = localStorage.getItem('token');
    const claims = useMemo(() => parseJwt(token || ''), [token]);
    const [name, setName] = useState(claims.unique_name || claims.name || 'Customer');
    const [email, setEmail] = useState(claims.email || 'customer@gmail.com');
    const [password, setPassword] = useState('********');
    const [saved, setSaved] = useState(false);

    const save = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="profile-page">
            <SiteHeader />
            <main className="profile-wrap">
                <AccountSidebar active="profile" />

                <section className="profile-main">
                    <h1>ОСОБИСТІ ДАНІ</h1>
                    <form onSubmit={save} className="profile-form">
                        <label>Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label>Ім'я</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                        <label>Пароль</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">ЗБЕРЕГТИ ЗМІНИ</button>
                    </form>
                </section>
            </main>
            <SiteFooter />
            {saved && <div className="profile-toast">Зміни збережено локально</div>}
        </div>
    );
}
