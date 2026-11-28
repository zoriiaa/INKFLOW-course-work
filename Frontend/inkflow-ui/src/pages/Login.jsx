import { useState } from 'react';
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
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
        } catch {
            alert("Сервер не відповідає");
        } finally {
            setLoading(false);
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

                                <button type="submit" className="btn-submit-black" disabled={loading}>
                                    {loading ? 'Зачекайте...' : 'Увійти'}
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