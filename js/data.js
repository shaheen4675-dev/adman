const VeloureData = {
    products: [
        {
            id: 1,
            name: 'Lace Dream Bodysuit',
            nameAr: 'بدي ليس دريم',
            category: 'lingerie',
            categoryAr: 'لانجري',
            price: 89.00,
            originalPrice: 110.00,
            description: 'Exquisite lace bodysuit crafted from the finest French lace, featuring an open-back design with adjustable satin straps. Perfect for intimate evenings.',
            descriptionAr: 'بدي دانتيل فاخر مصنوع من أفخر أنواع الدانتيل الفرنسي، بتصميم مفتوح من الخلف مع أشرطة ساتان قابلة للتعديل. مثالي للأمسيات الحميمة.',
            colors: ['أسود', 'عاجي', 'بيج'],
            colorHex: ['#0a0a0a', '#f5f0e8', '#f5c6d0'],
            stock: 180,
            images: ['product1.jpg', 'product1-2.jpg', 'product1-3.jpg'],
            rating: 4.8,
            reviews: 124,
            isNew: true,
            isHot: false,
            isSale: true,
            featured: true
        },
        {
            id: 2,
            name: 'Silk Charmeuse Robe',
            nameAr: 'روب حرير شارموز',
            category: 'robes',
            categoryAr: 'أرواب',
            price: 149.00,
            originalPrice: null,
            description: 'Luxurious silk charmeuse robe with a delicate satin trim and inner tie closure. Weightless against the skin with a subtle luminosity.',
            descriptionAr: 'روب حرير شارموز فاخر مع حواف ساتان رقيقة وإغلاق داخلي. خفيف كالنسيم على البشرة مع لمعان رقيق.',
            colors: ['أسود', 'شمبانيا', 'نبيذي'],
            colorHex: ['#0a0a0a', '#f7e7ce', '#800020'],
            stock: 110,
            images: ['product2.jpg', 'product2-2.jpg', 'product2-3.jpg'],
            rating: 4.9,
            reviews: 89,
            isNew: false,
            isHot: true,
            isSale: false,
            featured: true
        },
        {
            id: 3,
            name: 'Midnight Seduction Set',
            nameAr: 'طقم منتصف الليل',
            category: 'sets',
            categoryAr: 'طقم',
            price: 129.00,
            originalPrice: 169.00,
            description: 'A captivating three-piece set featuring a lace bralette, high-waist brief, and garter belt. Intricate floral lace pattern with adjustable straps.',
            descriptionAr: 'طقم ثلاثي آسر يتكون من براليت دانتيل، كلاسيك عالي الخصر، وحزام رباط. نقش دانتيل زهري معقد مع أشرطة قابلة للتعديل.',
            colors: ['أسود', 'أحمر', 'كحلي'],
            colorHex: ['#0a0a0a', '#dc2626', '#1e3a5f'],
            stock: 90,
            images: ['product3.jpg', 'product3-2.jpg', 'product3-3.jpg'],
            rating: 4.7,
            reviews: 156,
            isNew: true,
            isHot: false,
            isSale: true,
            featured: true
        },
        {
            id: 4,
            name: 'Velvet Touch Corset',
            nameAr: 'كورسيه فيلفت',
            category: 'corsets',
            categoryAr: 'كورسيهات',
            price: 109.00,
            originalPrice: null,
            description: 'Premium velvet corset with steel boning and a satin ribbon lace-up back. Sculpts the silhouette while maintaining comfort for all-night wear.',
            descriptionAr: 'كورسيه فيلفت ممتاز مع دعائم فولاذية وأربطة ساتان خلفية. يمنح القوام المثالي مع الحفاظ على الراحة طوال الليل.',
            colors: ['أسود', 'زمردي', 'أزرق ملكي'],
            colorHex: ['#0a0a0a', '#046307', '#1e40af'],
            stock: 70,
            images: ['product4.jpg', 'product4-2.jpg', 'product4-3.jpg'],
            rating: 4.6,
            reviews: 98,
            isNew: false,
            isHot: true,
            isSale: false,
            featured: false
        },
        {
            id: 5,
            name: 'Cashmere Wrap Cardigan',
            nameAr: 'كارديغان كشمير',
            category: 'outerwear',
            categoryAr: 'ملابس خارجية',
            price: 199.00,
            originalPrice: 259.00,
            description: 'Ultra-soft cashmere wrap cardigan with a relaxed fit and gold-tone button closure. The ultimate layering piece for elegant sophistication.',
            descriptionAr: 'كارديغان كشمير ناعم جداً بقصة فضفاضة وأزرار ذهبية. قطعة مثالية للطبقات لإطلالة أنيقة وراقية.',
            colors: ['عاجي', 'جمل', 'أسود'],
            colorHex: ['#f5f0e8', '#c19a6b', '#0a0a0a'],
            stock: 55,
            images: ['product5.jpg', 'product5-2.jpg', 'product5-3.jpg'],
            rating: 4.9,
            reviews: 67,
            isNew: false,
            isHot: false,
            isSale: true,
            featured: false
        },
        {
            id: 6,
            name: 'Satin Chemise Nightie',
            nameAr: 'ثوب نوم ساتان',
            category: 'nightwear',
            categoryAr: 'ملابس نوم',
            price: 79.00,
            originalPrice: null,
            description: 'Silky satin chemise with delicate lace trim and adjustable spaghetti straps. A timeless silhouette that glides over the body with effortless elegance.',
            descriptionAr: 'قميص نوم ساتان حريري مع حواف دانتيل رقيقة وأشرطة سباغيتي قابلة للتعديل. تصميم خالد ينزلق على الجسم بأناقة.',
            colors: ['أسود', 'وردي', 'لافندر'],
            colorHex: ['#0a0a0a', '#f9a8d4', '#c4b5fd'],
            stock: 150,
            images: ['product6.jpg', 'product6-2.jpg', 'product6-3.jpg'],
            rating: 4.7,
            reviews: 203,
            isNew: true,
            isHot: false,
            isSale: false,
            featured: true
        },
        {
            id: 7,
            name: 'Lace Trim Bralette',
            nameAr: 'براليت دانتيل',
            category: 'lingerie',
            categoryAr: 'لانجري',
            price: 59.00,
            originalPrice: null,
            description: 'Intricately patterned lace bralette with a scalloped hem and stretch mesh back. Wire-free for natural comfort with undeniable allure.',
            descriptionAr: 'براليت دانتيل بنقوش معقدة مع حافة مكشكشة وخلفية مش شبك مطاطي. بدون أسلاك لراحة طبيعية مع جاذبية لا تُقاوم.',
            colors: ['أسود', 'أبيض', 'بشرة'],
            colorHex: ['#0a0a0a', '#ffffff', '#e8c5a5'],
            stock: 220,
            images: ['product7.jpg', 'product7-2.jpg', 'product7-3.jpg'],
            rating: 4.5,
            reviews: 312,
            isNew: false,
            isHot: true,
            isSale: false,
            featured: true
        },
        {
            id: 8,
            name: 'High-Waist Suspender Belt',
            nameAr: 'حزام رباط عالي الخصر',
            category: 'accessories',
            categoryAr: 'إكسسوارات',
            price: 69.00,
            originalPrice: 89.00,
            description: 'A statement suspender belt in luxury satin with adjustable strap. High-waist design cinches the waist and creates an unforgettable silhouette.',
            descriptionAr: 'حزام رباط أيقوني من الساتان الفاخر مع أشرطة قابلة للتعديل. تصميم عالي الخصر يحدد الخصر ويخلق قواماً لا يُنسى.',
            colors: ['أسود', 'أحمر'],
            colorHex: ['#0a0a0a', '#dc2626'],
            stock: 130,
            images: ['product8.jpg', 'product8-2.jpg', 'product8-3.jpg'],
            rating: 4.6,
            reviews: 78,
            isNew: false,
            isHot: false,
            isSale: true,
            featured: false
        }
    ],

    categories: [
        { id: 'lingerie', name: 'Lingerie', nameAr: 'لانجري', image: 'cat-lingerie.jpg', count: 2 },
        { id: 'robes', name: 'Robes', nameAr: 'أرواب', image: 'cat-robes.jpg', count: 1 },
        { id: 'sets', name: 'Sets', nameAr: 'طقم', image: 'cat-sets.jpg', count: 1 },
        { id: 'corsets', name: 'Corsets', nameAr: 'كورسيهات', image: 'cat-corsets.jpg', count: 1 }
    ],

    testimonials: [
        {
            id: 1,
            name: 'Sophia Laurent',
            role: 'Fashion Editor',
            roleAr: 'محررة أزياء',
            text: 'The quality of Velouré pieces is extraordinary. Every stitch tells a story of craftsmanship and elegance. My new go-to for luxury lingerie.',
            textAr: 'جودة قطع Velouré استثنائية. كل غرزة تحكي قصة من الحرفية والأناقة. وجهتي الجديدة للانجري الفاخر.',
            rating: 5
        },
        {
            id: 2,
            name: 'Olivia Chen',
            role: 'Style Influencer',
            roleAr: 'مؤثرة أزياء',
            text: 'I\'ve never felt more confident than in my Velouré pieces. The fit is impeccable and the fabrics are divine. Truly transformative.',
            textAr: 'لم أشعر بثقة أكبر من أي وقت مضى في قطع Velouré الخاصة بي. المقاس لا يُضاهى والأقمشة إلهية. تحويلية حقاً.',
            rating: 5
        },
        {
            id: 3,
            name: 'Isabella Rossi',
            role: 'Boutique Owner',
            roleAr: 'صاحبة بوتيك',
            text: 'Velouré represents everything luxury lingerie should be - sophisticated, comfortable, and impossibly beautiful. A masterpiece of design.',
            textAr: 'تجسد Velouré كل ما يجب أن يكون عليه اللانجري الفاخر - راقي ومريح وجميل بشكل لا يُصدق. تحفة فنية في التصميم.',
            rating: 5
        }
    ],

    coupons: [
        { code: 'WELCOME20', discount: 20, type: 'percent', minAmount: 0, isActive: true },
        { code: 'VIP30', discount: 30, type: 'percent', minAmount: 200, isActive: true },
        { code: 'FREESHIP', discount: 0, type: 'freeshipping', minAmount: 150, isActive: true }
    ],

    currency: {
        code: 'SYP',
        symbol: 'ل.س',
        rate: 13000
    },

    currencies: [
        { code: 'SYP', symbol: 'ل.س', name: 'ليرة سورية', rate: 13000 },
        { code: 'USD', symbol: '$', name: 'دولار أمريكي', rate: 1 },
        { code: 'EUR', symbol: '€', name: 'يورو', rate: 0.92 },
        { code: 'GBP', symbol: '£', name: 'جنيه إسترليني', rate: 0.79 }
    ],

    languages: ['en', 'ar'],
    currentLang: 'ar',

    settings: {
        storeName: 'Velouré',
        tagline: 'Luxury Lingerie & Fashion',
        taglineAr: 'لانجري وأزياء فاخرة',
        phone: '0944975460',
        address: 'حلب، سوريا',
        social: {
            instagram: '#',
            facebook: '#',
            twitter: '#',
            pinterest: '#'
        },
        shipping: {
            standard: 9.99,
            express: 19.99,
            free: 0
        },
        taxRate: 0.08
    }
};

// Load admin-saved products from localStorage
(function() {
    try {
        const saved = JSON.parse(localStorage.getItem('veloure_products'));
        if (saved && saved.length) {
            const merged = VeloureData.products.map(p => saved.find(s => s.id === p.id) || p);
            saved.forEach(p => { if (!merged.find(m => m.id === p.id)) merged.push(p); });
            VeloureData.products = merged;
        }
    } catch(e) {}
})();
