#!/usr/bin/env node
import inquirer from 'inquirer';
let enemies = ["Goblin", "Ghoul", "Ogre", "Assassin"];
let maxEnemyHealth = 75;
let enemyAttackDamage = 25;
let health = 100;
let attackDamage = 30;
let numHealthPotions = 3;
let healthPotionHealAmount = 30;
let healthPotionDropChance = 50;
let running = true;
console.log("Welcome to the Monster Maze!");
function getRandomEnemy() {
    return enemies[Math.floor(Math.random() * enemies.length)];
}
function getRandomEnemyHealth() {
    return Math.floor(Math.random() * maxEnemyHealth + 1);
}
function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}
async function gameLoop() {
    let enemyHealth = getRandomEnemyHealth();
    let enemy = getRandomEnemy();
    console.log(`You encounter a ${enemy} lurking in the maze!`);
    while (running && health > 0) {
        console.log(`\nYour HP: ${health}`);
        console.log(`${enemy}'s HP: ${enemyHealth}`);
        const action = await inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "do",
                choices: ["Attack", "Drink health potion", "Run!"]
            }
        ]);
        if (action.do === "Attack") {
            let damageDealt = getRandomNumber(attackDamage);
            let damageTaken = getRandomNumber(enemyAttackDamage);
            enemyHealth -= damageDealt;
            health -= damageTaken;
            console.log(`\n> You strike the ${enemy} for ${damageDealt} damage.`);
            console.log(`> You receive ${damageTaken} in retaliation!`);
            if (health < 1) {
                console.log("\n> You have taken too much damage, you are too weak to go on!");
                running = false;
            }
            if (enemyHealth < 1) {
                console.log(`\n> ${enemy} was defeated!`);
                console.log(`> You have ${health} HP left.`);
                let dropChance = getRandomNumber(100);
                if (dropChance < healthPotionDropChance) {
                    numHealthPotions++;
                    console.log(`> The ${enemy} dropped a health potion!`);
                    console.log(`> You now have ${numHealthPotions} health potion(s).`);
                }
                console.log("You cautiously navigate through the maze...");
                enemyHealth = getRandomEnemyHealth();
                enemy = getRandomEnemy();
                console.log(`\n# You turn a corner and face a ${enemy}! #`);
            }
        }
        else if (action.do === "Drink health potion") {
            if (numHealthPotions > 0) {
                health += healthPotionHealAmount;
                numHealthPotions--;
                console.log(`\n> You drink a health potion, healing yourself for ${healthPotionHealAmount}.`);
                console.log(`> You now have ${health} HP.`);
                console.log(`> You have ${numHealthPotions} health potion(s) left.`);
            }
            else {
                console.log(`\n> You have no health potions left! Defeat enemies for a chance to get one!`);
            }
        }
        else if (action.do === "Run!") {
            console.log(`\nYou flee deeper into the maze, leaving the ${enemy} behind!`);
            enemyHealth = getRandomEnemyHealth();
            enemy = getRandomEnemy();
            console.log(`\n# A ${enemy} has appeared! #`);
        }
    }
    if (health < 1) {
        console.log("\nYou stumble out of the Monster Maze, weak from battle.");
    }
}
gameLoop();
