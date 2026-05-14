import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import collage from '../assets/images/Collage.svg';
import '../styles/Register.css';

const Register = () => {
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5275/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowToast(true); // Показуємо сповіщення
                setTimeout(() => {
                    setShowToast(false);
                    navigate('/'); // Після реєстрації кидає на головну
                }, 3000);
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (err) {
            alert("Сервер не відповідає");
        }
    };

    return (
        <div className="reg-page">
            <main className="reg-hero">
                <div className="reg-panel-left">
                    <div className="reg-content">

                        <img src={logo} alt="INKFLOW" className="logo-white main-logo" />

                        <div className="slogan-container">
                            <p className="slogan-text">
                                Отримуй доступ до інструментів,<br />
                                що витримують темп твоєї творчості.
                            </p>
                        </div>


                        <div className="form-card-white">
                            <form onSubmit={handleSubmit}>
                                <div className="input-row">
                                    <label>Email</label>
                                    <input
                                        name="email" type="email" placeholder="example@gmail.com"
                                        value={formData.email} onChange={handleChange} required
                                    />
                                </div>

                                <div className="input-row">
                                    <label>І'мя</label>
                                    <input
                                        name="username" type="text" placeholder="YourLovelyName"
                                        value={formData.username} onChange={handleChange} required
                                    />
                                </div>

                                <div className="input-row">
                                    <label>Пароль</label>
                                    <input
                                        name="password" type="password" placeholder="iLoveINKFLOW!"
                                        value={formData.password} onChange={handleChange} required
                                    />
                                </div>

                                <button type="submit" className="btn-submit-black">
                                    Зареєструватись
                                </button>
                            </form>
                            <p className="form-footer-txt">
                                <Link to="/login" className="footer-link-main">
                                    Вже з <strong>нами</strong>?
                                </Link>
                            </p>


                        </div>
                    </div>
                </div>

                <div className="reg-panel-right">
                    <img src={collage} alt="Art Collage" className="collage-fit" />
                    <span className="collage-author-tag">by @zoroo.art</span>
                </div>
            </main>

            <footer className="footer-black">
                <div className="footer-left-group">
                    <h2 className="brand-name">INKFLOW</h2>
                    <span className="brand-sub">KYIV 2026</span>
                </div>

                {/* Лого та навігація тепер поруч */}
                <div className="footer-center-content">
                    <img src={logo} alt="INKFLOW" className="logo-white footer-symbol" />
                    <nav className="footer-nav-menu">
                        <Link to="/catalog">КАТАЛОГ</Link>
                        <Link to="/brands">БРЕНДИ</Link>
                        <Link to="/about">ПРО НАС</Link>
                    </nav>
                </div>

                {/* Правий бік порожній для балансу як на макеті */}
                <div className="footer-right-space"></div>
            </footer>

            {showToast && (
                <div className="registration-toast">
                    Успішно зареєстровано!
                </div>
            )}
        </div>
    );
};

export default Register;