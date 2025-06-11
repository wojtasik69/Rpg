// === STATYSTYKI GRACZA ===
let playerStats = {
    hp: 100,
    maxHp: 100, // Maksymalne HP gracza do regeneracji
    attack: 10,
    gold: 0,
    // Możesz dodać więcej statystyk, np. defence, inventory itp.
};

// === OBIEKT PRZECHOWUJĄCY STANY GRY ===
const gameStates = {
    start: {
        text: "Witaj w grze! Jesteś na początku wielkiej przygody, której celem jest pokonanie Złej Wiedźmy w jej twierdzy. Co robisz?",
        options: [
            { text: "Wejdź do Zaklętego Lasu", nextState: "enchantedForestIntro" },
            { text: "Poszukaj informacji w pobliskiej wiosce", nextState: "village" }
        ]
    },

    // --- ETAP: Zaklęty Las ---
    enchantedForestIntro: {
        text: "Wkraczasz do Zaklętego Lasu. Drzewa są niezwykle gęste, a powietrze ciężkie od magii. Widzisz dwie ścieżki - jedną, która wydaje się naturalna i drugą, która lśni dziwnym, fioletowym blaskiem.",
        options: [
            { text: "Idź naturalną ścieżką", nextState: "forestPathNormal" },
            { text: "Idź lśniącą ścieżką", nextState: "forestPathMagic" }
        ]
    },
    forestPathNormal: {
        text: "Wybrałeś naturalną ścieżkę. Nagle z krzaków wyskakuje wściekły Wilk Leśny! Przygotuj się do walki.",
        options: [
            { text: "Walcz z Wilkiem", nextState: "battleForestWolf" }
        ]
    },
    forestPathMagic: {
        text: "Lśniąca ścieżka prowadzi Cię do dziwnego kręgu kamieni. Na środku leży starożytna inskrypcja. Co robisz?",
        options: [
            { text: "Spróbuj odczytać inskrypcję (Zagadka)", nextState: "forestRiddle" },
            { text: "Obejdź krąg kamieni", nextState: "forestBypassRiddle" }
        ]
    },
    forestRiddle: {
        text: "Inskrypcja głosi: 'Mam miasta, ale nie ma domów. Mam góry, ale nie ma drzew. Mam wodę, ale nie ma ryb. Czym jestem?'",
        options: [
            { text: "Mapa", nextState: "forestRiddleCorrect" },
            { text: "Książka", nextState: "forestRiddleIncorrect" },
            { text: "Zamek", nextState: "forestRiddleIncorrect" }
        ]
    },
    forestRiddleCorrect: {
        text: "Poprawna odpowiedź! Krąg kamieni rozbłyska, a przed Tobą pojawia się portal prowadzący bezpośrednio do podnóża góry. Zdobywasz 10 złota za spryt!",
        options: [
            { text: "Przejdź przez portal", nextState: "mountainClimbIntro" }
        ],
        onEnter: function() {
            playerStats.gold += 10;
        }
    },
    forestRiddleIncorrect: {
        text: "Błędna odpowiedź! Krąg kamieni zaczyna drżeć, a z ziemi wyłania się wściekły Duch Lasu! Musisz walczyć.",
        options: [
            { text: "Walcz z Duchem Lasu", nextState: "battleForestSpirit" }
        ]
    },
    forestBypassRiddle: {
        text: "Obchodzisz krąg kamieni. Szybko jednak napotykasz wściekłego Dzikiego Lisa, który broni swojego terytorium. Przygotuj się do walki.",
        options: [
            { text: "Walcz z Lisem", nextState: "battleWildFox" }
        ]
    },

    // Walki w lesie (używają battleLogic)
    battleForestWolf: {
        text: "", options: [], enemyHp: 25, enemyAttack: 7,
        onEnter: function() { battleLogic(gameStates.battleForestWolf, "Wilk Leśny", "forestExit"); }
    },
    battleForestSpirit: {
        text: "", options: [], enemyHp: 30, enemyAttack: 9,
        onEnter: function() { battleLogic(gameStates.battleForestSpirit, "Duch Lasu", "forestExit"); }
    },
    battleWildFox: {
        text: "", options: [], enemyHp: 20, enemyAttack: 6,
        onEnter: function() { battleLogic(gameStates.battleWildFox, "Dziki Lis", "forestExit"); }
    },
    forestExit: {
        text: "Przechodzisz przez ostatnie gęste zarośla lasu i docierasz do podnóża wysokiej, skalistej góry.",
        options: [
            { text: "Ruszaj w górę", nextState: "mountainClimbIntro" }
        ]
    },

    // --- ETAP: Wdrapanie się na Górę ---
    mountainClimbIntro: {
        text: "Jesteś u podnóża góry, na której szczycie widać zamek wiedźmy. Widzisz strome, skaliste zbocze oraz mroczną, zdaje się, łatwiejszą ścieżkę prowadzącą do jaskini.",
        options: [
            { text: "Wspinaj się po zboczu", nextState: "mountainSteepClimb" },
            { text: "Wejdź do jaskini", nextState: "mountainCavePath" }
        ]
    },
    mountainSteepClimb: {
        text: "Wspinaczka jest wyczerpująca. Z trudem utrzymujesz się na skale. Udaje Ci się wdrapać, ale tracisz 10 HP z wyczerpania.",
        options: [
            { text: "Kontynuuj podróż na szczyt", nextState: "mountainPeakApproach" }
        ],
        onEnter: function() {
            playerStats.hp = Math.max(0, playerStats.hp - 10); // Upewnij się, że HP nie spadnie poniżej 0
        }
    },
    mountainCavePath: {
        text: "Wchodzisz do ciemnej jaskini. Nagle coś miga w oddali... Widzisz ślepego nietoperza, który bije skrzydłami o kamień wydając rytmiczny dźwięk.",
        options: [
            { text: "Zainteresuj się dźwiękiem (Zagadka)", nextState: "mountainRiddleCave" },
            { text: "Obejdź nietoperza i szukaj drogi", nextState: "mountainCaveFight" }
        ]
    },
    mountainRiddleCave: {
        text: "Dźwięk Nietoperza jest rytmiczny. Bije raz w krótkich odstępach, potem dwa razy w dłuższych. Czy potrafisz odczytać wiadomość, jeśli A=1, B=2 itd.?",
        options: [
            { text: "Krótkie-krótkie-długie (S.O.S.)", nextState: "mountainRiddleIncorrect" },
            { text: "Jeden-dwa-jeden (121)", nextState: "mountainRiddleCorrect" },
            { text: "Trzy-cztery-pięć (345)", nextState: "mountainRiddleIncorrect" }
        ]
    },
    mountainRiddleCorrect: {
        text: "Poprawna odpowiedź! Dźwięki układają się w logiczną sekwencję. Nietoperz wskazuje na ukryte przejście. Zyskujesz 5 złota i odnajdujesz skrót!",
        options: [
            { text: "Przejdź skrótem", nextState: "mountainPeakApproach" }
        ],
        onEnter: function() {
            playerStats.gold += 5;
        }
    },
    mountainRiddleIncorrect: {
        text: "To nie to! Nietoperz denerwuje się i atakuje Cię! Musisz walczyć.",
        options: [
            { text: "Walcz ze ślepym Nietoperzem", nextState: "battleBlindBat" }
        ]
    },
    mountainCaveFight: {
        text: "Obchodząc Nietoperza, wpadasz na pułapkę zastawioną przez Górskiego Bandytę! Przygotuj się do walki.",
        options: [
            { text: "Walcz z Bandytą", nextState: "battleMountainBandit" }
        ]
    },
    // Walki na górze
    battleBlindBat: {
        text: "", options: [], enemyHp: 15, enemyAttack: 4,
        onEnter: function() { battleLogic(gameStates.battleBlindBat, "Ślepy Nietoperz", "mountainPeakApproach"); }
    },
    battleMountainBandit: {
        text: "", options: [], enemyHp: 30, enemyAttack: 8,
        onEnter: function() { battleLogic(gameStates.battleMountainBandit, "Górski Bandyta", "mountainPeakApproach"); }
    },
    mountainPeakApproach: {
        text: "Po trudach wspinaczki docierasz w pobliże twierdzy wiedźmy. Widzisz masywne bramy, a obok nich małą, ledwo widoczną ścieżkę wzdłuż urwiska.",
        options: [
            { text: "Spróbuj otworzyć bramę twierdzy", nextState: "fortressGates" },
            { text: "Spróbuj przejść ścieżką urwiska", nextState: "fortressCliffPath" }
        ]
    },

    // --- ETAP: Przejście przez Twierdzę ---
    fortressGates: {
        text: "Próbujesz otworzyć masywne bramy. Są zamknięte na wielką kłódkę. Czy spróbujesz ją otworzyć siłą, czy poszukasz klucza?",
        options: [
            { text: "Wytrychem (wymaga 15 Ataku)", nextState: "fortressPickLock" },
            { text: "Szukaj klucza", nextState: "fortressSearchKey" }
        ]
    },
    fortressPickLock: {
        text: "",
        options: [],
        onEnter: function() {
            if (playerStats.attack >= 15) {
                gameStates.fortressPickLock.text = "Udało Ci się sforsować kłódkę! Bramy skrzypiąc otwierają się. Wchodzisz do środka, ale włącza się magiczny alarm!";
                gameStates.fortressPickLock.options = [{ text: "Walcz ze strażnikiem", nextState: "battleFortressGuard" }];
            } else {
                gameStates.fortressPickLock.text = "Jesteś za słaby, by sforsować kłódkę. W akcie frustracji uderzasz w bramę i ściągasz uwagę strażnika!";
                gameStates.fortressPickLock.options = [{ text: "Walcz ze strażnikiem", nextState: "battleFortressGuard" }];
            }
        }
    },
    fortressSearchKey: {
        text: "Szukasz klucza wokół bram. Nagle zauważasz małą, wklęsłą płytkę w kamieniu, z której wydobywa się ledwie słyszalny szmer.",
        options: [
            { text: "Przyjrzyj się płytce (Zagadka)", nextState: "fortressRiddlePlate" },
            { text: "Ignoruj i szukaj dalej", nextState: "fortressSearchKeyFail" }
        ]
    },
    fortressRiddlePlate: {
        text: "Płytka ma wygrawerowane cztery symbole: słońce, księżyc, gwiazda, czaszka. Szmer staje się głośniejszy, a czujesz, że płytka chce, abyś nacisnął symbole w odpowiedniej kolejności. Wiedźma ceni sobie potęgę nocy bardziej niż blask dnia.",
        options: [
            { text: "Księżyc, Gwiazda, Czaszka, Słońce", nextState: "fortressRiddleCorrect" }, // Poprawna kolejność
            { text: "Słońce, Księżyc, Gwiazda, Czaszka", nextState: "fortressRiddleIncorrect" },
            { text: "Czaszka, Słońce, Księżyc, Gwiazda", nextState: "fortressRiddleIncorrect" }
        ]
    },
    fortressRiddleCorrect: {
        text: "Poprawna kolejność! Płytka cofa się, ukazując ukryty mechanizm. Z daleka słychać otwieranie się małych, bocznych drzwi. Wchodzisz niezauważony. Zyskujesz 10 złota za spryt!",
        options: [
            { text: "Wejdź do twierdzy", nextState: "fortressInside" }
        ],
        onEnter: function() {
            playerStats.gold += 10;
        }
    },
    fortressRiddleIncorrect: {
        text: "Błędna kolejność! Płytka zaczyna pulsować czerwonym światłem, a z pobliskiej wieży przylatuje Gargulec, który ma z Tobą do czynienia!",
        options: [
            { text: "Walcz z Gargulcem", nextState: "battleGargoyle" }
        ]
    },
    fortressSearchKeyFail: {
        text: "Ignorujesz płytkę i szukasz dalej. Nic nie znajdujesz, ale w oddali słyszysz kroki. Strażnik z twierdzy Cię zauważył!",
        options: [
            { text: "Walcz ze strażnikiem", nextState: "battleFortressGuard" }
        ]
    },
    // Walki w twierdzy
    battleFortressGuard: {
        text: "", options: [], enemyHp: 35, enemyAttack: 10,
        onEnter: function() { battleLogic(gameStates.battleFortressGuard, "Strażnik Twierdzy", "fortressInside"); }
    },
    battleGargoyle: {
        text: "", options: [], enemyHp: 40, enemyAttack: 12,
        onEnter: function() { battleLogic(gameStates.battleGargoyle, "Gargulec", "fortressInside"); }
    },
    fortressCliffPath: {
        text: "Idziesz wąską ścieżką wzdłuż urwiska. Jest zdradliwie, ale udaje Ci się znaleźć ukryte wejście do twierdzy, omijając główną bramę.",
        options: [
            { text: "Wejdź do twierdzy", nextState: "fortressInside" }
        ]
    },
    fortressInside: {
        text: "Jesteś wewnątrz twierdzy. Powietrze jest chłodne i wilgotne. Widzisz przejście do lochów i wielką salę tronową.",
        options: [
            { text: "Idź do lochów", nextState: "dungeonEntrance" }, // Prowadzi do Smoka
            { text: "Idź do sali tronowej", nextState: "throneRoom" } // Możliwe, że zbyt wcześnie do wiedźmy
        ]
    },

    // --- ETAP: Lochy / Spotkanie ze Smokiem ---
    dungeonEntrance: {
        text: "Wchodzisz do ciemnych, cuchnących lochów. Smród siarki i spalenizny jest przytłaczający. Nagle słyszysz głębokie, gardłowe pomruki... Przed Tobą leży ogromny, uśpiony Smok pilnujący przejścia. Co robisz?",
        options: [
            { text: "Spróbuj zakraść się obok Smoka", nextState: "dragonStealth" },
            { text: "Obudź Smoka i walcz", nextState: "battleDragon" }
        ]
    },
    dragonStealth: {
        text: "",
        options: [],
        onEnter: function() {
            const stealthChance = Math.random();
            if (stealthChance < 0.3) { // Niska szansa na zakradnięcie się (30%)
                gameStates.dragonStealth.text = "Udało Ci się ostrożnie przemknąć obok śpiącego Smoka! Jesteś bezpieczny po drugiej stronie lochów. To było o włos!";
                gameStates.dragonStealth.options = [{ text: "Kontynuuj do Sali Tronowej", nextState: "throneRoom" }];
            } else {
                gameStates.dragonStealth.text = "Niechcący potykasz się o kamień! Smok budzi się z rykiem i patrzy prosto na Ciebie! Przygotuj się do walki!";
                gameStates.dragonStealth.options = [{ text: "Walcz ze Smokiem", nextState: "battleDragon" }];
            }
        }
    },
    battleDragon: {
        text: "", options: [], enemyHp: 80, enemyAttack: 15,
        onEnter: function() { battleLogic(gameStates.battleDragon, "Smok", "throneRoom"); }
    },

    // --- ETAP: Sala Tronowa (Cel gry) ---
    throneRoom: {
        text: "Wchodzisz do ogromnej Sali Tronowej. Na końcu pomieszczenia, na wysokim tronie, siedzi zła Wiedźma. Widzi Cię i uśmiecha się drwiąco. To jest koniec podróży. Musisz ją pokonać!",
        options: [
            { text: "Walcz z Wiedźmą", nextState: "battleWitch" }
        ]
    },
    battleWitch: {
        text: "", options: [], enemyHp: 100, enemyAttack: 20, // Wiedźma jest najsilniejsza
        onEnter: function() { battleLogic(gameStates.battleWitch, "Zła Wiedźma", "gameWin"); }
    },
    gameWin: {
        text: "Pokonałeś Złą Wiedźmę! Jej mroczna magia rozpływa się, a świat znowu jest bezpieczny. Jesteś bohaterem! GRATULACJE!",
        options: [
            { text: "Zacznij nową przygodę", nextState: "start", onChoose: resetGame }
        ]
    },
    // --- KONIEC GRY (Porażka) ---
    gameOver: {
        text: "Twoja przygoda dobiegła końca w niepowodzeniu. Niestety, zostałeś pokonany.",
        options: [
            { text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }
        ]
    },


    // --- ETAPY WCZEŚNIEJ OMÓWIONE (Dla kontekstu, jeśli nie używasz ich bezpośrednio w ścieżkach) ---
    // Możesz je usunąć lub zintegrować, jeśli chcesz, by były dostępne z "wioski" lub jako boczne zadania
    talkToWanderer: {
        text: "Wędrowiec opowiada ci o ukrytym skarbie! Dostajesz 20 złota. Gra zakończona.", // Zmiana zakończenia, by nie kończyć gry
        options: [
            { text: "Kontynuuj podróż", nextState: "enchantedForestIntro" } // Po rozmowie wracasz do lasu
        ],
        onEnter: function() {
            playerStats.gold += 20;
        }
    },
    // continueLeft, enterCastle, bypassCastle, rightPath, exploreRuins, battleGoblin, escapeGoblin
    // Te stany można dostosować, aby były np. częścią "bocznych misji" z wioski
    // Jeśli nie są używane w żadnej ścieżce, można je usunąć
    // Przykład: Usunąłem większość pierwotnych stanów, pozostawiając tylko te potrzebne do nowej fabuły.
    // Jeśli chcesz, aby były dostępne z wioski, dodaj odpowiednie opcje w `village`.

    // --- ETAP WIOSKI I SKLEPU (Zmodyfikowane) ---
    village: {
        text: "Docierasz do tętniącej życiem wioski. Możesz odpocząć, zrobić zakupy lub wyruszyć w dalszą podróż.",
        options: [
            { text: "Odwiedź sklep", nextState: "shop" },
            { text: "Odpocznij w gospodzie", nextState: "restAtInn" },
            { text: "Wróć do początku przygody (Las)", nextState: "enchantedForestIntro" } // Powrót do początku głównej ścieżki
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
 * Główna logika walki dla każdego przeciwnika.
 * Przeniesiona tu, aby uniknąć powtórzeń kodu.
 * @param {object} enemyState - Obiekt stanu przeciwnika (np. gameStates.battleGoblin).
 * @param {string} enemyName - Nazwa przeciwnika do wyświetlania.
 * @param {string} nextStateOnWin - Stan, do którego gracz przechodzi po wygranej.
 */
function battleLogic(enemyState, enemyName, nextStateOnWin) {
    let playerDamage = playerStats.attack + Math.floor(Math.random() * 5); // Gracz zadaje obrażenia + losowy bonus
    enemyState.enemyHp -= playerDamage;
    let enemyDamage = enemyState.enemyAttack + Math.floor(Math.random() * 3); // Wróg zadaje obrażenia + losowy bonus

    let combatLog = `Zadajesz ${enemyName} ${playerDamage} obrażeń. ${enemyName} zadaje ci ${enemyDamage} obrażeń.\n`;

    if (playerStats.hp <= 0) {
        playerStats.hp = 0; // Upewnij się, że HP nie spadnie poniżej 0 na wyświetlaczu
        enemyState.text = combatLog + `Twoje HP spadło do zera! Zostałeś pokonany przez ${enemyName}.`;
        enemyState.options = [{ text: "Zacznij od nowa", nextState: "start", onChoose: resetGame }];
    } else if (enemyState.enemyHp <= 0) {
        let goldReward = Math.floor(Math.random() * 10) + enemyState.enemyAttack; // Nagroda złota proporcjonalna do siły wroga
        playerStats.gold += goldReward;
        enemyState.text = combatLog + `Pokonałeś ${enemyName}! Znajdujesz ${goldReward} sztuk złota.`;
        enemyState.options = [{ text: "Kontynuuj przygodę", nextState: nextStateOnWin }];
    } else {
        enemyState.text = combatLog + `Twoje HP: ${playerStats.hp}. HP ${enemyName}: ${enemyState.enemyHp}. Kontynuujesz walkę.`;
        // Opcje walki - zawsze powrót do obecnego stanu (czyli kontynuacja walki)
        enemyState.options = [
            { text: "Atakuj ponownie", nextState: currentState }
            // Opcja ucieczki może być dodana specyficznie dla niektórych walk
            // lub zaimplementowana jako ogólna opcja z ryzykiem
            // { text: "Spróbuj uciec", nextState: "escapeBattle" } // wymagałoby stanu "escapeBattle"
        ];
    }
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
    // Ważne: Dodaj tutaj wszystkie wrogów, których HP resetujesz
    if (gameStates.battleGoblin) gameStates.battleGoblin.enemyHp = 20; // Przywróć HP Goblina (jeśli go używasz)
    if (gameStates.battleForestWolf) gameStates.battleForestWolf.enemyHp = 25;
    if (gameStates.battleForestSpirit) gameStates.battleForestSpirit.enemyHp = 30;
    if (gameStates.battleWildFox) gameStates.battleWildFox.enemyHp = 20;
    if (gameStates.battleBlindBat) gameStates.battleBlindBat.enemyHp = 15;
    if (gameStates.battleMountainBandit) gameStates.battleMountainBandit.enemyHp = 30;
    if (gameStates.battleFortressGuard) gameStates.battleFortressGuard.enemyHp = 35;
    if (gameStates.battleGargoyle) gameStates.battleGargoyle.enemyHp = 40;
    if (gameStates.battleDragon) gameStates.battleDragon.enemyHp = 80;
    if (gameStates.battleWitch) gameStates.battleWitch.enemyHp = 100;

    // Zresetuj currentState do "start", aby gra rozpoczęła się od początku
    currentState = "start";
}


// === ZAINICJUJ GRĘ PO ZAŁADOWANIU STRONY ===
// document.addEventListener("DOMContentLoaded", ...) to dobry sposób, aby upewnić się, że HTML jest załadowany
document.addEventListener("DOMContentLoaded", () => {
    updateGame();
});
