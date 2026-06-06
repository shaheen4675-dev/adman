const Store = {
    getCart() {
        try { return JSON.parse(localStorage.getItem('veloure_cart')) || []; } catch { return []; }
    },
    saveCart(cart) {
        localStorage.setItem('veloure_cart', JSON.stringify(cart));
        this.updateBadges();
    },
    addToCart(productId, color, quantity = 1) {
        const cart = this.getCart();
        const product = VeloureData.products.find(p => p.id === productId);
        if (!product) return { success: false, message: 'المنتج غير موجود' };
        if (!color) return { success: false, message: 'الرجاء اختيار اللون' };
        const stock = product.stock || 0;
        if (stock < quantity) return { success: false, message: `يتوفر ${stock} قطع فقط` };
        const existing = cart.find(item => item.productId === productId && item.color === color);
        if (existing) {
            if (existing.quantity + quantity > stock) return { success: false, message: `يتوفر ${stock - existing.quantity} قطع إضافية فقط` };
            existing.quantity += quantity;
        } else {
            cart.push({ productId, color, quantity, id: Date.now() + Math.random() * 1000 });
        }
        this.saveCart(cart);
        return { success: true, message: 'تمت الإضافة إلى السلة!' };
    },
    removeFromCart(itemId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== itemId);
        this.saveCart(cart);
    },
    updateQuantity(itemId, delta) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        if (!item) return;
        const product = VeloureData.products.find(p => p.id === item.productId);
        const maxStock = product ? (product.stock || 0) : 99;
        item.quantity = Math.max(1, Math.min(maxStock, item.quantity + delta));
        this.saveCart(cart);
    },
    getCartCount() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },
    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => {
            const product = VeloureData.products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    },
    applyCoupon(code) {
        const coupon = VeloureData.coupons.find(c => c.code === code.toUpperCase() && c.isActive);
        if (!coupon) return { success: false, discount: 0, message: 'كود الخصم غير صالح' };
        const total = this.getCartTotal();
        if (total < coupon.minAmount) return { success: false, discount: 0, message: `الطلب الأدنى ${coupon.minAmount}$ مطلوب` };
        let discount = 0;
        if (coupon.type === 'percent') discount = total * (coupon.discount / 100);
        if (coupon.type === 'freeshipping') discount = VeloureData.settings.shipping.standard;
        return { success: true, discount, code: coupon.code, message: `تم تطبيق الكود! ${coupon.type === 'percent' ? coupon.discount + '% خصم' : 'شحن مجاني'}` };
    },

    getWishlist() {
        try { return JSON.parse(localStorage.getItem('veloure_wishlist')) || []; } catch { return []; }
    },
    saveWishlist(wishlist) {
        localStorage.setItem('veloure_wishlist', JSON.stringify(wishlist));
        this.updateBadges();
    },
    toggleWishlist(productId) {
        let wishlist = this.getWishlist();
        const idx = wishlist.indexOf(productId);
        if (idx > -1) { wishlist.splice(idx, 1); this.saveWishlist(wishlist); return false; }
        else { wishlist.push(productId); this.saveWishlist(wishlist); return true; }
    },
    isInWishlist(productId) {
        return this.getWishlist().includes(productId);
    },

    getOrders() {
        try { return JSON.parse(localStorage.getItem('veloure_orders')) || []; } catch { return []; }
    },
    saveOrders(orders) {
        localStorage.setItem('veloure_orders', JSON.stringify(orders));
    },
    placeOrder(orderData) {
        const cart = this.getCart();
        if (cart.length === 0) return { success: false, message: 'السلة فارغة' };
        const subtotal = this.getCartTotal();
        const shipping = orderData.shippingMethod === 'express' ? VeloureData.settings.shipping.express : 
                         subtotal >= VeloureData.settings.shipping.free && VeloureData.coupons.find(c => c.code === orderData.couponCode?.toUpperCase() && c.type === 'freeshipping') ? 0 :
                         VeloureData.settings.shipping.standard;
        const discount = orderData.discount || 0;
        const tax = subtotal * VeloureData.settings.taxRate;
        const total = subtotal + shipping + tax - discount;
        const order = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase(),
            items: [...cart],
            customer: {
                name: orderData.name,
                phone: orderData.phone || '',
                address: orderData.address,
                city: orderData.city,
                country: orderData.country
            },
            paymentMethod: orderData.paymentMethod || 'cod',
            shippingMethod: orderData.shippingMethod || 'standard',
            subtotal,
            shipping,
            discount,
            tax,
            total,
            couponCode: orderData.couponCode || null,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const orders = this.getOrders();
        orders.unshift(order);
        this.saveOrders(orders);
        this.saveCart([]);
        return { success: true, order };
    },
    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) { order.status = status; order.updatedAt = new Date().toISOString(); this.saveOrders(orders); }
    },

    getAbandonedCarts() {
        try { return JSON.parse(localStorage.getItem('veloure_abandoned')) || []; } catch { return []; }
    },
    saveAbandonedCart(cartData) {
        const carts = this.getAbandonedCarts();
        carts.push({ ...cartData, createdAt: new Date().toISOString() });
        localStorage.setItem('veloure_abandoned', JSON.stringify(carts));
    },

    updateBadges() {
        const cartCount = this.getCartCount();
        const wishlistCount = this.getWishlist().length;
        document.querySelectorAll('.cart-badge').forEach(el => { el.textContent = cartCount; el.style.display = cartCount > 0 ? 'flex' : 'none'; });
        document.querySelectorAll('.wishlist-badge').forEach(el => { el.textContent = wishlistCount; el.style.display = wishlistCount > 0 ? 'flex' : 'none'; });
    },

    getAdminStats() {
        const orders = this.getOrders();
        const cartData = this.getCart();
        const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'pending').length;
        const totalProducts = VeloureData.products.length;
        return { totalRevenue, totalOrders, pendingOrders, totalProducts };
    },

    getSalesData(days = 7) {
        const orders = this.getOrders();
        const data = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayOrders = orders.filter(o => o.createdAt.split('T')[0] === dateStr);
            data.push({
                date: dateStr,
                revenue: dayOrders.reduce((s, o) => s + o.total, 0),
                orders: dayOrders.length
            });
        }
        return data;
    }
};

document.addEventListener('DOMContentLoaded', () => Store.updateBadges());
