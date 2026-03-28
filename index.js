// TODO
// Class:
// Filter: Weapon/subtype, Tool/subtype
// Item Type: [MAKE SINGLE FILTER ONLY] Ammo, Potion(?), Tools

let difficulties = ["Normal", "Expert", "Revengeance", "Master", "Death"]
let selectedDifficulty = "Revengeance";

let classes = ["Classless", "Melee", "Ranger", "Mage", "Summoner", "Rogue"];
let selectedClasses = [];

let filters = [];
let filter_groups = [
    {
        "types": ["Accessory"],
        "classes": [],
        "values": ["Offensive", "Defensive", "Mobility", "Wings", "Utility", "Fishing", "Mining", "Abyss", "Informational", "Building"],
        "displayOnEdit": true
    },
    {
        "types": ["Weapon"],
        "classes": ["Melee"],
        "values": ["Sword", "Flail", "Spear", "Projectile Sword", "Boomerang"],
        "displayOnEdit": false
    },
    {
        "types": ["Weapon"],
        "classes": ["Mage"],
        "values": ["Magic Gun", "Tome", "Wand"],
        "displayOnEdit": false
    },
    {
        "types": ["Weapon"],
        "classes": ["Ranger"],
        "values": ["Bow", "Flamethrower", "Gun", "Launcher", "Dartgun"],
        "displayOnEdit": false
    },
    {
        "types": ["Weapon"],
        "classes": ["Rogue"],
        "values": ["Bomb", "Boomerang", "Dagger", "Javelin", "Spiky Ball"],
        "displayOnEdit": false
    },
    {
        "types": ["Weapon"],
        "classes": ["Summoner"],
        "values": ["Minion", "Sentry", "Whip"],
        "displayOnEdit": false
    },
    {
        "types": ["Tool"],
        "classes": [],
        "values": ["Pickaxe", "Axe", "Hammer"],
        "displayOnEdit": false
    },
    {
        "types": ["Ammo"],
        "classes": [],
        "values": ["Arrow", "Bullet", "Rocket", "Dart", "Sand"],
        "displayOnEdit": false
    },
    {
        "types": ["Armor"],
        "classes": [],
        "values": ["Helmet", "Chestplate", "Greaves"],
        "displayOnEdit": false
    }
];
let selectedFilters = [];

let itemTypes = ["Weapon", "Accessory", "Armor", "Tool", "Ammo"];
let selectedItemTypes = [];

let searchContent = "";
let showUnknown = true;

let DEBUG_ONLY_NEW = false;
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
    "Violet",
    "",
    "Dark Blue",
    "",
    "Hot Pink",
    "Pure Green",
    "Turquoise",
    "",
    "",
]

function getToolTimeString(toolTime) {
    if (toolTime <= 3) {
        return "Very Fast";
    } else if (toolTime <= 6) {
        return "Fast";
    } else if (toolTime <= 9) {
        return "Average";
    } else if (toolTime <= 12) {
        return "Slow";
    } else {
        return "Very Slow";
    }
}

function getKnockbackString(kb) {
    if (kb > 11) {
        return "Insane Knockback";
    } else if (kb > 9) {
        return "Extremely Strong Knockback";
    } else if (kb > 7) {
        return "Very Strong Knockback";
    } else if (kb > 6) {
        return "Strong Knockback";
    } else if (kb > 4) {
        return "Average Knockback";
    } else if (kb > 3) {
        return "Weak Knockback";
    } else if (kb > 1.5) {
        return "Very Weak Knockback";
    } else if (kb > 0) {
        return "Extremely Weak Knockback";
    } else {
        return "No Knockback";
    }
}

function getCooldownString(cd) {
    if (cd <= 8) {
        return "Insanely Fast Speed";
    } else if (cd <= 20) {
        return "Very Fast Speed";
    } else if (cd <= 25) {
        return "Fast Speed";
    } else if (cd <= 30) {
        return "Average Speed";
    } else if (cd <= 35) {
        return "Slow Speed";
    } else if (cd <= 45) {
        return "Very Slow Speed";
    } else if (cd <= 55) {
        return "Extremely Slow Speed";
    } else {
        return "Snail Speed";
    }
}

