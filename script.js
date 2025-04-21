// زر العودة للأعلى
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============== وظائف سلة التسوق ==============

// الحصول على عناصر السلة من localStorage
function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// إضافة منتج إلى السلة
function addToCart(product) {
    const cart = getCartItems();
    
    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // إذا كان المنتج موجودًا بالفعل، زيادة الكمية
        existingItem.quantity += 1;
    } else {
        // إذا لم يكن المنتج موجودًا، إضافته للسلة
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // حفظ السلة في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تحديث عداد السلة
    updateCartCounter();
}

// تحديث عداد السلة
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if(!cartCounter) return; // التحقق من وجود العداد
    
    const cart = getCartItems();
    
    // حساب إجمالي عدد المنتجات في السلة
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // تحديث العداد
    cartCounter.textContent = totalItems;
    
    // إظهار أو إخفاء العداد حسب وجود منتجات في السلة
    if (totalItems > 0) {
        cartCounter.style.display = 'flex';
    } else {
        cartCounter.style.display = 'none';
    }
}

// تفعيل أزرار إضافة للسلة
function initCartButtons() {
    const cartButtons = document.querySelectorAll('.btn-cart');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            
            // الحصول على بيانات المنتج
            const id = productCard.dataset.id || Math.random().toString(36).substring(2, 15);
            const name = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent.trim();
            const price = parseFloat(priceText.split(' ')[0].replace(',', ''));
            const image = productCard.querySelector('.product-img img').src;
            
            // تحديث بيانات المنتج في البطاقة
            productCard.dataset.id = id;
            
            // إضافة المنتج للسلة
            addToCart({ id, name, price, image });
            
            // تأثير الإضافة للسلة
            productCard.classList.add('added-to-cart');
            setTimeout(() => {
                productCard.classList.remove('added-to-cart');
            }, 1000);
            
            // عرض رسالة نجاح
            showNotification(`تم إضافة ${name} إلى سلة التسوق`, 'success');
        });
    });
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <span class="close-notification">&times;</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إغلاق الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ============== وظائف المفضلة ==============

const wishlistButtons = document.querySelectorAll('.btn-wishlist');

wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = button.querySelector('i');
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.style.backgroundColor = '#ffe6e6';
            icon.style.color = '#ff3b30';

            // تأثير القلب النابض
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 300);
            
            // عرض رسالة نجاح
            showNotification(`تمت إضافة ${productName} إلى المفضلة`, 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.style.backgroundColor = '#f2f2f7';
            icon.style.color = '#666';
            
            // عرض رسالة إزالة
            showNotification(`تمت إزالة ${productName} من المفضلة`, 'info');
        }
    });
});

// ============== وظائف البحث ==============

// تفعيل البحث
// تفعيل البحث
const searchIcon = document.querySelector('.nav-icons .fa-search');

