import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import './SiteFooter.css';

export default function SiteFooter() {
    return (
        <footer className="site-footer-black">
            <div className="site-footer-left-group">
                <h2 className="site-brand-name">INKFLOW</h2>
                <span className="site-brand-sub">KYIV 2026</span>
            </div>
            <div className="site-footer-center-content">
                <img src={logo} alt="INKFLOW" className="logo-white site-footer-symbol" />
                <nav className="site-footer-nav-menu">
                    <Link to="/catalog">КАТАЛОГ</Link>
                    <Link to="/about">ПРО НАС</Link>
                </nav>
            </div>
            <div className="site-footer-right-space" />
        </footer>
    );
}
