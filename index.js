let difficulties = ["Normal", "Expert", "Revengeance"]
let selectedDifficulty = "Revengeance";

let classes = ["Classless", "Melee", "Ranger", "Mage", "Summoner", "Rogue"];
let selectedClasses = [];

let filters = ["Offensive", "Defensive", "Mobility", "Utility", "Fishing", "Mining"];
let selectedFilters = [];

let itemTypes = ["Weapon", "Accessory", "Armor"];
let selectedItemTypes = [];

let progression = [
    ["King Slime", "Desert Scourge", "Eye of Cthulhu", "Crabulon"],
    ["Eater of Worlds", "Brain of Cthulhu"],
    ["The Hive Mind", "The Perforators"],
    ["Queen Bee", "Skeletron", "Deerclops"],
    ["The Slime God"],
    ["Wall of Flesh"],
    ["Queen Slime", "Cryogen", "Aquatic Scourge", "The Twins", "The Destroyer", "Skeletron Prime", "Brimstone Elemental"],
    ["Calamitas Clone", "Plantera"],
    ["Leviathan and Anahita", "Golem", "Astrum Aureus", "Duke Fishron"],
    ["Plaguebringer Goliath", "Empress of Light", "Ravager", "Lunatic Cultist"],
    ["Astrum Deus", "Moon Lord"],
    ["Profaned Guardians", "Dragonfolly"],
    ["Providence"],
    ["Ceaseless Void", "Storm Weaver", "Signus", "Polterghast", "Old Duke"],
    ["Devourer of Gods"],
    ["Yharon"],
    ["Supreme Calamitas", "Exo Mechs"]
];

function registerGeneric(source, destination, latch) {
    let select = document.getElementById(latch);
    for (const item of source) {
        let element = document.createElement("button");
        element.classList.add("filter-option")
        element.textContent = item;
        element.addEventListener("click", () => {
            if (destination.includes(item)) {
                if (destination.indexOf(item) !== -1) {
                    destination.splice(destination.indexOf(item), 1);
                }
                element.classList.remove("toggle-green");
            } else {
                destination.push(item);
                element.classList.add("toggle-green");
            }
        });
        select.appendChild(element);
    }
}

function registerDifficulties() {
    function renderSelectedDifficulty() {
        let items = document.getElementsByClassName("difficulty-item");
        for (const item of items) {
            if (item.innerText === selectedDifficulty) {
                item.classList.add("difficulty-item-selected");
            } else {
                item.classList.remove("difficulty-item-selected");
            }
        }
    }
    
    let select = document.getElementById("difficulty-select");
    for (const diff of difficulties) {
        let button = document.createElement("button");
        button.classList.add("difficulty-item");
        button.style.backgroundImage = "url('https://calamitymod.wiki.gg/images/" + diff + "_Indicator.png')";
        button.innerText = diff;
        button.addEventListener("click", () => {
            selectedDifficulty = diff;
            renderSelectedDifficulty();
        });
        select.appendChild(button);
    }
    renderSelectedDifficulty();
}

function registerBossProgression() {
    function updateAllowedBossGroups() {
        let groups = document.getElementsByClassName("boss-group");
        let foundTerminator = false;
        for (let i = groups.length - 1; i >= 0; i--) {
            let boxes = groups[i].getElementsByClassName("boss-check");
            if (foundTerminator) {
                groups[i].classList.add("boss-group-disabled");
                for (const box of boxes) {
                    box.disabled = true;
                }
                continue
            }
            groups[i].classList.remove("boss-group-disabled");
            for (const box of boxes) {
                box.disabled = false;
                if (box.checked) {
                    foundTerminator = true;
                }
            }
        }
    }
    
    let select = document.getElementById("boss-progression");
    
    for (const bossGroup of progression) {
        let container = document.createElement("div");
        container.classList.add("boss-group");
        for (const boss of bossGroup) {
            let item = document.createElement("label");
            item.classList.add("boss-item");
            let box = document.createElement("input");
            box.classList.add("boss-check");
            box.type = "checkbox";
            box.name = boss;
            box.addEventListener("change", () => {
                updateAllowedBossGroups();
            });
            item.appendChild(box);
            container.appendChild(item);
            item.append(boss);
        }
        select.appendChild(container);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    registerDifficulties();
    registerBossProgression();
    registerGeneric(classes, selectedClasses, "filter-class");
    registerGeneric(filters, selectedFilters, "filter-filter");
    registerGeneric(itemTypes, selectedItemTypes, "filter-type");
});