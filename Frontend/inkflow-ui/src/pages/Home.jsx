import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import homePhoto from '../assets/images/HomePhoto.svg';

// Фото-фон кожної картки бренду
import manuscriptPhoto from '../assets/images/brands/ManuscriptPhoto.svg';
import sakuraPhoto     from '../assets/images/brands/SakuraPhoto.svg';
import copicPhoto      from '../assets/images/brands/CopicPhoto.svg';
import faberPhoto      from '../assets/images/brands/FaberCastellPhoto.svg';
import poscaPhoto      from '../assets/images/brands/PoscaPhoto.svg';

// Лого кожного бренду (окремий файл — svg або png)
import manuscriptLogo  from '../assets/images/brands/ManuscriptLogo.svg';
import sakuraLogo      from '../assets/images/brands/SakuraLogo.svg';
import copicLogo       from '../assets/images/brands/CopicLogo.svg';
import faberLogo       from '../assets/images/brands/FaberCastellLogo.svg';
import poscaLogo       from '../assets/images/brands/PoscaLogo.svg';

import './Home.css';

const Home = () => {
    const [headerVisible, setHeaderVisible] = useState(false);
    const heroLogoRef = useRef(null);

    // Хедер з'являється після того як hero-лого виходить з viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Лого пропало з виду → показуємо хедер
                setHeaderVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (heroLogoRef.current) {
            observer.observe(heroLogoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="home-page">

            {/* ===== STICKY HEADER ===== */}
            <header className={`site-header ${headerVisible ? 'site-header--visible' : ''}`}>
                <div className="header-inner">
                    <img src={logo} alt="INKFLOW" className="header-logo logo-white" />
                    <nav className="header-nav">
                        <Link to="/catalog">КАТАЛОГ</Link>
                        <Link to="/brands">БРЕНДИ</Link>
                        <Link to="/about">ПРО НАС</Link>
                    </nav>
                    <div className="header-icons">
                        <button className="icon-btn" aria-label="Пошук">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </button>
                        <Link to="/wishlist" className="icon-btn" aria-label="Вішліст">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </Link>
                        <Link to="/cart" className="icon-btn" aria-label="Кошик">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                        </Link>
                        <Link to="/login" className="icon-btn" aria-label="Профіль">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className="hero">
                {/* Ліва частина — фото */}
                <div className="hero-photo-side">
                    <img src={homePhoto} alt="Sketching" className="hero-photo" />
                </div>

                {/* Права частина — лого + текст */}
                <div className="hero-content-side">
                    {/* Це лого слідкується IntersectionObserver */}
                    <img
                        ref={heroLogoRef}
                        src={logo}
                        alt="INKFLOW"
                        className="hero-logo logo-white"
                    />
                    <h1 className="hero-title">
                        ПРОФЕСІЙНІ<br />
                        МАТЕРІАЛИ ДЛЯ<br />
                        СКЕТЧИНГУ
                    </h1>
                    <p className="hero-subtitle">
                        Найкращі маркери, лайнери та<br />
                        олівці від провідних<br />
                        світових брендів
                    </p>

                    {/* Стрілка вниз — заклик прокрутити */}
                    <div className="hero-scroll-arrow" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <polyline points="19 12 12 19 5 12"/>
                        </svg>
                    </div>
                </div>
            </section>

            {/* ===== BRANDS ===== */}
            <section className="brands-section">
                <div className="brands-header">
                    <h2 className="brands-title">БРЕНДИ</h2>
                    <p className="brands-desc">
                        Ми зібрали бренди, яким довіряють ілюстратори, дизайнери та художники по всьому світу.<br />
                        Нічого зайвого - лише перевірені інструменти для чистої лінії та впевненого штриха.
                    </p>
                </div>

                {/*
                    Сітка брендів — 3 колонки, 2 рядки (як у макеті):
                    [Manuscript]  [Sakura  ]  [          ]
                    [Copic    ]  [Faber   ]  [ Posca    ]
                */}
                <div className="brands-grid">
                    <Link to="/brands/manuscript" className="brand-card brand-card--large brand-card--manuscript">
                        <img src={manuscriptPhoto} alt="Manuscript" className="brand-card-photo" />
                        <img src={manuscriptLogo}  alt="Manuscript logo" className="brand-card-logo-img" />
                    </Link>

                    <div className="brand-card-column">
                        <Link to="/brands/sakura" className="brand-card brand-card--half">
                            <img src={sakuraPhoto} alt="Sakura" className="brand-card-photo" />
                            <img src={sakuraLogo}  alt="Sakura logo" className="brand-card-logo-img" />
                        </Link>
                        <Link to="/brands/faber-castell" className="brand-card brand-card--half">
                            <img src={faberPhoto} alt="Faber-Castell" className="brand-card-photo" />
                            <img src={faberLogo}  alt="Faber-Castell logo" className="brand-card-logo-img" />
                        </Link>
                    </div>

                    <Link to="/brands/posca" className="brand-card brand-card--large brand-card--posca">
                        <img src={poscaPhoto} alt="Posca" className="brand-card-photo" />
                        <img src={poscaLogo}  alt="Posca logo" className="brand-card-logo-img" />
                    </Link>

                    <Link to="/brands/copic" className="brand-card brand-card--large brand-card--copic">
                        <img src={copicPhoto} alt="COPIC" className="brand-card-photo" />
                        <img src={copicLogo}  alt="COPIC logo" className="brand-card-logo-img" />
                    </Link>
                </div>

                <div className="brands-cta">
                    <Link to="/brands" className="btn-outline-black">
                        Більше брендів <span className="btn-arrow">→</span>
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="footer-black">
                <div className="footer-left-group">
                    <h2 className="brand-name">INKFLOW</h2>
                    <span className="brand-sub">KYIV 2026</span>
                </div>

                <div className="footer-center-content">
                    <img src={logo} alt="INKFLOW" className="logo-white footer-symbol" />
                    <nav className="footer-nav-menu">
                        <Link to="/catalog">КАТАЛОГ</Link>
                        <Link to="/brands">БРЕНДИ</Link>
                        <Link to="/about">ПРО НАС</Link>
                    </nav>
                </div>

                <div className="footer-right-space" />
            </footer>
        </div>
    );
};

export default Home;