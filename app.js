const tg = window.Telegram.WebApp;
tg.expand();

// Valyuta kurslari (Asosiy baza: UZS)
const exchangeRates = {
    UZS: 1,
    USD: 12800,  // 1 USD = 12,800 UZS
    RUB: 135     // 1 RUB = 135 UZS
};

let currentLang = 'uz';
let currentCurrency = 'UZS';
let selectedProductCard = null;

// Til tarjimalari lug'ati
const translations = {
    uz: {
        balanceLabel: "Topup balance",
        topupBtn: "To'ldirish",
        langTitle: "TIL VA VALYUTA",
        labelId: "O'YINCHI ID",
        labelServer: "SERVER ID",
        inputPlaceholderId: "ID kiriting",
        inputPlaceholderServer: "Server ID kiriting",
        checkBtn: "Tekshirish",
        productsTitle: "MAHSULOTNI TANLANG",
        walletTitle: "Joriy balans",
        topupAction: "+ Balansni to'ldirish (Payme / Click)",
        historyTitle: "XARIDLAR TARIXI",
        historyEmpty: "Hozircha xaridlar tarixi mavjud emas.",
        supportBtn: "Qo'llab-quvvatlash",
        navHome: "Bosh sahifa",
        navWallet: "Hamyon",
        navHistory: "Tarix",
        navProfile: "Profil",
        buyBtnDefault: "Sotib olish",
        buyBtnFormat: (title, priceStr) => `Sotib olish — ${priceStr}`,
        alertFillIds: "⚠️ Iltimos, O'YINCHI ID va SERVER ID ni kiriting!",
        alertSelectProduct: "Iltimos, mahsulotni tanlang!",
        confirmOrder: (title, priceStr, id, server) => `Xaridni tasdiqlaysizmi?\n\n💎 Mahsulot: ${title}\n💰 Narxi: ${priceStr}\n👤 ID: ${id} (${server})`,
        idFound: (id, server) => `✅ ID: ${id} (${server})\nHisob topildi!`
    },
    ru: {
        balanceLabel: "Баланс пополнения",
        topupBtn: "Пополнить",
        langTitle: "ЯЗЫК И ВАЛЮТА",
        labelId: "ID ИГРОКА",
        labelServer: "ID СЕРВЕРА",
        inputPlaceholderId: "Введите ID",
        inputPlaceholderServer: "Введите Server ID",
        checkBtn: "Проверить",
        productsTitle: "ВЫБЕРИТЕ ТОВАР",
        walletTitle: "Текущий баланс",
        topupAction: "+ Пополнить баланс (Payme / Click)",
        historyTitle: "ИСТОРИЯ ПОКУПОК",
        historyEmpty: "История покупок пока пуста.",
        supportBtn: "Служба поддержки",
        navHome: "Главная",
        navWallet: "Кошелек",
        navHistory: "История",
        navProfile: "Профиль",
        buyBtnDefault: "Купить",
        buyBtnFormat: (title, priceStr) => `Купить — ${priceStr}`,
        alertFillIds: "⚠️ Пожалуйста, введите ID ИГРОКА и ID СЕРВЕРА!",
        alertSelectProduct: "Пожалуйста, выберите товар!",
        confirmOrder: (title, priceStr, id, server) => `Подтверждаете покупку?\n\n💎 Товар: ${title}\n💰 Цена: ${priceStr}\n👤 ID: ${id} (${server})`,
        idFound: (id, server) => `✅ ID: ${id} (${server})\nАккаунт найден!`
    },
    en: {
        balanceLabel: "Topup balance",
        topupBtn: "Top up",
        langTitle: "LANGUAGE & CURRENCY",
        labelId: "PLAYER ID",
        labelServer: "SERVER ID",
        inputPlaceholderId: "Enter Player ID",
        inputPlaceholderServer: "Enter Server ID",
        checkBtn: "Check",
        productsTitle: "SELECT PRODUCT",
        walletTitle: "Current balance",
        topupAction: "+ Top up balance (Payme / Click)",
        historyTitle: "PURCHASE HISTORY",
        historyEmpty: "No purchase history available yet.",
        supportBtn: "Support",
        navHome: "Home",
        navWallet: "Wallet",
        navHistory: "History",
        navProfile: "Profile",
        buyBtnDefault: "Buy Now",
        buyBtnFormat: (title, priceStr) => `Buy Now — ${priceStr}`,
        alertFillIds: "⚠️ Please enter PLAYER ID and SERVER ID!",
        alertSelectProduct: "Please select a product!",
        confirmOrder: (title, priceStr, id, server) => `Confirm purchase?\n\n💎 Item: ${title}\n💰 Price: ${priceStr}\n👤 ID: ${id} (${server})`,
        idFound: (id, server) => `✅ ID: ${id} (${server})\nAccount found!`
    }
};

// Dastur yuklanganda foydalanuvchi ismini olish
document.addEventListener('DOMContentLoaded', () => {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('user-fullname').innerText = `${user.first_name} ${user.last_name || ''}`;
    }
    updateUI();
});

// TILNI O'ZGAR T IRISH
function setLanguage(lang, element) {
    currentLang = lang;
    element.parentElement.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    updateUI();
    tg.HapticFeedback.impactOccurred('light');
}

// VALYUTANI O'ZGAR T IRISH (KURS BO'YICHA)
function setCurrency(currency, element) {
    currentCurrency = currency;
    element.parentElement.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    updateUI();
    tg.HapticFeedback.impactOccurred('light');
}

