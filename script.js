// === STATYSTYKI GRACZA ===
let playerStats = {
    hp: 100,
    maxHp: 100, // Dodano maxHp do łatwiejszego zarządzania leczeniem
    attack: 10,
    gold: 0,
    // Możesz dodać więcej statystyk, np. defence, inventory itp.
};

/**
 * Główna logika walki dla każdego przeciwnika.
 * @param {object} enemyState - Obiekt stanu przeciwnika (np. gameStates.battleGoblin).
 * @param {string} enemyName - Nazwa przeciwnika do wyświetlania.
 * @param {string} nextStateOnWin - Stan, do którego gracz przechodzi po wygranej.
 */
function battleLogic(enemyState, enemyName, nextStateOnWin) {
    let playerDamage = playerStats.attack + Math.floor(Math.random() * 5); // Gracz zadaje obrażenia
    enemyState.enemyHp -= playerDamage;
    let enemyDamage = enemyState.enemyAttack + Math.floor(Math.random() * 3); // Wróg zadaje obrażenia
    playerStats.hp -= enemyDamage;

    let combatLog = `Zadajesz ${enemyName} ${playerDamage} obrażeń. ${enemyName} zadaje ci ${enemyDamage} obrażeń.\n`;

    if (playerStats.hp <= 0) {
        enemyState.text = combatLog + `Twoje HP spadło do zera! Zostałeś pokonany przez ${enemyName}. Gra zakończona.`;
        enemyState.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
    } else if (enemyState.enemyHp <= 0) {
        let goldReward = Math.floor(Math.random() * 10) + 10; // Losowa nagroda złota
        playerStats.gold += goldReward;
        enemyState.text = combatLog + `Pokonałeś ${enemyName}! Znajdujesz ${goldReward} sztuk złota.`;
        enemyState.options = [{ text: "Kontynuuj przygodę", nextState: nextStateOnWin }];
    } else {
        enemyState.text = combatLog + `Twoje HP: ${playerStats.hp}. HP ${enemyName}: ${enemyState.enemyHp}. Kontynuujesz walkę.`;
        enemyState.options = [
            { text: "Atakuj ponownie", nextState: enemyState.name }, // Użyj nazwy stanu, aby wrócić do walki
            { text: "Spróbuj uciec", nextState: `escape${enemyName.replace(/\s/g, '')}` } // Dynamiczna nazwa stanu ucieczki
        ];
        // Musisz dodać stany ucieczki dla każdego wroga, np. escapeForestWolf, escapeMountainBandit
        // Zauważ, że `enemyState.name` nie jest automatycznie dostępne, więc musisz przekazać je w `onEnter`
        // Lepszym rozwiązaniem jest po prostu przekazać `enemyState` i użyć `currentState` do powrotu.
        // Zmodyfikujmy to:
        enemyState.options[0].nextState = currentState; // Wróć do obecnego stanu (walki)
        // Stany ucieczki musisz stworzyć osobno dla każdego bossa
        // Dla ułatwienia, na razie, walka jest bez ucieczki, dopóki nie dodasz specyficznej logiki ucieczki dla każdego.
        // Przykład dla Goblina:
        if (enemyName === "Goblin") {
             enemyState.options.push({ text: "Spróbuj uciec", nextState: "escapeGoblin" });
        }
        // Dla pozostałych wrogów możesz na razie pominąć ucieczkę, lub stworzyć ogólną, np. "escapeBattle"
        // Lub co bardziej realistyczne, jeśli wrogów jest wielu, po prostu zakończ walkę porażką w przypadku ucieczki.
    }
}

