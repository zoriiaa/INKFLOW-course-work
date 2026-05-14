import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import AccountSidebar from '../components/AccountSidebar.jsx';
import '../styles/Orders.css';

const API_BASE = 'http://localhost:5275/api';

export default function Orders() {
    const token = localStorage.getItem('token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetch(`${API_BASE}/Order/my-orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => (res.ok ? res.json() : []))
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [token]);

    const itemPrice = (item) => {
        return Number(item.priceAtPurchase ?? item.priceAtTime ?? 0);
    };

    return (
        <div className="orders-page">
            <SiteHeader />
            <main className="orders-wrap">
                <AccountSidebar active="orders" />

                <section className="orders-main">
                    <h1>МОЇ ЗАМОВЛЕННЯ</h1>
                    {loading && <p>Завантаження...</p>}
                    {!loading && orders.length === 0 && <p>Замовлень поки немає.</p>}
                    {!loading && orders.length > 0 && (
                        <div className="orders-list">
                            {orders.map(order => (
                                <article key={order.id} className="order-card">
                                    <div className="order-card__head">
                                        <div>
                                            <strong>Замовлення №{order.id}</strong>
                                            <div className="order-card__date">
                                                {new Date(order.orderDate).toLocaleDateString('uk-UA')}
                                            </div>
                                        </div>
                                        <div className="order-card__meta">
                                            <span className="order-card__status">{order.status}</span>
                                            <span className="order-card__total-inline">{order.totalPrice}₴</span>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {(order.orderItems || []).map(item => (
                                            <div key={`${order.id}-${item.productId}`} className="order-item">
                                                <Link to={`/product/${item.productId}`} className="order-item__thumb-link">
                                                    {item.imageUrl
                                                        ? <img src={item.imageUrl} alt="" className="order-item__thumb" />
                                                        : <div className="order-item__thumb order-item__thumb--empty">—</div>
                                                    }
                                                </Link>
                                                <div className="order-item__body">
                                                    <Link to={`/product/${item.productId}`} className="order-item__name">
                                                        {item.productName}
                                                    </Link>
                                                    <span className="order-item__qty-price">
                                                        Кількість: {item.quantity} × {itemPrice(item)}₴
                                                    </span>
                                                </div>
                                                <span className="order-item__line-total">
                                                    {(Number(item.quantity) * itemPrice(item)).toFixed(0)}₴
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}