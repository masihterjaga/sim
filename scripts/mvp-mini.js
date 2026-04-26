// Defense Stats From Nila & Isle (16)
const DEFENSE_TABLE = {

  "DUMMY Lvl.0 (0 DEF)": {
    def: 0,
    dmgred: 0
  },

  "Avg. MVP Lvl.130": {
    def: 182.27,
    dmgred: 148.10
  },
  "Avg. MINI Lvl.130": {
    def: 206.45,
    dmgred: 165.52
  },
  "Avg. MVP MINI Lvl.130": {
    def: 194.36,
    dmgred: 156.81
  },
  "Avg. MVP Lvl.140": {
    def: 155.32,
    dmgred: 191.35
  },
  "Avg. MINI Lvl.140": {
    def: 161.41,
    dmgred: 233.48
  },
  "Avg. MVP MINI Lvl.140": {
    def: 158.37,
    dmgred: 212.41
  },
  "Avg. MVP Lvl.150": {
    def: 191.03,
    dmgred: 283.92
  },
  "Avg. MINI Lvl.150": {
    def: 198.53,
    dmgred: 324.23
  },
  "Avg. MVP MINI Lvl.150": {
    def: 194.78,
    dmgred: 304.08
  },
  "Avg. Small MVP Lvl.140": {
    def: 130.18,
    dmgred: 272.80,
    sizeMob: "Small"
  },
  "Avg. Medium MVP Lvl.140": {
    def: 199.62,
    dmgred: 195.88,
    sizeMob: "Medium"
  },
  "Avg. Large MVP Lvl.140": {
    def: 143.05,
    dmgred: 184.84,
    sizeMob: "Large"
  },
  "Avg. Small MINI Lvl.140": {
    def: 161.12,
    dmgred: 225.97,
    sizeMob: "Small"
  },
  "Avg. Medium MINI Lvl.140": {
    def: 148.23,
    dmgred: 212.13,
    sizeMob: "Medium"
  },
  "Avg. Large MINI Lvl.140": {
    def: 178.61,
    dmgred: 267.37,
    sizeMob: "Large"
  },
  "Avg. Small MVP Lvl.150": {
    def: 161.98,
    dmgred: 361.00,
    sizeMob: "Small"
  },
  "Avg. Medium MVP Lvl.150": {
    def: 240.07,
    dmgred: 273.72,
    sizeMob: "Medium"
  },
  "Avg. Large MVP Lvl.150": {
    def: 177.51,
    dmgred: 282.29,
    sizeMob: "Large"
  },
  "Avg. Small MINI Lvl.150": {
    def: 198.01,
    dmgred: 312.15,
    sizeMob: "Small"
  },
  "Avg. Medium MINI Lvl.150": {
    def: 182.88,
    dmgred: 304.72,
    sizeMob: "Medium"
  },
  "Avg. Large MINI Lvl.150": {
    def: 219.08,
    dmgred: 359.67,
    sizeMob: "Large"
  },

  "Phreeoni Lv.160": {
    def: 154.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mistress Lv.160": {
    def: 183.99,
    dmgred: 425.90,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eddga Lv.160": {
    def: 154.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Kraken Lv.160": {
    def: 183.99,
    dmgred: 425.90,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Maya Lv.160": {
    def: 135.46,
    dmgred: 220.31,
    sizeMob: "Large",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Orc Hero Lv.160": {
    def: 125.11,
    dmgred: 308.41,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Pharaoh Lv.160": {
    def: 135.46,
    dmgred: 220.31,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Shadow"
  },
  "Orc Lord Lv.160": {
    def: 125.11,
    dmgred: 308.41,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Doppelganger Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Amon Ra Lv.160": {
    def: 154.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Morroc Lv.160": {
    def: 193.36,
    dmgred: 308.41,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Time Holder Lv.160": {
    def: 226.46,
    dmgred: 220.31,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Tao Gunka Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Lost Dragon Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Fallen Bishop Lv.160": {
    def: 226.46,
    dmgred: 220.31,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Lord of the Dead Lv.160": {
    def: 193.36,
    dmgred: 308.41,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Arc Angeling Lv.160": {
    def: 226.46,
    dmgred: 220.31,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Gioia Lv.160": {
    def: 297.74,
    dmgred: 425.90,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Wind"
  },
  "RSX-0806 Lv.160": {
    def: 337.67,
    dmgred: 376.00,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Neutral"
  },
  "Nidhoggr's Shadow Lv.160": {
    def: 262.30,
    dmgred: 316.00,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Gloom Under Night Lv.160": {
    def: 412.30,
    dmgred: 436.00,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Ghost"
  },
  "Retribution Lv.160": {
    def: 344.05,
    dmgred: 436.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Shadow"
  },
  "Shadow Chaser Gertie Lv.160": {
    def: 397.23,
    dmgred: 347.00,
    sizeMob: "Small",
    raceMob: "Demi-Human",
    attributeMob: "Undead"
  },
  "Genetic Flamel Lv.160": {
    def: 443.85,
    dmgred: 385.50,
    sizeMob: "Medium",
    raceMob: "Demi-Human",
    attributeMob: "Fire"
  },
  "Dragon Fly Lv.160": {
    def: 154.89,
    dmgred: 367.10,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eclipse Lv.160": {
    def: 183.99,
    dmgred: 425.90,
    sizeMob: "Small",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mastering Lv.160": {
    def: 183.99,
    dmgred: 425.90,
    sizeMob: "Medium",
    raceMob: "Plant",
    attributeMob: "Water"
  },
  "Ghostring Lv.160": {
    def: 154.89,
    dmgred: 367.10,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Toad Lv.160": {
    def: 135.46,
    dmgred: 220.31,
    sizeMob: "Small",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "King Dramoh Lv.160": {
    def: 125.11,
    dmgred: 308.40,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Angeling Lv.160": {
    def: 146.01,
    dmgred: 220.31,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Deviling Lv.160": {
    def: 125.11,
    dmgred: 308.40,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Dark Priest Lv.160": {
    def: 297.74,
    dmgred: 425.90,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Undead"
  },
  "Vagabond Wolf Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Medium",
    raceMob: "Brute",
    attributeMob: "Earth"
  },
  "Chimera Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Mysteltainn Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Ogretooth Lv.160": {
    def: 297.74,
    dmgred: 451.84,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Necromancer Lv.160": {
    def: 193.36,
    dmgred: 324.64,
    sizeMob: "Medium",
    raceMob: "Undead",
    attributeMob: "Undead"
  },
  "Coelacanth Lv.160": {
    def: 200.39,
    dmgred: 367.10,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Naght Sieger Lv.160": {
    def: 297.74,
    dmgred: 425.90,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Observation Lv.160": {
    def: 206.74,
    dmgred: 425.90,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Neutral"
  },
  "Skeggiold Lv.160": {
    def: 245.89,
    dmgred: 367.10,
    sizeMob: "Small",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Queen Scaraba Lv.160": {
    def: 296.40,
    dmgred: 410.50,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Faceworm Queen Lv.160": {
    def: 341.90,
    dmgred: 410.50,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Poison"
  },
  "Ktullanux Lv.160": {
    def: 344.05,
    dmgred: 436.00,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Water"
  },
  "Shelter Lv.160": {
    def: 337.67,
    dmgred: 376.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Sorcerer Celia Lv.160": {
    def: 397.23,
    dmgred: 347.00,
    sizeMob: "Small",
    raceMob: "Undead",
    attributeMob: "Ghost"
  },
  "Ranger Cecil Lv.160": {
    def: 348.95,
    dmgred: 308.40,
    sizeMob: "Small",
    raceMob: "Demi-Human",
    attributeMob: "Wind"
  },

  "Phreeoni Lv.150": {
    def: 136.61930000000004,//136.62,
    dmgred: 311.1982999999999,//311.20019999999994,//311.20,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mistress Lv.150": {
    def: 161.9804,//161.98,
    dmgred: 361.0001,//361.00,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eddga Lv.150": {
    def: 136.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Kraken Lv.150": {
    def: 161.98029000000008,//161.98,
    dmgred: 361.00016999999957,//361.00,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Maya Lv.150": {
    def: 118.76800000000033,//118.76,
    dmgred: 186.69310000000044,//186.70,
    sizeMob: "Large",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Orc Hero Lv.150": {
    def: 110.66980000000007,//110.67,
    dmgred: 261.3984999999999,//261.40,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Pharaoh Lv.150": {
    def: 118.76,
    dmgred: 186.70,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Shadow"
  },
  "Orc Lord Lv.150": {
    def: 110.66980000000007, //110.67,
    dmgred: 261.3984999999999, //261.40,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Doppelganger Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Amon Ra Lv.150": {
    def: 136.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Morroc Lv.150": {
    def: 169.17,
    dmgred: 261.40,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Time Holder Lv.150": {
    def: 196.76,
    dmgred: 186.70,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Tao Gunka Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Lost Dragon Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Fallen Bishop Lv.150": {
    def: 196.76,
    dmgred: 186.70,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Lord of the Dead Lv.150": {
    def: 169.17,
    dmgred: 261.40,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Arc Angeling Lv.150": {
    def: 196.75721000000007,//196.76,
    dmgred: 186.697,//186.70,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Gioia Lv.150": {
    def: 259.48,
    dmgred: 361.00,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Wind"
  },
  "RSX-0806 Lv.150": {
    def: 293.16,
    dmgred: 317.00,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Neutral"
  },
  "Nidhoggr's Shadow Lv.150": {
    def: 228.13,
    dmgred: 266.00,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Gloom Under Night Lv.150": {
    def: 357.57,
    dmgred: 367.00,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Ghost"
  },
  "Retribution Lv.150": {
    def: 299.07,
    dmgred: 367.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Shadow"
  },
  "Dragon Fly Lv.150": {
    def: 136.62,
    dmgred: 311.20,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eclipse Lv.150": {
    def: 161.98,
    dmgred: 361.00,
    sizeMob: "Small",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mastering Lv.150": {
    def: 161.98,
    dmgred: 361.00,
    sizeMob: "Medium",
    raceMob: "Plant",
    attributeMob: "Water"
  },
  "Ghostring Lv.150": {
    def: 136.62,
    dmgred: 311.20,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Toad Lv.150": {
    def: 118.76,
    dmgred: 186.70,
    sizeMob: "Small",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "King Dramoh Lv.150": {
    def: 110.66960000000016,//110.67,
    dmgred: 261.37909999975295,//261.40,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Angeling Lv.150": {
    def: 118.76,
    dmgred: 186.70,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Deviling Lv.150": {
    def: 110.66,
    dmgred: 261.40,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Dark Priest Lv.150": {
    def: 259.48,
    dmgred: 361.00,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Undead"
  },
  "Vagabond Wolf Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Medium",
    raceMob: "Brute",
    attributeMob: "Earth"
  },
  "Chimera Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Mysteltainn Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Ogretooth Lv.150": {
    def: 259.48,
    dmgred: 385.89,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Necromancer Lv.150": {
    def: 169.17,
    dmgred: 272.00,
    sizeMob: "Medium",
    raceMob: "Undead",
    attributeMob: "Undead"
  },
  "Coelacanth Lv.150": {
    def: 175.62,
    dmgred: 311.20,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Naght Sieger Lv.150": {
    def: 259.48,
    dmgred: 361.00,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Observation Lv.150": {
    def: 181.48,
    dmgred: 361.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Neutral"
  },
  "Skeggiold Lv.150": {
    def: 214.62,
    dmgred: 311.20,
    sizeMob: "Small",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Queen Scaraba Lv.150": {
    def: 258.55,
    dmgred: 351.40,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Faceworm Queen Lv.150": {
    def: 297.55,
    dmgred: 351.40,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Poison"
  },
  "Ktullanux Lv.150": {
    def: 299.07,
    dmgred: 575.77,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Water"
  },
  "Shelter Lv.150": {
    def: 293.16,
    dmgred: 317.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },

  "Phreeoni Lv.140": {
    def: 106.98,//106.98,
    dmgred: 204.60,//204.60,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mistress Lv.140": {
    def: 130.18,//130.18,
    dmgred: 272.8023999999994,//272.80,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eddga Lv.140": {
    def: 106.98040000000002,//106.98,
    dmgred: 204.60080000000002,//204.60,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Kraken Lv.140": {
    def: 130.18360000000013,//130.18,
    dmgred: 272.8001,//272.80,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Maya Lv.140": {
    def: 98.97150000000005,//98.97,
    dmgred: 136.4031000000001,//136.40,
    sizeMob: "Large",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Orc Hero Lv.140": {
    def: 82.47030000000001,//82.47,
    dmgred: 136.40400000000014,//136.40,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Pharaoh Lv.140": {
    def: 98.97380000000013,//98.97,
    dmgred: 136.40120000000005,//136.40,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Shadow"
  },
  "Orc Lord Lv.140": {
    def: 82.47030000000001,//82.47,
    dmgred: 136.40400000000014,//136.40,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Doppelganger Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Amon Ra Lv.140": {
    def: 106.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Demi-Human",
    attributeMob: "Earth"
  },
  "Morroc Lv.140": {
    def: 131.97,
    dmgred: 136.40,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Time Holder Lv.140": {
    def: 164.97,
    dmgred: 136.40,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Tao Gunka Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Neutral"
  },
  "Lost Dragon Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Fallen Bishop Lv.140": {
    def: 164.97,
    dmgred: 136.40,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Lord of the Dead Lv.140": {
    def: 131.97,
    dmgred: 136.40,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Arc Angeling Lv.140": {
    def: 164.9684,//164.97,
    dmgred: 136.4008000000001,//136.40,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Gioia Lv.140": {
    def: 212.68,
    dmgred: 272.80,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Wind"
  },
  "RSX-0806 Lv.140": {
    def: 238.66,
    dmgred: 202.00,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Neutral"
  },
  "Nidhoggr's Shadow Lv.140": {
    def: 181.21,
    dmgred: 134.00,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Shadow"
  },
  "Gloom Under Night Lv.140": {
    def: 306.00,
    dmgred: 300.00,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Ghost"
  },
  "Retribution Lv.140": {
    def: 256.50,
    dmgred: 300.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Shadow"
  },
  "Dragon Fly Lv.140": {
    def: 106.98,
    dmgred: 204.60,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Wind"
  },
  "Eclipse Lv.140": {
    def: 130.18,
    dmgred: 272.80,
    sizeMob: "Small",
    raceMob: "Brute",
    attributeMob: "Neutral"
  },
  "Mastering Lv.140": {
    def: 130.18,
    dmgred: 272.80,
    sizeMob: "Medium",
    raceMob: "Plant",
    attributeMob: "Water"
  },
  "Ghostring Lv.140": {
    def: 106.98,
    dmgred: 204.60,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Toad Lv.140": {
    def: 98.97,
    dmgred: 136.40,
    sizeMob: "Small",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "King Dramoh Lv.140": {
    def: 82.47,
    dmgred: 136.40,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Angeling Lv.140": {
    def: 98.97,
    dmgred: 136.40,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Deviling Lv.140": {
    def: 82.47,
    dmgred: 136.40,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Shadow"
  },
  "Dark Priest Lv.140": {
    def: 212.68,
    dmgred: 272.80,
    sizeMob: "Medium",
    raceMob: "Demon",
    attributeMob: "Undead"
  },
  "Vagabond Wolf Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Medium",
    raceMob: "Brute",
    attributeMob: "Earth"
  },
  "Chimera Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Brute",
    attributeMob: "Fire"
  },
  "Mysteltainn Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Ogretooth Lv.140": {
    def: 212.68,
    dmgred: 306.35,
    sizeMob: "Medium",
    raceMob: "Formless",
    attributeMob: "Shadow"
  },
  "Necromancer Lv.140": {
    def: 131.97,
    dmgred: 150.75,
    sizeMob: "Medium",
    raceMob: "Undead",
    attributeMob: "Undead"
  },
  "Coelacanth Lv.140": {
    def: 139.98,
    dmgred: 204.60,
    sizeMob: "Large",
    raceMob: "Fish",
    attributeMob: "Water"
  },
  "Naght Sieger Lv.140": {
    def: 212.68,
    dmgred: 272.80,
    sizeMob: "Large",
    raceMob: "Demon",
    attributeMob: "Ghost"
  },
  "Observation Lv.140": {
    def: 146.68,
    dmgred: 272.80,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Neutral"
  },
  "Skeggiold Lv.140": {
    def: 172.98,
    dmgred: 204.60,
    sizeMob: "Small",
    raceMob: "Angel",
    attributeMob: "Holy"
  },
  "Queen Scaraba Lv.140": {
    def: 212.30,
    dmgred: 268.70,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Earth"
  },
  "Faceworm Queen Lv.140": {
    def: 245.30,
    dmgred: 268.70,
    sizeMob: "Small",
    raceMob: "Insect",
    attributeMob: "Poison"
  },
  "Ktullanux Lv.140": {
    def: 256.50,
    dmgred: 542.27,
    sizeMob: "Large",
    raceMob: "Dragon",
    attributeMob: "Water"
  },
  "Shelter Lv.140": {
    def: 251.18,
    dmgred: 258.00,
    sizeMob: "Medium",
    raceMob: "Angel",
    attributeMob: "Holy"
  }
};

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
