import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './AccountSidebar.css';

function parseJwt(token) {
    try {
        const base64 = token.split('.')[1];
        return JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return {};
    }
}

export default function AccountSidebar({ active }) {
    const token = localStorage.getItem('token');
    const claims = useMemo(() => parseJwt(token || ''), [token]);
    const name = claims.unique_name || claims.name || 'Customer';
    const email = claims.email || '';

    const logout = () => {
        localStorage.removeItem('token');
    };

    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__avatar" aria-hidden>☺</div>
            <div className="account-sidebar__name">{name}</div>
            {email && <div className="account-sidebar__email">{email}</div>}
            <Link
                to="/orders"
                className={`account-sidebar__link${active === 'orders' ? ' account-sidebar__link--active' : ''}`}
            >
                Замовлення
            </Link>
            <Link
                to="/profile"
                className={`account-sidebar__link${active === 'profile' ? ' account-sidebar__link--active' : ''}`}
            >
                Профіль
            </Link>
            <Link to="/login" className="account-sidebar__link account-sidebar__link--danger" onClick={logout}>
                Вийти
            </Link>
        </aside>
    );
}
