// 1. التحكم في الشاشة الافتتاحية والتلاشي بعد 3 ثوانٍ
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        const mainSite = document.getElementById("main-site");
        if (splash) {
            splash.style.opacity = "0";
            setTimeout(() => {
                splash.classList.add("hidden");
                if (mainSite) mainSite.classList.remove("hidden");
            }, 500);
        }
    }, 3000);
});

// 2. نظام التبديل الصحيح بين الأقسام الـ 3
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.style.display = 'grid';
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// 3. أنيميشن طيران المنتج إلى السلة
let cartCount = 0;
let currentCartItems = [];

function addToCart(button) {
    const card = button.closest('.product-card');
    const prodImg = card.querySelector('.product-image');
    const prodName = card.getAttribute('data-name');
    const prodPrice = card.getAttribute('data-price');
    
    currentCartItems.push({ name: prodName, price: prodPrice });

    const flyingImg = prodImg.cloneNode();
    flyingImg.classList.add('flying-product-node');
    document.body.appendChild(flyingImg);

    const imgRect = prodImg.getBoundingClientRect();
    const cartBin = document.getElementById('cart-bin');
    const cartRect = cartBin.getBoundingClientRect();

    flyingImg.style.top = `${imgRect.top + window.scrollY}px`;
    flyingImg.style.left = `${imgRect.left + window.scrollX}px`;

    setTimeout(() => {
        flyingImg.style.top = `${cartRect.top + window.scrollY + 10}px`;
        flyingImg.style.left = `${cartRect.left + window.scrollX + 10}px`;
        flyingImg.style.transform = 'scale(0.1) rotate(360deg)';
    }, 50);

    flyingImg.addEventListener('transitionend', () => {
        flyingImg.remove();
        cartCount++;
        document.getElementById('cart-count').innerText = cartCount;
    });
}

// 4. تفاعل المساعد الذكي
function annoyAssistant() {
    const head = document.querySelector('.assistant-character');
    const bubble = document.getElementById('bubble');
    
    if (head && bubble) {
        head.classList.add('shake-head');
        head.addEventListener('animationend', () => {
            head.classList.remove('shake-head');
        }, { once: true });

        bubble.classList.add('show');
        setTimeout(() => {
            bubble.classList.remove('show');
        }, 2000);
    }
}

// 5. فتح نافذة الشراء والتحقق من البيانات
document.getElementById('cart-bin').addEventListener('click', () => {
    if (currentCartItems.length === 0) {
        alert("سلة المشتريات فارغة حالياً!");
        return;
    }
    
    let total = currentCartItems.reduce((sum, item) => sum + parseInt(item.price), 0);
    let name = prompt("برجاء إدخال الاسم بالكامل للطلب:");
    if (!name) return;
    
    let phone = prompt("برجاء إدخال رقم هاتف واتساب (11 رقم يبدأ بـ 01):");
    const phoneRegex = /^01[0-9]{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
        alert("رقم الهاتف غير صحيح! يجب أن يتكون من 11 رقم ويبدأ بـ 01");
        return;
    }

    let address = prompt("برجاء كتابة عنوان الاستلام بالتفصيل:");
    if (!address) return;

    let payment = prompt("اختر طريقة الدفع (عند الاستلام / فودافون كاش / انستا باي):", "عند الاستلام");

    let productsText = currentCartItems.map((item, index) => `${index + 1}- ${item.name} (${item.price} ج.م)`).join('%0A');
    const targetWhatsApp = "01017674108";
    
    const textMessage = `🚨 *طلب جديد من ELkady store* 🚨%0A%0A` +
                        `👤 *الاسم:* ${name}%0A` +
                        `📞 *الرقم:* ${phone}%0A` +
                        `📍 *العنوان:* ${address}%0A` +
                        `💳 *طريقة الدفع:* ${payment}%0A%0A` +
                        `🛒 *المنتجات المطلوبة:*%0A${productsText}%0A%0A` +
                        `💰 *الإجمالي:* ${total} ج.م`;

    window.open(`https://wa.me{targetWhatsApp}?text=${textMessage}`, '_blank');
    
    currentCartItems = [];
    cartCount = 0;
    document.getElementById('cart-count').innerText = "0";
});

// 6. لوحة التحكم المحمية
let currentAdminPassword = "Alaa123890A";
function openAdmin() {
    let pass = prompt("أدخل باسوورد لوحة التحكم الأمنية:");
    if (pass === currentAdminPassword) {
        alert("تم الدخول بنجاح! يمكنك الآن تعديل وإدارة المتجر.");
        let newPass = prompt("إذا كنت تريد تغيير الباسوورد، اكتب الجديد هنا (أو اضغط إلغاء):");
        if (newPass) {
            currentAdminPassword = newPass;
            alert("تم تغيير الباسوورد بنجاح!");
        }
    } else {
        alert("الباسوورد غير صحيح!");
    }
}