// FORMATLANGAN NARX O'GIRISH
function formatPrice(baseUzs) {
    const rate = exchangeRates[currentCurrency];
    const converted = baseUzs / rate;

    if (currentCurrency === 'UZS') {
        return `${Math.round(converted).toLocaleString()} UZS`;
    } else if (currentCurrency === 'USD') {
        return `$${converted.toFixed(2)}`;
    } else if (currentCurrency === 'RUB') {
        return `${Math.round(converted).toLocaleString()} ₽`;
    }
}

// UI VA NAMLARNI YANGILASH
function updateUI() {
    const t = translations[currentLang];

    document.getElementById('txt-balance-label').innerText = t.balanceLabel;
    document.getElementById('txt-topup-btn').innerText = t.topupBtn;
    document.getElementById('txt-lang-title').innerText = t.langTitle;
    document.getElementById('txt-label-id').innerText = t.labelId;
    document.getElementById('txt-label-server').innerText = t.labelServer;
    document.getElementById('mlbb-id').placeholder = t.inputPlaceholderId;
    document.getElementById('zone-id').placeholder = t.inputPlaceholderServer;
    document.getElementById('txt-check-btn').innerText = t.checkBtn;
    document.getElementById('txt-products-title').innerText = t.productsTitle;
    document.getElementById('txt-wallet-title').innerText = t.walletTitle;
    document.getElementById('txt-topup-action').innerText = t.topupAction;
    document.getElementById('txt-history-title').innerText = t.historyTitle;
    document.getElementById('txt-history-empty').innerText = t.historyEmpty;
    document.getElementById('txt-support-btn').innerText = t.supportBtn;

    document.getElementById('nav-home').innerText = t.navHome;
    document.getElementById('nav-wallet').innerText = t.navWallet;
    document.getElementById('nav-history').innerText = t.navHistory;
    document.getElementById('nav-profile').innerText = t.navProfile;

    document.getElementById('user-balance').innerText = formatPrice(0);
    document.getElementById('wallet-balance-disp').innerText = formatPrice(0);

    // Barcha mahsulot kartalaridagi narx va nomlarni yangilash
    document.querySelectorAll('.product-card').forEach(card => {
        const baseUzs = parseFloat(card.getAttribute('data-base-uzs'));
        const nameAttr = card.getAttribute(`data-name-${currentLang}`) || card.getAttribute('data-name-uz');
        
        card.querySelector('.prod-title').innerText = nameAttr;
        card.querySelector('.prod-price').innerText = formatPrice(baseUzs);

        const badge = card.querySelector('.badge');
        if (badge) {
            badge.innerText = badge.getAttribute(`data-badge-${currentLang}`) || badge.getAttribute('data-badge-uz');
        }
    });

    // Sticky Buy tugmasini yangilash
    const buyBtn = document.getElementById('buy-btn');
    if (selectedProductCard) {
        const baseUzs = parseFloat(selectedProductCard.getAttribute('data-base-uzs'));
        const nameAttr = selectedProductCard.getAttribute(`data-name-${currentLang}`) || selectedProductCard.getAttribute('data-name-uz');
        buyBtn.innerText = t.buyBtnFormat(nameAttr, formatPrice(baseUzs));
    } else {
        buyBtn.innerText = t.buyBtnDefault;
    }
}

// MAHSULOT TANLASH
function selectProduct(cardElement) {
    document.querySelectorAll('.product-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');
    selectedProductCard = cardElement;

    const buyBtn = document.getElementById('buy-btn');
    buyBtn.removeAttribute('disabled');
    updateUI();
    tg.HapticFeedback.selectionChanged();
}

// BUYURTMANI YUBORISH
function submitOrder() {
    const t = translations[currentLang];
    const userId = document.getElementById('mlbb-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();

    if (!userId || !zoneId) {
        tg.showAlert(t.alertFillIds);
        return;
    }

    if (!selectedProductCard) {
        tg.showAlert(t.alertSelectProduct);
        return;
    }

    const baseUzs = parseFloat(selectedProductCard.getAttribute('data-base-uzs'));
    const productName = selectedProductCard.getAttribute(`data-name-${currentLang}`) || selectedProductCard.getAttribute('data-name-uz');
    const priceFormatted = formatPrice(baseUzs);

    tg.showConfirm(t.confirmOrder(productName, priceFormatted, userId, zoneId), (confirmed) => {
        if (confirmed) {
            const payload = {
                user_id: userId,
                zone_id: zoneId,
                product: productName,
                price: priceFormatted,
                currency: currentCurrency,
                lang: currentLang
            };
            tg.sendData(JSON.stringify(payload));
        }
    });
}

// SAHIFALARNI ALMASHTIRISH (Bottom Nav)
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.style.display = 'block';
    }

    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    const pages = ['home', 'wallet', 'history', 'profile'];
    const activeIndex = pages.indexOf(pageId);
    if (activeIndex !== -1) {
        navItems[activeIndex].classList.add('active');
    }

    const stickyBar = document.getElementById('sticky-bar');
    stickyBar.style.display = (pageId === 'home') ? 'block' : 'none';
}

// ID TEKSHIRISH
function checkAccount() {
    const t = translations[currentLang];
    const userId = document.getElementById('mlbb-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();

    if (userId && zoneId) {
        tg.showAlert(t.idFound(userId, zoneId));
    } else {
        tg.showAlert(t.alertFillIds);
    }
}

function fillBalance() {
    tg.showAlert("💳 Payme / Click / Crypto...");
}

function contactSupport() {
    tg.showAlert("👨‍💻 Qo'llab-quvvatlash xizmati: @jarvis_analitika_bot");
}
