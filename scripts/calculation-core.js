// ======== CALCULATION Core ========
function getCurrentCalculationState() {
  const safeNum = (el) => el ? (Number(el.value) || 0) : 0;
  const safeStr = (el) => el?.value || '';
  
  const { vesperSet, blueSet, whiteSet, wElem, tAttr } = DOM_ELEMENTS;
  const selectedOption = blueSet ? blueSet.options[blueSet.selectedIndex] : null;
  const blueValue = safeNum(blueSet);
  const optionText = (selectedOption?.textContent || '').trim();
  
  const isReaperActive = AppState.get('isTestReaperActive');
  const isSpearActive = AppState.get('isTestSpearActive');
  
  const wElemValue = safeStr(wElem);
  const tAttrValue = safeStr(tAttr);
  
  const state = {
    atkType: safeStr(DOM_ELEMENTS.atkType),
    weapon: safeStr(DOM_ELEMENTS.weapon),
    wElem: wElemValue,
    tDefKey: safeStr(DOM_ELEMENTS.tDef),
    tSize: safeStr(DOM_ELEMENTS.tSize),
    tRace: safeStr(DOM_ELEMENTS.tRace),
    tAttr: tAttrValue,
    vesper: safeNum(vesperSet),
    blue3: optionText.includes('*3') ? blueValue : 0,
    blue8: optionText.includes('*8') ? blueValue : 0,
    white: safeNum(whiteSet),
    baseAttack: safeNum(DOM_ELEMENTS.attack),
    flatDmg: safeNum(DOM_ELEMENTS.flatDmgBns),
    percentageDmg: safeNum(DOM_ELEMENTS.percentageDmgBns),
    pen: safeNum(DOM_ELEMENTS.pen),
    crit: safeNum(DOM_ELEMENTS.crit),
    dmg: safeNum(DOM_ELEMENTS.dmg),
    elemEnh: safeNum(DOM_ELEMENTS.elemEnh),
    sizeEnh: safeNum(DOM_ELEMENTS.sizeEnh),
    race: safeNum(DOM_ELEMENTS.race),
    attr: safeNum(DOM_ELEMENTS.attr),
    dmgStack: safeNum(DOM_ELEMENTS.dmgStack),
    reaperValue: isReaperActive ? ((wElemValue === tAttrValue) || (wElemValue === "Neutral" && !tAttrValue) ? 84 : 28) : 0,
    spearValue: isSpearActive ? 84 : 0
  };
  
  const result = calculateMultiplier(state);
  
  return { ...state, ...result };
};
function calculateMultiplier(state) {
  const {
    atkType = '', weapon = '', wElem = '', tDefKey = '', tSize = '', tRace = '', tAttr = '',
    baseAttack = 0, flatDmg = 0, percentageDmg = 0, pen = 0, crit = 0, dmg = 0,
    elemEnh = 0, sizeEnh = 0, race = 0, attr = 0, vesper = 0, blue3 = 0, blue8 = 0,
    white = 0, dmgStack = 0, reaperValue = 0, spearValue = 0
  } = state;
  
  const toPercent = (val) => val / 100;
  
  const EXTRA_LABELS = {
    vesper: 'Vesper', blue3: 'BlueGroup3', white: 'White', dmgStack: 'Final DMG Bonus',
    reaperValue: 'Reaper', spearValue: 'Spear', blue8: 'BlueGroup8'
  };
  
  const { def, dmgred } = getTargetDefenseData(tDefKey);
  const isPenMode = atkType === 'pen';
  
  const calculateAttackFactor = () => {
    if (atkType === 'crit') return toPercent(crit);
    
    if (isPenMode) {
      const rawPen = pen - def;
      if (rawPen > 0) {
        return 1 + toPercent(rawPen >= 150 ? (rawPen * 2 - 150) : rawPen);
      }
    }
    
    return 0;
  };
  
  const atkF = calculateAttackFactor();
  const effDmgVal = dmg - dmgred;
  const sizeMod = getWeaponSizeModifier(weapon, tSize);
  const elemCtr = getElementCounter(wElem, tAttr);
  
  const pctSpearVal = toPercent(spearValue);
  const pctReaperVal = toPercent(reaperValue);
  
  const processExtras = (extrasMap, type) => {
    const items = [];
    const rawValues = [];
    
    for (const [key, value] of Object.entries(extrasMap)) {
      if (value > 0) {
        const normalized = toPercent(value);
        items.push({ key: EXTRA_LABELS[key], type, value: normalized });
        rawValues.push(normalized);
      }
    }
    
    const sum = rawValues.reduce((acc, val) => acc + val, 0);
    return { items, sum, factor: 1 + sum };
  };
  
  const extra1 = processExtras({ vesper, blue3, white, dmgStack, reaperValue }, 'extra1');
  const extra2 = processExtras({ spearValue }, 'extra2');
  const extra3 = processExtras({ blue8 }, 'extra3');
  
  const step1 = (baseAttack ? baseAttack : 1) * atkF + ((flatDmg ? flatDmg : 0)  * (percentageDmg ? 1 + toPercent(percentageDmg) : 1));
  const step2 = step1 * (1 + toPercent(effDmgVal));
  
  const calcSteps = (e1Factor, e2Factor, e3Factor) => {
    const s3 = step2 * (elemCtr + toPercent(elemEnh));
    const s4 = s3 * (1 + (tAttr ? toPercent(attr) : 0));
    const s5 = s4 * (1 + (tRace ? toPercent(race) : 0));
    const s6 = s5 * e1Factor;
    const s7 = s6 * e2Factor;
    const s8 = s7 * e3Factor;
    return s8 * (sizeMod + toPercent(sizeEnh));
  };
  
  const mult = calcSteps(extra1.factor, extra2.factor, extra3.factor);
  
  const extra1FactorNoReaper = 1 + (extra1.sum - pctReaperVal);
  const extra2FactorNoSpear = 1 + (extra2.sum - pctSpearVal);
  
  const multNoSpear = calcSteps(extra1.factor, extra2FactorNoSpear, extra3.factor);
  const multNoReaper = calcSteps(extra1FactorNoReaper, extra2.factor, extra3.factor);
  const multNoReaperSpear = calcSteps(extra1FactorNoReaper, extra2FactorNoSpear, extra3.factor);
  
  const calculatePct = (base, comparison) =>
    comparison > 0 ? ((base - comparison) / comparison * 100) : 0;
  
  const pctSpear = calculatePct(mult, multNoSpear);
  const pctReaper = calculatePct(mult, multNoReaper);
  const pctReaperSpear = calculatePct(mult, multNoReaperSpear);
  
  const resultGroups = [];
  [extra1, extra2, extra3].forEach((extra) => {
    resultGroups.push(...extra.items);
    if (extra.sum > 0) {
      resultGroups.push({ type: extra.items[0]?.type, sum: extra.sum, factor: extra.factor });
    }
  });
  
  const includeRace = !!(tRace && race > 0);
  const includeAttr = !!(tAttr && attr > 0);
  const includeExtra = extra1.sum > 0;
  const includeExtraTwo = extra2.sum > 0;
  const includeExtraThree = extra3.sum > 0;
  
  const buildFactorItem = (key, label, val, mult, options = {}) => ({
    key, label, val, mult, ...options
  });
  
  const factorList = [
    buildFactorItem('attackAndType', isPenMode ? 'Attack + Type (PEN)' : 'Attack + Type (CRIT)', 
      { baseAttack, flatDmg, percentageDmg, typeVal: isPenMode ? pen : crit, atkF, def }, step1, { isPenMode }),
    buildFactorItem('dmg', 'Final P/M DMG BNS', dmg, 1 + toPercent(effDmgVal)),
    buildFactorItem('elem', 'Element', elemEnh, elemCtr + toPercent(elemEnh), { extra: `counter ${elemCtr}` }),
    buildFactorItem('size', 'Size', sizeEnh, sizeMod + toPercent(sizeEnh), { extra: `mod ${sizeMod}` }),
    buildFactorItem('attr', 'Attribute', attr, 1 + toPercent(attr), { show: includeAttr }),
    buildFactorItem('race', 'Race', race, 1 + toPercent(race), { show: includeRace }),
    buildFactorItem('extra', 'Extra#1', extra1.sum, extra1.factor, { show: includeExtra }),
    buildFactorItem('extraTwo', 'Extra#2', extra2.sum, extra2.factor, { show: includeExtraTwo }),
    buildFactorItem('extraThree', 'Extra#3', extra3.sum, extra3.factor, { show: includeExtraThree }),
    buildFactorItem('contribution', 'Flash Contribution', undefined, undefined, { show: pctSpear > 0 || pctReaper > 0 })
  ];
  
  return {
    mult, pctSpear, pctReaper, pctReaperSpear, def, dmgred, effDmgVal, atkF,
    sizeModifier: sizeMod, elementCounter: elemCtr,
    breakdownData: { factorList, isPenMode, includeRace, includeAttr, includeExtra, includeExtraTwo, includeExtraThree },
    parts: {
      baseMult: mult, extraGroups: resultGroups,
      extra1Factor: extra1.factor, extra2Factor: extra2.factor, extra3Factor: extra3.factor,
      extra1Sum: extra1.sum, extra2Sum: extra2.sum, extra3Sum: extra3.sum
    }
  };
};
