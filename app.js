const tg = window.Telegram.WebApp;
tg.expand();

let selectedProductData = null;

// Foydalanuvchi ismini chiqarish
document.addEventListener('DOMContentLoaded', () => {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('user-fullname').innerText = `${user.first_name} ${user.last_name || ''}`;
    }
});

// SAHIFALARNI ALMASHTIRISH (Bottom Nav)
function switchPage(pageId) {
    // Barcha sahifalarni yashirish
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Tanlangan sahifani ko'rsatish
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.style.display = 'block';
    }

    // Navigatsiya tugmalari faolligini yangilash
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    const pages = ['home', 'wallet', 'history', 'profile'];
    const activeIndex = pages.indexOf(pageId);
    if (activeIndex !== -1) {
        navItems[activeIndex].classList.add('active');
    }

    // Sticky Buy tugmasini faqat Bosh sahifada ko'rsatish
    const stickyBar = document.getElementById('sticky-bar');
    if (pageId === 'home') {
        stickyBar.style.display = 'block';
    } else {
        stickyBar.style.display = 'none';
    }
}

// MINTAQA / TIL TABS TUGMASI
function selectTab(element) {
    document.querySelectorAll('.region-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    tg.HapticFeedback.impactOccurred('light');
}

// TOVAR TANLASH
function selectProduct(cardElement, name, price) {
    document.querySelectorAll('.product-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');

    selectedProductData = { name, price };
    
    const buyBtn = document.getElementById('buy-btn');
    buyBtn.removeAttribute('disabled');
    buyBtn.innerText = `Sotib olish — ${price.toLocaleString()} UZS`;
    tg.HapticFeedback.selectionChanged();
}

// ORDER YUBORISH
function submitOrder() {
    const userId = document.getElementById('mlbb-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();

    if (!userId || !zoneId) {
        tg.showAlert("⚠️ Iltimos, O'YINCHI ID va SERVER ID ni kiriting!");
        return;
    }

    if (!selectedProductData) {
        tg.showAlert("Iltimos, mahsulotni tanlang!");
        return;
    }

    const payload = {
        user_id: userId,
        zone_id: zoneId,
        product: selectedProductData.name,
        price: `${selectedProductData.price.toLocaleString()} UZS`
    };

    tg.sendData(JSON.stringify(payload));
}

// ID TEKSHIRISH
function checkAccount() {
    const userId = document.getElementById('mlbb-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();

    if (userId && zoneId) {
        tg.showAlert(`✅ ID: ${userId} (${zoneId})\nHisob topildi!`);
    } else {
        tg.showAlert("⚠️ Iltimos, ID va Serverni kiriting!");
    }
}

// QO'SHIMCHA SOZLAMALAR
function fillBalance() {
    tg.showAlert("💳 Balansni to'ldirish tizimi yaqin orada ishga tushadi!");
}

function changeLang() {
    tg.showAlert("🌐 Hozircha asosiy til: O'zbek tili");
}

function changeCurrency() {
    tg.showAlert("💰 Asosiy valyuta: UZS (So'm)");
}

function contactSupport() {
    tg.showAlert("👨‍💻 Qo'llab-quvvatlash xizmati: @jarvis_analitika_bot");
}
