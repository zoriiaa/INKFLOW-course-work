import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { notifyCartChanged } from '../utils/cartEvents.js';
import './ProductDetails.css';

const API_BASE = 'http://localhost:5275/api';

export default function ProductDetails() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/Products/${id}`)
            .then(res => (res.ok ? res.json() : null))
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [id]);

    const addToCart = async () => {
        if (!token || !product) return;
        try {
            const res = await fetch(`${API_BASE}/Cart/add?productId=${product.id}&quantity=1`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: '{}',
            });
            if (res.ok) notifyCartChanged();
            setToast(res.ok ? 'Додано в кошик' : 'Помилка додавання');
        } catch {
            setToast("Помилка з'єднання");
        }
    };

    return (
        <div className="product-details-page">
            <SiteHeader />
            <main className="product-details-wrap">
                {loading && <p>Завантаження...</p>}
                {!loading && !product && <p>Товар не знайдено.</p>}
                {!loading && product && (
                    <div className="product-details-card">
                        <div className="product-details-image">
                            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <div>Немає фото</div>}
                        </div>
                        <div className="product-details-info">
                            <h1>{product.name}</h1>
                            <p className="product-details-brand">{product.brandName} · {product.categoryName}</p>
                            <p className="product-details-price">{product.price}₴</p>
                            <p className="product-details-desc">{product.description || 'Опис відсутній.'}</p>
                            <div className="product-specs">
                                <h3>Специфікація</h3>
                                <div><span>Колір:</span><strong>{product.color || '—'}</strong></div>
                                <div><span>Товщина:</span><strong>{product.thickness || '—'}</strong></div>
                                <div><span>Щільність:</span><strong>{product.density || '—'}</strong></div>
                                <div><span>Наявність:</span><strong>{product.stock > 0 ? `${product.stock} шт.` : 'Немає'}</strong></div>
                            </div>
                            <button onClick={addToCart} className="details-buy-btn">ДОДАТИ В КОШИК</button>
                        </div>
                    </div>
                )}
            </main>
            <SiteFooter />
            {toast && <div className="product-toast">{toast}</div>}
        </div>
    );
}
