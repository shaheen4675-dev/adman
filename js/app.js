const App = {
    currentPage: 'home',
    selectedProduct: null,
    currentCategory: 'all',
    searchQuery: '',
    appliedCoupon: null,
    detailQty: 1,

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupNewsletter();
        this.setupScrollEffects();
        this.routePage();
        window.addEventListener('hashchange', () => this.routePage());
    },

    routePage() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentPage = hash;
        this.showPage(hash);
    },

    showPage(page) {
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`page-${page}`);
        if (section) section.classList.add('active');
        if (page === 'home') this.renderHome();
        else if (page === 'products' || page === 'catalog') this.renderProducts(this.currentCategory);
        else if (page === 'product') this.renderProductDetail();
        else if (page === 'cart') this.renderCart();
        else if (page === 'checkout') this.renderCheckout();
        else if (page === 'orders') this.renderOrders();
        else if (page === 'wishlist') this.renderWishlist();
        else if (page === 'success') this.renderSuccess();
        if (page !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    navigate(page) {
        window.location.hash = page;
    },

    getCurrency() {
        return VeloureData.currencies.find(c => c.code === VeloureData.currency.code) || VeloureData.currencies[0];
    },

    formatPrice(amount) {
        const cur = this.getCurrency();
        const converted = amount * cur.rate;
        if (cur.code === 'SYP') {
            return converted.toLocaleString('ar-SA') + ' ' + cur.symbol;
        }
        return cur.symbol + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= Math.round(rating) ? '' : 'empty'}">${i <= Math.round(rating) ? '★' : '☆'}</span>`;
        }
        return stars;
    },

    getProductImage(product, index = 0) {
        if (product.images && product.images[index] && product.images[index].startsWith('data:')) {
            return product.images[index];
        }
        return this.getPlaceholderUrl(product.id, index);
    },

    getPlaceholderUrl(productId, index = 0) {
        const colors = ['c9a96e', '0a0a0a', 'f5f0e8', '800020', '1e3a5f', 'dc2626', '046307', 'f9a8d4', 'c4b5fd'];
        const c = colors[(productId + index) % colors.length];
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23${c}'/%3E%3C/svg%3E`;
    },

    getCategoryPlaceholder(catId) {
        const colors = { lingerie: 'c9a96e', robes: '800020', sets: '0a0a0a', corsets: 'dc2626' };
        const c = colors[catId] || 'c9a96e';
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23${c}'/%3E%3C/svg%3E`;
    },

    getCategoryPlaceholder(catId) {
        const colors = { lingerie: 'c9a96e', robes: '800020', sets: '0a0a0a', corsets: 'dc2626' };
        const c = colors[catId] || 'c9a96e';
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect fill='%23${c}' width='400' height='533'/%3E%3Ctext x='200' y='266' text-anchor='middle' fill='white' font-family='Georgia' font-size='24' font-style='italic' opacity='0.8'%3EVeloré%3C/text%3E%3C/svg%3E`;
    },

    renderHome() {
        this.renderFeaturedProducts();
        this.renderCategories();
        this.renderTestimonials();
    },

    renderFeaturedProducts(category = 'all') {
        const grid = document.getElementById('featured-products-grid');
        if (!grid) return;
        let products = VeloureData.products.filter(p => p.featured);
        if (category !== 'all') products = products.filter(p => p.category === category);
        grid.innerHTML = products.map(p => this.createProductCard(p)).join('');
        this.attachProductCardEvents();
    },

    renderCategories() {
        const grid = document.getElementById('categories-grid');
        if (!grid) return;
        grid.innerHTML = VeloureData.categories.map(cat => `
            <div class="category-card" onclick="App.navigate('products'); App.filterByCategory('${cat.id}')">
                <img src="${this.getCategoryPlaceholder(cat.id)}" alt="${cat.nameAr}">
                <div class="category-overlay">
                    <h3>${cat.nameAr}</h3>
                    <span>${cat.count} منتج</span>
                </div>
            </div>
        `).join('');
    },

    renderTestimonials() {
        const grid = document.getElementById('testimonials-grid');
        if (!grid) return;
        grid.innerHTML = VeloureData.testimonials.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-stars">${this.renderStars(t.rating)}</div>
                <p class="testimonial-text">"${t.textAr}"</p>
                <h4 class="testimonial-author">${t.name}</h4>
                <span class="testimonial-role">${t.roleAr}</span>
            </div>
        `).join('');
    },

    createProductCard(product) {
        const isWishlisted = Store.isInWishlist(product.id);
        const badge = product.isNew ? '<span class="product-card-badge badge-new">جديد</span>' :
                      product.isHot ? '<span class="product-card-badge badge-hot">رائج</span>' :
                      product.isSale && product.originalPrice ? '<span class="product-card-badge badge-sale">تخفيض</span>' : '';
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card-image" onclick="App.navigate('product'); App.showProduct(${product.id})">
                    <img src="${this.getProductImage(product, 0)}" alt="${product.nameAr}">
                    ${badge}
                    <div class="product-card-actions">
                        <button class="product-card-action-btn wishlist-btn-card ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); App.toggleWishlist(${product.id})" title="المفضلة">
                            ${isWishlisted ? '❤' : '♡'}
                        </button>
                        <button class="product-card-action-btn" onclick="event.stopPropagation(); App.quickView(${product.id})" title="معاينة سريعة">👁</button>
                    </div>
                </div>
                <div class="product-card-body">
                    <div class="product-card-category">${product.categoryAr || product.category}</div>
                    <h3 class="product-card-title" onclick="App.navigate('product'); App.showProduct(${product.id})">${product.nameAr || product.name}</h3>
                    <div class="product-card-rating">${this.renderStars(product.rating)} <span style="font-size:0.75rem;color:var(--gray-400);margin-right:4px;">(${product.reviews})</span></div>
                    <div class="product-card-price">
                        <span class="price-current">${this.formatPrice(product.price)}</span>
                        ${product.originalPrice ? `<span class="price-original">${this.formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-card-colors">
                        ${product.colors.map((c, i) => `<span class="color-dot" style="background:${product.colorHex[i]}" title="${c}"></span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    attachProductCardEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.product-card-action-btn')) return;
                const id = parseInt(card.dataset.id);
                this.showProduct(id);
                this.navigate('product');
            });
        });
    },

    renderProducts(category = 'all') {
        this.currentCategory = category;
        const grid = document.getElementById('catalog-grid');
        const title = document.getElementById('catalog-title');
        const count = document.getElementById('catalog-count');
        if (!grid) return;
        let products = [...VeloureData.products];
        if (category !== 'all') products = products.filter(p => p.category === category);
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.nameAr && p.nameAr.includes(q)));
        }
        if (count) count.textContent = `${products.length} منتج`;
        if (title) title.textContent = category === 'all' ? 'جميع المنتجات' : (VeloureData.categories.find(c => c.id === category)?.nameAr || category);
        grid.innerHTML = products.length ? products.map(p => this.createProductCard(p)).join('') : '<div class="empty-state"><div class="icon">🔍</div><h3>لا توجد منتجات</h3><p>جربي تصنيفاً آخر أو كلمة بحث مختلفة</p></div>';
        this.attachProductCardEvents();
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
    },

    filterByCategory(category) {
        this.currentCategory = category;
        this.searchQuery = '';
        const searchInput = document.getElementById('catalog-search');
        if (searchInput) searchInput.value = '';
        this.showPage('products');
        this.renderProducts(category);
    },

    showProduct(id) {
        const product = VeloureData.products.find(p => p.id === id);
        if (!product) return;
        this.selectedProduct = product;
        this.renderProductDetail();
        this.navigate('product');
    },

    renderProductDetail() {
        const p = this.selectedProduct;
        if (!p) { this.navigate('products'); return; }
        const container = document.getElementById('product-detail-container');
        if (!container) return;
        const isWishlisted = Store.isInWishlist(p.id);
        container.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-images">
                    <div class="product-detail-main-image">
                        <img id="detail-main-img" src="${this.getProductImage(p, 0)}" alt="${p.nameAr}">
                    </div>
                    <div class="product-detail-thumbs">
                        ${p.images.map((img, i) => `
                            <div class="product-detail-thumb ${i === 0 ? 'active' : ''}" onclick="App.switchDetailImage(${i})">
                                <img src="${this.getProductImage(p, i)}" alt="${p.nameAr}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="product-detail-info">
                    <div class="product-detail-category">${p.categoryAr || p.category}</div>
                    <h1>${p.nameAr || p.name}</h1>
                    <div class="product-detail-rating">
                        ${this.renderStars(p.rating)}
                        <span style="color:var(--gray-500);font-size:0.85rem;">${p.rating} (${p.reviews} تقييم)</span>
                    </div>
                    <div class="product-detail-price">
                        ${this.formatPrice(p.price)}
                        ${p.originalPrice ? `<span style="text-decoration:line-through;color:var(--gray-400);font-size:1.2rem;font-weight:400;margin-right:12px;">${this.formatPrice(p.originalPrice)}</span>` : ''}
                    </div>
                    <p class="product-detail-description">${p.descriptionAr || p.description}</p>
                    <div class="product-option-group">
                        <span class="product-option-label">اللون</span>
                        <div class="color-options" id="color-options">
                            ${p.colors.map((c, i) => `<span class="color-option" style="background:${p.colorHex[i]}" data-color="${c}" title="${c}"></span>`).join('')}
                        </div>
                    </div>
                    <div class="product-option-group">
                        <span class="product-option-label">الكمية</span>
                        <div class="quantity-selector">
                            <button onclick="App.changeQty(-1)">−</button>
                            <input type="text" id="detail-qty" value="1" readonly>
                            <button onclick="App.changeQty(1)">+</button>
                        </div>
                    </div>
                    <div class="product-detail-actions">
                        <button class="btn btn-primary" onclick="App.addCurrentToCart()">أضف إلى السلة</button>
                        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="App.toggleWishlist(${p.id})">${isWishlisted ? '❤' : '♡'}</button>
                    </div>
                </div>
            </div>
        `;
        document.querySelectorAll('.color-option').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
            });
        });
        this.detailQty = 1;
    },

    switchDetailImage(index) {
        const p = this.selectedProduct;
        if (!p) return;
        const mainImg = document.getElementById('detail-main-img');
        if (mainImg) mainImg.src = this.getProductImage(p, index);
        document.querySelectorAll('.product-detail-thumb').forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
    },

    changeQty(delta) {
        const input = document.getElementById('detail-qty');
        if (!input) return;
        this.detailQty = Math.max(1, Math.min(10, (this.detailQty || 1) + delta));
        input.value = this.detailQty;
    },

    addCurrentToCart() {
        const p = this.selectedProduct;
        if (!p) return;
        const selectedColor = document.querySelector('.color-option.active');
        if (!selectedColor) { this.showToast('الرجاء اختيار اللون', 'error'); return; }
        const color = selectedColor.dataset.color;
        const result = Store.addToCart(p.id, color, this.detailQty || 1);
        if (result.success) {
            this.showToast(`تمت إضافة ${p.nameAr || p.name} إلى السلة!`, 'success');
        } else {
            this.showToast(result.message, 'error');
        }
    },

    toggleWishlist(id) {
        const now = Store.toggleWishlist(id);
        const product = VeloureData.products.find(p => p.id === id);
        this.showToast(now ? `تمت إضافة ${product.nameAr || product.name} إلى المفضلة` : 'تمت الإزالة من المفضلة', now ? 'success' : 'info');
        const btns = document.querySelectorAll(`.wishlist-btn-card[onclick*="${id}"]`);
        btns.forEach(b => { b.classList.toggle('active', now); b.innerHTML = now ? '❤' : '♡'; });
        const detailBtn = document.querySelector('.wishlist-btn');
        if (detailBtn) { detailBtn.classList.toggle('active', now); detailBtn.textContent = now ? '❤' : '♡'; }
    },

    quickView(id) {
        const product = VeloureData.products.find(p => p.id === id);
        if (!product) return;
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        content.innerHTML = `
            <button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('active')">✕</button>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                <div style="aspect-ratio:3/4;background:var(--secondary);overflow:hidden;">
                    <img src="${this.getProductImage(product, 0)}" alt="${product.nameAr}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div>
                    <div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--gray-400);margin-bottom:8px;">${product.categoryAr || product.category}</div>
                    <h2 style="font-family:var(--font-heading);font-size:1.5rem;margin-bottom:8px;">${product.nameAr || product.name}</h2>
                    <div style="margin-bottom:12px;">${this.renderStars(product.rating)}</div>
                    <div style="font-size:1.5rem;font-weight:700;margin-bottom:16px;">${this.formatPrice(product.price)}</div>
                    <p style="color:var(--gray-600);line-height:1.7;margin-bottom:16px;font-size:0.9rem;">${(product.descriptionAr || product.description).substring(0, 150)}...</p>
                    <button class="btn btn-primary" onclick="document.getElementById('modal-overlay').classList.remove('active');App.showProduct(${product.id});App.navigate('product');" style="width:100%;justify-content:center;">عرض التفاصيل</button>
                </div>
            </div>
        `;
        overlay.classList.add('active');
    },

    renderCart() {
        const cart = Store.getCart();
        const container = document.getElementById('cart-container');
        if (!container) return;
        if (cart.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="icon">🛒</div><h3>سلتك فارغة</h3><p>اكتشفي مجموعتنا الحصرية</p><button class="btn btn-primary" onclick="App.navigate(\'products\')">تسوق الآن</button></div>';
            document.getElementById('cart-summary-container').innerHTML = '';
            return;
        }
        let html = '';
        let subtotal = 0;
        cart.forEach(item => {
            const product = VeloureData.products.find(p => p.id === item.productId);
            if (!product) return;
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${this.getProductImage(product, 0)}" alt="${product.nameAr}">
                    </div>
                    <div class="cart-item-info">
                        <h3>${product.nameAr || product.name}</h3>
                        <div class="cart-item-variant">اللون: ${item.color}</div>
                        <div class="cart-item-price">${this.formatPrice(itemTotal)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button onclick="App.changeCartQty(${item.id}, -1)">−</button>
                            <input type="text" value="${item.quantity}" readonly style="width:40px;">
                            <button onclick="App.changeCartQty(${item.id}, 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="App.removeCartItem(${item.id})">إزالة</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        this.renderCartSummary(subtotal);
    },

    renderCartSummary(subtotal) {
        const container = document.getElementById('cart-summary-container');
        if (!container) return;
        const discount = this.appliedCoupon?.discount || 0;
        const shipping = subtotal >= 150 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax - discount;
        container.innerHTML = `
            <div class="cart-summary">
                <h3>ملخص الطلب</h3>
                <div class="coupon-input">
                    <input type="text" id="coupon-input" placeholder="كود الخصم" value="${this.appliedCoupon?.code || ''}">
                    <button onclick="App.applyCouponCode()">تطبيق</button>
                </div>
                <div class="cart-summary-row">
                    <span>المجموع الفرعي</span>
                    <span>${this.formatPrice(subtotal)}</span>
                </div>
                <div class="cart-summary-row">
                    <span>الشحن</span>
                    <span>${shipping === 0 ? 'مجاني' : this.formatPrice(shipping)}</span>
                </div>
                ${discount > 0 ? `<div class="cart-summary-row" style="color:#059669;">
                    <span>الخصم</span>
                    <span>-${this.formatPrice(discount)}</span>
                </div>` : ''}
                <div class="cart-summary-row">
                    <span>الضريبة (8%)</span>
                    <span>${this.formatPrice(tax)}</span>
                </div>
                <div class="cart-summary-row total">
                    <span>المجموع</span>
                    <span>${this.formatPrice(total)}</span>
                </div>
                <button class="btn btn-primary" onclick="App.navigate('checkout')">متابعة الدفع</button>
            </div>
        `;
    },

    changeCartQty(id, delta) {
        Store.updateQuantity(id, delta);
        this.renderCart();
        Store.updateBadges();
    },

    removeCartItem(id) {
        Store.removeFromCart(id);
        this.renderCart();
        Store.updateBadges();
        this.showToast('تمت إزالة المنتج من السلة', 'info');
    },

    applyCouponCode() {
        const input = document.getElementById('coupon-input');
        if (!input) return;
        const result = Store.applyCoupon(input.value);
        if (result.success) {
            this.appliedCoupon = result;
            this.showToast(result.message, 'success');
        } else {
            this.appliedCoupon = null;
            this.showToast(result.message, 'error');
        }
        this.renderCart();
    },

    renderCheckout() {
        const cart = Store.getCart();
        if (cart.length === 0) {
            this.navigate('cart');
            this.showToast('سلتك فارغة', 'error');
            return;
        }
        const container = document.getElementById('checkout-container');
        if (!container) return;
        let itemsHtml = '';
        let subtotal = 0;
        cart.forEach(item => {
            const product = VeloureData.products.find(p => p.id === item.productId);
            if (!product) return;
            subtotal += product.price * item.quantity;
            itemsHtml += `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:0.9rem;border-bottom:1px solid var(--gray-100);">
                <span>${product.nameAr || product.name} × ${item.quantity} <span style="color:var(--gray-400);font-size:0.8rem;">(${item.color})</span></span>
                <span>${this.formatPrice(product.price * item.quantity)}</span>
            </div>`;
        });
        const discount = this.appliedCoupon?.discount || 0;
        const shipping = subtotal >= 150 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax - discount;
        container.innerHTML = `
            <div class="checkout-page">
                <div class="checkout-form">
                    <h2>معلومات الشحن</h2>
                    <div class="form-group">
                        <label>الاسم الكامل</label>
                        <input type="text" id="checkout-name" placeholder="الاسم الكامل" required>
                    </div>
                    <div class="form-group">
                        <label>رقم الهاتف</label>
                        <input type="tel" id="checkout-phone" placeholder="+963 900 000 000" required>
                    </div>
                    <div class="form-group">
                        <label>العنوان</label>
                        <input type="text" id="checkout-address" placeholder="العنوان بالكامل" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>المدينة</label>
                            <input type="text" id="checkout-city" placeholder="المدينة" required>
                        </div>
                        <div class="form-group">
                            <label>الدولة</label>
                            <select id="checkout-country">
                                <option value="SY">سوريا</option>
                                <option value="AE">الإمارات</option>
                                <option value="SA">السعودية</option>
                                <option value="KW">الكويت</option>
                                <option value="QA">قطر</option>
                                <option value="BH">البحرين</option>
                                <option value="OM">عمان</option>
                                <option value="JO">الأردن</option>
                                <option value="LB">لبنان</option>
                                <option value="EG">مصر</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>طريقة الشحن</label>
                            <select id="checkout-shipping">
                                <option value="standard">عادي - 9.99$ (5-7 أيام)</option>
                                <option value="express">سريع - 19.99$ (2-3 أيام)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>طريقة الدفع</label>
                        <select id="checkout-payment">
                            <option value="cod">الدفع عند الاستلام</option>
                            <option value="shamcash">شام كاش</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="App.placeOrder()" style="width:100%;justify-content:center;margin-top:16px;">تأكيد الطلب — ${this.formatPrice(total)}</button>
                </div>
                <div>
                    <div class="cart-summary" style="position:sticky;top:100px;">
                        <h3>ملخص الطلب</h3>
                        ${itemsHtml}
                        <div style="margin-top:16px;border-top:1px solid var(--gray-300);padding-top:12px;">
                            <div class="cart-summary-row"><span>المجموع الفرعي</span><span>${this.formatPrice(subtotal)}</span></div>
                            <div class="cart-summary-row"><span>الشحن</span><span>${shipping === 0 ? 'مجاني' : this.formatPrice(shipping)}</span></div>
                            ${discount > 0 ? `<div class="cart-summary-row" style="color:#059669;"><span>الخصم</span><span>-${this.formatPrice(discount)}</span></div>` : ''}
                            <div class="cart-summary-row"><span>الضريبة</span><span>${this.formatPrice(tax)}</span></div>
                            <div class="cart-summary-row total"><span>المجموع</span><span>${this.formatPrice(total)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    placeOrder() {
        const name = document.getElementById('checkout-name')?.value.trim();
        const address = document.getElementById('checkout-address')?.value.trim();
        const city = document.getElementById('checkout-city')?.value.trim();
        const country = document.getElementById('checkout-country')?.value;
        const phone = document.getElementById('checkout-phone')?.value.trim();
        const shippingMethod = document.getElementById('checkout-shipping')?.value;
        const paymentMethod = document.getElementById('checkout-payment')?.value;
        if (!name || !address || !city || !phone) {
            this.showToast('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
            return;
        }
        const orderData = {
            name, address, city, country, phone, shippingMethod, paymentMethod,
            couponCode: this.appliedCoupon?.code || null,
            discount: this.appliedCoupon?.discount || 0
        };
        const result = Store.placeOrder(orderData);
        if (result.success) {
            this.appliedCoupon = null;
            this.lastOrder = result.order;
            this.showToast(`تم تأكيد الطلب! رقم الطلب: ${result.order.id}`, 'success');
            this.navigate('success');
        } else {
            this.showToast(result.message, 'error');
        }
    },

    renderSuccess() {
        const order = this.lastOrder;
        const container = document.getElementById('success-container');
        if (!container || !order) return;
        container.innerHTML = `
            <div class="success-page">
                <div class="icon">✓</div>
                <h2>تم تأكيد الطلب!</h2>
                <p>شكراً لك على الشراء، ${order.customer.name}.</p>
                <p style="margin-bottom:4px;">رقم الطلب: <strong>${order.id}</strong></p>
                <p style="color:var(--gray-500);margin-bottom:4px;">طريقة الدفع: <strong style="color:var(--gold);">${order.paymentMethod === 'shamcash' ? 'شام كاش' : 'الدفع عند الاستلام'}</strong></p>
                <p style="margin-bottom:24px;">سنقوم بالاتصال بك على <strong style="color:var(--gold);">${order.customer.phone}</strong></p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="App.navigate('orders')">تتبع الطلب</button>
                    <button class="btn btn-outline" style="border-color:var(--primary);color:var(--primary);" onclick="App.navigate('products')">متابعة التسوق</button>
                </div>
            </div>
        `;
    },

    renderOrders() {
        const orders = Store.getOrders();
        const container = document.getElementById('orders-container');
        if (!container) return;
        if (orders.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="icon">📦</div><h3>لا توجد طلبات بعد</h3><p>ستظهر طلباتك هنا</p><button class="btn btn-primary" onclick="App.navigate(\'products\')">ابدأي التسوق</button></div>';
            return;
        }
        const statusMap = { pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' };
        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status ${order.status}">${statusMap[order.status] || order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => {
                        const product = VeloureData.products.find(p => p.id === item.productId);
                        return product ? `<div class="order-item">
                            <img src="${this.getProductImage(product, 0)}" alt="${product.nameAr}">
                            <div>
                                <div style="font-weight:500;">${product.nameAr || product.name}</div>
                                <div style="font-size:0.8rem;color:var(--gray-500);">${item.color} × ${item.quantity}</div>
                            </div>
                            <div style="margin-right:auto;font-weight:600;">${this.formatPrice(product.price * item.quantity)}</div>
                        </div>` : '';
                    }).join('')}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                        <div style="font-size:0.85rem;color:var(--gray-500);">${new Date(order.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div style="font-size:0.8rem;color:var(--gray-400);background:var(--gray-100);padding:2px 8px;border-radius:4px;">${order.paymentMethod === 'shamcash' ? 'شام كاش' : 'الدفع عند الاستلام'}</div>
                    </div>
                    <div class="order-total">المجموع: <span style="color:var(--gold);">${this.formatPrice(order.total)}</span></div>
                </div>
            </div>
        `).join('');
    },

    renderWishlist() {
        const ids = Store.getWishlist();
        const container = document.getElementById('wishlist-container');
        if (!container) return;
        if (ids.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="icon">♡</div><h3>المفضلة فارغة</h3><p>أضفي منتجاتك المفضلة هنا</p><button class="btn btn-primary" onclick="App.navigate(\'products\')">تصفحي المنتجات</button></div>';
            return;
        }
        const products = VeloureData.products.filter(p => ids.includes(p.id));
        container.innerHTML = `<div class="products-grid">${products.map(p => this.createProductCard(p)).join('')}</div>`;
        this.attachProductCardEvents();
    },

    setupNavigation() {
        document.querySelectorAll('.nav-link, .mobile-nav-link, .header-action-btn[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page || link.getAttribute('href')?.slice(1);
                if (page) {
                    if (page === 'catalog') {
                        this.currentCategory = 'all';
                        this.searchQuery = '';
                    }
                    this.navigate(page);
                    document.getElementById('mobile-menu')?.classList.remove('active');
                }
            });
        });
        const mobileMenu = document.getElementById('mobile-menu');
        document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
            mobileMenu?.classList.add('active');
        });
        document.querySelector('.mobile-menu-close')?.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
        });
        if (mobileMenu) mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) mobileMenu.classList.remove('active');
        });
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterByCategory(tab.dataset.category);
            });
        });
        const searchBtn = document.querySelector('[data-page="search"]');
        if (searchBtn) searchBtn.addEventListener('click', () => document.getElementById('search-overlay')?.classList.add('active'));
        const searchOverlay = document.getElementById('search-overlay');
        if (searchOverlay) searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) searchOverlay.classList.remove('active'); });
        const searchCloseBtn = document.getElementById('search-close-btn');
        if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => searchOverlay?.classList.remove('active'));
    },

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const resultsDiv = document.getElementById('search-results');
        if (!searchInput || !resultsDiv) return;
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const q = searchInput.value.toLowerCase().trim();
                if (!q) { resultsDiv.innerHTML = ''; return; }
                const results = VeloureData.products.filter(p => p.name.toLowerCase().includes(q) || p.nameAr.includes(q) || p.category.includes(q));
                resultsDiv.innerHTML = results.length ? results.map(p => `
                    <div class="search-result-item" onclick="App.searchSelect(${p.id})">
                        <img src="${this.getProductImage(p, 0)}" alt="${p.nameAr}">
                        <div class="info">
                            <h4>${p.nameAr || p.name}</h4>
                            <span>${this.formatPrice(p.price)}</span>
                        </div>
                    </div>
                `).join('') : '<div style="color:var(--gray-400);padding:12px;text-align:center;">لا توجد نتائج</div>';
            }, 300);
        });
    },

    searchSelect(productId) {
        document.getElementById('search-overlay')?.classList.remove('active');
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').innerHTML = '';
        this.showProduct(productId);
        this.navigate('product');
    },

    setupNewsletter() {
        document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (input?.value) {
                this.showToast('مرحباً بك في Velouré! تفقدي بريدك لعروضنا الحصرية.', 'success');
                input.value = '';
            }
        });
    },

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-100px)'; toast.style.transition = 'all 0.3s ease'; }, 3000);
        setTimeout(() => toast.remove(), 3300);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
