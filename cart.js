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

    // تنفيذ البحث عند الضغط على Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            // الانتقال للصفحة الرئيسية مع معيار البحث
            searchContainer.style.transform = 'scale(0.5)';
            searchContainer.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }, 300);
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

// تفعيل حساب المستخدم
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
        }, 300);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('input[type="text"]').value;
        
        // محاكاة عملية إنشاء الحساب
        authModal.classList.remove('show');
        
        setTimeout(() => {
            authModal.remove();
            
            // عرض رسالة نجاح إنشاء الحساب
            showNotification(`تم إنشاء حسابك بنجاح! مرحباً بك ${name}`, 'success');
            
            // تحديث واجهة المستخدم بعد تسجيل الدخول
            updateLoggedInUI(name);
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

// وظائف سلة التسوق
document.addEventListener('DOMContentLoaded', function() {
    // عرض سلة التسوق
    displayCart();
    updateCartCounter();
});

// عرض سلة التسوق
function displayCart() {
    const cartContent = document.getElementById('cart-content');
    const cart = getCartItems();
    
    if (cart.length === 0) {
        // إذا كانت السلة فارغة
        cartContent.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h3>سلة التسوق فارغة</h3>
                <p>لم تقم بإضافة أي منتجات إلى سلة التسوق</p>
                <a href="index.html" class="btn">العودة للتسوق</a>
            </div>
        `;
    } else {
        // إذا كانت السلة تحتوي على منتجات
        let cartHTML = `
            <div class="cart-layout">
                <div class="cart-items-container">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>السعر</th>
                                <th>الكمية</th>
                                <th>المجموع</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <tr data-id="${item.id}">
                    <td>
                        <div style="display: flex; align-items: center;">
                            <img src="${item.image}" alt="${item.name}" class="product-img-small">
                            <div class="product-details">
                                <h4>${item.name}</h4>
                                <span class="product-price">${item.price} شيكل</span>
                            </div>
                        </div>
                    </td>
                    <td>${item.price} شيكل</td>
                    <td>
                        <div class="qty-control">
                            <button class="qty-btn decrease-qty">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" readonly>
                            <button class="qty-btn increase-qty">+</button>
                        </div>
                    </td>
                    <td class="item-total">${itemTotal} شيكل</td>
                    <td>
                        <button class="remove-btn" title="إزالة من السلة"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
        });
        
        cartHTML += `
                        </tbody>
                    </table>
                </div>
                
                <div class="cart-summary">
                    <h3 class="summary-title">ملخص الطلب</h3>
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span>${subtotal} شيكل</span>
                    </div>
                    <div class="summary-row">
                        <span>الشحن:</span>
                        <span>${subtotal > 5000 ? 'مجاني' : '50 شيكل'}</span>
                    </div>
                    <div class="summary-row">
                        <span>الضريبة (16%):</span>
                        <span>${Math.round(subtotal * 0.16)} شيكل</span>
                    </div>
                    <div class="summary-row total">
                        <span>المجموع الكلي:</span>
                        <span>${subtotal > 5000 ? Math.round(subtotal * 1.16) : Math.round(subtotal * 1.16) + 50} شيكل</span>
                    </div>
                    <button class="checkout-btn">إتمام الشراء</button>
                    <a href="index.html" class="continue-shopping">متابعة التسوق</a>
                </div>
            </div>
        `;
        
        cartContent.innerHTML = cartHTML;
        
        // تفعيل أزرار الكمية
        const decreaseButtons = document.querySelectorAll('.decrease-qty');
        const increaseButtons = document.querySelectorAll('.increase-qty');
        const removeButtons = document.querySelectorAll('.remove-btn');
        const checkoutButton = document.querySelector('.checkout-btn');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', removeCartItem);
        });
        
        checkoutButton.addEventListener('click', processCheckout);
    }
}

// زيادة الكمية
function increaseQuantity(e) {
    const row = e.target.closest('tr');
    const id = row.dataset.id;
    const inputEl = row.querySelector('.qty-input');
    let quantity = parseInt(inputEl.value);
    
    if (quantity < 10) {
        quantity++;
        inputEl.value = quantity;
        updateCartItemQuantity(id, quantity);
        updateRowTotal(row, quantity);
        displayCart(); // تحديث العرض بالكامل
    }
}

// إنقاص الكمية
function decreaseQuantity(e) {
    const row = e.target.closest('tr');
    const id = row.dataset.id;
    const inputEl = row.querySelector('.qty-input');
    let quantity = parseInt(inputEl.value);
    
    if (quantity > 1) {
        quantity--;
        inputEl.value = quantity;
        updateCartItemQuantity(id, quantity);
        updateRowTotal(row, quantity);
        displayCart(); // تحديث العرض بالكامل
    }
}

// تحديث مجموع الصف
function updateRowTotal(row, quantity) {
    const priceEl = row.querySelector('.product-price');
    const price = parseFloat(priceEl.textContent.split(' ')[0]);
    const totalEl = row.querySelector('.item-total');
    
    totalEl.textContent = `${price * quantity} شيكل`;
}

// إزالة عنصر من السلة
function removeCartItem(e) {
    const row = e.target.closest('tr');
    const id = row.dataset.id;
    
    removeFromCart(id);
    displayCart();
    updateCartCounter();
    
    showNotification('تم إزالة المنتج من السلة بنجاح', 'success');
}

// معالجة عملية الشراء
function processCheckout() {
    // محاكاة عملية الشراء
    localStorage.removeItem('cart');
    
    // عرض رسالة نجاح
    const cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = `
        <div class="empty-cart-message" style="background-color: #f8fffa; border-radius: 12px; box-shadow: var(--box-shadow); padding: 40px 20px;">
            <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 60px;"></i>
            <h3>تم إتمام عملية الشراء بنجاح!</h3>
            <p>سيتم إرسال تفاصيل طلبك إلى بريدك الإلكتروني. شكراً لتسوقك معنا.</p>
            <a href="index.html" class="btn">العودة للتسوق</a>
        </div>
    `;
    
    // تحديث عداد السلة
    updateCartCounter();
}

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

// إزالة منتج من السلة
function removeFromCart(productId) {
    let cart = getCartItems();
    
    // إزالة المنتج من السلة
    cart = cart.filter(item => item.id !== productId);
    
    // حفظ السلة في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تحديث كمية منتج في السلة
function updateCartItemQuantity(productId, quantity) {
    const cart = getCartItems();
    
    // العثور على المنتج وتحديث الكمية
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        
        // حفظ السلة في localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// تحديث عداد السلة
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
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

// إضافة أنماط CSS للإشعارات
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    
    document.head.appendChild(style);
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${email}&password=${password}`
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("loginMessage").textContent = data.message;
            if (data.status === "success") {
                window.location.href = "dashboard.html"; // توجيه المستخدم بعد تسجيل الدخول
            }
        })
        .catch(error => console.error("Error:", error));
});