searchIcon.addEventListener('click', () => {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.transform = 'scale(0.5)'; // جعل الحجم صغير بالبداية
    searchContainer.style.opacity = '0';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ابحث عن المنتجات...';
    searchInput.className = 'search-input';

    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-search';
    closeButton.innerHTML = '&times;';

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchResults);
    searchContainer.appendChild(closeButton);
    document.body.appendChild(searchContainer);

    // جعل التأثير الانتقالي أكثر سلاسة
    requestAnimationFrame(() => {
        searchContainer.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        setTimeout(() => {
            searchContainer.classList.add('active');
            searchContainer.style.transform = 'scale(1)';
            searchContainer.style.opacity = '1';
            searchInput.focus();
        }, 10);
    });

    // إضافة وظيفة البحث
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length > 1) {
            // البحث في منتجات الصفحة
            const products = document.querySelectorAll('.product-card');
            const matchingProducts = [];
            
            products.forEach(product => {
                const name = product.querySelector('h3').textContent.toLowerCase();
                const description = product.querySelector('.features') ? 
                                    product.querySelector('.features').textContent.toLowerCase() : '';
                
                if (name.includes(query) || description.includes(query)) {
                    matchingProducts.push({
                        name: product.querySelector('h3').textContent,
                        price: product.querySelector('.price').textContent.trim(),
                        image: product.querySelector('.product-img img').src,
                        link: `#${product.closest('.featured-products').id}`
                    });
                }
            });
            
            // عرض نتائج البحث
            if (matchingProducts.length > 0) {
                let resultsHTML = '';
                
                matchingProducts.forEach(product => {
                    resultsHTML += `
                        <div class="search-result-item">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="search-result-details">
                                <h4>${product.name}</h4>
                                <p>${product.price}</p>
                            </div>
                        </div>
                    `;
                });
                
                searchResults.innerHTML = resultsHTML;
                searchResults.style.display = 'block';
                
                // إضافة تفاعل للنتائج
                const resultItems = searchResults.querySelectorAll('.search-result-item');
                
                resultItems.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        searchContainer.style.transform = 'scale(0.5)';
                        searchContainer.style.opacity = '0';
                        
                        setTimeout(() => {
                            searchContainer.remove();
                            // الانتقال إلى المنتج
                            window.location.href = matchingProducts[index].link;
                        }, 300);
                    });
                });
            } else {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>لا توجد نتائج مطابقة لـ "${query}"</p>
                    </div>
                `;
                searchResults.style.display = 'block';
            }
        } else {
            searchResults.style.display = 'none';
        }
    });

    closeButton.addEventListener('click', () => {
        searchContainer.style.transform = 'scale(0.5)';
        searchContainer.style.opacity = '0';
        
        setTimeout(() => {
            searchContainer.remove();
        }, 300);
    });
});

// ============== وظائف حساب المستخدم ==============

const userIcon = document.querySelector('.nav-icons .fa-user');

userIcon.addEventListener('click', () => {
    const authModal = document.createElement('div');
    authModal.className = 'auth-modal';

    authModal.innerHTML = `
        <div class="auth-content">
            <span class="close-auth">&times;</span>
            <h3>تسجيل الدخول</h3>
            <form class="auth-form" id="login-form">
                <input type="email" placeholder="البريد الإلكتروني" required>
                <input type="password" placeholder="كلمة المرور" required>
                <button type="submit">تسجيل الدخول</button>
                <p>ليس لديك حساب؟ <a href="#" class="switch-to-register">إنشاء حساب جديد</a></p>
            </form>
            <form class="auth-form" id="register-form" style="display: none;">
                <input type="text" placeholder="الاسم الكامل" required>
                <input type="email" placeholder="البريد الإلكتروني" required>
                <input type="password" placeholder="كلمة المرور" required>
                <input type="password" placeholder="تأكيد كلمة المرور" required>
                <button type="submit">إنشاء حساب</button>
                <p>لديك حساب بالفعل؟ <a href="#" class="switch-to-login">تسجيل الدخول</a></p>
            </form>
        </div>
    `;

    document.body.appendChild(authModal);

    // تفعيل النموذج
    const loginForm = authModal.querySelector('#login-form');
    const registerForm = authModal.querySelector('#register-form');
    const switchToRegister = authModal.querySelector('.switch-to-register');
    const switchToLogin = authModal.querySelector('.switch-to-login');

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authModal.querySelector('.auth-content h3').textContent = 'إنشاء حساب جديد';
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        authModal.querySelector('.auth-content h3').textContent = 'تسجيل الدخول';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        
        // محاكاة عملية تسجيل الدخول
        authModal.classList.remove('show');
        
        setTimeout(() => {
            authModal.remove();
            
            // عرض رسالة نجاح تسجيل الدخول
            showNotification(`تم تسجيل الدخول بنجاح! مرحباً بك ${email}`, 'success');
            
            // تحديث واجهة المستخدم بعد تسجيل الدخول
            updateLoggedInUI(email);
            
            // تخزين حالة تسجيل الدخول
            localStorage.setItem('user', JSON.stringify({ email: email, name: email.split('@')[0] }));
        }, 300);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        
        // محاكاة عملية إنشاء الحساب
        authModal.classList.remove('show');
        
        setTimeout(() => {
            authModal.remove();
            
            // عرض رسالة نجاح إنشاء الحساب
            showNotification(`تم إنشاء حسابك بنجاح! مرحباً بك ${name}`, 'success');
            
            // تحديث واجهة المستخدم بعد تسجيل الدخول
            updateLoggedInUI(name);
            
            // تخزين حالة تسجيل الدخول
            localStorage.setItem('user', JSON.stringify({ email: email, name: name }));
        }, 300);
    });

    setTimeout(() => {
        authModal.classList.add('show');
    }, 10);

    const closeButton = authModal.querySelector('.close-auth');
    closeButton.addEventListener('click', () => {
        authModal.classList.remove('show');
        setTimeout(() => {
            authModal.remove();
        }, 300);
    });
});

// تحديث واجهة المستخدم بعد تسجيل الدخول
function updateLoggedInUI(name) {
    const userIcon = document.querySelector('.nav-icons .fa-user');
    
    // تغيير أيقونة المستخدم لتظهر أنه مسجل الدخول
    userIcon.className = 'fas fa-user-check';
    userIcon.style.color = 'var(--apple-blue)';
    
    // إضافة tooltip للمستخدم
    userIcon.setAttribute('title', `مرحباً، ${name}`);
}

// ============== وظائف سلة التسوق في الصفحة الرئيسية ==============

// تفعيل زر سلة التسوق
const cartIcon = document.querySelector('.nav-icons .fa-shopping-bag');

cartIcon.addEventListener('click', () => {
    // الانتقال إلى صفحة السلة
    window.location.href = 'cart.html';
});

// ============== وظائف التحميل والتهيئة ==============

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين معرفات فريدة للمنتجات
    assignProductIds();
    
    // تهيئة أزرار السلة
    initCartButtons();
    
    // تحديث عداد السلة
    updateCartCounter();
    
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();
    
    // إضافة تأثيرات ظهور تدريجي للعناصر
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.category-card, .product-card, .feature-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // تعيين أسلوب العناصر الأولي
    const setInitialStyles = () => {
        const elements = document.querySelectorAll('.category-card, .product-card, .feature-card');

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    };

    setInitialStyles();
    animateOnScroll();

    // إضافة حدث التمرير
    window.addEventListener('scroll', animateOnScroll);

    // تغيير لون القائمة عند التمرير
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });

    // إضافة أنماط CSS ديناميكية
    const style = document.createElement('style');
    style.textContent = `
        .toast-message {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .toast-message.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .product-card.added-to-cart {
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        
        .search-container {
            position: fixed;
            top: 60px;
            right: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.95);
            padding: 20px;
            display: flex;
            flex-direction: column;
            z-index: 1001;
            border-radius: 15px;
            margin: 0 auto;
            max-width: 600px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform-origin: top center;
            /* تمت إزالة transform: translateY(-100%) لأننا نستخدم scale بدلاً منه */
        }
        
        
        .search-container.active {
            transform: translateY(0);
        }
        
        .search-input {
            flex: 1;
            padding: 12px 20px;
            border-radius: 30px;
            border: none;
            font-size: 16px;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            margin-bottom: 10px;
        }
        
        .search-results {
            background-color: white;
            border-radius: 10px;
            max-height: 70vh;
            overflow-y: auto;
            margin-top: 10px;
        }
        
        .search-result-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .search-result-item:hover {
            background-color: #f5f5f7;
        }
        
        .search-result-item img {
            width: 60px;
            height: 60px;
            object-fit: contain;
            background-color: #f5f5f7;
            border-radius: 8px;
            margin-left: 15px;
        }
        
        .search-result-details h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        
        .search-result-details p {
            margin: 0;
            color: var(--apple-blue);
            font-weight: 500;
        }
        
        .no-results {
            text-align: center;
            padding: 30px;
            color: var(--apple-gray);
        }
        
        .no-results i {
            font-size: 30px;
            margin-bottom: 10px;
            opacity: 0.5;
        }
        
        .close-search {
            color: white;
            font-size: 28px;
            margin-right: 15px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.3s;
            align-self: flex-end;
            margin-top: -40px;
            position: relative;
            z-index: 1002;
        }
        
        .close-search:hover {
            opacity: 1;
        }
        
        .auth-modal {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1002;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        
        .auth-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .auth-content {
            background-color: white;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            position: relative;
            transform: translateY(-20px);
            transition: transform 0.3s;
        }
        
        .auth-modal.show .auth-content {
            transform: translateY(0);
        }
        
        .close-auth {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 24px;
            cursor: pointer;
            color: var(--apple-gray);
        }
        
        .auth-content h3 {
            margin-bottom: 1.5rem;
            text-align: center;
            color: var(--apple-black);
        }
        
        .auth-form input {
            display: block;
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        
        .auth-form button {
            width: 100%;
            padding: 12px;
            background-color: var(--apple-blue);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .auth-form button:hover {
            background-color: #0058b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 113, 227, 0.3);
        }
        
        .auth-form p {
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
        }
        
        .switch-to-register, .switch-to-login {
            color: var(--apple-blue);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .switch-to-register:hover, .switch-to-login:hover {
            color: #0058b9;
            text-decoration: underline;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification.success i {
            color: #4CAF50;
        }
        
        .notification.info i {
            color: var(--apple-blue);
        }
        
        .notification.error i {
            color: #f44336;
        }
        
        .notification p {
            margin: 0;
            font-size: 14px;
        }
        
        .close-notification {
            color: #aaa;
            font-size: 20px;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .close-notification:hover {
            color: #777;
        }
        
        .cart-counter {
            position: absolute;
            top: -8px;
            left: -8px;
            background-color: var(--apple-blue);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
    
    document.head.appendChild(style);
});

// التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    const user = localStorage.getItem('user');
    
    if (user) {
        const userData = JSON.parse(user);
        updateLoggedInUI(userData.name);
    }
}

// تعيين معرفات فريدة للمنتجات
function assignProductIds() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // التحقق من وجود معرف
        if (!card.dataset.id) {
            // تعيين معرف فريد
            const category = card.closest('.featured-products').id;
            card.dataset.id = `${category}-${index}`;
        }
    });
}

// إضافة قائمة متنقلة للشاشات الصغيرة
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const mobileMenuButton = document.createElement('div');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';

        const navbar = document.querySelector('.navbar');
        navbar.insertBefore(mobileMenuButton, navbar.firstChild);

        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        const navLinks = document.querySelector('.nav-links').cloneNode(true);
        mobileMenu.appendChild(navLinks);

        document.body.appendChild(mobileMenu);

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // إضافة الأنماط للقائمة
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-button {
                display: block;
                cursor: pointer;
                font-size: 24px;
                color: white;
                transition: all 0.3s;
            }
            
            .mobile-menu-button:hover {
                color: var(--apple-blue);
                transform: scale(1.1);
            }
            
            .mobile-menu {
                position: fixed;
                top: 60px;
                right: -100%;
                width: 80%;
                height: calc(100vh - 60px);
                background-color: var(--apple-black);
                z-index: 999;
                transition: right 0.3s ease;
                padding: 2rem;
                overflow-y: auto;
            }
            
            .mobile-menu.active {
                right: 0;
            }
            
            .mobile-menu .nav-links {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            
            .mobile-menu .nav-links li {
                margin-bottom: 1.5rem;
            }
            
            .mobile-menu .nav-links a {
                font-size: 18px;
                color: white;
                opacity: 0.8;
                transition: all 0.3s;
            }
            
            .mobile-menu .nav-links a:hover {
                opacity: 1;
                color: var(--apple-blue);
                transform: translateX(-5px);
            }
            
            body.menu-open {
                overflow: hidden;
            }
        `;

        document.head.appendChild(style);
    }
};

// تفعيل القائمة المتنقلة عند تحميل الصفحة
window.addEventListener('load', createMobileMenu);

// تحديث القائمة عند تغيير حجم الشاشة
window.addEventListener('resize', () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (window.innerWidth > 768 && mobileMenuButton && mobileMenu) {
        mobileMenuButton.remove();
        mobileMenu.remove();
        document.body.classList.remove('menu-open');
    } else if (window.innerWidth <= 768 && !mobileMenuButton) {
        createMobileMenu();
    }
});