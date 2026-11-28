import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import '../styles/AdminPanel.css';

const API_BASE = '/api';

const formatPrice = (value) => `${Number(value || 0).toLocaleString('uk-UA')} грн`;
const ORDER_STATUSES = ['Комплектується', 'Скасовано', 'Виконано'];

const getCustomerName = (order) => {
    return order.username
        || order.userName
        || order.user?.username
        || order.user?.name
        || order.userEmail?.split('@')[0]
        || 'Без імені';
};

function getRoleFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || '';
    } catch {
        return '';
    }
}

function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return Number(payload.sub || payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    } catch {
        return null;
    }
}

const emptyForm = {
    name: '', description: '', price: '', imageUrl: '', categoryId: '', brandId: '', stock: '10',
    color: '', thickness: '', density: '', hardness: '', size: '', specification: ''
};

function ProductsSection({ token, showToast }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);

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
        } catch {
            showToast('Не вдалося завантажити категорії або бренди', 'error');
        }
    }, [showToast]);

    useEffect(() => {
        Promise.all([fetchProducts(), fetchMeta()]).finally(() => setLoading(false));
    }, [fetchProducts, fetchMeta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = async (p) => {
        try {
            const res = await fetch(`${API_BASE}/Products/${p.id}`);
            if (!res.ok) throw new Error('Не вдалося завантажити деталі товару');
            const detail = await res.json();
            setEditingProduct(detail);
            setForm({
                name: detail.name || '',
                description: detail.description || '',
                price: detail.price,
                brandId: String(detail.brandId ?? detail.brand?.id ?? ''),
                categoryId: String(detail.categoryId ?? detail.category?.id ?? ''),
                imageUrl: detail.imageUrl || '',
                stock: detail.stock?.toString() || '10',
                color: detail.color || '',
                thickness: detail.thickness?.toString() || '',
                density: detail.density?.toString() || '',
                hardness: detail.hardness || '',
                size: detail.size || '',
                specification: detail.specification || ''
            });
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            const bodyData = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                imageUrl: form.imageUrl,
                categoryId: parseInt(form.categoryId),
                brandId: parseInt(form.brandId),
                stock: parseInt(form.stock) || 0,
                color: form.color || null,
                thickness: form.thickness === '' ? null : parseFloat(form.thickness),
                density: form.density === '' ? null : parseFloat(form.density),
                hardness: form.hardness || null,
                size: form.size || null,
                specification: form.specification || null
            };

            if (editingProduct) {
                const res = await fetch(`${API_BASE}/Products/admin/${editingProduct.id}`, {
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

            setForm(emptyForm);
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
                    <div className="ap-form__group ap-form__group--span-4">
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
                    <div className="ap-form__group">
                        <label className="ap-form__label">Категорія</label>
                        <select name="categoryId" className="ap-form__select" required value={form.categoryId} onChange={handleChange}>
                            <option value="">Оберіть категорію</option>
                            {categories.map(c => {
                                const parent = categories.find(category => category.id === c.parentCategoryId);
                                return <option key={c.id} value={c.id}>{parent ? `${parent.name} / ${c.name}` : c.name}</option>;
                            })}
                        </select>
                    </div>
                    <div className="ap-form__group">
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
                        <textarea name="description" rows="3" className="ap-form__textarea" placeholder="Детальний опис характеристик товару..." value={form.description} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Колір</label>
                        <input type="text" name="color" className="ap-form__input" value={form.color} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Товщина (мм)</label>
                        <input type="number" step="any" min="0" name="thickness" className="ap-form__input" value={form.thickness} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Щільність (г/м²)</label>
                        <input type="number" step="any" min="0" name="density" className="ap-form__input" value={form.density} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Твердість</label>
                        <input type="text" name="hardness" className="ap-form__input" value={form.hardness} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group">
                        <label className="ap-form__label">Розмір / кількість</label>
                        <input type="text" name="size" className="ap-form__input" value={form.size} onChange={handleChange} />
                    </div>
                    <div className="ap-form__group ap-form__group--span-4">
                        <label className="ap-form__label">Специфікація</label>
                        <textarea name="specification" rows="2" className="ap-form__textarea" value={form.specification} onChange={handleChange} />
                    </div>
                </div>
                <div className="ap-form__actions">
                    <button type="submit" className="ap-btn ap-btn--submit" disabled={submitting}>
                        {editingProduct ? 'Зберегти зміни' : 'Додати товар'}
                    </button>
                    {editingProduct && (
                        <button
                            type="button"
                            className="ap-btn ap-btn--cancel"
                            onClick={() => {
                                setEditingProduct(null);
                                setForm(emptyForm);
                            }}
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
                                    <img src={p.imageUrl} alt="" className="ap-table__img" loading="lazy" decoding="async" />
                                ) : (
                                    <span className="ap-table__no-img">—</span>
                                )}
                            </td>
                            <td><strong>{p.name}</strong></td>
                            <td>{p.price} грн</td>
                            <td>
                                <div className="ap-table__actions">
                                    <button className="ap-btn ap-btn--edit" onClick={() => handleEditClick(p)}>
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

function CatalogSection({ token, showToast }) {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [brandName, setBrandName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingBrandId, setEditingBrandId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchCatalogData = useCallback(async () => {
        const [categoryResponse, brandResponse] = await Promise.all([
            fetch(`${API_BASE}/Categories`),
            fetch(`${API_BASE}/Brands`)
        ]);
        if (!categoryResponse.ok || !brandResponse.ok)
            throw new Error('Не вдалося завантажити категорії та бренди');
        const [categoryData, brandData] = await Promise.all([
            categoryResponse.json(),
            brandResponse.json()
        ]);
        return { categories: categoryData, brands: brandData };
    }, []);

    useEffect(() => {
        fetchCatalogData()
            .then(({ categories: categoryData, brands: brandData }) => {
                setCategories(categoryData);
                setBrands(brandData);
            })
            .catch(err => showToast(err.message, 'error'))
            .finally(() => setLoading(false));
    }, [fetchCatalogData, showToast]);

    const getApiError = async (response, fallback) => {
        const result = await response.json().catch(() => null);
        return result?.message || fallback;
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const wasEditing = Boolean(editingCategoryId);
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/Categories${editingCategoryId ? `/${editingCategoryId}` : ''}`, {
                method: editingCategoryId ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: categoryName,
                    parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null
                })
            });
            if (!response.ok)
                throw new Error(await getApiError(response, 'Не вдалося зберегти категорію'));
            setCategoryName('');
            setParentCategoryId('');
            setEditingCategoryId(null);
            const data = await fetchCatalogData();
            setCategories(data.categories);
            setBrands(data.brands);
            showToast(wasEditing ? 'Категорію оновлено!' : 'Категорію успішно додано!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveBrand = async (e) => {
        e.preventDefault();
        const wasEditing = Boolean(editingBrandId);
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/Brands${editingBrandId ? `/${editingBrandId}` : ''}`, {
                method: editingBrandId ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: brandName })
            });
            if (!response.ok)
                throw new Error(await getApiError(response, 'Не вдалося зберегти бренд'));
            setBrandName('');
            setEditingBrandId(null);
            const data = await fetchCatalogData();
            setCategories(data.categories);
            setBrands(data.brands);
            showToast(wasEditing ? 'Бренд оновлено!' : 'Бренд успішно додано!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCatalogItem = async (type, id) => {
        const label = type === 'Categories' ? 'категорію' : 'бренд';
        if (!window.confirm(`Видалити ${label}?`)) return;
        try {
            const response = await fetch(`${API_BASE}/${type}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error(await getApiError(response, `Не вдалося видалити ${label}`));
            const data = await fetchCatalogData();
            setCategories(data.categories);
            setBrands(data.brands);
            if (type === 'Categories' && editingCategoryId === id) {
                setEditingCategoryId(null);
                setCategoryName('');
                setParentCategoryId('');
            }
            if (type === 'Brands' && editingBrandId === id) {
                setEditingBrandId(null);
                setBrandName('');
            }
            showToast(`${label[0].toUpperCase()}${label.slice(1)} видалено.`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <h2 className="ap-section__title">Каталог</h2>
            <div className="ap-catalog-grid">
                <section>
                    <h3 className="ap-catalog__title">Категорії та підкатегорії</h3>
                    <form className="ap-form" onSubmit={handleSaveCategory}>
                        <div className="ap-form__grid">
                            <div className="ap-form__group ap-form__group--span-2">
                                <label className="ap-form__label">Назва</label>
                                <input
                                    className="ap-form__input"
                                    value={categoryName}
                                    onChange={e => setCategoryName(e.target.value)}
                                    maxLength="100"
                                    required
                                />
                            </div>
                            <div className="ap-form__group ap-form__group--span-2">
                                <label className="ap-form__label">Батьківська категорія</label>
                                <select
                                    className="ap-form__select"
                                    value={parentCategoryId}
                                    onChange={e => setParentCategoryId(e.target.value)}
                                >
                                    <option value="">Основна категорія</option>
                                    {categories.filter(category => !category.parentCategoryId && category.id !== editingCategoryId).map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="ap-form__actions">
                            <button className="ap-btn ap-btn--submit" disabled={submitting}>
                                {editingCategoryId ? 'Зберегти категорію' : 'Додати категорію'}
                            </button>
                            {editingCategoryId && <button type="button" className="ap-btn ap-btn--cancel" onClick={() => {
                                setEditingCategoryId(null);
                                setCategoryName('');
                                setParentCategoryId('');
                            }}>Скасувати</button>}
                        </div>
                    </form>
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead><tr><th>Категорія</th><th>Тип</th><th>Дії</th></tr></thead>
                            <tbody>
                                {categories.map(category => {
                                    const parent = categories.find(item => item.id === category.parentCategoryId);
                                    return (
                                        <tr key={category.id}>
                                            <td>{parent ? `${parent.name} / ${category.name}` : category.name}</td>
                                            <td>{parent ? 'Підкатегорія' : 'Основна'}</td>
                                            <td><div className="ap-table__actions">
                                                <button className="ap-btn ap-btn--edit" onClick={() => {
                                                    setEditingCategoryId(category.id);
                                                    setCategoryName(category.name);
                                                    setParentCategoryId(category.parentCategoryId ? String(category.parentCategoryId) : '');
                                                }}>Редагувати</button>
                                                <button className="ap-btn ap-btn--danger" onClick={() => handleDeleteCatalogItem('Categories', category.id)}>Видалити</button>
                                            </div></td>
                                        </tr>
                                    );
                                })}
                                {categories.length === 0 && <tr><td colSpan="3" className="ap-table__empty">Категорій ще немає.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section>
                    <h3 className="ap-catalog__title">Бренди</h3>
                    <form className="ap-form" onSubmit={handleSaveBrand}>
                        <div className="ap-form__group">
                            <label className="ap-form__label">Назва бренду</label>
                            <input
                                className="ap-form__input"
                                value={brandName}
                                onChange={e => setBrandName(e.target.value)}
                                maxLength="100"
                                required
                            />
                        </div>
                        <div className="ap-form__actions">
                            <button className="ap-btn ap-btn--submit" disabled={submitting}>
                                {editingBrandId ? 'Зберегти бренд' : 'Додати бренд'}
                            </button>
                            {editingBrandId && <button type="button" className="ap-btn ap-btn--cancel" onClick={() => {
                                setEditingBrandId(null);
                                setBrandName('');
                            }}>Скасувати</button>}
                        </div>
                    </form>
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead><tr><th>Бренд</th><th>Дії</th></tr></thead>
                            <tbody>
                                {brands.map(brand => (
                                    <tr key={brand.id}>
                                        <td>{brand.name}</td>
                                        <td><div className="ap-table__actions">
                                            <button className="ap-btn ap-btn--edit" onClick={() => {
                                                setEditingBrandId(brand.id);
                                                setBrandName(brand.name);
                                            }}>Редагувати</button>
                                            <button className="ap-btn ap-btn--danger" onClick={() => handleDeleteCatalogItem('Brands', brand.id)}>Видалити</button>
                                        </div></td>
                                    </tr>
                                ))}
                                {brands.length === 0 && <tr><td colSpan="2" className="ap-table__empty">Брендів ще немає.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

function UsersSection({ token, showToast }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = getUserIdFromToken(token);

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

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Видалити цього користувача та його дані?')) return;
        try {
            const res = await fetch(`${API_BASE}/Admin/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const error = await res.json().catch(() => null);
                throw new Error(error?.message || 'Не вдалося видалити користувача');
            }
            setUsers(prev => prev.filter(user => user.id !== id));
            showToast('Користувача видалено.', 'success');
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
                        <th>Дії</th>
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
                            <td>
                                <button
                                    className="ap-btn ap-btn--danger"
                                    disabled={u.id === currentUserId}
                                    title={u.id === currentUserId ? 'Не можна видалити власний обліковий запис' : ''}
                                    onClick={() => handleDeleteUser(u.id)}
                                >Видалити</button>
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
    const [statusFilter, setStatusFilter] = useState('all');

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
            setOrders(prev => prev.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            ));
            showToast('Статус замовлення оновлено!', 'success');
            fetchOrders();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Видалити це замовлення?')) return;
        try {
            const res = await fetch(`${API_BASE}/Admin/orders/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const error = await res.json().catch(() => null);
                throw new Error(error?.message || 'Не вдалося видалити замовлення');
            }
            setOrders(prev => prev.filter(order => order.id !== id));
            showToast('Замовлення видалено.', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const visibleOrders = useMemo(() => {
        if (statusFilter === 'all') return orders;
        return orders.filter(order => (order.status || 'Комплектується') === statusFilter);
    }, [orders, statusFilter]);

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <div className="ap-section__header">
                <h2 className="ap-section__title">Замовлення</h2>
                <div className="ap-order-filters" aria-label="Фільтр замовлень за статусом">
                    <button
                        type="button"
                        className={`ap-order-filter${statusFilter === 'all' ? ' ap-order-filter--active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Усі
                    </button>
                    {ORDER_STATUSES.map(status => (
                        <button
                            key={status}
                            type="button"
                            className={`ap-order-filter${statusFilter === status ? ' ap-order-filter--active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Покупець</th>
                        <th>Дата</th>
                        <th>Товари</th>
                        <th>Сума</th>
                        <th>Статус замовлення</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visibleOrders.map(o => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>
                                <strong>{getCustomerName(o)}</strong>
                                <span className="ap-table__muted">{o.userEmail}</span>
                            </td>
                            <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                            <td>
                                <div className="ap-order-items">
                                    {o.orderItems && o.orderItems.map((item, index) => (
                                        <div key={`${o.id}-${item.productId}-${index}`} className="ap-order-item">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt="" className="ap-order-item__img" loading="lazy" decoding="async" />
                                            ) : (
                                                <span className="ap-order-item__no-img">—</span>
                                            )}
                                            <span className="ap-order-item__name">{item.productName}</span>
                                            <strong className="ap-order-item__qty">x{item.quantity}</strong>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td><strong>{formatPrice(o.totalPrice)}</strong></td>
                            <td>
                                <select
                                    className="ap-form__select"
                                    value={o.status || 'Комплектується'}
                                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                            <td><button className="ap-btn ap-btn--danger" onClick={() => handleDeleteOrder(o.id)}>Видалити</button></td>
                        </tr>
                    ))}
                    {visibleOrders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="ap-table__empty">
                                Замовлень з таким статусом немає.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ReportsSection({ token, showToast }) {
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const responses = await Promise.all([
                fetch(`${API_BASE}/Admin/reports/monthly-revenue`, { headers }),
                fetch(`${API_BASE}/Admin/reports/top-products`, { headers }),
                fetch(`${API_BASE}/Admin/reports/orders-by-status`, { headers })
            ]);
            if (responses.some(response => !response.ok))
                throw new Error('Не вдалося завантажити звітні дані');
            const [revenue, products, statuses] = await Promise.all(responses.map(response => response.json()));
            setMonthlyRevenue(revenue);
            setTopProducts(products);
            setOrdersByStatus(statuses);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    if (loading) return <div className="ap-loading">Завантаження...</div>;

    return (
        <div className="ap-section">
            <h2 className="ap-section__title">Звіти</h2>
            <div className="ap-catalog-grid">
                <section>
                    <h3 className="ap-catalog__title">Виручка за місяцями</h3>
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead><tr><th>Місяць</th><th>Виручка</th></tr></thead>
                            <tbody>
                                {monthlyRevenue.map(item => (
                                    <tr key={`${item.year}-${item.month}`}>
                                        <td>{new Date(item.year, item.month - 1).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}</td>
                                        <td>{formatPrice(item.revenue)}</td>
                                    </tr>
                                ))}
                                {monthlyRevenue.length === 0 && <tr><td colSpan="2" className="ap-table__empty">Даних поки немає.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section>
                    <h3 className="ap-catalog__title">Топ-5 товарів за продажами</h3>
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead><tr><th>Товар</th><th>Кількість</th><th>Виручка</th></tr></thead>
                            <tbody>
                                {topProducts.map(item => (
                                    <tr key={item.productId}>
                                        <td>{item.productName}</td>
                                        <td>{item.quantitySold}</td>
                                        <td>{formatPrice(item.revenue)}</td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && <tr><td colSpan="3" className="ap-table__empty">Даних поки немає.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section>
                    <h3 className="ap-catalog__title">Замовлення за статусами</h3>
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead><tr><th>Статус</th><th>Кількість</th></tr></thead>
                            <tbody>
                                {ordersByStatus.map(item => (
                                    <tr key={item.status}><td>{item.status}</td><td>{item.count}</td></tr>
                                ))}
                                {ordersByStatus.length === 0 && <tr><td colSpan="2" className="ap-table__empty">Даних поки немає.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function Admin() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const [navOpen, setNavOpen] = useState(false);

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

    useEffect(() => {
        if (!navOpen) return;
        const onKeyDown = event => {
            if (event.key === 'Escape') setNavOpen(false);
        };
        document.body.classList.add('ap-menu-open');
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.classList.remove('ap-menu-open');
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [navOpen]);

    useEffect(() => {
        const closeOnDesktop = () => {
            if (window.innerWidth > 768) setNavOpen(false);
        };
        window.addEventListener('resize', closeOnDesktop);
        return () => window.removeEventListener('resize', closeOnDesktop);
    }, []);

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
            id: 'catalog',
            label: 'Каталог',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z"/>
                    <path d="M4 9h16M9 9v11"/>
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
        },
        {
            id: 'reports',
            label: 'Звіти',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19V5M4 19h16" />
                    <path d="m7 15 4-4 3 2 5-6" />
                </svg>
            )
        }
    ];

    return (
        <div className="ap-page">
            {navOpen && (
                <button
                    type="button"
                    className="ap-mobile-nav-backdrop"
                    aria-label="Закрити навігацію"
                    onClick={() => setNavOpen(false)}
                />
            )}
            <aside className={`ap-sidebar${navOpen ? ' ap-sidebar--open' : ''}`}>
                <div className="ap-sidebar__brand">
                    <div className="ap-sidebar__brand-copy">
                        <span className="ap-sidebar__logo">INKFLOW</span>
                        <span className="ap-sidebar__role">ADMIN PANEL</span>
                    </div>
                    <button className="ap-site-link-mobile" onClick={() => navigate('/home')}>НА САЙТ</button>
                    <button
                        type="button"
                        className="ap-menu-toggle"
                        aria-label={navOpen ? 'Закрити розділи' : 'Відкрити розділи'}
                        aria-expanded={navOpen}
                        onClick={() => setNavOpen(open => !open)}
                    >
                        {navOpen ? '×' : '☰'}
                    </button>
                </div>
                <nav className="ap-nav">
                    <button type="button" className="ap-nav__close" onClick={() => setNavOpen(false)} aria-label="Закрити розділи">
                        ×
                    </button>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`ap-nav__item${activeTab === item.id ? ' ap-nav__item--active' : ''}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                setNavOpen(false);
                            }}
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
                {activeTab === 'catalog' && <CatalogSection token={token} showToast={showToast} />}
                {activeTab === 'users'    && <UsersSection    token={token} showToast={showToast} />}
                {activeTab === 'orders'   && <OrdersSection   token={token} showToast={showToast} />}
                {activeTab === 'reports'  && <ReportsSection  token={token} showToast={showToast} />}
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
