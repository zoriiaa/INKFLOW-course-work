import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { notifyCartChanged } from '../utils/cartEvents.js';
import './Cart.css';

const API_BASE = 'http://localhost:5275/api';

const Cart = () => {
    const token = localStorage.getItem('token');
    const [cart, setCart] = useState({ items: [], grandTotal: 0 });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/Cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (e) {
            console.error('Помилка завантаження кошика:', e);
        } finally {
            setLoading(false);
        }
    };

    const setLineQuantity = async (productId, quantity) => {
        if (!token) return;
        try {
            const res = await fetch(
                `${API_BASE}/Cart/quantity?productId=${productId}&quantity=${quantity}`,
                {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                await fetchCart();
                notifyCartChanged();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const checkout = async () => {
        if (!token || cart.items.length === 0) return;
        setCheckoutLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Order/checkout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                setToast('Не вдалося оформити замовлення');
                return;
            }
            setToast('Замовлення успішно оформлено!');
            await fetchCart();
            notifyCartChanged();
        } catch {
            setToast("Помилка з'єднання");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const lineTotal = (item) => {
        const p = Number(item.price);
        const q = Number(item.quantity);
        if (item.totalPrice != null) return Number(item.totalPrice);
        return p * q;
    };

    return (
        <div className="cart-page">
            <SiteHeader />
            <main className="cart-container">
                <h1 className="cart-title">КОШИК</h1>

                {loading ? (
                    <div className="loader">Завантаження...</div>
                ) : cart.items.length === 0 ? (
                    <div className="cart-empty-state">
                        <p>Ваш кошик порожній</p>
                        <Link to="/catalog" className="back-btn">До каталогу</Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-list">
                            {cart.items.map(item => (
                                <div key={item.productId} className="cart-item-card">
                                    <button
                                        type="button"
                                        className="cart-item-remove"
                                        aria-label="Видалити"
                                        onClick={() => setLineQuantity(item.productId, 0)}
                                    >
                                        ×
                                    </button>
                                    <Link to={`/product/${item.productId}`} className="cart-item__img-wrap">
                                        {item.imageUrl
                                            ? <img src={item.imageUrl} alt="" className="cart-item__img" />
                                            : <div className="cart-item__img cart-item__img--empty">—</div>
                                        }
                                    </Link>
                                    <div className="cart-item__info">
                                        <h3>
                                            <Link to={`/product/${item.productId}`}>{item.productName}</Link>
                                        </h3>
                                        <div className="cart-item__row">
                                            <div className="qty-stepper">
                                                <button
                                                    type="button"
                                                    onClick={() => setLineQuantity(item.productId, item.quantity - 1)}
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setLineQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="cart-item__price">{lineTotal(item)}₴</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="cart-summary">
                            <h2>ПІДСУМОК ЗАМОВЛЕННЯ</h2>
                            <div className="summary-row">
                                <span>Сума:</span>
                                <span>{cart.grandTotal}₴</span>
                            </div>
                            <div className="summary-row">
                                <span>Доставка:</span>
                                <span>Безкоштовно</span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Разом:</span>
                                <span>{cart.grandTotal}₴</span>
                            </div>
                            <button className="checkout-btn" onClick={checkout} disabled={checkoutLoading}>
                                {checkoutLoading ? 'ОФОРМЛЮЄМО...' : 'ОФОРМИТИ ЗАМОВЛЕННЯ'}
                            </button>
                            <Link to="/catalog" className="continue-shopping">Продовжити покупки</Link>
                            <Link to="/orders" className="continue-shopping continue-shopping--secondary">Мої замовлення</Link>
                        </aside>
                    </div>
                )}
            </main>
            <SiteFooter />
            {toast && <div className="cart-toast">{toast}</div>}
        </div>
    );
};

export default Cart;
