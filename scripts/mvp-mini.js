// Defense Stats From Nila & Isle (160 & LHZ)
const MONSTER_DATA = {
  "Phreeoni": { size: "Large", race: "Brute", attr: "Neutral",
    140: { def: 106.98, dmgred: 204.60 },
    150: { def: 136.62, dmgred: 311.20 },
    160: { def: 154.89, dmgred: 367.10 }
  },
  "Mistress": { size: "Small", race: "Insect", attr: "Wind",
    140: { def: 130.18, dmgred: 272.80 },
    150: { def: 161.98, dmgred: 361.00 },
    160: { def: 183.99, dmgred: 425.90 }
  },
  "Eddga": { size: "Large", race: "Brute", attr: "Fire",
    140: { def: 106.98, dmgred: 204.60 },
    150: { def: 136.62, dmgred: 311.20 },
    160: { def: 154.89, dmgred: 367.10 }
  },
  "Kraken": { size: "Large", race: "Fish", attr: "Water",
    140: { def: 130.18, dmgred: 272.80 },
    150: { def: 161.98, dmgred: 361.00 },
    160: { def: 183.99, dmgred: 425.90 }
  },
  "Maya": { size: "Large", race: "Insect", attr: "Earth",
    140: { def: 98.97,  dmgred: 136.40 },
    150: { def: 118.76, dmgred: 186.70 },
    160: { def: 135.46, dmgred: 220.31 }
  },
  "Orc Hero": { size: "Large", race: "Demi-Human", attr: "Earth",
    140: { def: 82.47,  dmgred: 136.40 },
    150: { def: 110.67, dmgred: 261.40 },
    160: { def: 125.11, dmgred: 308.41 }
  },
  "Pharaoh": { size: "Large", race: "Demi-Human", attr: "Shadow",
    140: { def: 98.97,  dmgred: 136.40 },
    150: { def: 118.76, dmgred: 186.70 },
    160: { def: 135.46, dmgred: 220.31 }
  },
  "Orc Lord": { size: "Large", race: "Demi-Human", attr: "Earth",
    140: { def: 82.47,  dmgred: 136.40 },
    150: { def: 110.67, dmgred: 261.40 },
    160: { def: 125.11, dmgred: 308.41 }
  },
  "Doppelganger": { size: "Medium", race: "Demon", attr: "Shadow",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Amon Ra": { size: "Large", race: "Demi-Human", attr: "Earth",
    140: { def: 106.98, dmgred: 204.60 },
    150: { def: 136.62, dmgred: 311.20 },
    160: { def: 154.89, dmgred: 367.10 }
  },
  "Morroc": { size: "Large", race: "Demon", attr: "Shadow",
    140: { def: 131.97, dmgred: 136.40 },
    150: { def: 169.17, dmgred: 261.40 },
    160: { def: 193.36, dmgred: 308.41 }
  },
  "Time Holder": { size: "Large", race: "Demon", attr: "Neutral",
    140: { def: 164.97, dmgred: 136.40 },
    150: { def: 196.76, dmgred: 186.70 },
    160: { def: 226.46, dmgred: 220.31 }
  },
  "Tao Gunka": { size: "Large", race: "Demon", attr: "Neutral",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Lost Dragon": { size: "Large", race: "Dragon", attr: "Shadow",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Fallen Bishop": { size: "Medium", race: "Demon", attr: "Shadow",
    140: { def: 164.97, dmgred: 136.40 },
    150: { def: 196.76, dmgred: 186.70 },
    160: { def: 226.46, dmgred: 220.31 }
  },
  "Lord of the Dead": { size: "Large", race: "Demon", attr: "Shadow",
    140: { def: 131.97, dmgred: 136.40 },
    150: { def: 169.17, dmgred: 261.40 },
    160: { def: 193.36, dmgred: 308.41 }
  },
  "Arc Angeling": { size: "Medium", race: "Angel", attr: "Holy",
    140: { def: 164.97, dmgred: 136.40 },
    150: { def: 196.76, dmgred: 186.70 },
    160: { def: 226.46, dmgred: 220.31 }
  },
  "Gioia": { size: "Large", race: "Formless", attr: "Wind",
    140: { def: 212.68, dmgred: 272.80 },
    150: { def: 259.48, dmgred: 361.00 },
    160: { def: 297.74, dmgred: 425.90 }
  },
  "RSX-0806": { size: "Medium", race: "Formless", attr: "Neutral",
    140: { def: 238.66, dmgred: 202.00 },
    150: { def: 293.16, dmgred: 317.00 },
    160: { def: 337.67, dmgred: 376.00 }
  },
  "Nidhoggr's Shadow": { size: "Large", race: "Dragon", attr: "Shadow",
    140: { def: 181.21, dmgred: 134.00 },
    150: { def: 228.13, dmgred: 266.00 },
    160: { def: 262.30, dmgred: 316.00 }
  },
  "Gloom Under Night": { size: "Large", race: "Formless", attr: "Ghost",
    140: { def: 306.00, dmgred: 300.00 },
    150: { def: 357.57, dmgred: 367.00 },
    160: { def: 412.30, dmgred: 436.00 }
  },
  "Retribution": { size: "Medium", race: "Angel", attr: "Shadow",
    140: { def: 256.50, dmgred: 300.00 },
    150: { def: 299.07, dmgred: 367.00 },
    160: { def: 344.05, dmgred: 436.00 }
  },
  "Shadow Chaser Gertie": { size: "Small", race: "Demi-Human", attr: "Undead",
    150: { def: 342.44, dmgred: 294.07 },
    160: { def: 397.23, dmgred: 347.00 }
  },
  "Genetic Flamel": { size: "Medium", race: "Demi-Human", attr: "Fire",
    150: { def: 382.63, dmgred: 326.69 },
    160: { def: 443.85, dmgred: 385.50 }
  },
  "Dragon Fly": { size: "Small", race: "Insect", attr: "Wind",
    140: { def: 106.98, dmgred: 204.60 },
    150: { def: 136.62, dmgred: 311.20 },
    160: { def: 154.89, dmgred: 367.10 }
  },
  "Eclipse": { size: "Small", race: "Brute", attr: "Neutral",
    140: { def: 130.18, dmgred: 272.80 },
    150: { def: 161.98, dmgred: 361.00 },
    160: { def: 183.99, dmgred: 425.90 }
  },
  "Mastering": { size: "Medium", race: "Plant", attr: "Water",
    140: { def: 130.18, dmgred: 272.80 },
    150: { def: 161.98, dmgred: 361.00 },
    160: { def: 183.99, dmgred: 425.90 }
  },
  "Ghostring": { size: "Medium", race: "Demon", attr: "Ghost",
    140: { def: 106.98, dmgred: 204.60 },
    150: { def: 136.62, dmgred: 311.20 },
    160: { def: 154.89, dmgred: 367.10 }
  },
  "Toad": { size: "Small", race: "Fish", attr: "Water",
    140: { def: 98.97,  dmgred: 136.40 },
    150: { def: 118.76, dmgred: 186.70 },
    160: { def: 135.46, dmgred: 220.31 }
  },
  "King Dramoh": { size: "Large", race: "Fish", attr: "Water",
    140: { def: 82.47,  dmgred: 136.40 },
    150: { def: 110.67, dmgred: 261.40 },
    160: { def: 125.11, dmgred: 308.40 }
  },
  "Angeling": { size: "Medium", race: "Angel", attr: "Holy",
    140: { def: 98.97,  dmgred: 136.40 },
    150: { def: 118.76, dmgred: 186.70 },
    160: { def: 146.01, dmgred: 220.31 }
  },
  "Deviling": { size: "Medium", race: "Demon", attr: "Shadow",
    140: { def: 82.47,  dmgred: 136.40 },
    150: { def: 110.66, dmgred: 261.40 },
    160: { def: 125.11, dmgred: 308.40 }
  },
  "Dark Priest": { size: "Medium", race: "Demon", attr: "Undead",
    140: { def: 212.68, dmgred: 272.80 },
    150: { def: 259.48, dmgred: 361.00 },
    160: { def: 297.74, dmgred: 425.90 }
  },
  "Vagabond Wolf": { size: "Medium", race: "Brute", attr: "Earth",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Chimera": { size: "Large", race: "Brute", attr: "Fire",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Mysteltainn": { size: "Large", race: "Formless", attr: "Shadow",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Ogretooth": { size: "Medium", race: "Formless", attr: "Shadow",
    140: { def: 212.68, dmgred: 306.35 },
    150: { def: 259.48, dmgred: 385.89 },
    160: { def: 297.74, dmgred: 451.84 }
  },
  "Necromancer": { size: "Medium", race: "Undead", attr: "Undead",
    140: { def: 131.97, dmgred: 150.75 },
    150: { def: 169.17, dmgred: 272.00 },
    160: { def: 193.36, dmgred: 324.64 }
  },
  "Coelacanth": { size: "Large", race: "Fish", attr: "Water",
    140: { def: 139.98, dmgred: 204.60 },
    150: { def: 175.62, dmgred: 311.20 },
    160: { def: 200.39, dmgred: 367.10 }
  },
  "Naght Sieger": { size: "Large", race: "Demon", attr: "Ghost",
    140: { def: 212.68, dmgred: 272.80 },
    150: { def: 259.48, dmgred: 361.00 },
    160: { def: 297.74, dmgred: 425.90 }
  },
  "Observation": { size: "Medium", race: "Angel", attr: "Neutral",
    140: { def: 146.68, dmgred: 272.80 },
    150: { def: 181.48, dmgred: 361.00 },
    160: { def: 206.74, dmgred: 425.90 }
  },
  "Skeggiold": { size: "Small", race: "Angel", attr: "Holy",
    140: { def: 172.98, dmgred: 204.60 },
    150: { def: 214.62, dmgred: 311.20 },
    160: { def: 245.89, dmgred: 367.10 }
  },
  "Queen Scaraba": { size: "Small", race: "Insect", attr: "Earth",
    140: { def: 212.30, dmgred: 268.70 },
    150: { def: 258.55, dmgred: 351.40 },
    160: { def: 296.40, dmgred: 410.50 }
  },
  "Faceworm Queen": { size: "Small", race: "Insect", attr: "Poison",
    140: { def: 245.30, dmgred: 268.70 },
    150: { def: 297.55, dmgred: 351.40 },
    160: { def: 341.90, dmgred: 410.50 }
  },
  "Ktullanux": { size: "Large", race: "Dragon", attr: "Water",
    140: { def: 256.50, dmgred: 542.27 },
    150: { def: 299.07, dmgred: 575.77 },
    160: { def: 344.05, dmgred: 436.00 }
  },
  "Shelter": { size: "Medium", race: "Angel", attr: "Holy",
    140: { def: 251.18, dmgred: 258.00 },
    150: { def: 293.16, dmgred: 317.00 },
    160: { def: 337.67, dmgred: 376.00 }
  },
  "Sorcerer Celia": { size: "Small", race: "Undead", attr: "Ghost",
    150: { def: 342.44, dmgred: 294.07 },
    160: { def: 397.23, dmgred: 347.00 }
  },
  "Ranger Cecil": { size: "Small", race: "Demi-Human", attr: "Wind",
    150: { def: 299.07, dmgred: 261.36 },
    160: { def: 348.95, dmgred: 308.40 }
  },
};

const AVG_ENTRIES = {
  "DUMMY Lvl.0 (0 DEF)":        { def:   0.00, dmgred:   0.00 },

  "Avg. MVP Lvl.130":            { def: 182.27, dmgred: 148.10 },
  "Avg. MINI Lvl.130":           { def: 206.45, dmgred: 165.52 },
  "Avg. MVP MINI Lvl.130":       { def: 194.36, dmgred: 156.81 },

  "Avg. MVP Lvl.140":            { def: 155.32, dmgred: 191.35 },
  "Avg. MINI Lvl.140":           { def: 161.41, dmgred: 233.48 },
  "Avg. MVP MINI Lvl.140":       { def: 158.37, dmgred: 212.41 },

  "Avg. MVP Lvl.150":            { def: 191.03, dmgred: 283.92 },
  "Avg. MINI Lvl.150":           { def: 198.53, dmgred: 324.23 },
  "Avg. MVP MINI Lvl.150":       { def: 194.78, dmgred: 304.08 },

  "Avg. Small MVP Lvl.140":      { def: 130.18, dmgred: 272.80, sizeMob: "Small"  },
  "Avg. Medium MVP Lvl.140":     { def: 199.62, dmgred: 195.88, sizeMob: "Medium" },
  "Avg. Large MVP Lvl.140":      { def: 143.05, dmgred: 184.84, sizeMob: "Large"  },

  "Avg. Small MINI Lvl.140":     { def: 161.12, dmgred: 225.97, sizeMob: "Small"  },
  "Avg. Medium MINI Lvl.140":    { def: 148.23, dmgred: 212.13, sizeMob: "Medium" },
  "Avg. Large MINI Lvl.140":     { def: 178.61, dmgred: 267.37, sizeMob: "Large"  },

  "Avg. Small MVP Lvl.150":      { def: 161.98, dmgred: 361.00, sizeMob: "Small"  },
  "Avg. Medium MVP Lvl.150":     { def: 240.07, dmgred: 273.72, sizeMob: "Medium" },
  "Avg. Large MVP Lvl.150":      { def: 177.51, dmgred: 282.29, sizeMob: "Large"  },

  "Avg. Small MINI Lvl.150":     { def: 198.01, dmgred: 312.15, sizeMob: "Small"  },
  "Avg. Medium MINI Lvl.150":    { def: 182.88, dmgred: 304.72, sizeMob: "Medium" },
  "Avg. Large MINI Lvl.150":     { def: 219.08, dmgred: 359.67, sizeMob: "Large"  },
};

const DEFENSE_TABLE = { ...AVG_ENTRIES };

for (const [name, data] of Object.entries(MONSTER_DATA)) {
  for (const [key, val] of Object.entries(data)) {
    const lvl = Number(key);
    if (!lvl) continue;

    DEFENSE_TABLE[`${name} Lv.${lvl}`] = {
      def:          val.def,
      dmgred:       val.dmgred,
      sizeMob:      data.size,
      raceMob:      data.race,
      attributeMob: data.attr,
    };
  }
}

const RACE_TYPES = [
  "Angel",
  "Demon",
  "Formless",
  "Insect",
  "Fish",
  "Demi-Human",
  "Undead",
  "Dragon",
  "Plant",
  "Brute"
];