function getSortableRarityID(rarityID) {
    if (rarityID <= 11) {
        return rarityID;
    } else if (rarityID === 12) {
        return 15;
    } else if (rarityID === 14) {
        return 14;
    } else if (rarityID === 16) {
        return 16;
    } else if (rarityID === 17) {
        return 13;
    } else if (rarityID === 18) {
        return 12;
    } else {
        return 99;
    }
}

let progression = [
    ["King Slime", "Desert Scourge", "Eye of Cthulhu", "Crabulon"],
    ["Eater of Worlds", "Brain of Cthulhu"],
    ["The Hive Mind", "The Perforators"],
    ["Queen Bee", "Skeletron", "Deerclops"],
    ["The Slime God"],
    ["Wall of Flesh"],
    ["Queen Slime", "Cryogen", "The Twins", "Aquatic Scourge", "The Destroyer", "Brimstone Elemental", "Skeletron Prime"],
    ["Calamitas Clone", "Plantera"],
    ["Leviathan and Anahita", "Astrum Aureus", "Golem", "Duke Fishron"],
    ["Plaguebringer Goliath", "Empress of Light", "Ravager", "Lunatic Cultist"],
    ["Astrum Deus", "Moon Lord"],
    ["Profaned Guardians", "Dragonfolly"],
    ["Providence"],
    ["Ceaseless Void", "Storm Weaver", "Signus", "Polterghast", "Old Duke"],
    ["Devourer of Gods"],
    ["Yharon"],
    ["Exo Mechs", "Supreme Calamitas"]
];
let selectedBosses = [];
let progressionTier = 0;
let furthestBoss = "";
let lastSelectedBoss = "";

function getClassFromDamageType(damageType) {
    switch (damageType) {
        case "MeleeDamageClass":
        case "MeleeNoSpeedDamageClass":
        case "TrueMeleeDamageClass":
        case "TrueMeleeNoSpeedDamageClass":
            return ["Melee"];
        case "RangedDamageClass":
            return ["Ranger"];
        case "MagicDamageClass":
            return ["Mage"];
        case "SummonDamageClass":
        case "SummonMeleeSpeedDamageClass":
            return ["Summoner"];
        case "RogueDamageClass":
        case "StealthDamageClass":
            return ["Rogue"];
        case "MeleeRangedHybridDamageClass":
            return ["Ranger", "Melee"];
        default:
            return ["Classless"];
    }
}

function getDamageTypeFromClass(className) {
    switch (className) {
        case "Melee":
            return "MeleeDamageClass"
        case "Ranger":
            return "RangedDamageClass";
        case "Mage":
            return "MagicDamageClass";
        case "Summoner":
            return "SummonDamageClass";
        case "Rogue":
            return "RogueDamageClass";
        default:
            return "DefaultDamageClass";
    }
}

function getFancyDamageFromDamageType(damageType) {
    switch (damageType) {
        case "MeleeDamageClass":
        case "MeleeNoSpeedDamageClass":
        case "TrueMeleeDamageClass":
        case "TrueMeleeNoSpeedDamageClass":
            return "Melee ";
        case "RangedDamageClass":
            return "Ranged ";
        case "MagicDamageClass":
            return "Magic ";
        case "SummonDamageClass":
        case "SummonMeleeSpeedDamageClass":
            return "Summon ";
        case "RogueDamageClass":
        case "StealthDamageClass":
            return "Rogue ";
        case "MeleeRangedHybridDamageClass":
            return "Ranged/Melee ";
        default:
            return "";
    }
}

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

function getBossSubtier(boss) {
    for (let i = 0; i < progression.length; i++) {
        if (progression[i].includes(boss)) {
            return progression[i].indexOf(boss);
        }
    }

    let overrides = {
        "Any Boss": 1,
        "Evil Boss 1": 2,
        "Evil Boss 2": 2,
        "Mech 1": 2,
        "Mech 2": 4,
        "Mech 3": 6
    };

    if (Object.keys(overrides).includes(boss)) {
        return overrides[boss];
    } else {
        return -1;
    }
}

