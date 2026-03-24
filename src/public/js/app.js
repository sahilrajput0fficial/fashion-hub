// ===========================
// Fashion Hub - Auth Utilities
// Shared across all pages
// ===========================

const API_BASE = '';

const Auth = {
    getToken: () => localStorage.getItem('fashionHub_token'),
    getUser: () => {
        const u = localStorage.getItem('fashionHub_user');
        return u ? JSON.parse(u) : null;
    },
    setSession: (userData) => {
        localStorage.setItem('fashionHub_token', userData.token);
        localStorage.setItem('fashionHub_user', JSON.stringify({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role
        }));
    },
    clearSession: () => {
        localStorage.removeItem('fashionHub_token');
        localStorage.removeItem('fashionHub_user');
    },
    isLoggedIn: () => !!localStorage.getItem('fashionHub_token'),
    isAdmin: () => {
        const user = Auth.getUser();
        return user && user.role === 'admin';
    }
};

const Cart = {
    getItems: () => {
        const items = localStorage.getItem('fashionHub_cart');
        return items ? JSON.parse(items) : [];
    },
    setItems: (items) => {
        localStorage.setItem('fashionHub_cart', JSON.stringify(items));
        localStorage.setItem('cartCount', items.reduce((sum, i) => sum + i.qty, 0));
    },
    addItem: (product, qty = 1) => {
        const items = Cart.getItems();
        const existing = items.find(i => i._id === product._id);
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({ ...product, qty });
        }
        Cart.setItems(items);
        return items;
    },
    removeItem: (productId) => {
        const items = Cart.getItems().filter(i => i._id !== productId);
        Cart.setItems(items);
        return items;
    },
    updateQty: (productId, qty) => {
        const items = Cart.getItems();
        const item = items.find(i => i._id === productId);
        if (item) {
            if (qty <= 0) return Cart.removeItem(productId);
            item.qty = qty;
        }
        Cart.setItems(items);
        return items;
    },
    getCount: () => {
        return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
    },
    getSubtotal: () => {
        return Cart.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    clear: () => {
        localStorage.removeItem('fashionHub_cart');
        localStorage.setItem('cartCount', 0);
    }
};

async function apiFetch(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
}

function initNavCart() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const count = Cart.getCount();
        counter.textContent = count;
        if (count > 0) counter.classList.remove('opacity-0');
        else counter.classList.add('opacity-0');
    }
}

function initNavUser() {
    const user = Auth.getUser();
    const accountLink = document.getElementById('account-nav-link');
    if (!accountLink) return;
    if (user) {
        accountLink.textContent = user.name.split(' ')[0];
        accountLink.href = '/account';
    } else {
        accountLink.textContent = 'Sign In';
        accountLink.href = '/login';
    }
}
