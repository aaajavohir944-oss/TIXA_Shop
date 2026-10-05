const tg = window.Telegram.WebApp;
tg.expand();

let selectedProductData = null;

// Telegram foydalanuvchi ismini chiqarish
document.addEventListener('DOMContentLoaded', () => {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('user-fullname').innerText = `${user.first_name} ${user.last_name || ''}`;
    }
});

// Tovar tanlash
function selectProduct(cardElement, name, price) {
    document.querySelectorAll('.product-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');

    selectedProductData = { name, price };
    
    const buyBtn = document.getElementById('buy-btn');
    buyBtn.removeAttribute('disabled');
    buyBtn.innerText = `Sotib olish — ${price.toLocaleString()} UZS`;
}

// Orderni yuborish
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
        price: selectedProductData.price
    };

    tg.sendData(JSON.stringify(payload));
}

function checkAccount() {
    const userId = document.getElementById('mlbb-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();

    if (userId && zoneId) {
        tg.showAlert(`Tekshirilmoqda: ID ${userId} (${zoneId})`);
    } else {
        tg.showAlert("Iltimos, ID va Serverni to'liq kiriting!");
    }
}