function addMiniStat(parent, str) {
    let elem = document.createElement("div");
    elem.innerText = str;
    elem.classList.add("mini-stat");
    parent.appendChild(elem);
}

function renderItems() {
    let cols = document.getElementsByClassName("item-col");

    for (const col of cols) {
        col.innerHTML = '';
    }

    let mechCount = selectedBosses.filter(m => (["The Twins", "The Destroyer", "Skeletron Prime"].includes(m))).length;

    let valid_item_count = 0;
    // let firstItemBossTier = null;
    outer: for (const item of items) {
        if (getDiffId(item["Difficulty"]) > getDiffId(selectedDifficulty)) {
            continue;
        }
        
        if (showUnknown && item["Stat"]["IsKnown"]) {
            continue;
        }
        
        if (item["Name"] === "$IGNORE" || item["Metadata"]["DeletionTarget"]) {
            continue;
        }
        
        if (selectedClasses.length > 0) {
            let found = false;
            classCheck: for (const cls of item["Classes"]) {
                let prettyClass = getClassFromDamageType(cls);
                for (const pcls of prettyClass) {
                    if (selectedClasses.includes(pcls)) {
                        found = true;
                        break classCheck;
                    }
                }
            }
            if (!found) {
                continue;
            }
        }
        
        for (const cls of selectedItemTypes) {
            if (!item["Flags"].includes(cls)) {
                continue outer;
            }
        }

        for (const cls of selectedFilters) {
            if (!item["Flags"].includes(cls)) {
                continue outer;
            }
        }

        if (!item["Name"].toLowerCase().includes(searchContent.toLowerCase()) &&
            !item["Description"].join(" ").toLowerCase().includes(searchContent.toLowerCase())) {
            continue;
        }

        if (DEBUG_ONLY_NEW) {
            if (item["Flags"].length !== 0) {
                continue;
            }
        }

        for (const boss of item["Bosses"]) {
            if (progressionTier < getBossTier(boss)) {
                continue outer;
            }
            if (progressionTier > getBossTier(boss)) {
                continue;
            }
            if (!selectedBosses.includes(boss)) {
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

        valid_item_count += 1;
        if (valid_item_count >= 300) {
            continue
        }

        // if (firstItemBossTier === null) {
        //     firstItemBossTier = getBossTier(item["Bosses"][0]);
        // }

        let destination = cols[0];
        for (const col of cols) {
            if (col.offsetHeight < destination.offsetHeight) {
                destination = col;
            }
        }

        let redirectWrapper = document.createElement("a");
        redirectWrapper.href = `https://${item["Mod"].toLowerCase()}.wiki.gg/wiki/${item["Name"].replaceAll(" ", "_")}`;
        redirectWrapper.target = "_blank";
        let element = document.createElement("div");
        element.classList.add("item");
        if (item["Flags"].length === 0) {
            element.classList.add("item-needs-manual");
        }
        let name = document.createElement("div");
        let tgtRarity = rarities[item["Rarity"] + 1].toLowerCase().replaceAll(" ", "-");
        if (getDiffId(item["Difficulty"]) >= getDiffId("Master")) {
            tgtRarity = "fiery-red";
        } else if (getDiffId(item["Difficulty"]) >= getDiffId("Expert")) {
            tgtRarity = "rainbow";
        }
        name.classList.add("item-name", "rarity-" + tgtRarity);
        if (item.hasOwnProperty("NameOverride") && item["NameOverride"] !== undefined) {
            name.textContent = item["NameOverride"];
        } else {
            name.textContent = item["Name"];
        }
        element.appendChild(name);
        let icon = document.createElement("div");
        icon.classList.add("item-icon");
        icon.classList.add(`item-${item["Mod"].toLowerCase()}`);
        let iconInner = document.createElement("div");
        iconInner.style.backgroundImage = `url("https://${item["Mod"].toLowerCase()}.wiki.gg/images/${item["Name"].replaceAll(" ", "_").replaceAll(":", "")}.png")`;
        iconInner.classList.add("item-icon-internal");
        icon.appendChild(iconInner);
        element.appendChild(icon);
        let statBox = document.createElement("div");
        statBox.classList.add("stat-box");
        if (item["Flags"].includes("Tool")) {
            addMiniStat(statBox, `${getToolTimeString(item["Stat"]["useTime"])} Mining Speed`);
            if (item["Stat"]["pickPower"] > 0) {
                addMiniStat(statBox, `${item["Stat"]["pickPower"]}% Pickaxe Power`);
            }
            if (item["Stat"]["axePower"] > 0) {
                addMiniStat(statBox, `${item["Stat"]["axePower"]}% Axe Power`);
            }
            if (item["Stat"]["hammerPower"] > 0) {
                addMiniStat(statBox, `${item["Stat"]["hammerPower"]}% Hammer Power`);
            }
            if (item["Stat"]["tileBoost"] !== 0) {
                addMiniStat(statBox, `+${item["Stat"]["tileBoost"]} Range`);
            }
        }
        
        if (item["Flags"].includes("Ammo") && !item["Flags"].includes("AmmoNoRender")) {
            addMiniStat(statBox, `${item["Stat"]["damage"]} Ranged Damage`);
            addMiniStat(statBox, `${getKnockbackString(item["Stat"]["knockback"])}`);
        }
        if (item["Flags"].includes("Weapon")) {
            addMiniStat(statBox, `${item["Stat"]["damage"]} ${getFancyDamageFromDamageType(item["Classes"][0])}Damage`);
            addMiniStat(statBox, `${item["Stat"]["crit"]+4}% Critical Chance`);
            addMiniStat(statBox, `${getKnockbackString(item["Stat"]["knockback"])}`);
            addMiniStat(statBox, `${getCooldownString(item["Stat"]["cooldown"])}`);
        }
        if (item["Flags"].includes("Armor")) {
            addMiniStat(statBox, `${item["Stat"]["defense"]} Defense`);
        }
        if (item["Flags"].includes("Accessory")) {
            if (item["Stat"]["defense"] !== 0) {
                addMiniStat(statBox, `${item["Stat"]["defense"]} Defense`);
            }
        }
        element.appendChild(statBox);
        let descStatBox = document.createElement("div");
        descStatBox.classList.add("stat-box");
        descStatBox.classList.add("no-bg");
        let desc = document.createElement("p");
        desc.classList.add("item-description");
        for (let i = 0; i < item["Description"].length; i++) {
            const descItem = item["Description"][i];
            desc.append(descItem);
            if (i !== item["Description"].length - 1) {
                desc.appendChild(document.createElement("br"));
            }
        }
        descStatBox.appendChild(desc);
        // if (getBossTier(item["Bosses"][0]) === getBossTier(furthestBoss)) {
        if (item["Bosses"].includes(lastSelectedBoss) ||
            item["Bosses"].includes("Any Boss") && selectedBosses.length === 1 ||
            item["Bosses"].includes("Evil Boss 1") && getBossTier(lastSelectedBoss) === 1 ||
            item["Bosses"].includes("Evil Boss 2") && getBossTier(lastSelectedBoss) === 2 ||
            item["Bosses"].includes("Mech 1") && mechCount === 1 && ["The Twins", "The Destroyer", "Skeletron Prime"].includes(lastSelectedBoss) ||
            item["Bosses"].includes("Mech 2") && mechCount === 2 && ["The Twins", "The Destroyer", "Skeletron Prime"].includes(lastSelectedBoss) ||
            item["Bosses"].includes("Mech 3") && mechCount === 3 && ["The Twins", "The Destroyer", "Skeletron Prime"].includes(lastSelectedBoss)) {
            let newPing = document.createElement("div");
            newPing.classList.add("new-indicator");
            newPing.textContent = "New!";
            element.appendChild(newPing);
        }
        element.appendChild(descStatBox);
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
                    renderFilters();
                    updateAllowedBossGroups();
                } else {
                    document.getElementById("sidebar-left").classList.remove("item-editing");
                    document.getElementById("sidebar-right").classList.remove("item-editing");
                    element.classList.remove("item-editing");
                    EDITING = false;
                    renderFilters();
                    updateAllowedBossGroups();
                    document.getElementById("editing-container").innerHTML = '';
                }
            });
        }
    }

    if (valid_item_count !== 1) {
        document.getElementById("result-count").textContent = `${valid_item_count} Results`;
        if (valid_item_count > 300) {
            let disclaimer = document.createElement("text");
            disclaimer.classList.add("gray-text");
            disclaimer.textContent = " (Showing first 300)";
            document.getElementById("result-count").appendChild(disclaimer);
        }
    } else {
        document.getElementById("result-count").textContent = `${valid_item_count} Result`;
    }
}

