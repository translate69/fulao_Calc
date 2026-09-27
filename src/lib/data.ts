import type { Supplier, IngredientNew, MealNew } from './calc';

// ===== 默认供应商 =====
export const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: 's1', name: '李记肉铺', note: '主要供应商' },
  { id: 's2', name: '王三批发', note: '量大时用' },
];

// ===== 默认食材库 =====
// 说明：
//  - prices.s1 / prices.s2 = 各供应商报价（未填=不提供此食材或暂未知）
//  - 组合食材（牛杂）isCombo=true，subRecipe 写配方（每份含多少克子食材）
export const DEFAULT_INGREDIENTS: IngredientNew[] = [
  // --- 肉蛋类 ---
  { id: 'i-broth', name: '现熬牛骨汤', yieldRate: 1, isCombo: false, prices: {} },
  {
    id: 'i-beef-brisket', name: '牛腩', yieldRate: 0.85, isCombo: false,
    prices: {
      s1: { price: 81.8, unit: '斤' },
      s2: { price: 85.0, unit: '斤' },
    },
  },
  {
    id: 'i-beef-tripe', name: '牛肚', yieldRate: 0.80, isCombo: false,
    prices: {
      s1: { price: 27, unit: '斤' },
      s2: { price: 28, unit: '斤' },
    },
  },
  {
    id: 'i-beef-tendon', name: '牛筋', yieldRate: 0.75, isCombo: false,
    prices: {
      s1: { price: 25, unit: '斤' },
      s2: { price: 26, unit: '斤' },
    },
  },
  {
    id: 'i-beef-belly', name: '牛百叶', yieldRate: 0.70, isCombo: false,
    prices: {
      s1: { price: 30, unit: '斤' },
      s2: { price: 31, unit: '斤' },
    },
  },
  {
    id: 'i-beef-intestine', name: '牛肠', yieldRate: 0.65, isCombo: false,
    prices: {
      s1: { price: 18, unit: '斤' },
      s2: { price: 19, unit: '斤' },
    },
  },
  {
    id: 'i-offal-mix', name: '牛杂', yieldRate: 1, isCombo: true,
    subRecipe: [
      { ingredientId: 'i-beef-tripe', amount: 100 },
      { ingredientId: 'i-beef-tendon', amount: 100 },
      { ingredientId: 'i-beef-belly', amount: 80 },
      { ingredientId: 'i-beef-intestine', amount: 50 },
    ],
    prices: {},
  },
  {
    id: 'i-fresh-beef', name: '鲜牛肉（吊龙）', yieldRate: 0.90, isCombo: false,
    prices: {
      s1: { price: 56, unit: '斤' },
      s2: { price: 58, unit: '斤' },
    },
  },
  {
    id: 'i-beef-ball', name: '牛肉丸', yieldRate: 1, isCombo: false,
    prices: {
      s1: { price: 35, unit: '斤' },
      s2: { price: 36, unit: '斤' },
    },
  },
  {
    id: 'i-beef-patty', name: '牛肉饼', yieldRate: 1, isCombo: false,
    prices: {
      s1: { price: 7, unit: '个' },
      s2: { price: 7.2, unit: '个' },
    },
  },
  {
    id: 'i-beef-ribs', name: '牛排骨', yieldRate: 0.70, isCombo: false,
    prices: {
      s1: { price: 76, unit: '斤' },
      s2: { price: 80, unit: '斤' },
    },
  },
  {
    id: 'i-beef-bone', name: '牛筒骨', yieldRate: 1, isCombo: false,
    prices: {
      s1: { price: 25, unit: '个' },
    },
  },

  // --- 蔬菜豆制品 ---
  { id: 'i-lettuce', name: '生菜', yieldRate: 0.90, isCombo: false, prices: {} },
  { id: 'i-veg', name: '时蔬', yieldRate: 0.90, isCombo: false, prices: {} },
  { id: 'i-cabbage', name: '娃娃菜', yieldRate: 0.90, isCombo: false, prices: {} },
  { id: 'i-enoki', name: '金针菇', yieldRate: 0.95, isCombo: false, prices: {} },
  { id: 'i-fz', name: '炸腐竹', yieldRate: 1, isCombo: false, prices: {} },
  { id: 'i-radish', name: '秘制白萝卜', yieldRate: 0.75, isCombo: false, prices: {} },

  // --- 主食 ---
  { id: 'i-rice', name: '米饭', yieldRate: 1, isCombo: false, prices: {} },
  { id: 'i-kway-teow', name: '粿条', yieldRate: 1, isCombo: false, prices: {} },
  { id: 'i-crab-roe-noodle', name: '蟹黄面', yieldRate: 1, isCombo: false, prices: {} },

  // --- 饮品 ---
  { id: 'i-cold-brew', name: '狗毛膏', yieldRate: 1, isCombo: false, prices: {} },
  { id: 'i-cola', name: '可乐', yieldRate: 1, isCombo: false, prices: {} },

  // --- 蘸料 ---
  { id: 'i-chili', name: '自制腐乳辣椒', yieldRate: 1, isCombo: false, prices: {} },
  { id: 'i-satay', name: '沙茶酱', yieldRate: 1, isCombo: false, prices: {} },
];