// === OBIEKT PRZECHOWUJĄCY STANY GRY ===
const gameStates = {
    start: {
        text: "Witaj w grze! Jesteś na rozdrożu. Co robisz?",
        options: [
            { text: "Idź w lewo", nextState: "leftPath" },
            { text: "Idź w prawo", nextState: "rightPath" }
        ]
    },
    leftPath: {
        text: "Idziesz w lewo. Co robisz?",
        options: [
            { text: "Spróbuj spotkać kogoś", nextState: "tryMeetWanderer" },
            { text: "Idź dalej prosto", nextState: "continueLeft" }
        ]
    },
    tryMeetWanderer: {
        text: "", // Tekst dynamiczny
        options: [], // Opcje dynamiczne
        onEnter: function() {
            const chance = Math.random(); // Losowa liczba od 0 do 1
            if (chance < 0.6) { // 60% szans na spotkanie wędrowca
                gameStates.tryMeetWanderer.text = "Spotykasz przyjaznego wędrowca. Chcesz z nim porozmawiać?";
                gameStates.tryMeetWanderer.options = [
                    { text: "Porozmawiaj", nextState: "talkToWanderer" },
                    { text: "Ignoruj i idź dalej", nextState: "continueLeft" }
                ];
            } else {
                gameStates.tryMeetWanderer.text = "Nikogo nie spotykasz. Droga jest pusta.";
                gameStates.tryMeetWanderer.options = [
                    { text: "Idź dalej", nextState: "continueLeft" }
                ];
            }
        }
    },
    talkToWanderer: {
        text: "Wędrowiec opowiada ci o ukrytym skarbie! Dostajesz 20 złota. Gra zakończona.",
        options: [
            { text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }
        ],
        onEnter: function() {
            playerStats.gold += 20; // Wędrowiec daje złoto
        }
    },
    continueLeft: {
        text: "Ignorujesz wędrowca i idziesz dalej. Docierasz do starego zamku. Co robisz?",
        options: [
            { text: "Wejdź do zamku", nextState: "enterCastle" },
            { text: "Obejście zamku", nextState: "bypassCastle" }
        ]
    },
    enterCastle: {
        text: "Wchodzisz do zamku i zostajesz uwięziony przez smoka! Twoja przygoda dobiegła końca.",
        options: [
            { text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }
        ]
    },
    bypassCastle: {
        text: "Obchodzisz zamek i bezpiecznie docierasz do tętniącej życiem wioski.",
        options: [
            { text: "Wejdź do wioski", nextState: "village" }
        ]
    },
    rightPath: {
        text: "Idziesz w prawo. Droga jest zarośnięta i trudna. Widzisz stare ruiny. Co robisz?",
        options: [
            { text: "Zbadaj ruiny", nextState: "exploreRuins" },
            { text: "Wróć na rozdroże", nextState: "start" }
        ]
    },
    exploreRuins: {
        text: "", // Tekst dynamiczny
        options: [], // Opcje dynamiczne
        onEnter: function() {
            const dangerChance = Math.random();
            if (dangerChance < 0.7) { // 70% szans na walkę
                gameStates.exploreRuins.text = "W ruinach ukrywa się goblin! Musisz walczyć!";
                gameStates.exploreRuins.options = [{ text: "Walcz z Goblinem", nextState: "battleGoblin" }];
            } else {
                gameStates.exploreRuins.text = "W ruinach znajdujesz starą mapę, która prowadzi do... nikąd. Ale znajdujesz 10 złota! Gra zakończona.";
                playerStats.gold += 10;
                gameStates.exploreRuins.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
            }
        }
    },
    // === ETAP WALKII ===
    battleGoblin: {
        text: "",
        options: [],
        enemyHp: 20, // HP Goblina (initial value, resetowany w resetGame)
        enemyAttack: 5,
        onEnter: function() {
            gameStates.battleGoblin.text = `Napotykasz groźnego Goblina! HP Goblina: ${gameStates.battleGoblin.enemyHp}. Co robisz?`;
            gameStates.battleGoblin.options = [
                { text: "Atakuj Goblina", nextState: "attackGoblin" },
                { text: "Spróbuj uciec", nextState: "escapeGoblin" }
            ];
        }
    },
    attackGoblin: {
        text: "",
        options: [],
        onEnter: function() {
            let playerDamage = playerStats.attack + Math.floor(Math.random() * 5); // Gracz zadaje obrażenia
            gameStates.battleGoblin.enemyHp -= playerDamage;
            let enemyDamage = gameStates.battleGoblin.enemyAttack + Math.floor(Math.random() * 3); // Goblin zadaje obrażenia
            playerStats.hp -= enemyDamage;

            let combatLog = `Zadajesz Goblinowi ${playerDamage} obrażeń. Goblin zadaje ci ${enemyDamage} obrażeń.\n`;

            if (playerStats.hp <= 0) {
                gameStates.attackGoblin.text = combatLog + "Twoje HP spadło do zera! Zostałeś pokonany. Gra zakończona.";
                gameStates.attackGoblin.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
            } else if (gameStates.battleGoblin.enemyHp <= 0) {
                playerStats.gold += 15; // Nagroda za pokonanie
                gameStates.attackGoblin.text = combatLog + "Pokonałeś Goblina! Znajdujesz 15 sztuk złota. Gra zakończona.";
                gameStates.attackGoblin.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
            } else {
                gameStates.attackGoblin.text = combatLog + `Twoje HP: ${playerStats.hp}. HP Goblina: ${gameStates.battleGoblin.enemyHp}. Kontynuujesz walkę.`;
                gameStates.attackGoblin.options = [
                    { text: "Atakuj ponownie", nextState: "attackGoblin" },
                    { text: "Spróbuj uciec", nextState: "escapeGoblin" }
                ];
            }
        }
    },
    escapeGoblin: {
        text: "",
        options: [],
        onEnter: function() {
            const escapeChance = Math.random();
            if (escapeChance < 0.4) { // 40% szans na ucieczkę
                gameStates.escapeGoblin.text = "Udało ci się uciec przed Goblinem!";
                gameStates.escapeGoblin.options = [{ text: "Idź dalej do wioski", nextState: "village" }];
            } else {
                let enemyDamage = gameStates.battleGoblin.enemyAttack + Math.floor(Math.random() * 3);
                playerStats.hp -= enemyDamage;
                if (playerStats.hp <= 0) {
                    gameStates.escapeGoblin.text = `Nie udało ci się uciec i otrzymujesz ${enemyDamage} obrażeń. Twoje HP spadło do zera! Zostałeś pokonany. Gra zakończona.`;
                    gameStates.escapeGoblin.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
                } else {
                    gameStates.escapeGoblin.text = `Nie udało ci się uciec i otrzymujesz ${enemyDamage} obrażeń. Musisz kontynuować walkę! Twoje HP: ${playerStats.hp}.`;
                    gameStates.escapeGoblin.options = [
                        { text: "Atakuj Goblina", nextState: "attackGoblin" },
                        { text: "Spróbuj uciec ponownie", nextState: "escapeGoblin" }
                    ];
                }
            }
        }
    },
    // === ETAP WIOSKI I SKLEPU ===
    village: {
        text: "Docierasz do tętniącej życiem wioski. Co chcesz zrobić?",
        options: [
            { text: "Odwiedź sklep", nextState: "shop" },
            { text: "Odpocznij w gospodzie", nextState: "restAtInn" },
            { text: "Wróć na rozdroże", nextState: "start" } // Opcja powrotu
        ]
    },
    shop: {
        text: "", // Tekst dynamiczny, ustawi się w onEnter
        options: [
            { text: "Kup Miecz (+5 Ataku) - 30 zł", nextState: "buySword", onChoose: () => buyItem('sword') },
            { text: "Kup Miksturę Zdrowia (+20 HP) - 10 zł", nextState: "buyPotion", onChoose: () => buyItem('potion') },
            { text: "Wyjdź ze sklepu", nextState: "village" }
        ],
        onEnter: function() {
            gameStates.shop.text = `Wchodzisz do sklepu. Masz ${playerStats.gold} złota. Co chcesz kupić?`;
        }
    },
    buySword: {
        text: "",
        options: [],
        onEnter: function() {
            if (playerStats.gold >= 30) {
                playerStats.gold -= 30;
                playerStats.attack += 5;
                gameStates.buySword.text = "Kupiłeś Miecz! Twój atak wzrósł o 5. Masz teraz " + playerStats.gold + " złota.";
            } else {
                gameStates.buySword.text = "Nie masz wystarczająco złota na Miecz! Masz tylko " + playerStats.gold + " złota.";
            }
            gameStates.buySword.options = [{ text: "Wróć do sklepu", nextState: "shop" }];
        }
    },
    buyPotion: {
        text: "",
        options: [],
        onEnter: function() {
            if (playerStats.gold >= 10) {
                playerStats.gold -= 10;
                playerStats.hp = Math.min(playerStats.hp + 20, playerStats.maxHp); // Ulecz, ale nie więcej niż maxHp
                gameStates.buyPotion.text = "Kupiłeś Miksturę Zdrowia! Twoje HP wzrosło o 20 (do " + playerStats.hp + "). Masz teraz " + playerStats.gold + " złota.";
            } else {
                gameStates.buyPotion.text = "Nie masz wystarczająco złota na Miksturę Zdrowia! Masz tylko " + playerStats.gold + " złota.";
            }
            gameStates.buyPotion.options = [{ text: "Wróć do sklepu", nextState: "shop" }];
        }
    },
    restAtInn: {
        text: "Odpoczywasz w gospodzie i regenerujesz siły. Twoje HP zostało przywrócone do maksimum.",
        options: [{ text: "Wróć do wioski", nextState: "village" }],
        onEnter: function() {
            playerStats.hp = playerStats.maxHp; // Przywróć HP do pełna
        }
    },
    // --- Tutaj możesz dodawać kolejne stany gry ---
    // np. questBoard, dungeonEntrance, finalBoss itp.
};

