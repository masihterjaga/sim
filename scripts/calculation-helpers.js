// ========== CALCULATION Helper ==========
const getWeaponSizeModifier = (weapon, size) => {
  if (weapon === 'all' || !weapon) return WEAPON_SIZE_MODIFIER_TABLE;
  return WEAPON_SIZE_MODIFIER_TABLE[weapon]?.[size] ?? 1.0;
};
const getElementCounter = (weaponElem, targetElem) => {
  if (weaponElem === 'all' || !weaponElem) return ELEMENT_COUNTER_TABLE;
  return ELEMENT_COUNTER_TABLE[weaponElem]?.[targetElem || 'Neutral'] ?? 1.0;
};
const getTargetDefenseData = (key) => {
  if (!key) return DEFENSE_TABLE;
  return DEFENSE_TABLE[key] || DEFENSE_TABLE["DUMMY Lvl.0 (0 DEF)"];
};
