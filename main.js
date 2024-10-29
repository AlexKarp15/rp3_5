import {Pokemon} from "./pokemon.js";
// Масив з логами для бою
const logs = [
    '[ПЕРСОНАЖ №1] згадав щось важливе, але раптово [ПЕРСОНАЖ №2], не пам\'ятаючи себе від страху, вдарив у передпліччя ворога.',
    '[ПЕРСОНАЖ №1] поперхнувся, і за це [ПЕРСОНАЖ №2] з переляку вдарив коліном у лоб ворога.',
    '[ПЕРСОНАЖ №1] задумався, але в цей час нахабний [ПЕРСОНАЖ №2], прийнявши вольове рішення, безшумно підійшов ззаду і вдарив.',
    '[ПЕРСОНАЖ №1] прийшов до тями, але раптово [ПЕРСОНАЖ №2] випадково завдав потужного удару.',
    '[ПЕРСОНАЖ №1] поперхнувся, але в цей час [ПЕРСОНАЖ №2] неохоче роздробив кулаком ворога.',
    '[ПЕРСОНАЖ №1] здивувався, а [ПЕРСОНАЖ №2] похитнувся і завдав підступного удару.',
    '[ПЕРСОНАЖ №1] висморкався, але раптово [ПЕРСОНАЖ №2] завдав дроблячого удару.',
    '[ПЕРСОНАЖ №1] похитнувся, і раптом нахабний [ПЕРСОНАЖ №2] без причини вдарив у ногу противника.',
    '[ПЕРСОНАЖ №1] засмутився, як раптом, несподівано [ПЕРСОНАЖ №2] випадково завдав удару в живіт суперника.',
    '[ПЕРСОНАЖ №1] намагався щось сказати, але раптом [ПЕРСОНАЖ №2] від нудьги розбив брову супротивнику.'
];

// Функція для генерації випадкового лог-повідомлення
export function generateLog(attackerName, defenderName, damage, remainingHealth) {
    const logIndex = Math.floor(Math.random() * logs.length);
    const log = logs[logIndex]
        .replace('[ПЕРСОНАЖ №1]', attackerName)
        .replace('[ПЕРСОНАЖ №2]', defenderName);
    return `${log} Нанесено ${damage} шкоди. Залишилося ${remainingHealth} здоров'я.`;
}

export function addLog(message) {
    const logContainer = document.getElementById('logs');
    const newLog = document.createElement('div');
    newLog.textContent = message;
    logContainer.prepend(newLog);
}

const enemiesList = [
    new Pokemon('Charmander', 100, 15, false, '/assets/Charmander.png'),
    new Pokemon('Bulbasaur', 120, 20, false, '/assets/Bulbasaur.png'),
    new Pokemon('Squirtle', 140, 25, false, '/assets/Squirtle.png')
];

let character = new Pokemon("Pikachu", 100, 40, true,'/assets/Pikachu.webp');
let enemy = {
    current: enemiesList[0],
    currentEnemyIndex: 0,
};

function updateEnemyDisplay() {
    const enemySprite = document.querySelector('.enemy .sprite');
    const enemyName = document.getElementById("name-enemy");

    enemySprite.src = enemy.current.sprite;
    enemyName.textContent = enemy.current.name;

    enemy.current.updateHealth();
}

function loadNextEnemy() {
    // Переходимо до наступного ворога
    enemy.currentEnemyIndex++;

    // Перевіряємо, чи досягли кінця списку ворогів
    if (enemy.currentEnemyIndex >= enemiesList.length) {
        alert("Ви перемогли всіх суперників! Гра завершена!");
        resetGame(); // Викликаємо скидання гри, якщо всі вороги переможені
        return;
    }

    // Оновлюємо поточного ворога та його здоров'я
    enemy.current = enemiesList[enemy.currentEnemyIndex];
    enemy.current.health = enemy.current.maxHealth;

    // Оновлюємо інтерфейс для нового ворога
    updateEnemyDisplay();
}


const maxClicksThunder = 12;
const maxClicksQuick = 7;
const attackCounts = {
    thunderJolt: 0,
    quickAttack: 0,
};

function handleThunderJoltAttack() {
    if (attackCounts.thunderJolt < maxClicksThunder) {
        attackCounts.thunderJolt++;
        addLog(`Атака "Thunder Jolt" виконана ${attackCounts.thunderJolt} раз(и). Залишилося ${maxClicksThunder - attackCounts.thunderJolt}.`);
        character.attack(enemy.current, generateLog, addLog, loadNextEnemy);
    } else {
        addLog(`Атака "Thunder Jolt" досягла максимального ліміту ${maxClicksThunder} натискань.`);
    }
}

function handleQuickAttack() {
    if (attackCounts.quickAttack < maxClicksQuick) {
        attackCounts.quickAttack++;
        addLog(`Атака "Quick Attack" виконана ${attackCounts.quickAttack} раз(и). Залишилося ${maxClicksQuick - attackCounts.quickAttack}.`);
        character.attack(enemy.current, generateLog, addLog, loadNextEnemy);
    } else {
        addLog(`Атака "Quick Attack" досягла максимального ліміту ${maxClicksQuick} натискань.`);
    }
}

// Оновлена функція `setupAttackButtons`
function setupAttackButtons() {
    const thunderJoltButton = document.getElementById('btn-kick');
    const quickAttackButton = document.getElementById('btn-attack-2');

    // Знімаємо попередні обробники подій, використовуючи зовнішні функції
    thunderJoltButton.removeEventListener('click', handleThunderJoltAttack);
    quickAttackButton.removeEventListener('click', handleQuickAttack);

    // Додаємо обробники подій для кнопок атак
    thunderJoltButton.addEventListener('click', handleThunderJoltAttack);
    quickAttackButton.addEventListener('click', handleQuickAttack);
}

function clearLogs() {
    const logContainer = document.getElementById('logs');
    logContainer.innerHTML = ''; 
}

// Оновлення функції resetGame
export function resetGame() {
    // Reset attack counts
    attackCounts.thunderJolt = 0;
    attackCounts.quickAttack = 0;

    enemy.currentEnemyIndex = 0;
    enemy.current = enemiesList[enemy.currentEnemyIndex];
    
    character.health = character.maxHealth;
    enemy.current.health = enemy.current.maxHealth;

    clearLogs();

    character.updateHealth();
    enemy.current.updateHealth();

    // Оновлення спрайтів для обох персонажів
    character.updateSprite();
    enemy.current.updateSprite();
    
    updateEnemyDisplay();
    setupAttackButtons();
}


// Оновлення функції updateEnemyDisplay
setupAttackButtons();
character.updateHealth();
updateEnemyDisplay();