let currentState = "start"; // Początkowy stan gry

// === FUNKCJE GRY ===

/**
 * Aktualizuje wyświetlane statystyki gracza w interfejsie.
 */
function updateStatsDisplay() {
    document.getElementById("player-hp").innerText = playerStats.hp;
    document.getElementById("player-attack").innerText = playerStats.attack;
    document.getElementById("player-gold").innerText = playerStats.gold;
}

/**
 * Aktualizuje tekst i opcje wyświetlanej sceny w grze.
 * Wywołuje funkcję onEnter dla aktualnego stanu, jeśli istnieje.
 */
function updateGame() {
    const currentScene = gameStates[currentState];

    // Jeśli stan ma funkcję 'onEnter', wywołaj ją
    // To pozwala na dynamiczne generowanie tekstu/opcji przed wyświetleniem
    if (currentScene.onEnter) {
        currentScene.onEnter();
    }

    document.getElementById("text-display").innerText = currentScene.text;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = ""; // Wyczyść poprzednie opcje

    currentScene.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.onclick = () => chooseOption(option.nextState);
        optionsContainer.appendChild(button);
    });

    updateStatsDisplay(); // Zawsze aktualizuj wyświetlane statystyki
}

/**
 * Wybiera kolejny stan gry na podstawie wybranej opcji.
 * Wywołuje funkcję onChoose dla opcji, jeśli istnieje.
 * @param {string} nextState - Nazwa następnego stanu gry.
 */