// ===== 默认套餐（引用食材库，成本自动算）=====
// 原套餐里成本填 null 的保留，有手填成本的兜底
export const DEFAULT_MEALS_NEW: MealNew[] = [
  {
    id: 'p12',
    name: '牛腩牛杂火锅1-2人餐（4.6折）',
    retail: 273, discount: 4.6, loss: 10,
    tableStd: 2, tableAct: 2, tableUnit: 0,
    one: 0, lab: 0, gas: 0, rent: 0,
    items: [
      { kind: 'item', ingredientId: 'i-broth',      name: '现熬牛骨汤',  qty: 1,  qtyUnit: '锅', retail: 25, cost: 11.5 },
      { kind: 'item', ingredientId: 'i-beef-brisket', name: '牛腩',      qty: 100,qtyUnit: 'g',  retail: 58 },
      { kind: 'item', ingredientId: 'i-offal-mix',   name: '牛杂',       qty: 1,  qtyUnit: '份', retail: 50 },
      { kind: 'item', ingredientId: 'i-fresh-beef',  name: '鲜牛肉',     qty: 100,qtyUnit: 'g',  retail: 28 },
      { kind: 'item', ingredientId: 'i-beef-patty', name: '牛肉饼',     qty: 4,  qtyUnit: '个', retail: 28 },
      { kind: 'item', ingredientId: 'i-lettuce',    name: '生菜',       qty: 100,qtyUnit: 'g',  retail: 15, cost: 6.9 },
      { kind: 'item', ingredientId: 'i-radish',     name: '秘制白萝卜', qty: 100,qtyUnit: 'g',  retail: 15, cost: 6.9 },
      { kind: 'item', ingredientId: 'i-fz',          name: '炸腐竹',     qty: 100,qtyUnit: 'g',  retail: 15, cost: 6.9 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-kway-teow',   name: '粿条',       qty: 1,  qtyUnit: '份', retail: 5,  cost: 2.3 },
      { kind: 'item', ingredientId: 'i-crab-roe-noodle', name: '蟹黄面', qty: 1,  qtyUnit: '包', retail: 5,  cost: 2.3 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-cold-brew',   name: '狗毛膏',     qty: 2,  qtyUnit: '份', retail: 12, cost: 5.5 },
      { kind: 'item', ingredientId: 'i-cola',        name: '可乐',       qty: 2,  qtyUnit: '份', retail: 10, cost: 4.6 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-chili',       name: '自制腐乳辣椒', qty: 2,qtyUnit: '份', retail: 12, cost: 5.5 },
      { kind: 'item', ingredientId: 'i-satay',       name: '沙茶酱',     qty: 2,  qtyUnit: '份', retail: 12, cost: 5.5 },
    ],
  },
  {
    id: 'p23',
    name: '牛腩牛杂火锅2-3人餐（5.1折）',
    retail: 341, discount: 5.1, loss: 10,
    tableStd: 2, tableAct: 2, tableUnit: 0,
    one: 0, lab: 0, gas: 0, rent: 0,
    items: [
      { kind: 'item', ingredientId: 'i-broth',           name: '现熬牛骨汤', qty: 1,  qtyUnit: '锅', retail: 25 },
      { kind: 'item', ingredientId: 'i-beef-brisket',    name: '牛腩',       qty: 150,qtyUnit: 'g',  retail: 58 },
      { kind: 'item', ingredientId: 'i-offal-mix',       name: '牛杂',       qty: 1,  qtyUnit: '份', retail: 50 },
      { kind: 'item', ingredientId: 'i-beef-ribs',        name: '牛排骨',     qty: 150,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '吊龙',       qty: 100,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-beef-ball',        name: '牛肉丸',     qty: 4,  qtyUnit: '个', retail: 35 },
      { kind: 'item', ingredientId: 'i-beef-patty',      name: '牛肉饼',     qty: 4,  qtyUnit: '个', retail: 28 },
      { kind: 'item', ingredientId: 'i-veg',             name: '时蔬',       qty: 150,qtyUnit: 'g',  retail: 15 },
      { kind: 'item', ingredientId: 'i-fz',              name: '炸腐竹',     qty: 100,qtyUnit: 'g',  retail: 15 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-kway-teow',       name: '粿条',       qty: 1,  qtyUnit: '份', retail: 5 },
      { kind: 'item', ingredientId: 'i-crab-roe-noodle',  name: '蟹黄面',     qty: 1,  qtyUnit: '包', retail: 5 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-cold-brew',       name: '狗毛膏',     qty: 2,  qtyUnit: '份', retail: 12 },
      { kind: 'item', ingredientId: 'i-cola',            name: '可乐',       qty: 2,  qtyUnit: '份', retail: 10 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-chili',           name: '自制腐乳辣椒', qty: 2, qtyUnit: '份', retail: 12 },
      { kind: 'item', ingredientId: 'i-satay',           name: '沙茶酱',     qty: 2,  qtyUnit: '份', retail: 12 },
    ],
  },
  {
    id: 'p34',
    name: '牛腩牛杂火锅3-4人餐（5.4折）',
    retail: 433, discount: 5.4, loss: 10,
    tableStd: 4, tableAct: 4, tableUnit: 0,
    one: 0, lab: 0, gas: 0, rent: 0,
    items: [
      { kind: 'item', ingredientId: 'i-broth',           name: '现熬牛骨汤', qty: 1,  qtyUnit: '锅', retail: 25 },
      { kind: 'item', ingredientId: 'i-beef-brisket',    name: '牛腩',       qty: 200,qtyUnit: 'g',  retail: 65 },
      { kind: 'item', ingredientId: 'i-offal-mix',       name: '牛杂',       qty: 1,  qtyUnit: '份', retail: 60 },
      { kind: 'item', ingredientId: 'i-beef-ribs',        name: '牛排骨',     qty: 200,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '吊龙',       qty: 100,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '鲜牛肉',     qty: 100,qtyUnit: 'g',  retail: 28 },
      { kind: 'item', ingredientId: 'i-beef-ball',        name: '牛肉丸',     qty: 6,  qtyUnit: '个', retail: 38 },
      { kind: 'item', ingredientId: 'i-beef-patty',      name: '牛肉饼',     qty: 4,  qtyUnit: '个', retail: 28 },
      { kind: 'item', ingredientId: 'i-veg',             name: '时蔬',       qty: 150,qtyUnit: 'g',  retail: 15 },
      { kind: 'item', ingredientId: 'i-fz',              name: '炸腐竹',     qty: 100,qtyUnit: 'g',  retail: 15 },
      { kind: 'group', label: '三选二' },
      { kind: 'item', ingredientId: 'i-rice',            name: '米饭',       qty: 2,  qtyUnit: '份', retail: 10 },
      { kind: 'item', ingredientId: 'i-kway-teow',       name: '粿条',       qty: 1,  qtyUnit: '份', retail: 5 },
      { kind: 'item', ingredientId: 'i-crab-roe-noodle',  name: '蟹黄面',     qty: 1,  qtyUnit: '包', retail: 5 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-cold-brew',       name: '狗毛膏',     qty: 4,  qtyUnit: '份', retail: 24 },
      { kind: 'item', ingredientId: 'i-cola',            name: '可乐',       qty: 4,  qtyUnit: '份', retail: 20 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-chili',           name: '自制腐乳辣椒', qty: 4, qtyUnit: '份', retail: 24 },
      { kind: 'item', ingredientId: 'i-satay',           name: '沙茶酱',     qty: 4,  qtyUnit: '份', retail: 24 },
    ],
  },
  {
    id: 'p56',
    name: '牛腩牛杂火锅5-6人餐（6.8折）',
    retail: 490, discount: 6.8, loss: 10,
    tableStd: 6, tableAct: 6, tableUnit: 0,
    one: 0, lab: 0, gas: 0, rent: 0,
    items: [
      { kind: 'item', ingredientId: 'i-broth',           name: '现熬牛骨汤', qty: 1,  qtyUnit: '锅', retail: 25 },
      { kind: 'item', ingredientId: 'i-beef-brisket',    name: '牛腩',       qty: 300,qtyUnit: 'g',  retail: 78 },
      { kind: 'item', ingredientId: 'i-offal-mix',       name: '牛杂',       qty: 2,  qtyUnit: '份', retail: 70 },
      { kind: 'item', ingredientId: 'i-beef-ribs',        name: '牛排骨',     qty: 300,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '吊龙',       qty: 200,qtyUnit: 'g',  retail: 38 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '鲜牛肉',     qty: 200,qtyUnit: 'g',  retail: 28 },
      { kind: 'item', ingredientId: 'i-beef-ball',        name: '牛肉丸',     qty: 10, qtyUnit: '个', retail: 38 },
      { kind: 'item', ingredientId: 'i-beef-patty',      name: '牛肉饼',     qty: 8,  qtyUnit: '个', retail: 28 },
      { kind: 'item', ingredientId: 'i-veg',             name: '时蔬',       qty: 200,qtyUnit: 'g',  retail: 15 },
      { kind: 'item', ingredientId: 'i-fz',              name: '炸腐竹',     qty: 150,qtyUnit: 'g',  retail: 15 },
      { kind: 'group', label: '三选二' },
      { kind: 'item', ingredientId: 'i-rice',            name: '米饭',       qty: 3,  qtyUnit: '份', retail: 12 },
      { kind: 'item', ingredientId: 'i-kway-teow',       name: '粿条',       qty: 1,  qtyUnit: '份', retail: 5 },
      { kind: 'item', ingredientId: 'i-crab-roe-noodle',  name: '蟹黄面',     qty: 1,  qtyUnit: '包', retail: 5 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-cold-brew',       name: '狗毛膏',     qty: 6,  qtyUnit: '份', retail: 36 },
      { kind: 'item', ingredientId: 'i-cola',            name: '可乐',       qty: 6,  qtyUnit: '份', retail: 30 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-chili',           name: '自制腐乳辣椒', qty: 6, qtyUnit: '份', retail: 36 },
      { kind: 'item', ingredientId: 'i-satay',           name: '沙茶酱',     qty: 6,  qtyUnit: '份', retail: 36 },
    ],
  },
  {
    id: 'p78',
    name: '牛腩牛杂火锅7-8人餐（5.9折）',
    retail: 923, discount: 5.9, loss: 10,
    tableStd: 8, tableAct: 8, tableUnit: 0,
    one: 0, lab: 0, gas: 0, rent: 0,
    items: [
      { kind: 'item', ingredientId: 'i-broth',           name: '现熬牛骨汤', qty: 2,  qtyUnit: '锅', retail: 50 },
      { kind: 'item', ingredientId: 'i-beef-brisket',    name: '牛腩',       qty: 500,qtyUnit: 'g',  retail: 130 },
      { kind: 'item', ingredientId: 'i-offal-mix',       name: '牛杂',       qty: 3,  qtyUnit: '份', retail: 120 },
      { kind: 'item', ingredientId: 'i-beef-ribs',        name: '牛排骨',     qty: 500,qtyUnit: 'g',  retail: 76 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '吊龙',       qty: 200,qtyUnit: 'g',  retail: 76 },
      { kind: 'item', ingredientId: 'i-fresh-beef',      name: '鲜牛肉',     qty: 200,qtyUnit: 'g',  retail: 56 },
      { kind: 'item', ingredientId: 'i-beef-ball',        name: '牛肉丸',     qty: 14, qtyUnit: '个', retail: 76 },
      { kind: 'item', ingredientId: 'i-beef-patty',      name: '牛肉饼',     qty: 10, qtyUnit: '个', retail: 56 },
      { kind: 'item', ingredientId: 'i-beef-bone',       name: '牛筒骨',     qty: 2,  qtyUnit: '个', retail: 50 },
      { kind: 'item', ingredientId: 'i-lettuce',        name: '生菜',       qty: 200,qtyUnit: 'g',  retail: 20 },
      { kind: 'item', ingredientId: 'i-enoki',           name: '金针菇',     qty: 150,qtyUnit: 'g',  retail: 12 },
      { kind: 'item', ingredientId: 'i-cabbage',         name: '娃娃菜',     qty: 200,qtyUnit: 'g',  retail: 10 },
      { kind: 'item', ingredientId: 'i-fz',              name: '炸腐竹',     qty: 200,qtyUnit: 'g',  retail: 30 },
      { kind: 'group', label: '三选二' },
      { kind: 'item', ingredientId: 'i-rice',            name: '米饭',       qty: 4,  qtyUnit: '份', retail: 20 },
      { kind: 'item', ingredientId: 'i-kway-teow',       name: '粿条',       qty: 2,  qtyUnit: '份', retail: 10 },
      { kind: 'item', ingredientId: 'i-crab-roe-noodle',  name: '蟹黄面',     qty: 2,  qtyUnit: '包', retail: 10 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-cold-brew',       name: '狗毛膏',     qty: 8,  qtyUnit: '份', retail: 48 },
      { kind: 'item', ingredientId: 'i-cola',            name: '可乐',       qty: 8,  qtyUnit: '份', retail: 40 },
      { kind: 'group', label: '二选一' },
      { kind: 'item', ingredientId: 'i-chili',           name: '自制腐乳辣椒', qty: 8, qtyUnit: '份', retail: 48 },
      { kind: 'item', ingredientId: 'i-satay',           name: '沙茶酱',     qty: 8,  qtyUnit: '份', retail: 48 },
    ],
  },
];
