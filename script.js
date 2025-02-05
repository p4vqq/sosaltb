let userId = null; // ID пользователя из TONKeeper
let balance = 0;
let energy = 100;
let clickMultiplier = 1;
let energyUpgradeCost = 200;
let clickUpgradeCost = 200;
let clickPower = 3;

// Функция для загрузки данных пользователя
async function loadUserData() {
    if (!userId) return alert("Сначала подключите свой кошелёк TONKeeper.");
    const response = await fetch(`https://p4vqq.pythonanywhere.com/api/user/${userId}`);
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

// Функция для сохранения данных пользователя
async function saveUserData() {
    if (!userId) return alert("Сначала подключите свой кошелёк TONKeeper.");
    const userData = {
        balance,
        energy,
        clickMultiplier,
        energyUpgradeCost,
        clickUpgradeCost,
        clickPower,
    };
    const response = await fetch(`https://p4vqq.pythonanywhere.com/api/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) alert("Ошибка при сохранении данных пользователя.");
}

// Подключение через TONKeeper
function connectWallet() {
    if (window.Tonkeeper) {
        window.Tonkeeper.request({ method: "ton_connect" })
            .then((result) => {
                userId = result.account.address;
                alert(`Вы успешно подключили кошелёк TONKeeper! Ваш адрес: ${userId}`);
                loadUserData();
            })
            .catch((error) => alert("Ошибка подключения к TONKeeper."));
    } else {
        alert("TONKeeper не обнаружен. Установите расширение TONKeeper для браузера.");
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById("balance").textContent = Math.floor(balance);
    document.getElementById("energy").textContent = energy;
    document.getElementById("energy-upgrade-cost").textContent = energyUpgradeCost;
    document.getElementById("click-upgrade-cost").textContent = clickUpgradeCost;
}

// Клик по монетке
function clickCoin() {
    if (energy <= 0) return alert("У вас нет энергии!");
    balance += clickMultiplier;
    energy -= 1;
    saveUserData();
    updateUI();
}

// Улучшение энергии
function upgradeEnergy() {
    if (balance < energyUpgradeCost) return alert("Недостаточно DA для покупки!");
    balance -= energyUpgradeCost;
    energy += 100;
    energyUpgradeCost *= 2;
    saveUserData();
    alert(`Вы купили улучшение энергии (+100). Новая стоимость: ${energyUpgradeCost} DA`);
    updateUI();
}

// Улучшение клика
function upgradeClick() {
    if (balance < clickUpgradeCost) return alert("Недостаточно DA для покупки!");
    balance -= clickUpgradeCost;
    clickMultiplier *= clickPower;
    clickUpgradeCost *= 2;
    clickPower -= 0.5;
    if (clickPower < 1.5) clickPower = 1.5;
    saveUserData();
    alert(`Вы улучшили клик x${clickMultiplier}. Новая стоимость: ${clickUpgradeCost} DA`);
    updateUI();
}

// Восстановление энергии
function restoreEnergy() {
    energy = 100;
    saveUserData();
    updateUI();
}

// Загрузка данных при старте игры
loadUserData();
