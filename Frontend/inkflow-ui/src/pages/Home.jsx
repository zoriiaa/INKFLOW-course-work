import React from 'react';
import { Link } from 'react-router-dom';
import homePhoto from '../assets/images/HomePhoto.svg';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

import manuscriptPhoto from '../assets/images/brands/ManuscriptPhoto.svg';
import sakuraPhoto     from '../assets/images/brands/SakuraPhoto.svg';
import copicPhoto      from '../assets/images/brands/CopicPhoto.svg';
import faberPhoto      from '../assets/images/brands/FaberCastellPhoto.svg';
import poscaPhoto      from '../assets/images/brands/PoscaPhoto.svg';

import manuscriptLogo  from '../assets/images/brands/ManuscriptLogo.svg';
import sakuraLogo      from '../assets/images/brands/SakuraLogo.svg';
import copicLogo       from '../assets/images/brands/CopicLogo.svg';
import faberLogo       from '../assets/images/brands/FaberCastellLogo.svg';
import poscaLogo       from '../assets/images/brands/PoscaLogo.svg';

import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <SiteHeader showSearch={false} />

            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-photo-side">
                    <img src={homePhoto} alt="Sketching" className="hero-photo" />
                </div>

                <div className="hero-content-side">
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

                    <div className="hero-scroll-arrow" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </div>
                </div>
            </section>

            <section className="brands-section">
                <div className="brands-header">
                    <h2 className="brands-title">БРЕНДИ</h2>
                    <p className="brands-desc">
                        Ми зібрали бренди, яким довіряють ілюстратори, дизайнери та художники по всьому світу.<br />
                        Нічого зайвого - лише перевірені інструменти для чистої лінії та впевненого штриха.
                    </p>
                </div>

                <div className="brands-grid">
                    <Link to="/brands" className="brand-card brand-card--large brand-card--manuscript">
                        <img src={manuscriptPhoto} alt="Manuscript" className="brand-card-photo" />
                        <img src={manuscriptLogo}  alt="Manuscript logo" className="brand-card-logo-img" />
                    </Link>

                    <div className="brand-card-column">
                        <Link to="/brands" className="brand-card brand-card--half">
                            <img src={sakuraPhoto} alt="Sakura" className="brand-card-photo" />
                            <img src={sakuraLogo}  alt="Sakura logo" className="brand-card-logo-img" />
                        </Link>
                        <Link to="/brands" className="brand-card brand-card--half">
                            <img src={faberPhoto} alt="Faber-Castell" className="brand-card-photo" />
                            <img src={faberLogo}  alt="Faber-Castell logo" className="brand-card-logo-img" />
                        </Link>
                    </div>

                    <Link to="/brands" className="brand-card brand-card--large brand-card--posca">
                        <img src={poscaPhoto} alt="Posca" className="brand-card-photo" />
                        <img src={poscaLogo}  alt="Posca logo" className="brand-card-logo-img" />
                    </Link>

                    <Link to="/brands" className="brand-card brand-card--large brand-card--copic">
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

            <SiteFooter />
        </div>
    );
};

export default Home;