function chooseOption(nextState) {
    // Znajdź bieżący stan i wybraną opcję, aby sprawdzić 'onChoose'
    const currentScene = gameStates[currentState];
    const chosenOption = currentScene.options.find(option => option.nextState === nextState);

    if (chosenOption && typeof chosenOption.onChoose === 'function') {
        chosenOption.onChoose(); // Wywołaj dodatkową funkcję (np. resetGame, buyItem)
    }

    currentState = nextState;
    updateGame();
}

/**
 * Funkcja do obsługi kupowania przedmiotów.
 * @param {string} itemType - Typ przedmiotu (np. 'sword', 'potion').
 */
function buyItem(itemType) {
    // Ta funkcja jest wywoływana przez `onChoose` w opcjach sklepu,
    // ale główna logika aktualizacji statystyk dzieje się w `onEnter` stanów `buySword` i `buyPotion`.
    // Możesz tutaj dodać bardziej złożoną logikę, jeśli np. każdy przedmiot miałby inną cenę i efekt.
    console.log(`Próba zakupu: ${itemType}`);
}


/**
 * Resetuje statystyki gracza i stan gry do wartości początkowych.
 */
function resetGame() {
    playerStats.hp = playerStats.maxHp;
    playerStats.attack = 10;
    playerStats.gold = 0;

    // Resetowanie specyficznych dla sceny zmiennych (np. HP wrogów)
    if (gameStates.battleGoblin) {
        gameStates.battleGoblin.enemyHp = 20; // Przywróć HP Goblina
    }
    // Dodaj reset innych zmiennych, jeśli będą
}


// === ZAINICJUJ GRĘ PO ZAŁADOWANIU STRONY ===
document.addEventListener("DOMContentLoaded", () => {
    updateGame();
});
