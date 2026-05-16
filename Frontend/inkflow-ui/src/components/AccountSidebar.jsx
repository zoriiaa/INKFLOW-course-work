import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const claims = useMemo(() => parseJwt(token || ''), [token]);

    const name = claims.unique_name || claims.name || 'Customer';
    const email = claims.email || '';

    const role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || claims.role
        || '';
    const isAdmin = role === 'Admin';

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isOrdersActive = active === 'orders';
    const iconStroke = isOrdersActive ? '#ffffff' : '#000000';

    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__avatar" aria-hidden>☺</div>
            <div className="account-sidebar__name">{name}</div>
            {email && <div className="account-sidebar__email">{email}</div>}

            <Link
                to="/orders"
                className={`account-sidebar__link${isOrdersActive ? ' account-sidebar__link--active' : ''}`}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11 6.2667L5 2.80668M2.18 4.64001L8 8.00668L13.82 4.64001M8 14.72V8.00001M14 10.6667V5.33335C13.9998 5.09953 13.9381 4.8699 13.821 4.66743C13.704 4.46503 13.5358 4.29692 13.3333 4.18001L8.66665 1.51335C8.46395 1.39633 8.23406 1.33472 8 1.33472C7.76594 1.33472 7.53605 1.39633 7.33335 1.51335L2.66667 4.18001C2.46417 4.29692 2.29599 4.46503 2.17898 4.66743C2.06196 4.8699 2.00024 5.09953 2 5.33335V10.6667C2.00024 10.9005 2.06196 11.1302 2.17898 11.3326C2.29599 11.535 2.46417 11.7031 2.66667 11.82L7.33335 14.4867C7.53605 14.6037 7.76594 14.6653 8 14.6653C8.23406 14.6653 8.46395 14.6037 8.66665 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.9381 11.1302 13.9998 10.9005 14 10.6667Z"
                        stroke={iconStroke}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Замовлення
            </Link>

            <Link
                to="/profile"
                className={`account-sidebar__link${active === 'profile' ? ' account-sidebar__link--active' : ''}`}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                Профіль
            </Link>
            {isAdmin && (
                <Link
                    to="/admin"
                    className={`account-sidebar__link${active === 'admin' ? ' account-sidebar__link--active' : ''}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Адмін-панель
                </Link>
            )}
            <Link to="/login" className="account-sidebar__link account-sidebar__link--danger" onClick={logout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Вийти
            </Link>
        </aside>
    );
}