function renderFilters() {
    let select = document.getElementById("filter-filter");
    select.innerHTML = "";
    selectedFilters = [];
    outer: for (const elem of filter_groups) {
        if (!EDITING || (EDITING && !elem["displayOnEdit"])) {
            for (const t of elem["types"]) {
                if (!selectedItemTypes.includes(t)) {
                    continue outer
                }
            }
            for (const t of elem["classes"]) {
                if (!selectedClasses.includes(t)) {
                    continue outer
                }
            }
        }
        
        for (const item of elem["values"]) {
            let element = document.createElement("button");
            element.classList.add("filter-option")
            element.textContent = item;
            element.addEventListener("click", () => {
                if (EDITING) {
                    toggleListItem(editTarget["Metadata"]["Flags"], item);
                    renderEditingDisplay();
                    return
                }
                if (selectedFilters.includes(item)) {
                    if (selectedFilters.indexOf(item) !== -1) {
                        selectedFilters.splice(selectedFilters.indexOf(item), 1);
                    }
                    element.classList.remove("toggle-green");
                } else {
                    selectedFilters.push(item);
                    element.classList.add("toggle-green");
                }
                renderItems();
            });
            select.appendChild(element);
        }
    }
}

function registerGeneric(source, destination, latch, editKey, convertToDamageType) {
    let select = document.getElementById(latch);
    select.innerHTML = "";
    for (const item of source) {
        let element = document.createElement("button");
        element.classList.add("filter-option")
        element.textContent = item;
        element.addEventListener("click", () => {
            if (EDITING) {
                if (editKey !== null) {
                    console.log(editTarget["Metadata"]);
                    let kv = item;
                    if (convertToDamageType) {
                        kv = getDamageTypeFromClass(item);
                    }
                    toggleListItem(editTarget["Metadata"][editKey], kv);
                    renderEditingDisplay();
                }
                return;
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
            renderFilters();
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
                editTarget["Metadata"]["Difficulty"] = diff;
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
                    lastSelectedBoss = "";
                } else {
                    lastSelectedBoss = boss;
                    selectedBosses.push(boss);
                }
                
                furthestBoss = "";
                for (const boss of selectedBosses) {
                    if (getBossTier(boss) > getBossTier(furthestBoss) ||
                        (getBossTier(boss) === getBossTier(furthestBoss)
                            && getBossSubtier(boss) > getBossSubtier(furthestBoss))) {
                        furthestBoss = boss;
                    }
                }
                
                updateAllowedBossGroups();
                renderItems();
            });
            item.addEventListener("mouseup", () => {
                if (EDITING) {
                    toggleListItem(editTarget["Metadata"]["Bosses"], boss);
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
    select.append(`Bosses: ${editTarget["Metadata"]["Bosses"]}`);
    select.append(document.createElement("br"));
    select.append(`NameOverride: ${editTarget["Metadata"]["NameOverride"]}`);
    select.append(document.createElement("br"));
    select.append(`Flags: ${editTarget["Metadata"]["Flags"]}`);
    select.append(document.createElement("br"));
    // select.append(`DIFFICULTY: ${editTarget["Difficulty"]}`);
    // select.append(document.createElement("br"));
    let dl_button = document.createElement("button");
    dl_button.addEventListener("click", () => {
        let metaExport = [];
        for (const item of items) {
            metaExport.push(item["Metadata"]);
        }
        
        const jsonString = JSON.stringify(metaExport, null);
        
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
    dl_button.textContent = "Download Metadata";
    select.append(dl_button);
    select.append(document.createElement("br"));
    // let filt_button = document.createElement("button");
    // filt_button.addEventListener("click", () => {
    //     DEBUG_ONLY_NEW = !DEBUG_ONLY_NEW;
    //     renderItems();
    // });
    // filt_button.textContent = "Filter New";
    // select.append(filt_button);
    select.append(document.createElement("br"));
    select.append(`SPECIAL FLAGS: vvvv`);
    select.append(document.createElement("br"));
    let sf_1 = document.createElement("button");
    sf_1.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_1.textContent);
        renderEditingDisplay();
    });
    sf_1.textContent = "Any Boss";
    select.append(sf_1);
    let sf_2 = document.createElement("button");
    sf_2.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_2.textContent);
        renderEditingDisplay();
    });
    sf_2.textContent = "Evil Boss 1";
    select.append(sf_2);
    let sf_3 = document.createElement("button");
    sf_3.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_3.textContent);
        renderEditingDisplay();
    });
    sf_3.textContent = "Evil Boss 2";
    select.append(sf_3);
    let sf_4 = document.createElement("button");
    sf_4.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_4.textContent);
        renderEditingDisplay();
    });
    sf_4.textContent = "Mech 1";
    select.append(sf_4);
    let sf_5 = document.createElement("button");
    sf_5.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_5.textContent);
        renderEditingDisplay();
    });
    sf_5.textContent = "Mech 2";
    select.append(sf_5);
    let sf_6 = document.createElement("button");
    sf_6.addEventListener("click", () => {
        toggleListItem(editTarget["Metadata"]["Bosses"], sf_6.textContent);
        renderEditingDisplay();
    });
    sf_6.textContent = "Mech 3";
    select.append(sf_6);
    let sf_7 = document.createElement("button");
    sf_7.style.background = "red";
    sf_7.addEventListener("click", () => {
        editTarget["Metadata"]["DeletionTarget"] = true;
    });
    sf_7.textContent = "DELETE";
    select.append(sf_7);
    let sf_8 = document.createElement("input");
    sf_8.placeholder = "enter new item name";
    select.append(sf_8);
    let sf_9 = document.createElement("button");
    sf_9.addEventListener("click", () => {
        editTarget["Metadata"]["NameOverride"] = sf_8.value;
        editTarget["NameOverride"] = sf_8.value;
        renderEditingDisplay();
    });
    sf_9.textContent = "Apply Name";
    select.append(sf_9);
    select.append(document.createElement("br"));
    select.append(`RAW: ${JSON.stringify(editTarget["Metadata"])}`);
}

