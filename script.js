let userId = null; // ID пользователя из Telegram
let balance = 0;
let energy = 100;
let clickMultiplier = 1;
let energyUpgradeCost = 200;
let clickUpgradeCost = 200;
let clickPower = 3;

// Функция для загрузки данных пользователя
async function loadUserData() {
    if (!userId) return alert("Сначала авторизуйтесь через Telegram.");
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) return alert("Ошибка при загрузке данных пользователя.");
    const data = await response.json();
    balance = data.balance || 0;
    energy = data.energy || 100;
    clickMultiplier = data.clickMultiplier || 1;
    energyUpgradeCost = data.energyUpgradeCost || 200;
    clickUpgradeCost = data.clickUpgradeCost || 200;
    clickPower = data.clickPower || 3;
    updateUI();
}

// Клик по монетке
function clickCoin() {
    if (energy <= 0) return alert("У вас нет энергии!");
    balance += clickMultiplier;
    energy -= 1;
    saveUserData();
    updateUI();
}

// Подключение через Telegram
function connectTelegramWallet() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (!tg.initDataUnsafe) {
            alert("Ошибка инициализации Telegram Web App. Попробуйте снова.");
            return;
        }
        userId = tg.initDataUnsafe.user.id; // Получаем ID пользователя
        alert(`Вы успешно авторизовались через Telegram! Ваш ID: ${userId}`);
        loadUserData(); // Загружаем данные пользователя после авторизации
    } else {
        alert("Эта игра работает только внутри Telegram. Пожалуйста, откройте её через бота.");
    }
}

// Автоматическая авторизация через Telegram
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    if (tg.initDataUnsafe) {
        userId = tg.initDataUnsafe.user.id; // Автоматическая авторизация через Telegram
        loadUserData();
    } else {
        alert("Ошибка инициализации Telegram Web App. Попробуйте снова.");
    }
} else {
    alert("Эта игра работает только внутри Telegram. Пожалуйста, откройте её через бота.");
}

// Сохранение данных пользователя
async function saveUserData() {
    if (!userId) return alert("Сначала авторизуйтесь через Telegram.");
    const userData = {
        balance,
        energy,
        clickMultiplier,
        energyUpgradeCost,
        clickUpgradeCost,
        clickPower,
    };
    const response = await fetch(`/api/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) alert("Ошибка при сохранении данных пользователя.");
}

// Обновление интерфейса
function updateUI() {
    document.getElementById("balance").textContent = Math.floor(balance);
    document.getElementById("energy").textContent = energy;
    document.getElementById("energy-upgrade-cost").textContent = energyUpgradeCost;
    document.getElementById("click-upgrade-cost").textContent = clickUpgradeCost;
}
