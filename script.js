// Initialize wallet data
let walletData = {
    balance: 0,
    btcBalance: 0,
    transactions: [],
    adminMode: false,
    profileName: "Мой профиль"
};

// Current filters
let currentFilters = {
    type: 'all',
    month: 'all',
    year: 'all',
    currency: 'all'
};

// Load data from localStorage if available
function loadWalletData() {
    const savedData = localStorage.getItem('cryptoWalletData');
    if (savedData) {
        walletData = JSON.parse(savedData);
    }
    updateUI();
}

// Save data to localStorage
function saveWalletData() {
    localStorage.setItem('cryptoWalletData', JSON.stringify(walletData));
    updateUI();
}

// Update UI with current data
function updateUI() {
    // Update balance
    document.getElementById('totalBalance').textContent = walletData.balance.toFixed(2) + ' USD';
    document.getElementById('cryptoBalance').textContent = walletData.btcBalance.toFixed(6) + ' BTC';
    
    // Apply filters and update transactions list
    applyFilters();
}

// Filter transactions based on current filters
function applyFilters() {
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const currencyFilter = document.getElementById('currencyFilter').value;
    
    currentFilters.month = monthFilter;
    currentFilters.year = yearFilter;
    currentFilters.currency = currencyFilter;
    
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    
    let filteredTransactions = walletData.transactions;
    
    // Apply type filter
    if (currentFilters.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === currentFilters.type);
    }
    
    // Apply month filter
    if (currentFilters.month !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === parseInt(currentFilters.month);
        });
    }
    
    // Apply year filter
    if (currentFilters.year !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => {
            const date = new Date(t.date);
            return date.getFullYear() === parseInt(currentFilters.year);
        });
    }
    
    // Apply currency filter
    if (currentFilters.currency !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.currency === currentFilters.currency);
    }
    
    // Display transactions
    filteredTransactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        transactionItem.innerHTML = `
            <div class="transaction-icon" style="background: ${transaction.type === 'receive' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};">
                <i class="fas ${transaction.type === 'receive' ? 'fa-arrow-down' : 'fa-arrow-up'}" 
                   style="color: ${transaction.type === 'receive' ? '#2ecc71' : '#e74c3c'};"></i>
            </div>
            <div class="transaction-info">
                <div class="transaction-title">${transaction.title}</div>
                <div class="transaction-details">${transaction.details}</div>
                <div class="transaction-date">${formattedDate}</div>
            </div>
            <div class="transaction-amount ${transaction.type === 'receive' ? 'positive' : 'negative'}">
                ${transaction.type === 'receive' ? '+' : ''}${transaction.amount.toFixed(2)} ${transaction.currency}
            </div>
        `;
        
        transactionList.appendChild(transactionItem);
    });
    
    // If no transactions found
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `
            <div style="text-align: center; padding: 30px; opacity: 0.7;">
                <i class="fas fa-exchange-alt" style="font-size: 40px; margin-bottom: 15px;"></i>
                <p>Транзакции не найдены</p>
            </div>
        `;
    }
}

// Filter transactions by type
function filterTransactions(type) {
    // Update tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    currentFilters.type = type;
    applyFilters();
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Currency selection
function selectCurrency(currency) {
    const options = document.querySelectorAll('.currency-option');
    options.forEach(option => option.classList.remove('active'));
    event.target.classList.add('active');
}

// Deposit funds
function depositFunds() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }
    
    // Update balance
    walletData.balance += amount;
    walletData.btcBalance += amount / 60000;
    
    // Add transaction
    walletData.transactions.unshift({
        id: Date.now(),
        type: 'receive',
        title: 'Пополнение баланса',
        details: 'От: Внешний источник',
        amount: amount,
        currency: 'USD',
        date: new Date().toLocaleString()
    });
    
    // Save and update UI
    saveWalletData();
    closeModal('receiveModal');
    document.getElementById('depositAmount').value = '';
    
    alert(`Кошелек успешно пополнен на ${amount.toFixed(2)} USD!`);
}

// Send funds
function sendFunds() {
    const address = document.getElementById('recipientAddress').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    
    if (!address) {
        alert('Пожалуйста, введите адрес кошелька получателя');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }
    
    if (amount > walletData.balance) {
        alert('Недостаточно средств на балансе');
        return;
    }
    
    // Update balance
    walletData.balance -= amount;
    walletData.btcBalance -= amount / 60000;
    
    // Add transaction
    walletData.transactions.unshift({
        id: Date.now(),
        type: 'send',
        title: 'Перевод средств',
        details: `На кошелек: ${address}`,
        amount: -amount,
        currency: 'USD',
        date: new Date().toLocaleString()
    });
    
    // Save and update UI
    saveWalletData();
    closeModal('sendModal');
    document.getElementById('recipientAddress').value = '';
    document.getElementById('sendAmount').value = '';
    
    alert(`Перевод на сумму ${amount.toFixed(2)} USD выполнен успешно!`);
}

