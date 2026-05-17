import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchOverlay from '../components/SearchOverlay.jsx';
import '../components/SearchOverlay.css';
import { notifyCartChanged } from '../utils/cartEvents.js';
import '../styles/Catalog.css';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const API_BASE = 'http://localhost:5275/api';

const COLORS = [
    { name: 'Чорний',   hex: '#000000', matchTerms: ['black', 'чорн', 'nero', 'graphite'] },
    { name: 'Білий',    hex: '#FFFFFF', matchTerms: ['white', 'біл'] },
    { name: 'Сірий',    hex: '#EDEDED', matchTerms: ['grey', 'gray', 'сір'] },
    { name: 'Синій',    hex: '#8E9AEB', matchTerms: ['blue', 'син', 'navy', 'indigo'] },
    { name: 'Червоний', hex: '#F14646', matchTerms: ['red', 'червон', 'crimson'] },
    { name: 'Жовтий',  hex: '#F7FF67', matchTerms: ['yellow', 'жовт', 'gold', 'lemon'] },
    { name: 'Рожевий', hex: '#FFBDDE', matchTerms: ['pink', 'рожев', 'rose'] },
    { name: 'Фіолет.',  hex: '#DBACF9', matchTerms: ['purple', 'violet', 'фіолет', 'mauve', 'lavender'] },
    { name: 'Зелений', hex: '#B0FBB8', matchTerms: ['green', 'зелен', 'lime', 'olive', 'mint'] },
    { name: 'Оранж.',  hex: '#FFD8A2', matchTerms: ['orange', 'оранж', 'peach', 'coral'] },
    { name: 'Бірюза',  hex: '#98FFD7', matchTerms: ['turquoise', 'teal', 'бірюз', 'aqua'] },
    { name: 'Блакит.', hex: '#93D3F6', matchTerms: ['sky blue', 'light blue', 'azure', 'блакит', 'голуб', 'cyan'] },
];

const COLOR_BY_NAME = new Map(COLORS.map(c => [c.name, c]));

function expandCategoryIdsForFilter(categories, selectedIds) {
    if (!selectedIds.length) return null;
    const byParent = new Map();
    for (const c of categories) {
        const pid = c.parentCategoryId;
        if (pid == null) continue;
        if (!byParent.has(pid)) byParent.set(pid, []);
        byParent.get(pid).push(c.id);
    }
    const effective = new Set(selectedIds);
    const stack = [...selectedIds];
    while (stack.length) {
        const id = stack.pop();
        const kids = byParent.get(id);
        if (!kids) continue;
        for (const kid of kids) {
            if (!effective.has(kid)) {
                effective.add(kid);
                stack.push(kid);
            }
        }
    }
    return effective;
}

function productMatchesSelectedColor(productColor, selectedSwatchName) {
    if (!selectedSwatchName) return true;
    if (!productColor) return false;
    const hay = productColor.toLowerCase();
    const swatch = COLOR_BY_NAME.get(selectedSwatchName);
    if (swatch?.matchTerms?.length) {
        return swatch.matchTerms.some(t => hay.includes(t.toLowerCase()));
    }
    return hay.includes(selectedSwatchName.toLowerCase());
}

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`catalog-toast catalog-toast--${type}`}>
            {message}
        </div>
    );
}

