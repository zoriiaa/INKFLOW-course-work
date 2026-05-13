import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchOverlay.css';

export default function SearchOverlay({ products, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputRef.current?.focus(), 80);
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const q = query.trim().toLowerCase();
    const results = q.length >= 1
        ? products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.brandName && p.brandName.toLowerCase().includes(q))
        ).slice(0, 8)
        : [];

    const catalogAllHref = query.trim()
        ? `/catalog?search=${encodeURIComponent(query.trim())}`
        : '/catalog';

    return (
        <div className="search-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="search-overlay__panel">
                <div className="search-overlay__bar">
                    <svg className="search-overlay__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        className="search-overlay__input"
                        type="text"
                        placeholder="Пошук товарів, брендів…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoComplete="off"
                    />
                    <button type="button" className="search-overlay__close" onClick={onClose} aria-label="Закрити">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {query.trim().length === 0 && (
                    <div className="search-overlay__hint">
                        <p>Почніть вводити назву товару або бренду</p>
                    </div>
                )}

                {query.trim().length >= 1 && (
                    <div className="search-overlay__results">
                        {results.length === 0 && (
                            <div className="search-overlay__empty">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                                <p>Нічого не знайдено за запитом «{query}»</p>
                            </div>
                        )}
                        {results.map(p => (
                            <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                className="search-result-card"
                                onClick={onClose}
                            >
                                <div className="search-result-card__img">
                                    {p.imageUrl
                                        ? <img src={p.imageUrl} alt={p.name} />
                                        : <div className="search-result-card__no-img">—</div>
                                    }
                                </div>
                                <div className="search-result-card__info">
                                    {p.brandName && <span className="search-result-card__brand">{p.brandName}</span>}
                                    <span className="search-result-card__name">{p.name}</span>
                                    <span className="search-result-card__price">{p.price}₴</span>
                                </div>
                                <span className={`search-result-card__avail ${p.stock > 0 ? 'in' : 'out'}`}>
                                    {p.stock > 0 ? 'В наявності' : 'Немає'}
                                </span>
                            </Link>
                        ))}
                        {results.length > 0 && (
                            <div className="search-overlay__all">
                                <Link to={catalogAllHref} className="search-overlay__all-link" onClick={onClose}>
                                    Переглянути всі результати →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
