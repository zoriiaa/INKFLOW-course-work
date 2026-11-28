import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.svg';
import collage from '../assets/images/Collage.optimized.jpg';
import '../styles/Register.css';
import SiteFooter from '../components/SiteFooter.jsx';
import Toast from '../components/Toast.jsx';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
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
        if (loading) return;
        setLoading(true);
        let registrationSucceeded = false;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                registrationSucceeded = true;
                navigate('/catalog');
            } else {
                const error = await response.text();
                setToast({ message: error || 'Не вдалося створити обліковий запис', type: 'error' });
            }
        } catch {
            setToast({ message: 'Сервер не відповідає', type: 'error' });
        } finally {
            if (!registrationSucceeded) setLoading(false);
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

                                <button type="submit" className="btn-submit-black" disabled={loading}>
                                    {loading ? 'Зачекайте...' : 'Зареєструватись'}
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
                    <img src={collage} alt="Art Collage" className="collage-fit" loading="lazy" decoding="async" />
                    <span className="collage-author-tag">by @zoroo.art</span>
                </div>
            </main>

            <SiteFooter />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Register;