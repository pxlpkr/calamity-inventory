let difficulties = ["Normal", "Expert", "Revengeance"]
let selectedDifficulty = "Revengeance";

let classes = ["Classless", "Melee", "Ranger", "Mage", "Summoner", "Rogue"];
let selectedClasses = [];

let filters = ["Offensive", "Defensive", "Mobility", "Utility", "Fishing", "Mining", "Abyss"];
let selectedFilters = [];

let itemTypes = ["Weapon", "Accessory", "Armor"];
let selectedItemTypes = [];

let searchContent = "";

let DEBUG = true;
let EDITING = false;
let editTarget;

let rarities = [
    "Gray",
    "White",
    "Blue",
    "Green",
    "Orange",
    "Light Red",
    "Pink",
    "Light Purple",
    "Lime",
    "Yellow",
    "Cyan",
    "Red",
    "Purple",
    "Turquoise",
    "Pure Green",
    "Dark Blue",
    "Violet",
    "Hot Pink",
    "Calamity Red",
    "Rainbow",
    "Fiery Red",
]

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
let selectedBosses = [];
let progressionTier = 0;

function getDiffId(diff) {
    return difficulties.indexOf(diff);
}

function getBossTier(boss) {
    for (let i = 0; i < progression.length; i++) {
        if (progression[i].includes(boss)) {
            return i;
        }
    }
    
    let overrides = {
        "Any Boss": 0,
        "Evil Boss 1": 1,
        "Evil Boss 2": 2,
        "Mech 1": 6,
        "Mech 2": 6,
        "Mech 3": 6
    };
    
    if (Object.keys(overrides).includes(boss)) {
        return overrides[boss];
    } else {
        return -1;
    }
}

function renderItems() {
    let cols = document.getElementsByClassName("item-col");
    
    for (const col of cols) {
        col.innerHTML = '';
    }
    
    outer: for (const item of items) {
        if (getDiffId(item["difficulty"]) > getDiffId(selectedDifficulty)) {
            continue;
        } else if (selectedClasses.length !== 0 && !selectedClasses.includes(item["class"])) {
            continue;
        } else if (selectedItemTypes.length !== 0 && !selectedItemTypes.includes(item["type"])) {
            continue;
        }
        
        if (!item["name"].toLowerCase().includes(searchContent.toLowerCase())) {
            continue;
        }
        
        for (const filter of selectedFilters) {
            if (!item["filters"].includes(filter)) {
                continue outer;
            }
        }

        for (const boss of item["bosses"]) {
            if (progressionTier < getBossTier(boss)) {
                continue outer;
            }
            if (progressionTier > getBossTier(boss)) {
                continue;
            }
            if (!selectedBosses.includes(boss)) {
                let mechCount = selectedBosses.filter(m => (["The Twins", "The Destroyer", "Skeletron Prime"].includes(m))).length;
                
                if (
                    !(boss === "Any Boss" && selectedBosses.length > 0) &&
                    !(boss === "Evil Boss 1" && progressionTier === 1) &&
                    !(boss === "Evil Boss 2" && progressionTier === 2) &&
                    !(boss === "Mech 1" && mechCount >= 1) &&
                    !(boss === "Mech 2" && mechCount >= 2) &&
                    !(boss === "Mech 3" && mechCount >= 3)
                ) {
                    continue outer;
                }
            }
        }
        
        let destination = cols[0];
        for (const col of cols) {
            if (col.childElementCount < destination.childElementCount) {
                destination = col;
            }
        }
        
        let redirectWrapper = document.createElement("a");
        redirectWrapper.href = `https://calamitymod.wiki.gg/wiki/${item["name"].replaceAll(" ", "_")}`;
        let element = document.createElement("div");
        element.classList.add("item");
        if (item["filters"].length === 0) {
            element.classList.add("item-needs-manual");
        }
        let name = document.createElement("div");
        name.classList.add("item-name", "rarity-" + item["rarity"].toLowerCase().replaceAll(" ", "-"));
        name.textContent = item["name"];
        element.appendChild(name);
        let icon = document.createElement("div");
        icon.classList.add("item-icon");
        let iconInner = document.createElement("div");
        iconInner.style.backgroundImage = `url("https://calamitymod.wiki.gg/images/${item["name"].replaceAll(" ", "_")}.png")`;
        iconInner.classList.add("item-icon-internal");
        icon.appendChild(iconInner);
        element.appendChild(icon);
        let desc = document.createElement("div");
        desc.classList.add("item-description");
        desc.textContent = item["description"];
        element.appendChild(desc);
        redirectWrapper.appendChild(element);
        destination.appendChild(redirectWrapper);
        
        if (DEBUG) {
            redirectWrapper.addEventListener("contextmenu", e => {
                e.preventDefault();
                if (!EDITING) {
                    document.getElementById("sidebar-left").classList.add("item-editing");
                    document.getElementById("sidebar-right").classList.add("item-editing");
                    element.classList.add("item-editing");
                    element.classList.remove("item-needs-manual");
                    EDITING = true;
                    editTarget = item;
                    renderEditingDisplay();
                    updateAllowedBossGroups();
                } else {
                    document.getElementById("sidebar-left").classList.remove("item-editing");
                    document.getElementById("sidebar-right").classList.remove("item-editing");
                    element.classList.remove("item-editing");
                    EDITING = false;
                    updateAllowedBossGroups();
                    document.getElementById("editing-container").innerHTML = '';
                }
            });
        }
    }
}