function registerItems() {
    items.sort((a, b) => {
        if (b["Bosses"].length === 0 && a["Bosses"].length > b["Bosses"].length) {
            return 1;
        }
        if (a["Bosses"].length === 0 && a["Bosses"].length < b["Bosses"].length) {
            return -1;
        }
        if (getBossTier(a["Bosses"][0]) > getBossTier(b["Bosses"][0])) {
            return 1;
        }
        if (getBossTier(a["Bosses"][0]) < getBossTier(b["Bosses"][0])) {
            return -1;
        }
        
        let subtierA = -1;
        for (const boss of a["Bosses"]) {
            let tier = getBossSubtier(boss);
            if (tier > subtierA) {
                subtierA = tier;
            }
        }

        let subtierB = -1;
        for (const boss of b["Bosses"]) {
            let tier = getBossSubtier(boss);
            if (tier > subtierB) {
                subtierB = tier;
            }
        }
        
        if (subtierA > subtierB) {
            return 1;
        }
        if (subtierA < subtierB) {
            return -1;
        }
        if (getSortableRarityID(a["Rarity"]) > getSortableRarityID(b["Rarity"])) {
            return 1;
        }
        if (getSortableRarityID(a["Rarity"]) < getSortableRarityID(b["Rarity"])) {
            return -1;
        }
        return b["Name"].localeCompare(a["Name"]);
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
    searchContent = document.getElementById("search").value;
}

document.addEventListener("DOMContentLoaded", () => {
    registerSearch();
    registerDifficulties();
    registerBossProgression();
    registerGeneric(classes, selectedClasses, "filter-class", "Classes", true);
    registerGeneric(itemTypes, selectedItemTypes, "filter-type", "Flags", false);
    renderFilters();
    registerItems();
    renderItems();
});