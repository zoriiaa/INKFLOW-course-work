import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import loginPhoto from '../assets/images/LoginPhoto.svg';
import '../styles/Login.css';
import SiteFooter from '../components/SiteFooter.jsx';

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

           <SiteFooter/>

            {showError && (
                <div className="login-toast login-toast--error">
                    Невірний Email або пароль
                </div>
            )}
        </div>
    );
};

export default Login;