function registerGeneric(source, destination, latch, editKey, targetArray) {
    let select = document.getElementById(latch);
    for (const item of source) {
        let element = document.createElement("button");
        element.classList.add("filter-option")
        element.textContent = item;
        element.addEventListener("click", () => {
            if (EDITING) {
                if (targetArray) {
                    if (editTarget[editKey].includes(item)) {
                        editTarget[editKey].splice(editTarget[editKey].indexOf(item), 1);
                    } else {
                        editTarget[editKey].push(item);
                    }
                } else {
                    editTarget[editKey] = item;
                }
                renderEditingDisplay();
                return
            }
            if (destination.includes(item)) {
                if (destination.indexOf(item) !== -1) {
                    destination.splice(destination.indexOf(item), 1);
                }
                element.classList.remove("toggle-green");
            } else {
                destination.push(item);
                element.classList.add("toggle-green");
            }
            renderItems();
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
            if (EDITING) {
                editTarget["difficulty"] = diff;
                renderEditingDisplay();
                return
            }
            selectedDifficulty = diff;
            renderSelectedDifficulty();
            renderItems();
        });
        select.appendChild(button);
    }
    renderSelectedDifficulty();
}

function updateAllowedBossGroups() {
    let groups = document.getElementsByClassName("boss-group");
    let foundTerminator = false;
    progressionTier = 0;
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
                progressionTier = i;
            }
        }
        if (EDITING) {
            for (const box of boxes) {
                box.disabled = true;
            }
        }
    }
}

function registerBossProgression() {
    
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
                if (EDITING) {
                    return;
                }
                if (selectedBosses.includes(boss)) {
                    if (selectedBosses.indexOf(boss) !== -1) {
                        selectedBosses.splice(selectedBosses.indexOf(boss), 1);
                    }
                } else {
                    selectedBosses.push(boss);
                }
                updateAllowedBossGroups();
                renderItems();
            });
            item.addEventListener("mouseup", () => {
                if (EDITING) {
                    if (editTarget["bosses"].includes(boss)) {
                        editTarget["bosses"].splice(editTarget["bosses"].indexOf(boss), 1);
                    } else {
                        editTarget["bosses"].push(boss);
                    }
                    renderEditingDisplay();
                } 
            });
            item.appendChild(box);
            container.appendChild(item);
            item.append(boss);
        }
        select.appendChild(container);
    }
}

