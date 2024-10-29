// pokemon.js
import {resetGame} from "./main.js";

export class Pokemon {
    constructor(name, maxHealth, attackPower, isHero = true, sprite) {
        this.name = name;
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.attackPower = attackPower;
        this.isHero = isHero;
        this.sprite = sprite;
    }

    updateHealth() {
        const healthDisplay = document.getElementById(`health-${this.isHero ? 'character' : 'enemy'}`);
        const progressBar = document.getElementById(`progressbar-${this.isHero ? 'character' : 'enemy'}`);
        healthDisplay.textContent = `${this.health} / ${this.maxHealth}`;
        progressBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
    }

    updateSprite() {
        const spriteElement = document.querySelector(`.${this.isHero ? 'character' : 'enemy'} .sprite`);
        if (spriteElement) {
            spriteElement.src = this.sprite;
        }
    }
    // Приймає функції як аргументи
    attack(target, generateLog, addLog, loadNextEnemy) {
        // Перевірка, чи здоров'я героя > 0 перед атакою
        if (this.health <= 0) {
            alert(`Покемон ${this.name} знепритомнів!`);
            resetGame();
            return; // Завершуємо атаку, якщо герой уже має 0 здоров'я
        }

        // Виконуємо атаку
        const damage = Math.floor(Math.random() * this.attackPower) + 1;
        target.health -= damage;
        if (target.health < 0) target.health = 0;
        target.updateHealth();

        // Генеруємо лог бою
        const logMessage = generateLog(this.name, target.name, damage, target.health);
        addLog(logMessage);

        // Перевірка здоров'я цілі після атаки
        if (target.health === 0) {
            if (this.isHero) {
                alert(`Ви перемогли ${target.name}!`);
                loadNextEnemy();
            } else {
                alert(`Покемон ${target.name} знепритомнів!`);
                resetGame();
            }
            return;
        }

        // Якщо атакує гравець, ворог атакує у відповідь
        if (this.isHero) {
            setTimeout(() => target.attack(this, generateLog, addLog, loadNextEnemy), 10);
        }
    }
}