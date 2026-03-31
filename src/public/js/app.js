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
        const parsed = items ? JSON.parse(items) : [];
        console.log('Cart Items Retrieved:', parsed);
        return parsed;
    },
    setItems: (items) => {
        console.log('Cart Items Setting:', items);
        localStorage.setItem('fashionHub_cart', JSON.stringify(items));
        localStorage.setItem('cartCount', items.reduce((sum, i) => sum + i.qty, 0));
        // Force header update
        initNavCart();
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

const LocationService = {
    fetchCountries: async () => {
        try {
            const res = await fetch('https://countriesnow.space/api/v0.1/countries');
            const data = await res.json();
            return data.data.map(c => c.country).sort();
        } catch (err) {
            console.error('Countries fetch error:', err);
            return ['United Kingdom', 'United States', 'France', 'Italy']; // Fallback
        }
    },
    fetchStates: async (country) => {
        try {
            const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country })
            });
            const data = await res.json();
            return data.data.states.map(s => s.name).sort();
        } catch (err) {
            console.error('States fetch error:', err);
            return [];
        }
    }
};

const Wishlist = {
    toggle: async (productId) => {
        if (!Auth.isLoggedIn()) {
            window.location.href = '/login';
            return;
        }
        try {
            // Check if already in wishlist (client side check for UI toggle)
            const currentWishlist = await apiFetch('/api/wishlist');
            const exists = currentWishlist.find(p => p._id === productId);
            if (exists) {
                await apiFetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
                return false; // Removed
            } else {
                await apiFetch(`/api/wishlist/${productId}`, { method: 'POST' });
                return true; // Added
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            return null;
        }
    },
    getItems: async () => {
        if (!Auth.isLoggedIn()) return [];
        return await apiFetch('/api/wishlist');
    }
};

async function apiFetch(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    
    if (res.status === 401) {
        Auth.clearSession();
        window.location.href = '/login';
    }

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
        accountLink.innerHTML = `
            <span class="flex items-center gap-2 uppercase tracking-widest text-[10px] font-semibold">
                <span class="material-symbols-outlined text-[18px]">person</span>
                <span class="hidden sm:inline">Account</span>
            </span>
        `;
        accountLink.href = '/account';
    } else {
        accountLink.innerHTML = `
            <span class="flex items-center gap-2 uppercase tracking-widest text-[10px] font-semibold">
                <span class="material-symbols-outlined text-[18px]">login</span>
                <span class="hidden sm:inline">Sign In</span>
            </span>
        `;
        accountLink.href = '/login';
    }
}


const Theme = {
    init: () => {
        const theme = localStorage.getItem('fashionHub_theme') || 'light';
        Theme.apply(theme);

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.onclick = () => {
                const current = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                Theme.apply(current);
            };
        }
    },
    apply: (theme) => {
        const darkIcon = document.getElementById('theme-icon-dark');
        const lightIcon = document.getElementById('theme-icon-light');

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (darkIcon) darkIcon.classList.remove('hidden');
            if (lightIcon) lightIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            if (darkIcon) darkIcon.classList.add('hidden');
            if (lightIcon) lightIcon.classList.remove('hidden');
        }
        localStorage.setItem('fashionHub_theme', theme);
    }
};

const LazyLoader = {
    init: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LazyLoader.init();
});
