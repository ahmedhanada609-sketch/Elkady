// إخفاء الشاشة الافتتاحية بعد 3 ثوانٍ
setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
        splash.style.opacity = 0;
        setTimeout(() => splash.style.display = 'none', 500);
    }
}, 3000);

// جلب المنتجات والأسعار الحركية الحية من قاعدة بيانات SQL المدمجة
let products = SQLStorage.getProducts();
let cart = [];

function loadProducts() {
    for (let cat in products) {
        const container = document.getElementById(cat);
        if (!container) continue;
        container.innerHTML = '';
        products[cat].forEach((p) => {
            container.innerHTML += `
                <div class="product-card">
                    <img src="https://placeholder.com" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <div class="price">${p.price} جنيه</div>
                    <button class="btn-buy" onclick="addToCart('${p.name}', ${p.price}, event)">إضافة للسلة</button>
                </div>
            `;
        });
    }
}

function openTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// بناء الروبوت ثلاثي الأبعاد باليمين (Three.js) وظهور الرسالة وهز الرأس
let scene, camera, renderer, robotHead, robotBody;
let isShaking = false, shakeTime = 0;

function init3DRobot() {
    const container = document.getElementById('robot-3d-canvas');
    if(!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x00e5ff, 1.5);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const robotGroup = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00b0ff, roughness: 0.2, metalness: 0.8 });
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

    const bodyGeom = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 32);
    robotBody = new THREE.Mesh(bodyGeom, bodyMaterial);
    robotBody.position.y = -0.6;
    robotGroup.add(robotBody);

    const headGeom = new THREE.SphereGeometry(0.6, 32, 32);
    robotHead = new THREE.Mesh(headGeom, bodyMaterial);
    robotHead.position.y = 0.5;
    robotGroup.add(robotHead);

    const eyeGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    leftEye.position.set(-0.3, 0.55, 0.45);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    rightEye.position.set(0.1, 0.55, 0.5);
    robotGroup.add(leftEye, rightEye);

    scene.add(robotGroup);
    container.addEventListener('click', talkCharacter);

    function animate() {
        requestAnimationFrame(animate);
        if (!isShaking) {
            robotGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
            robotHead.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.04;
        } else {
            shakeTime += 0.5;
            robotHead.rotation.z = Math.sin(shakeTime) * 0.3;
            if(shakeTime > 15) {
                isShaking = false;
                robotHead.rotation.z = 0;
            }
        }
        renderer.render(scene, camera);
    }
    animate();
}

function talkCharacter() {
    isShaking = true;
    shakeTime = 0;
    const bubble = document.getElementById('bubble');
    if (bubble) {
        bubble.style.display = 'block';
        setTimeout(() => { bubble.style.display = 'none'; }, 2000);
    }
}

// حركة المنتج فوق يد الروبوت وفوق السير متجهاً لليسار نحو السلة
function addToCart(name, price, event) {
    cart.push({name, price});
    document.getElementById('cart-count').innerText = cart.length;

    const ball = document.createElement('div');
    ball.className = 'flying-item';
    
    const robotArm = document.querySelector('.character-arm').getBoundingClientRect();
    const cartBox = document.querySelector('.cart-btn').getBoundingClientRect();

    ball.style.top = (robotArm.top + window.scrollY) + 'px';
    ball.style.left = robotArm.left + 'px';
    document.body.appendChild(ball);

    const moveX = cartBox.left - robotArm.left + 20;
    const moveY = cartBox.top - robotArm.top;

    setTimeout(() => {
        ball.style.transform = `translate(${moveX}px, ${moveY}px)`;
        ball.style.opacity = '0.3';
    }, 50);

    setTimeout(() => { ball.remove(); }, 1200);
}

function openCheckout() { document.getElementById('checkoutModal').style.display = 'flex'; }
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

function submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const method = document.getElementById('paymentMethod').value;

    const phoneRegex = /^01[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
        alert("تنبيه: يجب إدخال رقم هاتف مصري صحيح مكون من 11 رقم ويبدأ بـ 01");
        return;
    }

    if (cart.length === 0) { alert("سلة المشتريات فارغة!"); return; }

    let itemsText = cart.map(i => `- ${i.name} (${i.price} ج)`).join('%0A');
    let total = cart.reduce((sum, i) => sum + i.price, 0);

    let whatsappText = `طلب جديد من المتجر الإلكتروني 🛒%0A%0A`;
    whatsappText += `👤 الاسم: ${name}%0A`;
    whatsappText += `📞 الهاتف: ${phone}%0A`;
    whatsappText += `📍 العنوان: ${address}%0A`;
    whatsappText += `💳 الدفع: ${method}%0A%0A`;
    whatsappText += `📦 المنتجات المشتراة:%0A${itemsText}%0A%0A`;
    whatsappText += `💰 إجمالي الحساب: ${total} جنيه`;

    const adminWhatsapp = "201017674108"; 
    window.open(`https://wa.me{adminWhatsapp}?text=${whatsappText}`, '_blank');
    
    cart = [];
    document.getElementById('cart-count').innerText = 0;
    closeCheckout();
}

window.onload = () => {
    loadProducts();
    init3DRobot();
};
