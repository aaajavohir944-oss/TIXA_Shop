// Telegram Web App obyekti
const tg = window.Telegram.WebApp;
tg.expand(); // Ekran bo'ylab yozish

// Valyuta kurslari (Bazaviy narx USD da)
const rates = {
    "USD": 1,
    "UZS": 12800, // 1 USD = 12,800 UZS
    "RUB": 95     // 1 USD = 95 RUB
};

let currentCurrency = "UZS";

// Valyuta o'zgarganda narxlarni hisoblash
function changeCurrency() {
    currentCurrency = document.getElementById('currency-select').value;
    updatePrices();
}

function updatePrices() {
    const rate = rates[currentCurrency];
    const symbol = currentCurrency === 'UZS' ? "so'm" : (currentCurrency === 'RUB' ? "₽" : "$");

    document.getElementById('price-pass').innerText = (1.99 * rate).toLocaleString() + " " + symbol;
    document.getElementById('price-86').innerText = (1.40 * rate).toLocaleString() + " " + symbol;
    document.getElementById('price-257').innerText = (4.00 * rate).toLocaleString() + " " + symbol;
    document.getElementById('price-706').innerText = (10.00 * rate).toLocaleString() + " " + symbol;
}

// Tovar tanlanganda Telegram Botga ma'lumot yuborish
function selectProduct(productName, priceUsd) {
    const mlbbId = document.getElementById('mlbb-id').value;
    const zoneId = document.getElementById('zone-id').value;

    if (!mlbbId || !zoneId) {
        alert("Iltimos, avval MLBB User ID va Zone ID raqamingizni kiriting!");
        return;
    }

    const priceConverted = (priceUsd * rates[currentCurrency]).toLocaleString();

    const orderData = {
        product: productName,
        price: priceConverted,
        currency: currentCurrency,
        id: mlbbId,
        zone: zoneId
    };

    // Botga ma'lumotni JSON formatda qaytarish
    tg.sendData(JSON.stringify(orderData));
}

// Dastlabki narxlarni o'rnatish
updatePrices(); 
