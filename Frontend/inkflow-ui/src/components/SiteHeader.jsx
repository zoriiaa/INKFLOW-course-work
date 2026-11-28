import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import logo from '../assets/images/Logo.svg';
import SearchOverlay from './SearchOverlay.jsx';
import { closeCatalogFilters } from '../utils/overlayEvents.js';
import './SiteHeader.css';
const API_BASE = '/api';

export default function SiteHeader({ showSearch = true }) {
    const token = localStorage.getItem('token');
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchProducts, setSearchProducts] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

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

    useEffect(() => {
        const closeNavigation = () => {
            setMenuOpen(false);
            setSearchOpen(false);
        };
        window.addEventListener('inkflow-close-site-navigation', closeNavigation);
        return () => window.removeEventListener('inkflow-close-site-navigation', closeNavigation);
    }, []);

    useEffect(() => {
        const closeOnDesktop = () => {
            if (window.innerWidth > 700) setMenuOpen(false);
        };
        window.addEventListener('resize', closeOnDesktop);
        return () => window.removeEventListener('resize', closeOnDesktop);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = event => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        document.body.classList.add('site-menu-open');
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.classList.remove('site-menu-open');
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const profilePath = useMemo(() => (token ? '/profile' : '/login'), [token]);

    const openSearch = async () => {
        setMenuOpen(false);
        closeCatalogFilters();
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
                        <Link to="/about">ПРО НАС</Link>
                    </nav>

                    <div className="site-top-header__icons">
                        <button
                            type="button"
                            className="icon-btn site-menu-button"
                            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
                            aria-expanded={menuOpen}
                            onClick={() => {
                                setSearchOpen(false);
                                if (!menuOpen) closeCatalogFilters();
                                setMenuOpen(open => !open);
                            }}
                        >
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                {menuOpen
                                    ? <path d="M6 6l12 12M18 6L6 18" />
                                    : <path d="M4 7h16M4 12h16M4 17h16" />}
                            </svg>
                        </button>
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
            {menuOpen && createPortal(
                <>
                    <button
                        type="button"
                        className="site-mobile-menu-backdrop"
                        aria-label="Закрити меню"
                        onClick={() => setMenuOpen(false)}
                    />
                    <aside className="site-mobile-menu" aria-label="Мобільна навігація" aria-modal="true" role="dialog">
                        <div className="site-mobile-menu__head">
                            <strong>МЕНЮ</strong>
                            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Закрити меню">×</button>
                        </div>
                        <nav>
                            <Link to="/catalog" onClick={() => setMenuOpen(false)}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" />
                                    <path d="M4 4.5v17M8 6h8M8 10h8" />
                                </svg>
                                Каталог
                            </Link>
                            <Link to="/about" onClick={() => setMenuOpen(false)}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 11v5M12 8h.01" />
                                </svg>
                                Про нас
                            </Link>
                        </nav>
                        <div className="site-mobile-menu__divider" />
                        <div className="site-mobile-menu__actions">
                            {showSearch && (
                                <button type="button" onClick={openSearch}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    Пошук
                                </button>
                            )}
                            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Обране
                            </Link>
                            <Link to="/cart" onClick={() => setMenuOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Кошик
                                {cartCount > 0 && <span className="site-mobile-menu__count">{cartCount}</span>}
                            </Link>
                            <Link to={profilePath} onClick={() => setMenuOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Профіль
                            </Link>
                        </div>
                    </aside>
                </>,
                document.body
            )}
            {searchOpen && (
                <SearchOverlay products={searchProducts} onClose={() => setSearchOpen(false)} />
            )}
        </>
    );
}
