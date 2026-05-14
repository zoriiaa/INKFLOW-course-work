import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { notifyCartChanged } from '../utils/cartEvents.js';
import '../styles/ProductDetails.css';

const API_BASE = 'http://localhost:5275/api';

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`pd-toast pd-toast--${type}`}>
            {message}
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [inWish, setInWish] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        fetch(`${API_BASE}/Products/${id}`)
            .then(res => (res.ok ? res.json() : null))
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [id]);

    const addToCart = async () => {
        if (!token) {
            showToast('Увійдіть, щоб додати в кошик', 'error');
            return;
        }
        if (!product) return;
        setCartLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Cart/add?productId=${product.id}&quantity=1`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) notifyCartChanged();
            showToast(res.ok ? 'Товар додано до кошика!' : 'Помилка додавання', res.ok ? 'success' : 'error');
        } catch {
            showToast("Помилка з'єднання", 'error');
        } finally {
            setCartLoading(false);
        }
    };

    const toggleWish = async () => {
        if (!token) {
            showToast('Увійдіть, щоб додати у вішліст', 'error');
            return;
        }
        if (!product) return;
        try {
            const method = inWish ? 'DELETE' : 'POST';
            const res = await fetch(`${API_BASE}/Favourite/${product.id}`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setInWish(!inWish);
                showToast(inWish ? 'Видалено з вішлісту' : 'Додано до вішлісту!', inWish ? 'info' : 'success');
            }
        } catch {
            showToast("Помилка з'єднання", 'error');
        }
    };

    const specs = product ? [
        product.color      && { label: 'Колір',        value: product.color },
        product.thickness  && { label: 'Товщина',      value: `${product.thickness} мм` },
        product.density    && { label: 'Щільність',    value: `${product.density} г/м²` },
        product.hardness   && { label: 'Твердість',    value: product.hardness },
        product.size       && { label: 'Розмір',       value: product.size },
        product.specification && { label: 'Специфікація', value: product.specification },
    ].filter(Boolean) : [];

    return (
        <div className="product-details-page">
            <SiteHeader />
            <main className="product-details-wrap">
                {loading && <p>Завантаження...</p>}
                {!loading && !product && <p>Товар не знайдено.</p>}
                {!loading && product && (
                    <div className="product-details-card">
                        <div className="product-details-image">
                            {product.imageUrl
                                ? <img src={product.imageUrl} alt={product.name} />
                                : <div className="pd-no-img">Немає фото</div>
                            }
                            <button
                                className={`pd-wish-btn${inWish ? ' pd-wish-btn--active' : ''}`}
                                onClick={toggleWish}
                                aria-label="Вішліст"
                            >
                                <svg width="24" height="24" viewBox="0 0 30 30" fill={inWish ? '#000' : 'none'} xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.05 5.76C25.41 5.12 24.65 4.62 23.82 4.27C22.99 3.93 22.09 3.75 21.19 3.75C20.28 3.75 19.39 3.93 18.56 4.27C17.72 4.62 16.96 5.12 16.33 5.76L15 7.09L13.68 5.76C12.39 4.47 10.64 3.75 8.81 3.75C6.99 3.75 5.24 4.47 3.95 5.76C2.66 7.05 1.94 8.8 1.94 10.63C1.94 12.45 2.66 14.2 3.95 15.49L15 26.54L26.05 15.49C26.69 14.85 27.2 14.09 27.54 13.26C27.89 12.42 28.06 11.53 28.06 10.63C28.06 9.72 27.89 8.83 27.54 7.99C27.2 7.16 26.69 6.4 26.05 5.76Z"
                                          stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className="product-details-info">
                            <p className="product-details-brand">{product.brandName} · {product.categoryName}</p>
                            <h1>{product.name}</h1>
                            <p className="product-details-price">{product.price}₴</p>
                            <p className="product-details-desc">{product.description || 'Опис відсутній.'}</p>

                            {specs.length > 0 && (
                                <div className="product-specs">
                                    <h3>Специфікація</h3>
                                    {specs.map(s => (
                                        <div key={s.label}>
                                            <span>{s.label}</span>
                                            <strong>{s.value}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="product-details-actions">
                                <button
                                    onClick={addToCart}
                                    className={`details-buy-btn${cartLoading ? ' details-buy-btn--loading' : ''}`}
                                    disabled={product.stock === 0 || cartLoading}
                                >
                                    {cartLoading ? 'ДОДАЄТЬСЯ...' : product.stock === 0 ? 'НЕМАЄ В НАЯВНОСТІ' : 'ДОДАТИ В КОШИК'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <SiteFooter />
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}