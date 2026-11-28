import { useState, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Toast from '../components/Toast.jsx';
import { notifyCartChanged } from '../utils/cartEvents.js';
import '../styles/Wishlist.css';

const API_BASE = '/api';

const Wishlist = () => {
    const token = localStorage.getItem('token');
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/Favourite`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (e) {
            console.error('Помилка завантаження вішлісту:', e);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/Favourite/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setWishlist(prev => prev.filter(p => p.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const addToCart = async (id) => {
        if (!token) {
            setToast({ message: 'Увійдіть, щоб додати в кошик', type: 'error' });
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/Cart/add?productId=${id}&quantity=1`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                notifyCartChanged();
                setToast({ message: 'Додано в кошик', type: 'success' });
            } else {
                setToast({ message: 'Не вдалося додати в кошик', type: 'error' });
            }
        } catch (e) {
            console.error(e);
            setToast({ message: "Помилка з'єднання", type: 'error' });
        }
    };

    return (
        <div className="wishlist-page">
            <SiteHeader />

            <main className="wishlist-container">
                <h1 className="wishlist-title">ОБРАНЕ</h1>

                {loading ? (
                    <div className="loader">Завантаження...</div>
                ) : wishlist.length === 0 ? (
                    <p className="empty-msg">Список обраного порожній</p>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map(product => (
                            <div key={product.id} className="wish-card">
                                <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
                                <h3>{product.name}</h3>
                                <p>{product.price}₴</p>
                                <div className="wish-card__actions">
                                    <button type="button" onClick={() => addToCart(product.id)}>До кошика</button>
                                    <button type="button" onClick={() => removeFromWishlist(product.id)}>Видалити</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <SiteFooter />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Wishlist;
