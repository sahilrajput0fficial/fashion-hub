// State
let currentModule = 'overview';
let activeEditId = null;
let allProducts = []; // For local filtering

// Auth Check
if (!Auth.isLoggedIn() || Auth.getUser().role !== 'admin') {
    window.location.href = '/login';
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    
    // Search Listener
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(term) || 
                p.category.toLowerCase().includes(term)
            );
            renderInventory(filtered);
        });
    }
});

async function loadDashboard() {
    await fetchStats();
    await fetchRecentOrders();
}

// Stats & Overview
async function fetchStats() {
    try {
        const stats = await apiFetch('/api/admin/stats');
        document.getElementById('stat-sales').textContent = `₹${stats.totalSales.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').textContent = stats.orderCount;
        document.getElementById('stat-users').textContent = stats.userCount;
        document.getElementById('stat-lowstock').textContent = stats.lowStockCount;
    } catch (err) { console.error('Stats error:', err); }
}

async function fetchRecentOrders() {
    try {
        const stats = await apiFetch('/api/admin/stats');
        const list = document.getElementById('recent-orders-list');
        list.innerHTML = stats.recentOrders.map(order => `
            <div class="flex justify-between items-center py-4 border-b border-outline-variant/10 last:border-0">
                <div>
                    <p class="text-[10px] uppercase font-bold text-secondary">#${order._id.slice(-6)}</p>
                    <p class="text-sm font-medium mt-1">₹${order.totalPrice.toLocaleString('en-IN')}</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-[9px] uppercase tracking-widest px-3 py-1 font-bold ${getStatusColor(order.orderStatus)}">
                        ${order.orderStatus || 'Processing'}
                    </span>
                    <button onclick="viewOrderDetails('${order._id}')" class="material-symbols-outlined text-secondary hover:text-primary transition-colors">visibility</button>
                </div>
            </div>
        `).join('') || '<p class="text-secondary italic text-sm">No recent activity.</p>';
    } catch (err) { console.error('Recent orders error:', err); }
}

// Module Navigation
function showModule(module) {
    currentModule = module;
    
    const titles = {
        overview: { t: 'Mission Control', s: 'Real-time performance and operational metrics.' },
        inventory: { t: 'Atelier Inventory', s: 'Manage your curated collection and stock levels.' },
        orders: { t: 'Order Queue', s: 'Fulfill customer orders and track delivery status.' },
        users: { t: 'Customer Relations', s: 'Manage boutique members and administrative access.' },
        promos: { t: 'Promotions', s: 'Generate and manage discount codes for marketing.' }
    };
    
    document.getElementById('module-title').textContent = titles[module].t;
    document.getElementById('module-subtitle').textContent = titles[module].s;

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.id === `nav-${module}`) link.classList.add('active');
    });

    document.querySelectorAll('.module-view').forEach(view => {
        view.classList.add('hidden');
        if (view.id === `module-${module}`) view.classList.remove('hidden');
    });

    if (module === 'inventory') fetchInventory();
    if (module === 'orders') fetchAllOrders();
    if (module === 'users') fetchUsers();
    if (module === 'promos') fetchPromos();
    if (module === 'overview') loadDashboard();
}

// Module: Inventory
async function fetchInventory() {
    try {
        const data = await apiFetch('/api/products?limit=100');
        allProducts = data.products;
        renderInventory(allProducts);
    } catch (err) { console.error('Inventory error:', err); }
}

function renderInventory(products) {
    const list = document.getElementById('inventory-list');
    list.innerHTML = products.map(p => `
        <tr>
            <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                    <img src="${p.image}" class="w-10 h-10 object-cover grayscale">
                    <span class="font-medium">${p.name}</span>
                </div>
            </td>
            <td class="px-8 py-5 text-secondary">${p.category}</td>
            <td class="px-8 py-5 font-serif">₹${p.price.toLocaleString('en-IN')}</td>
            <td class="px-8 py-5 ${p.stock < 10 ? 'text-error font-bold' : ''}">${p.stock}</td>
            <td class="px-8 py-5 flex gap-4">
                <button onclick="openProductEdit('${p._id}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="text-primary font-bold uppercase tracking-widest text-[10px]">Edit</button>
                <button onclick="deleteProduct('${p._id}')" class="text-error font-bold uppercase tracking-widest text-[10px]">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        if (activeEditId) {
            await apiFetch(`/api/products/${activeEditId}`, { method: 'PUT', body: JSON.stringify(data) });
        } else {
            await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(data) });
        }
        closeProductModal();
        fetchInventory();
    } catch (err) { alert(err.message); }
}

