// ===== 单位换算：都换算到"克 (g)" =====
// 进货价的单位  →  换算系数（除以这个数 = 每克价）
// 比如"斤"的系数是 500：每克价 = price / 500
// 用量如果也是斤，那用量(克) = qty * 500
// 所以 total cost = price / unitCoeff * (qty * qtyCoeff) / yieldRate

const UNIT_TO_G: Record<string, number> = {
  'g': 1,       '克': 1,
  'kg': 1000,   '千克': 1000, '公斤': 1000,
  '斤': 500,    '两': 50,
  '份': 1,      '个': 1,    '包': 1,    '瓶': 1,    '杯': 1, '块': 1,
};

export function unitToGrams(unit: string): number {
  const u = unit.trim().toLowerCase();
  return UNIT_TO_G[u] ?? 1;
}

/**
 * 计算单个食材成本
 * @param price  进货单价
 * @param purchaseUnit  进货单位（斤 / g / kg / 个 / 包 ...）
 * @param qty    套餐里用多少
 * @param qtyUnit 套餐里的用量单位
 * @param yieldRate 出货率 0~1
 */
export function ingredientCost(
  price: number,
  purchaseUnit: string,
  qty: number,
  qtyUnit: string,
  yieldRate: number = 1
): number {
  if (!price || !qty) return 0;
  const purchaseGrams = unitToGrams(purchaseUnit);
  const qtyGrams = unitToGrams(qtyUnit);
  // 把进货价换算成"每1g"的价格，乘以套餐用量的克数，除以出货率
  const perGram = price / purchaseGrams;
  const amount = qty * qtyGrams;
  const result = perGram * amount / (yieldRate || 1);
  return Math.round(result * 100) / 100;
}

/**
 * 计算套餐食材成本（处理二选一、组合食材）
 * @param items 套餐明细
 * @param ingredients 食材库
 * @param supplierId 当前使用的供应商
 */
export function mealFoodCost(
  items: MealItemNew[],
  ingredients: IngredientNew[],
  supplierId: string
): number {
  let sum = 0;
  let i = 0;
  while (i < items.length) {
    const it = items[i];
    if (it.kind === 'group') {
      // 解析 "二选一" / "三选二" → 取最贵的 pick 个
      const m = /(\d+)\s*选\s*(\d+)/.exec(it.label || '');
      const pick = m ? parseInt(m[2]) : 1;
      const groupItems: MealItemNew[] = [];
      i++;
      while (i < items.length && items[i].kind === 'item') {
        groupItems.push(items[i]);
        i++;
      }
      const costs = groupItems
        .map((g) => itemCost(g, ingredients, supplierId))
        .sort((a, b) => b - a);
      sum += costs.slice(0, pick).reduce((s, c) => s + c, 0);
    } else if (it.kind === 'item') {
      sum += itemCost(it, ingredients, supplierId);
      i++;
    } else {
      i++;
    }
  }
  return Math.round(sum * 100) / 100;
}

function itemCost(
  item: MealItemNew,
  ingredients: IngredientNew[],
  supplierId: string
): number {
  if (!item.ingredientId) return item.cost || 0; // 兜底：旧数据直接手填cost
  const ing = ingredients.find((x) => x.id === item.ingredientId);
  if (!ing) return item.cost || 0;

  if (ing.isCombo && ing.subRecipe && ing.subRecipe.length > 0) {
    // 组合食材 = Σ 子食材成本
    let perPortion = 0;
    for (const sub of ing.subRecipe) {
      const subIng = ingredients.find((x) => x.id === sub.ingredientId);
      if (!subIng) continue;
      const priceInfo = subIng.prices?.[supplierId];
      if (!priceInfo || !priceInfo.price) continue;
      // 子食材在配方里的 amount 单位是 g
      perPortion += ingredientCost(
        priceInfo.price,
        priceInfo.unit || '斤',
        sub.amount,
        'g',
        subIng.yieldRate || 1
      );
    }
    // 套餐里写的是 qty "份"（或按配方克数比例）
    return perPortion * (item.qty || 1);
  }

  // 普通食材
  const priceInfo = ing.prices?.[supplierId];
  if (!priceInfo || !priceInfo.price) return 0;
  return ingredientCost(
    priceInfo.price,
    priceInfo.unit || '斤',
    item.qty || 0,
    item.qtyUnit || 'g',
    ing.yieldRate || 1
  );
}

// ===== 类型 =====
export interface Supplier {
  id: string;
  name: string;
  note?: string;
}

export interface SubRecipe {
  ingredientId: string;
  amount: number; // 克
}

export interface IngredientNew {
  id: string;
  name: string;
  yieldRate: number;        // 0~1，默认1
  isCombo: boolean;
  subRecipe?: SubRecipe[];
  prices?: Record<string, { price: number; unit: string }>;
}

export interface MealItemNew {
  kind: 'group' | 'item';
  label?: string;                // group: "二选一" / "三选二"
  ingredientId?: string;         // item: 引用食材库
  name?: string;                 // item: 显示名（冗余）
  qty?: number;                   // item: 用量
  qtyUnit?: string;              // item: 用量单位
  retail?: number;               // item: 零售价
  cost?: number;                 // 兜底：旧数据直接手填
}

export interface MealNew {
  id: string;
  name: string;
  retail: number;
  discount: number;
  loss: number;
  tableStd: number;
  tableAct: number;
  tableUnit: number;
  one: number;
  lab: number;
  gas: number;
  rent: number;
  items: MealItemNew[];
}

/**
 * 完整套餐毛利计算（给定一个供应商）
 */
export function computeMeal(
  meal: MealNew,
  ingredients: IngredientNew[],
  supplierId: string
) {
  const P = meal.retail * meal.discount / 10;
  const fr = mealFoodCost(meal.items, ingredients, supplierId);
  const foodReal = fr * (1 + meal.loss / 100);
  const tableCost = meal.tableUnit * meal.tableAct;
  const tableStd = meal.tableUnit * meal.tableStd;
  const grossCost = foodReal + tableCost + meal.one;
  const costTotal = grossCost + meal.lab + meal.gas + meal.rent;
  return {
    P,
    fr,
    foodReal,
    tableCost,
    grossCost,
    costTotal,
    mTheo: P > 0 ? (P - (fr + tableStd + meal.one)) / P : 0,
    mReal: P > 0 ? (P - grossCost) / P : 0,
    mNet: P > 0 ? (P - costTotal) / P : 0,
  };
}
