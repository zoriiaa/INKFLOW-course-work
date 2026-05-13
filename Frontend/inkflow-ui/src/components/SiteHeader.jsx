import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import SearchOverlay from './SearchOverlay.jsx';
import './SiteHeader.css';
const API_BASE = 'http://localhost:5275/api';

export default function SiteHeader({ showSearch = true }) {
    const token = localStorage.getItem('token');
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchProducts, setSearchProducts] = useState([]);

    const refreshCartCount = useCallback(() => {
        if (!token) {
            setCartCount(0);
            return;
        }
        fetch(`${API_BASE}/Cart`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (!data?.items) return;
                const count = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                setCartCount(count);
            })
            .catch(() => {});
    }, [token]);

    useEffect(() => {
        refreshCartCount();
    }, [refreshCartCount]);

    useEffect(() => {
        const onCart = () => refreshCartCount();
        window.addEventListener('inkflow-cart-changed', onCart);
        return () => window.removeEventListener('inkflow-cart-changed', onCart);
    }, [refreshCartCount]);

    const profilePath = useMemo(() => (token ? '/profile' : '/login'), [token]);

    const openSearch = async () => {
        setSearchOpen(true);
        if (searchProducts.length === 0) {
            try {
                const res = await fetch(`${API_BASE}/Products?pageNumber=1&pageSize=500`);
                if (res.ok) setSearchProducts(await res.json());
            } catch { /* ignore */ }
        }
    };

    return (
        <>
            <header className="site-top-header">
                <div className="site-top-header__inner">
                    <Link to="/home">
                        <img src={logo} className="site-top-header__logo logo-white" alt="INKFLOW" />
                    </Link>

                    <nav className="site-top-header__nav">
                        <Link to="/catalog">КАТАЛОГ</Link>
                        <Link to="/brands">БРЕНДИ</Link>
                        <Link to="/about">ПРО НАС</Link>
                    </nav>

                    <div className="site-top-header__icons">
                        {showSearch && (
                            <button type="button" className="icon-btn" aria-label="Пошук" onClick={openSearch}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>
                        )}

                        <Link to="/wishlist" className="icon-btn" aria-label="Вішліст">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </Link>
                        <Link to="/cart" className="icon-btn cart-icon-btn" aria-label="Кошик">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
                        </Link>
                        <Link to={profilePath} className="icon-btn" aria-label="Профіль">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>
            {searchOpen && (
                <SearchOverlay products={searchProducts} onClose={() => setSearchOpen(false)} />
            )}
        </>
    );
}
