#!/usr/bin/env node

import inquirer from 'inquirer';

let enemies: string[] = ["Goblin", "Ghoul", "Ogre", "Assassin"];
let maxEnemyHealth: number = 75;
let enemyAttackDamage: number = 25;

let health: number = 100;
let attackDamage: number = 30;
let numHealthPotions: number = 3;
let healthPotionHealAmount: number = 30;
let healthPotionDropChance: number = 50;

let running: boolean = true;

console.log("Welcome to the Monster Maze!");

function getRandomEnemy(): string {
    return enemies[Math.floor(Math.random() * enemies.length)];
}

function getRandomEnemyHealth(): number {
    return Math.floor(Math.random() * maxEnemyHealth + 1);
}

function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
}

async function gameLoop() {
    let enemyHealth = getRandomEnemyHealth();
    let enemy = getRandomEnemy();
    console.log(`${enemy} has appeared!`);

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

                enemyHealth = getRandomEnemyHealth();
                enemy = getRandomEnemy();
                console.log(`\n# A ${enemy} has appeared! #`);
            }

        } else if (action.do === "Drink health potion") {
            if (numHealthPotions > 0) {
                health += healthPotionHealAmount;
                numHealthPotions--;
                console.log(`\n> You drink a health potion, healing yourself for ${healthPotionHealAmount}.`);
                console.log(`> You now have ${health} HP.`);
                console.log(`> You have ${numHealthPotions} health potion(s) left.`);
            } else {
                console.log(`\n> You have no health potions left! Defeat enemies for a chance to get one!`);
            }

        } else if (action.do === "Run!") {
            console.log(`\nYou run away from the ${enemy}!`);
            enemyHealth = getRandomEnemyHealth();
            enemy = getRandomEnemy();
            console.log(`\n# A ${enemy} has appeared! #`);
        }
    }

    if (health < 1) {
        console.log("\nYou limp out of the dungeon, weak from battle.");
    }
}

gameLoop();