function ProductCard({ p, token, showToast, wishlistIds, onWishChange }) {
    const inWish = wishlistIds.has(p.id);
    const [cartLoading, setCartLoading] = useState(false);

    const handleWish = async () => {
        if (!token) { showToast('Увійдіть, щоб додати у вішліст', 'error'); return; }
        try {
            const method = inWish ? 'DELETE' : 'POST';
            const res = await fetch(`${API_BASE}/Favourite/${p.id}`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                onWishChange(p.id, !inWish);
                showToast(inWish ? 'Видалено з вішлісту' : 'Додано до вішлісту!', inWish ? 'info' : 'success');
            }
        } catch { showToast("Помилка з'єднання", 'error'); }
    };

    const handleCart = async () => {
        if (!token) { showToast('Увійдіть, щоб додати до кошика', 'error'); return; }
        setCartLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Cart/add?productId=${p.id}&quantity=1`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) notifyCartChanged();
            showToast(res.ok ? 'Товар додано до кошика!' : 'Помилка при додаванні', res.ok ? 'success' : 'error');
        } catch { showToast("Помилка з'єднання", 'error'); }
        finally { setCartLoading(false); }
    };

    const available = p.stock > 0;

    return (
        <div className="product-card">
            <Link to={`/product/${p.id}`} className="product-card__image-link">
                {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="product-card__image" />
                    : <div className="product-card__no-img">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    </div>
                }
            </Link>

            <button
                className={`product-card__wish${inWish ? ' product-card__wish--active' : ''}`}
                onClick={handleWish}
                aria-label="Вішліст"
            >
                <svg width="22" height="22" viewBox="0 0 30 30" fill={inWish ? '#000' : 'none'} xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.05 5.76C25.41 5.12 24.65 4.62 23.82 4.27C22.99 3.93 22.09 3.75 21.19 3.75C20.28 3.75 19.39 3.93 18.56 4.27C17.72 4.62 16.96 5.12 16.33 5.76L15 7.09L13.68 5.76C12.39 4.47 10.64 3.75 8.81 3.75C6.99 3.75 5.24 4.47 3.95 5.76C2.66 7.05 1.94 8.8 1.94 10.63C1.94 12.45 2.66 14.2 3.95 15.49L15 26.54L26.05 15.49C26.69 14.85 27.2 14.09 27.54 13.26C27.89 12.42 28.06 11.53 28.06 10.63C28.06 9.72 27.89 8.83 27.54 7.99C27.2 7.16 26.69 6.4 26.05 5.76Z"
                          stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="product-card__info">
                {p.brandName && <span className="product-card__brand">{p.brandName}</span>}
                <Link to={`/product/${p.id}`} className="product-card__name">{p.name}</Link>
                <div className="product-card__price-row">
                    <span className="product-card__price">{p.price}₴</span>
                    <span className={`product-card__stock${available ? ' product-card__stock--in' : ' product-card__stock--out'}`}>
                        {available ? 'В наявності' : 'Немає в наявності'}
                    </span>
                </div>
                <button
                    className={`product-card__btn-cart${!available ? ' product-card__btn-cart--disabled' : ''}${cartLoading ? ' product-card__btn-cart--loading' : ''}`}
                    onClick={handleCart}
                    disabled={!available || cartLoading}
                >
                    {cartLoading ? 'ДОДАЄТЬСЯ…' : 'ДОДАТИ В КОШИК'}
                </button>
            </div>
        </div>
    );
}

function FilterBlock({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="filter-block">
            <button className="filter-block__head" onClick={() => setOpen(o => !o)}>
                <span>{title}</span>
                <svg width="20" height="20" viewBox="0 0 33 33" fill="none"
                     style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform .22s' }}>
                    <path d="M24.75 20.625L16.5 12.375L8.25 20.625" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            {open && <div className="filter-block__body">{children}</div>}
            <div className="filter-block__divider" />
        </div>
    );
}

const Catalog = () => {
    const token = localStorage.getItem('token');
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTermFromUrl = (searchParams.get('search') || '').trim().toLowerCase();
    const brandFromUrl = (searchParams.get('brand') || '').trim().toLowerCase();

    const [products, setProducts]     = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [toast, setToast]           = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [wishlistIds, setWishlistIds] = useState(new Set());

    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [expandedParents, setExpandedParents]         = useState([]);
    const [selectedBrand, setSelectedBrand]             = useState(null);
    const [selectedColor, setSelectedColor]             = useState(null);
    const [sortBy, setSortBy]                           = useState('default');
    const [cartCount, setCartCount]                     = useState(0);

    const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

    const handleWishChange = useCallback((productId, isNowInWish) => {
        setWishlistIds(prev => {
            const next = new Set(prev);
            if (isNowInWish) next.add(productId);
            else next.delete(productId);
            return next;
        });
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const fetchArgs = [
                    fetch(`${API_BASE}/Products?pageNumber=1&pageSize=500`),
                    fetch(`${API_BASE}/Categories`),
                    fetch(`${API_BASE}/Brands`),
                ];
                if (token) {
                    fetchArgs.push(
                        fetch(`${API_BASE}/Favourite`, { headers: { Authorization: `Bearer ${token}` } })
                    );
                }
                const results = await Promise.all(fetchArgs);
                setProducts(await results[0].json());
                setCategories(await results[1].json());
                setBrands(await results[2].json());
                if (token && results[3]?.ok) {
                    const favs = await results[3].json();
                    setWishlistIds(new Set(favs.map(f => f.id)));
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, [token]);

    useEffect(() => {
        const refreshCartCount = () => {
            if (!token) {
                setCartCount(0);
                return;
            }
            fetch(`${API_BASE}/Cart`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => (res.ok ? res.json() : null))
                .then(data => {
                    if (!data?.items) return;
                    setCartCount(data.items.reduce((sum, item) => sum + (item.quantity || 0), 0));
                })
                .catch(() => {});
        };
        refreshCartCount();
        window.addEventListener('inkflow-cart-changed', refreshCartCount);
        return () => window.removeEventListener('inkflow-cart-changed', refreshCartCount);
    }, [token]);

    useEffect(() => {
        if (!brandFromUrl || brands.length === 0) return;
        const matched = brands.find(b =>
            String(b.name || '').toLowerCase() === brandFromUrl ||
            String(b.id) === brandFromUrl
        );
        if (matched) setSelectedBrand(matched.id);
    }, [brandFromUrl, brands]);

    const handleCategoryToggle = (id, isParent) => {
        setSelectedCategoryIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        if (isParent) {
            setExpandedParents(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
        }
    };

    const effectiveCategoryIds = useMemo(
        () => expandCategoryIdsForFilter(categories, selectedCategoryIds),
        [categories, selectedCategoryIds]
    );

    const filteredProducts = products.filter(p => {
        const catOk   = !effectiveCategoryIds || effectiveCategoryIds.has(p.categoryId);
        const brandOk = !selectedBrand || p.brandId === selectedBrand;
        const colorOk = productMatchesSelectedColor(p.color, selectedColor);
        const searchOk = !searchTermFromUrl
            || String(p.name || '').toLowerCase().includes(searchTermFromUrl)
            || String(p.brandName || '').toLowerCase().includes(searchTermFromUrl);
        return catOk && brandOk && colorOk && searchOk;
    });

    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        switch (sortBy) {
            case 'price-asc':
                return list.sort((a, b) => Number(a.price) - Number(b.price));
            case 'price-desc':
                return list.sort((a, b) => Number(b.price) - Number(a.price));
            case 'name-asc':
                return list.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
            default:
                return list;
        }
    }, [filteredProducts, sortBy]);

    const parentCats = categories.filter(c => !c.parentCategoryId);
    const hasFilters = selectedCategoryIds.length > 0 || selectedBrand || selectedColor || !!searchTermFromUrl;

    const clearFilters = () => {
        setSelectedCategoryIds([]);
        setExpandedParents([]);
        setSelectedBrand(null);
        setSelectedColor(null);
        setSearchParams({});
    };

    return (
        <div className="catalog-page">
            <SiteHeader />
            <div className="catalog-body">

                <aside className="catalog-sidebar">

                    <FilterBlock title="КАТЕГОРІЯ">
                        {parentCats.map(parent => (
                            <div key={parent.id} className="cat-group">
                                <label className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.includes(parent.id)}
                                        onChange={() => handleCategoryToggle(parent.id, true)}
                                    />
                                    <span className="filter-checkbox__box" />
                                    <span className="filter-checkbox__label filter-checkbox__label--bold">{parent.name}</span>
                                </label>
                                {expandedParents.includes(parent.id) && (
                                    <div className="cat-subs">
                                        {categories
                                            .filter(sub => sub.parentCategoryId === parent.id)
                                            .map(sub => (
                                                <label key={sub.id} className="filter-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategoryIds.includes(sub.id)}
                                                        onChange={() => handleCategoryToggle(sub.id, false)}
                                                    />
                                                    <span className="filter-checkbox__box" />
                                                    <span className="filter-checkbox__label">{sub.name}</span>
                                                </label>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </FilterBlock>

                    <FilterBlock title="БРЕНД">
                        {brands.map(b => (
                            <label key={b.id} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedBrand === b.id}
                                    onChange={() => setSelectedBrand(selectedBrand === b.id ? null : b.id)}
                                />
                                <span className="filter-checkbox__box" />
                                <span className="filter-checkbox__label">{b.name}</span>
                            </label>
                        ))}
                    </FilterBlock>

                    <FilterBlock title="КОЛІР">
                        <div className="color-grid">
                            {COLORS.map(c => (
                                <button
                                    key={c.name}
                                    className={`color-swatch${selectedColor === c.name ? ' color-swatch--selected' : ''}`}
                                    style={{ background: c.hex }}
                                    onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                                    title={c.name}
                                    aria-label={c.name}
                                />
                            ))}
                        </div>
                        {selectedColor && (
                            <button className="color-clear" onClick={() => setSelectedColor(null)}>
                                Скинути колір ×
                            </button>
                        )}
                    </FilterBlock>
                </aside>

                <main className="catalog-main">
                    <div className="catalog-toolbar">
                        <span className="catalog-count">
                            {loading ? '…' : `${filteredProducts.length} товарів`}
                        </span>
                        <div className="catalog-toolbar__right">
                            {hasFilters && (
                                <button className="clear-all-btn" onClick={clearFilters}>
                                    Скинути фільтри ×
                                </button>
                            )}
                            <label className="catalog-sort">
                                <span className="catalog-sort__label">Сортування</span>
                                <select
                                    className="catalog-sort__select"
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    aria-label="Сортування товарів"
                                >
                                    <option value="default">За замовчуванням</option>
                                    <option value="price-asc">Від дешевих до дорогих</option>
                                    <option value="price-desc">Від дорогих до дешевих</option>
                                    <option value="name-asc">За назвою (А–Я)</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {loading && (
                        <div className="catalog-loading">
                            <div className="spinner" />
                            <span>Завантаження товарів…</span>
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="catalog-empty">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                            <p>Товарів не знайдено</p>
                            <span>Спробуйте змінити фільтри</span>
                        </div>
                    )}

                    {!loading && sortedProducts.length > 0 && (
                        <div className="products-grid">
                            {sortedProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    p={p}
                                    token={token}
                                    showToast={showToast}
                                    wishlistIds={wishlistIds}
                                    onWishChange={handleWishChange}
                                />
                            ))}
                        </div>
                    )}
                </main>

            </div>
            <SiteFooter />

            {searchOpen && (
                <SearchOverlay products={products} onClose={() => setSearchOpen(false)} />
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};

export default Catalog;