// Profile management
function openProfileModal() {
    document.getElementById('profileName').value = walletData.profileName;
    openModal('profileModal');
}

function saveProfile() {
    const profileName = document.getElementById('profileName').value;
    if (profileName) {
        walletData.profileName = profileName;
    }
    
    const dataStr = JSON.stringify(walletData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'cryptoWalletProfile.json');
    linkElement.click();
    
    alert('Профиль успешно сохранен!');
}

function loadProfile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                walletData = importedData;
                saveWalletData();
                alert('Профиль успешно загружен!');
                closeModal('profileModal');
            } catch (error) {
                alert('Ошибка при загрузке профиля: неверный формат файла');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Transfer to own wallet (hidden feature)
function transferToSelf() {
    const amount = parseFloat(prompt('Введите сумму для перевода на свой кошелек:'));
    
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }
    
    // Update balance
    walletData.balance += amount;
    walletData.btcBalance += amount / 60000;
    
    // Add transaction
    walletData.transactions.unshift({
        id: Date.now(),
        type: 'receive',
        title: 'Перевод на свой кошелек',
        details: 'От: Собственный перевод',
        amount: amount,
        currency: 'USD',
        date: new Date().toLocaleString()
    });
    
    // Save and update UI
    saveWalletData();
    alert(`На ваш кошелек переведено ${amount.toFixed(2)} USD!`);
}

// Toggle admin panel
function toggleAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (walletData.adminMode) {
        adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
    } else {
        alert('Админ-панель заблокирована. Нажмите 5 раз на логотип для доступа.');
    }
}

// Admin access
let adminClicks = 0;
document.querySelector('.logo').addEventListener('click', function() {
    adminClicks++;
    if (adminClicks >= 5) {
        walletData.adminMode = true;
        alert('Админ-панель разблокирована!');
        adminClicks = 0;
    }
});

// Admin functions
function addTestTransaction() {
    const types = ['receive', 'send'];
    const titles = ['Тестовая транзакция', 'Перевод', 'Пополнение', 'Оплата услуг'];
    const details = ['От: Test Network', 'На кошелек: 0xTestAddress', 'Бонусная программа', 'Возврат средств'];
    const currencies = ['USD', 'BTC', 'ETH'];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDetail = details[Math.floor(Math.random() * details.length)];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    
    let randomAmount;
    if (randomType === 'receive') {
        randomAmount = Math.random() * 1000 + 50;
    } else {
        randomAmount = -(Math.random() * 500 + 10);
    }
    
    if (randomCurrency !== 'USD') {
        randomAmount = randomAmount / 100;
    }
    
    walletData.transactions.unshift({
        id: Date.now(),
        type: randomType,
        title: randomTitle,
        details: randomDetail,
        amount: randomAmount,
        currency: randomCurrency,
        date: new Date().toLocaleString()
    });
    
    saveWalletData();
    alert('Тестовая транзакция добавлена!');
}

function clearAllTransactions() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ транзакции?')) {
        walletData.transactions = [];
        saveWalletData();
    }
}

function generatePositiveTransactions() {
    for (let i = 0; i < 5; i++) {
        const amount = Math.random() * 1000 + 50;
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        walletData.transactions.push({
            id: Date.now(),
            type: 'receive',
            title: 'Генерированный доход',
            details: 'От: Система',
            amount: amount,
            currency: 'USD',
            date: date.toLocaleString()
        });
    }
    
    saveWalletData();
    alert('Сгенерировано 5 положительных транзакций!');
}

function generateNegativeTransactions() {
    for (let i = 0; i < 5; i++) {
        const amount = -(Math.random() * 500 + 10);
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        walletData.transactions.push({
            id: Date.now(),
            type: 'send',
            title: 'Генерированный расход',
            details: 'На: Система',
            amount: amount,
            currency: 'USD',
            date: date.toLocaleString()
        });
    }
    
    saveWalletData();
    alert('Сгенерировано 5 отрицательных транзакций!');
}

function setBalance(amount) {
    walletData.balance = amount;
    walletData.btcBalance = amount / 60000;
    saveWalletData();
    alert(`Баланс установлен на ${amount.toFixed(2)} USD`);
}

function addToBalance(amount) {
    walletData.balance += amount;
    walletData.btcBalance += amount / 60000;
    saveWalletData();
    alert(`Баланс пополнен на ${amount.toFixed(2)} USD`);
}

function resetToDefault() {
    if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
        walletData = {
            balance: 0,
            btcBalance: 0,
            transactions: [],
            adminMode: false,
            profileName: "Мой профиль"
        };
        saveWalletData();
        alert('Настройки сброшены!');
    }
}

// Initialize the application
window.onload = function() {
    loadWalletData();
    
    // Add event listeners
    document.getElementById('profileBtn').addEventListener('click', openProfileModal);
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            if (event.target == modals[i]) {
                modals[i].style.display = 'none';
            }
        }
    };
};