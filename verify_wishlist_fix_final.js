const API_BASE = 'http://localhost:8000/api';

async function verify() {
    try {
        console.log('1. Logging in as admin...');
        const loginRes = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@fashionhub.com',
                password: 'admin123admin'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData));
        
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('   Login successful.');

        console.log('2. Fetching products...');
        const productsRes = await fetch(`${API_BASE}/products`);
        const productsData = await productsRes.json();
        const product = productsData.products[0];
        console.log(`   Selected product: ${product.name} (${product._id})`);

        console.log('3. Adding to wishlist...');
        const addRes = await fetch(`${API_BASE}/wishlist/${product._id}`, {
            method: 'POST',
            headers
        });
        const addData = await addRes.json();
        if (addRes.status !== 200) throw new Error('Add failed: ' + JSON.stringify(addData));
        console.log('   Product added.');

        console.log('4. Verifying wishlist content...');
        const wishlistRes = await fetch(`${API_BASE}/wishlist`, { headers });
        const wishlistData = await wishlistRes.json();
        const isInList = wishlistData.some(p => p && p._id === product._id);
        if (isInList) {
            console.log('   Verified: Product is in wishlist.');
        } else {
            throw new Error(`Verification failed: Product NOT in wishlist. Wishlist size: ${wishlistData.length}`);
        }

        console.log('5. Testing password persistence (re-logging)...');
        const loginRes2 = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@fashionhub.com',
                password: 'admin123admin'
            })
        });
        const loginData2 = await loginRes2.json();
        if (loginData2.token) {
            console.log('   Verified: Password still works after wishlist update.');
        } else {
            throw new Error('Verification failed: Could not re-login after wishlist update.');
        }

        console.log('6. Removing from wishlist...');
        await fetch(`${API_BASE}/wishlist/${product._id}`, {
            method: 'DELETE',
            headers
        });
        console.log('   Product removed.');

        console.log('\nSUCCESS: Wishlist feature and password persistence are working correctly!');
    } catch (err) {
        console.error('\nFAILURE:', err.message);
        process.exit(1);
    }
}

verify();
