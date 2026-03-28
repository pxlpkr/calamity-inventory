for (const item of items) {
    switch (item["Name"]) {
        case "Sand Block":
            item["Stat"]["damage"] = 30;
            break;
        case "Pearlsand Block":
        case "Ebonsand Block":
        case "Crimsand Block":
            item["Stat"]["damage"] = 35;
            item["Description"].push("Infinite pierce");
            break;
        case "Astral Sand":
            item["Stat"]["damage"] = 22;
            item["Description"].push("On hit, splits into 3 mini homing sands that deal half damage");
            break;
        case "Eutrophic Sand":
            item["Stat"]["damage"] = 17;
            item["Description"].push("Inflicts Eutrophication for 5 seconds");
            break;
        case "Sulphurous Sand":
            item["Stat"]["damage"] = 22;
            item["Description"].push("Inflicts Irradiated for 2.5 seconds", "Pierces once");
            break;
        case "Dunesand":
            item["Stat"]["damage"] = 27;
            item["Description"].push("Half speed and no gravity for the first 3 seconds", "Infinite pierce");
            break;
        case "Polyp Sand":
            item["Stat"]["damage"] = 22;
            item["Description"].push("Small homing range and can pass through platforms");
            break;
        case "Volcanic Sand":
            item["Stat"]["damage"] = 11;
            item["Description"].push("Fires a shotgun of 4 additional mini sands", "Infinite pierce");
            break;
        case "Enchanted Sword":
            item["Name"] = "Enchanted Sword (item)"
            break;
        case "Copper Coin":
            item["Flags"] = ["Ammo"];
            break;
        case "Silver Coin":
            item["Flags"] = ["Ammo"];
            break;
        case "Gold Coin":
            item["Flags"] = ["Ammo"];
            break;
        case "Platinum Coin":
            item["Flags"] = ["Ammo"];
            break;
        case "Blue Phasesaber":
        case "Green Phasesaber":
        case "Purple Phasesaber":
        case "Red Phasesaber":
        case "White Phasesaber":
        case "Yellow Phasesaber":
        case "Blue Phaseblade":
        case "Green Phaseblade":
        case "Purple Phaseblade":
        case "Red Phaseblade":
        case "White Phaseblade":
        case "Yellow Phaseblade":
        case "White Paper Airplane":
        case "Blue Counterweight":
        case "Green Counterweight":
        case "Purple Counterweight":
        case "Yellow Counterweight":
        case "Red Counterweight":
        case "Glowing Fishing Bobber":
            item["Name"] = "$IGNORE";
            break;
        case "Snowball":
            item["Flags"].push("AmmoNoRender");
            break;
        case "Explosive Bunny":
        case "Cannonball":
        case "Baby Cannonball Jellyfish":
            toggleListItem(item["Flags"], "Weapon");
            toggleListItem(item["Flags"], "Ammo");
            break;
    }
    
    if (item["Name"].includes("Music Box") || item["Name"].includes("Golf Ball") ||
        (item["Name"].includes("String") && item["Name"] !== "White String") ||
        (item["Name"].includes("Moss Fishing Bobber"))) {
        item["Name"] = "$IGNORE";
    }
}

// for (const metaItem of oldMetadata) {
//     if (metaItem["type"] === "Weapon") {
//         metadata.push({
//             Name: metaItem["name"],
//             Bosses: metaItem["bosses"],
//             Flags: [],
//         });
//     } else if (metaItem["type"] === "Accessory") {
//         metadata.push({
//             Name: metaItem["name"],
//             Bosses: metaItem["bosses"],
//             Flags: metaItem["filters"],
//             Classes: [getDamageTypeFromClass(metaItem["class"])]
//         });
//     }
// }

for (const item of items) {
    item["Metadata"] = {
        Name: item["Name"],
        Bosses: [],
        Flags: [],
        Classes: []
    };
    
    if (item["Flags"].includes("Tool")) {
        item["Classes"] = ["DefaultDamageClass"];
    }
    
    for (const metaItem of metadata) {
        if (metaItem["Name"] === item["Name"]) {
            item["Bosses"] = metaItem["Bosses"];
            item["Metadata"] = metaItem;
            if (metaItem.hasOwnProperty("NameOverride")) {
                item["NameOverride"] = metaItem["NameOverride"];
            }
            if (metaItem.hasOwnProperty("DeletionTarget")) {
                item["DeletionTarget"] = metaItem["DeletionTarget"];
            }
            if (metaItem.hasOwnProperty("Difficulty")) {
                item["Difficulty"] = metaItem["Difficulty"];
            }
            item["Flags"].push(...metaItem["Flags"]);
            if (!metaItem.hasOwnProperty("Classes")) {
                metaItem["Classes"] = [];
            }
            item["Classes"].push(...metaItem["Classes"]);
        }
    }
}

// for (const olditem of itemsold) {
//     olditem["IsKnown"] = false;
// }
//
// for (const item of items) {
//     item["Stat"]["IsKnown"] = false;
//     for (const olditem of oldMetadata) {
//         if (item["Name"] === olditem["name"]) {
//             item["Stat"]["IsKnown"] = true;
//             olditem["IsKnown"] = true;
//             break;
//         }
//     }
// }
//
// for (const olditem of itemsold) {
//     if (!olditem["IsKnown"]) {
//         console.log(olditem["name"]);
//         items.add({
//             "Name": olditem["name"],
//             "Rarity": -1,
//             "Flags": ["Upgrade"],
//             "Description": olditem["description"],
//             "Difficulty": "Normal",
//             "Bossses": [],
//             "Classes": [],
//             "Mod": olditem["format"]
//         });
//     }
// }