function renderEditingDisplay() {
    let select = document.getElementById("editing-container");
    select.innerHTML = '';
    select.append(`CLASS: ${editTarget["class"]}`);
    select.append(document.createElement("br"));
    select.append(`FILTERS: ${editTarget["filters"]}`);
    select.append(document.createElement("br"));
    select.append(`TYPE: ${editTarget["type"]}`);
    select.append(document.createElement("br"));
    select.append(`BOSSES: ${editTarget["bosses"]}`);
    select.append(document.createElement("br"));
    select.append(`DIFFICULTY: ${editTarget["difficulty"]}`);
    select.append(document.createElement("br"));
    let dl_button = document.createElement("button");
    dl_button.addEventListener("click", () => {
        const jsonString = JSON.stringify(items, null);
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "items-data-cfg-review.txt";

        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
    dl_button.textContent = "Download";
    select.append(dl_button);
    select.append(document.createElement("br"));
    select.append(`SPECIAL FLAGS: vvvv`);
    select.append(document.createElement("br"));
    let sf_1 = document.createElement("button");
    sf_1.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_1.textContent);
        renderEditingDisplay();
    });
    sf_1.textContent = "Any Boss";
    select.append(sf_1);
    let sf_2 = document.createElement("button");
    sf_2.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_2.textContent);
        renderEditingDisplay();
    });
    sf_2.textContent = "Evil Boss 1";
    select.append(sf_2);
    let sf_3 = document.createElement("button");
    sf_3.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_3.textContent);
        renderEditingDisplay();
    });
    sf_3.textContent = "Evil Boss 2";
    select.append(sf_3);
    let sf_4 = document.createElement("button");
    sf_4.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_4.textContent);
        renderEditingDisplay();
    });
    sf_4.textContent = "Mech 1";
    select.append(sf_4);
    let sf_5 = document.createElement("button");
    sf_5.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_5.textContent);
        renderEditingDisplay();
    });
    sf_5.textContent = "Mech 2";
    select.append(sf_5);
    let sf_6 = document.createElement("button");
    sf_6.addEventListener("click", () => {
        toggleListItem(editTarget["bosses"], sf_6.textContent);
        renderEditingDisplay();
    });
    sf_6.textContent = "Mech 3";
    select.append(sf_6);
    let sf_7 = document.createElement("button");
    sf_7.style.background = "red";
    sf_7.addEventListener("click", () => {
        toggleListItem(items, editTarget);
    });
    sf_7.textContent = "DELETE";
    select.append(sf_7);
}

function registerItems() {
    items.sort((a, b) => {
        if (b["bosses"].length === 0 && a["bosses"].length > b["bosses"].length) {
            return 1;
        }
        if (a["bosses"].length === 0 && a["bosses"].length < b["bosses"].length) {
            return -1;
        }
        if (getBossTier(a["bosses"][0]) > getBossTier(b["bosses"][0])) {
            return 1;
        }
        if (getBossTier(a["bosses"][0]) < getBossTier(b["bosses"][0])) {
            return -1;
        }
        if (rarities.indexOf(a["rarity"]) > rarities.indexOf(b["rarity"])) {
            return 1;
        }
        if (rarities.indexOf(a["rarity"]) < rarities.indexOf(b["rarity"])) {
            return -1;
        }
        return 0;
    });
    items.reverse();
}

function toggleListItem(list, item) {
    if (list.includes(item)) {
        list.splice(list.indexOf(item), 1);
    } else {
        list.push(item);
    }
}

function registerSearch() {
    document.getElementById("search").addEventListener("input", () => {
        searchContent = document.getElementById("search").value;
        renderItems();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    registerSearch();
    registerDifficulties();
    registerBossProgression();
    registerGeneric(classes, selectedClasses, "filter-class", "class", false);
    registerGeneric(filters, selectedFilters, "filter-filter", "filters", true);
    registerGeneric(itemTypes, selectedItemTypes, "filter-type", "type", false);
    registerItems();
    renderItems();
});