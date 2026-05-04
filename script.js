        // ===== PRODUCT DATA =====
        const products = [
            {
                id: 1,
                name: "Wireless Charging Pad",
                desc: "Sleek bamboo & aluminum fast charger, 15W Qi compatible",
                price: 39.99,
                category: "tech",
                img: "https://images.unsplash.com/photo-1543472750-506bacbf5808?w=600&h=400&fit=crop",
                badge: null
            },
            {
                id: 2,
                name: "Ceramic Pour-Over Set",
                desc: "Hand-crafted dripper with thermal carafe, matte finish",
                price: 64.00,
                category: "home",
                img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
                badge: "Best Seller"
            },
            {
                id: 3,
                name: "Minimalist Leather Wallet",
                desc: "Full-grain leather, RFID blocking, 6 card slots",
                price: 49.99,
                oldPrice: 69.99,
                category: "accessories",
                img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop",
                badge: "Sale"
            },
            {
                id: 4,
                name: "Aromatherapy Diffuser",
                desc: "Ultrasonic mist, 7 LED colors, auto shut-off timer",
                price: 44.99,
                category: "wellness",
                img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=400&fit=crop",
                badge: null
            },
            {
                id: 5,
                name: "Mechanical Keyboard",
                desc: "65% layout, hot-swappable switches, RGB backlight",
                price: 89.99,
                category: "tech",
                img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop",
                badge: "New"
            },
            {
                id: 6,
                name: "Handmade Soy Candle",
                desc: "Cedarwood & vanilla blend, 50+ hours burn time",
                price: 28.00,
                category: "home",
                img: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=400&fit=crop",
                badge: null
            },
            {
                id: 7,
                name: "Canvas Tote Bag",
                desc: "Organic cotton, reinforced straps, inner zip pocket",
                price: 34.99,
                category: "accessories",
                img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=400&fit=crop",
                badge: null
            },
            {
                id: 8,
                name: "Yoga Mat Premium",
                desc: "Natural rubber, non-slip surface, 6mm thickness",
                price: 59.99,
                oldPrice: 79.99,
                category: "wellness",
                img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop",
                badge: "Sale"
            }
        ];

        let cart = [];
        let currentFilter = 'all';

        // ===== RENDER PRODUCTS =====
        function renderProducts(filter = 'all') {
            const grid = document.getElementById('productsGrid');
            const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

            grid.innerHTML = filtered.map(product => `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-img">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        <img src="${product.img}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-desc">${product.desc}</div>
                        <div class="product-bottom">
                            <div class="product-price">
                                $${product.price.toFixed(2)}
                                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <button class="add-to-cart" onclick="addToCart(${product.id})" title="Add to cart">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // ===== FILTER =====
        function filterProducts(category) {
            currentFilter = category;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.textContent.toLowerCase() === category || (category === 'all' && btn.textContent === 'All'));
            });
            renderProducts(category);
        }

        // ===== CART =====
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ ...product, qty: 1 });
            }

            updateCart();
            showToast(`${product.name} added to cart`);
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        function changeQty(productId, delta) {
            const item = cart.find(i => i.id === productId);
            if (!item) return;

            item.qty += delta;
            if (item.qty <= 0) {
                removeFromCart(productId);
                return;
            }
            updateCart();
        }

        function updateCart() {
            const countEl = document.getElementById('cartCount');
            const totalEl = document.getElementById('cartTotal');
            const itemsEl = document.getElementById('cartItems');
            const checkoutBtn = document.getElementById('checkoutBtn');

            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

            countEl.textContent = totalItems;
            totalEl.textContent = `$${totalPrice.toFixed(2)}`;
            checkoutBtn.disabled = cart.length === 0;

            if (cart.length === 0) {
                itemsEl.innerHTML = `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                    </div>`;
                return;
            }

            itemsEl.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">✕ Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // ===== CART DRAWER =====
        function toggleCart() {
            const overlay = document.getElementById('cartOverlay');
            const drawer = document.getElementById('cartDrawer');
            const isOpen = drawer.classList.contains('open');

            overlay.classList.toggle('open');
            drawer.classList.toggle('open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        }

        // ===== CHECKOUT =====
        function openCheckout() {
            toggleCart();
            setTimeout(() => {
                const modal = document.getElementById('checkoutModal');
                modal.classList.add('open');
                const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                document.getElementById('payAmount').textContent = `$${total.toFixed(2)}`;
                document.body.style.overflow = 'hidden';
            }, 300);
        }

        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('open');
            document.body.style.overflow = '';
        }

        // ===== PAYMENT (SIMULATED STRIPE) =====
        function processPayment() {
            const btn = document.getElementById('payBtn');
            const card = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiry = document.getElementById('expiry').value;
            const cvc = document.getElementById('cvc').value;
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;

            if (!name || !email || !card || !expiry || !cvc) {
                showToast('Please fill in all fields');
                return;
            }

            if (card.length < 16) {
                showToast('Please enter a valid card number');
                return;
            }

            // Simulate Stripe processing
            btn.disabled = true;
            btn.textContent = 'Processing...';

            setTimeout(() => {
                // Simulate API call to Stripe
                console.log('💳 Stripe Test Payment:', {
                    amount: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
                    currency: 'usd',
                    card: { number: card, exp: expiry, cvc: cvc },
                    customer: { name, email },
                    mode: 'TEST'
                });

                btn.textContent = `Pay $0.00`;
                btn.disabled = false;

                // Close checkout, show success
                closeCheckout();
                setTimeout(() => {
                    document.getElementById('successModal').classList.add('open');
                    cart = [];
                    updateCart();
                }, 300);
            }, 2000);
        }

        function closeSuccess() {
            document.getElementById('successModal').classList.remove('open');
            document.body.style.overflow = '';
        }

        // ===== HELPERS =====
        function formatCardNumber(input) {
            let value = input.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            input.value = value;
        }

        function formatExpiry(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            input.value = value;
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }

        // ===== INIT =====
        renderProducts();
