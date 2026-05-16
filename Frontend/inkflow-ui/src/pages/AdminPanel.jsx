import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const API_BASE = 'http://localhost:5275/api';

function getRoleFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || '';
    } catch {
        return '';
    }
}

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return <div className={`ap-toast ap-toast--${type}`}>{message}</div>;
}

function ProductsSection({ token, showToast }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [form, setForm] = useState({
        name: '', description: '', price: '', imageUrl: '',
        categoryId: '', brandId: '', stock: '10'
    });

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/Products?pageSize=100`);
            if (!res.ok) throw new Error('Не вдалося завантажити товари');
            setProducts(await res.json());
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast]);

    const fetchMeta = useCallback(async () => {
        try {
            const [resCat, resBrand] = await Promise.all([
                fetch(`${API_BASE}/Categories`),
                fetch(`${API_BASE}/Brands`)
            ]);
            if (resCat.ok) setCategories(await resCat.json());
            if (resBrand.ok) setBrands(await resBrand.json());
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchProducts(), fetchMeta()]).finally(() => setLoading(false));
    }, [fetchProducts, fetchMeta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            const bodyData = {
                ...form,
                price: parseFloat(form.price),
                categoryId: parseInt(form.categoryId),
                brandId: parseInt(form.brandId),
                stock: parseInt(form.stock) || 0
            };

            if (editingProduct) {
                const res = await fetch(`${API_BASE}/Admin/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(bodyData)
                });
                if (!res.ok) throw new Error('Не вдалося оновити товар');
                showToast('Товар успішно оновлено!', 'success');
            } else {
                const res = await fetch(`${API_BASE}/Products/admin/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(bodyData)
                });
                if (!res.ok) throw new Error('Не вдалося створити товар');
                showToast('Товар успішно додано в базу!', 'success');
            }

            setForm({ name: '', description: '', price: '', imageUrl: '', categoryId: '', brandId: '', stock: '10' });
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) return;
        try {
            const res = await fetch(`${API_BASE}/Products/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не вдалося видалити товар');
            showToast('Товар успішно видалено', 'success');
            fetchProducts();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <h2 className="ap-section__title">
                {editingProduct ? 'Редагування товару' : 'Додати новий товар'}
            </h2>
            <form className="ap-form" onSubmit={handleSubmit}>
                <div className="ap-form__grid">
                    <div className="ap-form__group ap-form__group--span-2">
                        <label className="ap-form__label">Назва товару</label>
                        <input type="text" name="name" className="ap-form__input" placeholder="Наприклад: Блокнот на спіралі" required value={form.name} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Ціна (грн)</label>
                        <input type="number" step="0.01" name="price" className="ap-form__input" placeholder="150.00" required value={form.price} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Кількість</label>
                        <input type="number" name="stock" className="ap-form__input" placeholder="10" required value={form.stock} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group ap-form__group--span-2">
                        <label className="ap-form__label">Категорія</label>
                        <select name="categoryId" className="ap-form__select" required value={form.categoryId} onChange={handleChange}>
                            <option value="">Оберіть категорію</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="ap-form__group ap-form__group--span-2">
                        <label className="ap-form__label">Бренд</label>
                        <select name="brandId" className="ap-form__select" required value={form.brandId} onChange={handleChange}>
                            <option value="">Оберіть бренд</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="ap-form__group ap-form__group--span-4">
                        <label className="ap-form__label">Посилання на фото</label>
                        <input type="text" name="imageUrl" className="ap-form__input" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group ap-form__group--span-4">
                        <label className="ap-form__label">Опис товару</label>
                        <textarea name="description" rows="3" className="ap-form__textarea" placeholder="Детальний опис характеристик товару..." required value={form.description} onChange={handleChange} />
                    </div>
                </div>
                <div className="ap-form__actions">
                    <button type="submit" className="ap-btn ap-btn--submit" disabled={submitting}>
                        {editingProduct ? 'Зберегти зміни' : 'Додати товар'}
                    </button>
                    {editingProduct && (
                        <button
                            type="button"
                            className="ap-btn"
                            onClick={() => {
                                setEditingProduct(null);
                                setForm({ name: '', description: '', price: '', imageUrl: '', categoryId: '', brandId: '', stock: '10' });
                            }}
                            style={{ marginLeft: '12px', background: '#fff', color: '#000', border: '1px solid #e5e5e5' }}
                        >
                            Скасувати
                        </button>
                    )}
                </div>
            </form>

            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Фото</th>
                        <th>Назва</th>
                        <th>Ціна</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt="" className="ap-table__img" />
                                ) : (
                                    <span className="ap-table__no-img">—</span>
                                )}
                            </td>
                            <td><strong>{p.name}</strong></td>
                            <td>{p.price} грн</td>
                            <td>
                                <div className="ap-table__actions">
                                    <button
                                        className="ap-btn ap-btn--edit"
                                        onClick={() => {
                                            setEditingProduct(p);
                                            setForm({
                                                name: p.name,
                                                description: p.description,
                                                price: p.price,
                                                brandId: p.brandId || p.brand?.id || '',
                                                categoryId: p.categoryId || p.category?.id || '',
                                                imageUrl: p.imageUrl || '',
                                                stock: p.stock?.toString() || '10'
                                            });
                                        }}
                                    >
                                        Редагувати
                                    </button>
                                    <button className="ap-btn ap-btn--danger" onClick={() => handleDelete(p.id)}>Видалити</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UsersSection({ token, showToast }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/Admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Не вдалося завантажити користувачів');
            setUsers(await res.json());
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await fetch(`${API_BASE}/Admin/users/${id}/role`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (!res.ok) throw new Error('Не вдалося змінити роль');
            showToast('Роль змінено!', 'success');
            fetchUsers();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <h2 className="ap-section__title">Користувачі</h2>
            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Користувач</th>
                        <th>Email</th>
                        <th>Роль</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td><strong>{u.username}</strong></td>
                            <td>{u.email}</td>
                            <td>
                                <select
                                    className="ap-form__select"
                                    style={{ padding: '6px 12px', width: 'auto' }}
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function OrdersSection({ token, showToast }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/Admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Не вдалося завантажити замовлення');
            setOrders(await res.json());
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_BASE}/Admin/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Не вдалося оновити статус');
            showToast('Статус замовлення оновлено!', 'success');
            fetchOrders();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <h2 className="ap-section__title">Замовлення</h2>
            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Покупець</th>
                        <th>Дата</th>
                        <th>Товари</th>
                        <th>Статус замовлення</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.userEmail || (o.user && o.user.email)}</td>
                            <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                            <td>
                                {o.orderItems && o.orderItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        {item.product?.imageUrl ? (
                                            <img src={item.product.imageUrl} alt="" className="ap-table__img" style={{ width: '30px', height: '30px' }} />
                                        ) : (
                                            <span className="ap-table__no-img" style={{ width: '30px', height: '30px', lineBreak: 'anywhere', fontSize: '10px', lineHigh: '28px' }}>—</span>
                                        )}
                                        <span style={{ fontSize: '12px' }}>{item.product?.name} <strong>x{item.quantity}</strong></span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <select
                                    className="ap-form__select"
                                    style={{ padding: '6px 12px', width: 'auto' }}
                                    value={o.status === 'Processing' ? 'Processing' : o.status === 'Cancelled' ? 'Cancelled' : 'Completed'}
                                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                >
                                    <option value="Processing">Комплектується</option>
                                    <option value="Cancelled">Скасовано</option>
                                    <option value="Completed">Виконано</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function Admin() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('products');

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        const role = getRoleFromToken(token);
        if (role !== 'Admin') {
            showToast('Доступ заборонено! Ви не адмін.', 'error');
            setTimeout(() => navigate('/home'), 2000);
        }
    }, [token, navigate, showToast]);

    const menuItems = [
        {
            id: 'products',
            label: 'Товари',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
            )
        },
        {
            id: 'users',
            label: 'Юзери',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            )
        },
        {
            id: 'orders',
            label: 'Замовлення',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            )
        }
    ];

    return (
        <div className="ap-page">
            <aside className="ap-sidebar">
                <div className="ap-sidebar__brand">
                    <span className="ap-sidebar__logo">INKFLOW</span>
                    <span className="ap-sidebar__role">ADMIN PANEL</span>
                </div>
                <nav className="ap-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`ap-nav__item${activeTab === item.id ? ' ap-nav__item--active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="ap-sidebar__footer">
                    <button className="ap-nav__item ap-nav__item--back" onClick={() => navigate('/home')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        НА САЙТ
                    </button>
                </div>
            </aside>

            <main className="ap-content">
                {activeTab === 'products' && <ProductsSection token={token} showToast={showToast} />}
                {activeTab === 'users'    && <UsersSection    token={token} showToast={showToast} />}
                {activeTab === 'orders'   && <OrdersSection   token={token} showToast={showToast} />}
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}