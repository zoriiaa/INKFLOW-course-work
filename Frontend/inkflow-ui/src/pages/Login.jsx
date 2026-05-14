import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import loginPhoto from '../assets/images/LoginPhoto.svg';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5275/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
            }
        } catch (err) {
            alert("Сервер не відповідає");
        }
    };

    return (
        <div className="login-page">
            <main className="login-hero">

                <div className="login-panel-left">
                    <img src={loginPhoto} alt="Art" className="login-photo-fit" />
                </div>

                {/* Права панель — форма */}
                <div className="login-panel-right">
                    <div className="login-content">

                        <img src={logo} alt="INKFLOW" className="logo-white login-logo" />

                        <div className="login-slogan-container">
                            <p className="login-slogan-text">
                                ІНСТРУМЕНТИ,<br />
                                ЩО ВЕДУТЬ ЛІНІЮ
                            </p>
                        </div>

                        <div className="form-card-white">
                            <form onSubmit={handleSubmit}>
                                <div className="input-row">
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-row">
                                    <label>Пароль</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="iLoveINKFLOW!"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-submit-black">
                                    Увійти
                                </button>
                            </form>
                            <p className="form-footer-txt">
                                <Link to="/register" className="footer-link-main">
                                    Ще не з <strong>нами</strong>?
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

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

                <div className="footer-right-space"></div>
            </footer>

            {showError && (
                <div className="login-toast login-toast--error">
                    Невірний Email або пароль
                </div>
            )}
        </div>
    );
};

export default Login;