function openAddProductModal() {
    activeEditId = null;
    document.getElementById('product-form').reset();
    document.getElementById('product-modal-title').textContent = 'Add Piece';
    openModal('product-modal');
}

function openProductEdit(id, product) {
    activeEditId = id;
    const form = document.getElementById('product-form');
    form.name.value = product.name;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.category.value = product.category;
    form.image.value = product.image;
    form.description.value = product.description;
    document.getElementById('product-modal-title').textContent = 'Edit Piece';
    openModal('product-modal');
}

async function deleteProduct(id) {
    if (!confirm('Remove this product permanently?')) return;
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchInventory();
}

// Module: Orders
async function fetchAllOrders() {
    try {
        const orders = await apiFetch('/api/admin/orders');
        const list = document.getElementById('orders-list');
        list.innerHTML = orders.map(o => `
            <tr>
                <td class="px-8 py-5 font-mono text-[10px]">#${o._id.slice(-8)}</td>
                <td class="px-8 py-5">
                    <p class="font-medium">${o.user ? o.user.name : (o.guestInfo ? o.guestInfo.name : 'Guest')}</p>
                    <p class="text-[10px] text-secondary">${o.user ? o.user.email : (o.guestInfo ? o.guestInfo.email : '')}</p>
                </td>
                <td class="px-8 py-5 font-serif">₹${o.totalPrice.toLocaleString('en-IN')}</td>
                <td class="px-8 py-5">
                    <select onchange="updateStatus('${o._id}', this.value)" class="bg-surface border-outline-variant/30 text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                        <option value="Ordered" ${o.orderStatus === 'Ordered' ? 'selected' : ''}>Ordered</option>
                        <option value="Paid" ${o.orderStatus === 'Paid' ? 'selected' : ''}>Paid</option>
                        <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="px-8 py-5">
                    <button onclick="viewOrderDetails('${o._id}')" class="text-primary font-bold uppercase tracking-widest text-[10px]">Details</button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error('Orders error:', err); }
}

async function viewOrderDetails(id) {
    try {
        const order = await apiFetch(`/api/admin/orders/${id}`);
        const content = document.getElementById('order-detail-content');
        
        content.innerHTML = `
            <div class="grid grid-cols-2 gap-12">
                <div class="space-y-6">
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Customer Context</p>
                        <p class="font-medium text-lg">${order.user ? order.user.name : (order.guestInfo ? order.guestInfo.name : 'Unknown')}</p>
                        <p class="text-secondary">${order.user ? order.user.email : (order.guestInfo ? order.guestInfo.email : '')}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Shipping Destination</p>
                        <p class="text-secondary leading-relaxed">
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                            ${order.shippingAddress.country}
                        </p>
                    </div>
                </div>
                <div class="space-y-6">
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Payment Metrics</p>
                        <p class="text-primary font-serif text-xl">Total: ₹${order.totalPrice.toLocaleString('en-IN')}</p>
                        <p class="text-[10px] uppercase font-bold mt-1 ${order.isPaid ? 'text-success' : 'text-error'}">
                            ${order.isPaid ? 'Payment Confirmed' : 'Payment Awaiting'}
                        </p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Internal Notes</p>
                        <p class="text-secondary italic">Status: ${order.orderStatus}</p>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-outline-variant/10 pt-8 mt-8">
                <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-4">Line Items</p>
                <div class="space-y-4">
                    ${order.orderItems.map(item => `
                        <div class="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                            <div class="flex items-center gap-4">
                                <img src="${item.image}" class="w-12 h-12 object-cover grayscale">
                                <div>
                                    <p class="font-medium">${item.name}</p>
                                    <p class="text-[11px] text-secondary">Qty: ${item.qty} × ₹${item.price.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <p class="font-serif">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        openModal('order-modal');
    } catch (err) { alert(err.message); }
}

async function updateStatus(id, status) {
    try {
        await apiFetch(`/api/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
        fetchAllOrders();
        loadDashboard();
    } catch (err) { alert(err.message); }
}

// Module: Users
async function fetchUsers() {
    try {
        const users = await apiFetch('/api/admin/users');
        const list = document.getElementById('users-list');
        list.innerHTML = users.map(u => `
            <tr>
                <td class="px-8 py-5 font-medium">${u.name}</td>
                <td class="px-8 py-5 text-secondary">${u.email}</td>
                <td class="px-8 py-5">
                    <span class="text-[9px] uppercase tracking-widest px-3 py-1 font-bold ${u.role === 'admin' ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}">${u.role}</span>
                </td>
                <td class="px-8 py-5">
                    <button onclick="toggleRole('${u._id}', '${u.role}')" class="text-primary font-bold uppercase tracking-widest text-[10px]">
                        ${u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error('Users error:', err); }
}

async function toggleRole(id, currentRole) {
    if (Auth.getUser()._id === id) return alert('You cannot demote yourself.');
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
        await apiFetch(`/api/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
        fetchUsers();
    } catch (err) { alert(err.message); }
}

// Module: Promos
async function fetchPromos() {
    try {
        const promos = await apiFetch('/api/promo-codes');
        const list = document.getElementById('promos-list');
        list.innerHTML = promos.map(p => `
            <tr>
                <td class="px-8 py-5 font-mono text-primary font-bold">${p.code}</td>
                <td class="px-8 py-5 font-bold">${p.discountPercent}%</td>
                <td class="px-8 py-5">
                    <span class="text-[9px] uppercase tracking-widest px-3 py-1 font-bold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${p.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-8 py-5 text-secondary text-xs">${new Date(p.expiryDate).toLocaleDateString()}</td>
                <td class="px-8 py-5 flex gap-4">
                    <button onclick="togglePromo('${p._id}', ${p.isActive})" class="text-primary font-bold uppercase tracking-widest text-[10px]">${p.isActive ? 'Disable' : 'Enable'}</button>
                    <button onclick="deletePromo('${p._id}')" class="text-error font-bold uppercase tracking-widest text-[10px]">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error('Promos error:', err); }
}

async function handlePromoSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiFetch('/api/promo-codes', { method: 'POST', body: JSON.stringify(data) });
        closePromoModal();
        fetchPromos();
    } catch (err) { alert(err.message); }
}

async function togglePromo(id, current) {
    await apiFetch(`/api/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !current }) });
    fetchPromos();
}

async function deletePromo(id) {
    if (!confirm('Delete this promo code?')) return;
    await apiFetch(`/api/promo-codes/${id}`, { method: 'DELETE' });
    fetchPromos();
}

function openAddPromoModal() {
    document.getElementById('promo-form').reset();
    openModal('promo-modal');
}

// Helpers
function getStatusColor(status) {
    switch(status) {
        case 'Ordered': return 'bg-amber-100 text-amber-800';
        case 'Paid': return 'bg-blue-100 text-blue-800';
        case 'Shipped': return 'bg-blue-500 text-white';
        case 'Delivered': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function openModal(id) {
    const m = document.getElementById(id);
    m.classList.remove('hidden');
    setTimeout(() => {
        m.classList.remove('opacity-0');
        m.querySelector('.glass-panel').classList.remove('scale-95');
    }, 10);
}

function closeProductModal() {
    const m = document.getElementById('product-modal');
    m.classList.add('opacity-0');
    setTimeout(() => m.classList.add('hidden'), 500);
}

function closePromoModal() {
    const m = document.getElementById('promo-modal');
    m.classList.add('opacity-0');
    setTimeout(() => m.classList.add('hidden'), 500);
}

function closeOrderModal() {
    const m = document.getElementById('order-modal');
    m.classList.add('opacity-0');
    setTimeout(() => m.classList.add('hidden'), 500);
}

function handleLogout() {
    Auth.clearSession();
    window.location.href = '/';
}
