'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SUPPLIERS,
  DEFAULT_INGREDIENTS,
  DEFAULT_MEALS_NEW,
} from '@/lib/data';
import {
  computeMeal,
  ingredientCost,
  mealFoodCost,
  type Supplier,
  type IngredientNew,
  type MealNew,
  type MealItemNew,
} from '@/lib/calc';

const LS_KEY = 'hotpot-v2';
const LS_VERSION = 3; // 数据结构变更时 +1，强制重置 localStorage

interface SavedState {
  suppliers: Supplier[];
  ingredients: IngredientNew[];
  meals: MealNew[];
  activeSupplierId: string;
  version?: number;
}

const defaultState = (): SavedState => ({
  suppliers: DEFAULT_SUPPLIERS,
  ingredients: DEFAULT_INGREDIENTS,
  meals: DEFAULT_MEALS_NEW,
  activeSupplierId: 's1',
  version: LS_VERSION,
});

function loadState(): SavedState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 版本不匹配 → 重置为默认数据
      if (parsed.version !== LS_VERSION) return defaultState();
      return parsed;
    }
  } catch {}
  return defaultState();
}

function saveState(s: SavedState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ ...s, version: LS_VERSION }));
  } catch {}
}

const fmt = (x: number) => '¥' + (x || 0).toFixed(2);
const pct = (x: number) => ((x || 0) * 100).toFixed(1) + '%';

// ======== 主页面 ========
export default function HotpotV2() {
  const [tab, setTab] = useState<'ingredients' | 'meals'>('ingredients');
  const [state, setState] = useState<SavedState>(() => loadState());
  const [curSupplierId, setCurSupplierId] = useState<string>(
    state.activeSupplierId || state.suppliers[0]?.id || ''
  );
  const [curMeal, setCurMeal] = useState(0);
  const [comboExpanded, setComboExpanded] = useState<Record<string, boolean>>({});

  // 持久化
  useEffect(() => {
    saveState(state);
  }, [state]);

  const curMealData = state.meals[curMeal];

  return (
    <div className="wrap">
      <h1>🍲 火锅成本 & 毛利计算器</h1>

      {/* ===== Tab 切换 ===== */}
      <div className="tabs">
        <button
          className={'tab ' + (tab === 'ingredients' ? 'on' : '')}
          onClick={() => setTab('ingredients')}
        >
          📦 食材库 & 供应商
        </button>
        <button
          className={'tab ' + (tab === 'meals' ? 'on' : '')}
          onClick={() => setTab('meals')}
        >
          💰 套餐毛利计算
        </button>
      </div>

      {tab === 'ingredients' ? (
        <IngredientsView
          state={state}
          setState={setState}
          curSupplierId={curSupplierId}
          setCurSupplierId={setCurSupplierId}
          comboExpanded={comboExpanded}
          setComboExpanded={setComboExpanded}
        />
      ) : (
        <MealsView
          state={state}
          setState={setState}
          curSupplierId={curSupplierId}
          setCurSupplierId={setCurSupplierId}
          curMeal={curMeal}
          setCurMeal={setCurMeal}
        />
      )}

      <style jsx global>{STYLES}</style>
    </div>
  );
}

// ======== Tab 1：食材库 & 供应商 ========
function IngredientsView(props: {
  state: SavedState;
  setState: React.Dispatch<React.SetStateAction<SavedState>>;
  curSupplierId: string;
  setCurSupplierId: (id: string) => void;
  comboExpanded: Record<string, boolean>;
  setComboExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const { state, setState, curSupplierId, setCurSupplierId, comboExpanded, setComboExpanded } = props;
  const [editSuppliers, setEditSuppliers] = useState(false);

  const updateIngredient = (idx: number, patch: Partial<IngredientNew>) => {
    setState((s) => {
      const list = [...s.ingredients];
      list[idx] = { ...list[idx], ...patch };
      return { ...s, ingredients: list };
    });
  };

  const updatePrice = (idx: number, supplierId: string, field: 'price' | 'unit', val: string) => {
    setState((s) => {
      const list = [...s.ingredients];
      const ing = { ...list[idx] };
      ing.prices = { ...(ing.prices || {}) };
      ing.prices[supplierId] = {
        ...(ing.prices[supplierId] || { price: 0, unit: '斤' }),
        [field]: field === 'price' ? parseFloat(val) || 0 : val,
      };
      list[idx] = ing;
      return { ...s, ingredients: list };
    });
  };

  const toggleCombo = (id: string) => {
    setComboExpanded((m) => ({ ...m, [id]: !m[id] }));
  };

  const addIngredient = () => {
    setState((s) => {
      const nextId = 'i-' + Date.now().toString(36);
      const newOne: IngredientNew = {
        id: nextId,
        name: '新食材',
        yieldRate: 1,
        isCombo: false,
        prices: {},
      };
      return { ...s, ingredients: [...s.ingredients, newOne] };
    });
  };

  const addSupplier = () => {
    setState((s) => {
      const nextId = 's-' + Date.now().toString(36);
      return {
        ...s,
        suppliers: [...s.suppliers, { id: nextId, name: '新供应商', note: '' }],
      };
    });
  };

  const updateSupplier = (idx: number, patch: Partial<Supplier>) => {
    setState((s) => {
      const list = [...s.suppliers];
      list[idx] = { ...list[idx], ...patch };
      return { ...s, suppliers: list };
    });
  };

  const deleteIngredient = (idx: number) => {
    if (!confirm('确定删除此食材？')) return;
    setState((s) => ({ ...s, ingredients: s.ingredients.filter((_, i) => i !== idx) }));
  };

  const toggleComboIng = (idx: number) => {
    setState((s) => {
      const list = [...s.ingredients];
      const ing = { ...list[idx], isCombo: !list[idx].isCombo };
      if (ing.isCombo && !ing.subRecipe) ing.subRecipe = [];
      list[idx] = ing;
      return { ...s, ingredients: list };
    });
  };

  const addSubItem = (ingIdx: number) => {
    setState((s) => {
      const list = [...s.ingredients];
      const ing = { ...list[ingIdx] };
      ing.subRecipe = [...(ing.subRecipe || []), { ingredientId: '', amount: 50 }];
      list[ingIdx] = ing;
      return { ...s, ingredients: list };
    });
  };

  const updateSubItem = (ingIdx: number, subIdx: number, patch: any) => {
    setState((s) => {
      const list = [...s.ingredients];
      const ing = { ...list[ingIdx] };
      ing.subRecipe = ing.subRecipe!.map((s, i) => (i === subIdx ? { ...s, ...patch } : s));
      list[ingIdx] = ing;
      return { ...s, ingredients: list };
    });
  };

  const deleteSubItem = (ingIdx: number, subIdx: number) => {
    setState((s) => {
      const list = [...s.ingredients];
      const ing = { ...list[ingIdx] };
      ing.subRecipe = ing.subRecipe!.filter((_, i) => i !== subIdx);
      list[ingIdx] = ing;
      return { ...s, ingredients: list };
    });
  };

  const curSupplier = state.suppliers.find((s) => s.id === curSupplierId);

  return (
    <div className="panel">
      {/* 供应商切换 + 管理 */}
      <div className="supplier-bar">
        <div className="supplier-tabs">
          {state.suppliers.map((sp) => (
            <button
              key={sp.id}
              className={'sp-tab ' + (curSupplierId === sp.id ? 'on' : '')}
              onClick={() => setCurSupplierId(sp.id)}
              title={sp.note || ''}
            >
              {sp.name}
            </button>
          ))}
          <button className="sp-add" onClick={addSupplier}>＋ 加供应商</button>
        </div>
        <button className="mini-btn" onClick={() => setEditSuppliers(!editSuppliers)}>
          {editSuppliers ? '完成编辑' : '管理供应商'}
        </button>
      </div>

      {editSuppliers && (
        <div className="supplier-edit">
          <table>
            <thead>
              <tr><th>名称</th><th>备注</th><th>操作</th></tr>
            </thead>
            <tbody>
              {state.suppliers.map((sp, i) => (
                <tr key={sp.id}>
                  <td>
                    <input
                      value={sp.name}
                      onChange={(e) => updateSupplier(i, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={sp.note || ''}
                      onChange={(e) => updateSupplier(i, { note: e.target.value })}
                      placeholder="可选"
                    />
                  </td>
                  <td>
                    {state.suppliers.length > 1 && (
                      <button
                        className="del-btn"
                        onClick={() => {
                          if (!confirm('删除此供应商？关联食材价格也会一起消失')) return;
                          setState((s) => ({
                            ...s,
                            suppliers: s.suppliers.filter((_, x) => x !== i),
                            ingredients: s.ingredients.map((ing) => {
                              const p = { ...(ing.prices || {}) };
                              delete p[sp.id];
                              return { ...ing, prices: p };
                            }),
                          }));
                        }}
                      >删除</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 食材表格：只显示当前供应商的进价 + 单位 */}
      <div className="table-wrap">
        <div className="cur-supplier-hint">
          当前供应商：<strong>{curSupplier?.name}</strong>
          <span className="muted">（切换上方供应商 Tab 填不同报价）</span>
        </div>
        <table className="ing-table">
          <thead>
            <tr>
              <th style={{ width: '26%' }}>食材</th>
              <th style={{ width: '10%' }}>出货率</th>
              <th style={{ width: '14%' }}>进价</th>
              <th style={{ width: '12%' }}>单位</th>
              <th style={{ width: '12%' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {state.ingredients.map((ing, idx) => {
              const isOpen = comboExpanded[ing.id];
              const p = ing.prices?.[curSupplierId];
              return (
                <React.Fragment key={ing.id}>
                  <tr className={ing.isCombo ? 'combo-row' : ''}>
                    <td>
                      <div className="ing-name">
                        {ing.isCombo && (
                          <button
                            className="expand-btn"
                            onClick={() => toggleCombo(ing.id)}
                          >{isOpen ? '▼' : '▶'}</button>
                        )}
                        <input
                          className="name-input"
                          value={ing.name}
                          onChange={(e) => updateIngredient(idx, { name: e.target.value })}
                        />
                        {ing.isCombo && <span className="combo-badge">组合</span>}
                      </div>
                    </td>
                    <td>
                      {ing.isCombo ? (
                        <span className="muted">—</span>
                      ) : (
                        <input
                          className="rate-input"
                          type="number" step="0.05" min="0" max="1"
                          value={ing.yieldRate}
                          onChange={(e) => updateIngredient(idx, { yieldRate: parseFloat(e.target.value) || 1 })}
                        />
                      )}
                    </td>
                    <td>
                      {ing.isCombo ? (
                        <span className="muted">配方组成</span>
                      ) : (
                        <input
                          className="mini price"
                          type="number" step="any" min="0"
                          value={p?.price || ''}
                          placeholder="—"
                          onChange={(e) => updatePrice(idx, curSupplierId, 'price', e.target.value)}
                        />
                      )}
                    </td>
                    <td>
                      {ing.isCombo ? (
                        <span className="muted">—</span>
                      ) : (
                        <input
                          className="mini unit"
                          value={p?.unit || ''}
                          placeholder="斤"
                          onChange={(e) => updatePrice(idx, curSupplierId, 'unit', e.target.value)}
                        />
                      )}
                    </td>
                    <td className="action-cell">
                      <button className="mini-btn small" onClick={() => toggleComboIng(idx)}>
                        {ing.isCombo ? '改单品' : '改组合'}
                      </button>
                      <button className="mini-btn small danger" onClick={() => deleteIngredient(idx)}>删</button>
                    </td>
                  </tr>

                  {/* 组合食材展开 → 配方子行 */}
                  {ing.isCombo && isOpen && (
                    <tr className="combo-sub-row">
                      <td colSpan={5} style={{ padding: 0 }}>
                        <div className="sub-recipe">
                          <div className="sub-recipe-head">
                            <span>配方（每份含）</span>
                            <button className="mini-btn" onClick={() => addSubItem(idx)}>＋ 加子食材</button>
                          </div>
                          <table className="sub-recipe-table">
                            <thead>
                              <tr>
                                <th>子食材</th>
                                <th>用量（g）</th>
                                <th>成本参考（{curSupplier?.name || ''}）</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(ing.subRecipe || []).map((sub, sIdx) => {
                                const subIng = state.ingredients.find((i) => i.id === sub.ingredientId);
                                const subPrice = subIng?.prices?.[curSupplierId];
                                const subCost = subPrice && !subIng?.isCombo
                                  ? ingredientCost(subPrice.price, subPrice.unit, sub.amount, 'g', subIng.yieldRate)
                                  : 0;
                                return (
                                  <tr key={sIdx}>
                                    <td>
                                      <select
                                        value={sub.ingredientId}
                                        onChange={(e) => updateSubItem(idx, sIdx, { ingredientId: e.target.value })}
                                      >
                                        <option value="">-- 选食材 --</option>
                                        {state.ingredients
                                          .filter((i) => !i.isCombo)
                                          .map((i) => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                          ))}
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="number" min="0" step="any"
                                        value={sub.amount}
                                        onChange={(e) => updateSubItem(idx, sIdx, { amount: parseFloat(e.target.value) || 0 })}
                                      />
                                    </td>
                                    <td className="cost-ref">
                                      {subCost > 0 ? fmt(subCost) : '—'}
                                    </td>
                                    <td>
                                      <button className="mini-btn small danger" onClick={() => deleteSubItem(idx, sIdx)}>删</button>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className="sub-recipe-sum">
                                <td colSpan={2}>
                                  <strong>合计成本</strong>
                                </td>
                                <td>
                                  <strong>
                                    {fmt(
                                      (ing.subRecipe || []).reduce((s, sub) => {
                                        const subIng = state.ingredients.find((i) => i.id === sub.ingredientId);
                                        const subPrice = subIng?.prices?.[curSupplierId];
                                        if (!subPrice || subIng?.isCombo) return s;
                                        return s + ingredientCost(subPrice.price, subPrice.unit, sub.amount, 'g', subIng.yieldRate);
                                      }, 0)
                                    )}
                                  </strong>
                                </td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <button className="add-row" onClick={addIngredient}>＋ 添加食材</button>
      </div>

      <div className="hint">
        · 出货率 = 成品克数 ÷ 进货克数（生牛肉 100g 煮完剩 90g → 填 0.90）<br />
        · 组合食材（如牛杂）= 由多个子食材配方组成，成本自动按子食材 × 出货率 算出<br />
        · 点"当前供应商"那一列可快速填进价和单位，其他供应商的列作为参考对照
      </div>
    </div>
  );
}

// ======== Tab 2：套餐毛利计算 ========
function MealsView(props: {
  state: SavedState;
  setState: React.Dispatch<React.SetStateAction<SavedState>>;
  curSupplierId: string;
  setCurSupplierId: (id: string) => void;
  curMeal: number;
  setCurMeal: (i: number) => void;
}) {
  const { state, setState, curSupplierId, setCurSupplierId, curMeal, setCurMeal } = props;
  const meal = state.meals[curMeal];

  const updateMealField = (field: string, val: string) => {
    setState((s) => {
      const list = [...s.meals];
      list[curMeal] = { ...list[curMeal], [field]: parseFloat(val) || 0 };
      return { ...s, meals: list };
    });
  };

  const updateItem = (itemIdx: number, patch: Partial<MealItemNew>) => {
    setState((s) => {
      const list = [...s.meals];
      const items = [...list[curMeal].items];
      items[itemIdx] = { ...items[itemIdx], ...patch };
      list[curMeal] = { ...list[curMeal], items };
      return { ...s, meals: list };
    });
  };

  // 所有供应商的毛利对比
  const allComparisons = useMemo(() => {
    return state.suppliers.map((sp) => ({
      supplier: sp,
      result: computeMeal(meal, state.ingredients, sp.id),
      foodCost: mealFoodCost(meal.items, state.ingredients, sp.id),
    }));
  }, [meal, state.ingredients, state.suppliers]);

  const bestSupplier = allComparisons.reduce((best, cur) =>
    cur.result.mReal > best.result.mReal ? cur : best
  , allComparisons[0]);
  const worstSupplier = allComparisons.reduce((worst, cur) =>
    cur.result.mReal < worst.result.mReal ? cur : worst
  , allComparisons[0]);

  // 排序后的对比：毛利率从高到低
  const sortedComparisons = [...allComparisons].sort((a, b) => b.result.mReal - a.result.mReal);
  const maxMargin = Math.max(...allComparisons.map((c) => c.result.mReal), 0.01);
  const [dailySets, setDailySets] = useState(30);
  const monthlyDays = 30;
  const bestNetProfit = bestSupplier.result.P - bestSupplier.result.costTotal;
  const curComparison = allComparisons.find((c) => c.supplier.id === curSupplierId);
  const curNetProfit = curComparison ? curComparison.result.P - curComparison.result.costTotal : 0;
  const monthlySaveVsWorst = Math.max(0, (bestNetProfit - (worstSupplier.result.P - worstSupplier.result.costTotal)) * dailySets * monthlyDays);
  const monthlySaveVsCurrent = Math.max(0, (bestNetProfit - curNetProfit) * dailySets * monthlyDays);

  return (
    <div className="panel">
      {/* 顶部：套餐选择 + 全局供应商 + 毛利对比 */}
      <div className="meal-header">
        <div className="header-row">
          <label>套餐：</label>
          <select value={curMeal} onChange={(e) => setCurMeal(parseInt(e.target.value))}>
            {state.meals.map((m, i) => (
              <option key={m.id} value={i}>{m.name}</option>
            ))}
          </select>

          <label className="ml">当前计算供应商：</label>
          <select value={curSupplierId} onChange={(e) => setCurSupplierId(e.target.value)}>
            {state.suppliers.map((sp) => (
              <option key={sp.id} value={sp.id}>{sp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== 🔥 供应商毛利对比条形图 ===== */}
      <div className="compare-hero">
        <div className="compare-hero-head">
          <h3>📊 供应商毛利率对比</h3>
          <span className="hint-inline">按实际毛利率排序 · 一眼看出谁最赚</span>
        </div>
        <div className="hero-bars">
          {sortedComparisons.map(({ supplier, result }, i) => {
            const w = (result.mReal / maxMargin) * 100;
            const isBest = supplier.id === bestSupplier.supplier.id;
            return (
              <div className="hero-bar" key={supplier.id}>
                <div className="hero-bar-name">
                  {i === 0 && <span className="rank-gold">🏆</span>}
                  <strong>{supplier.name}</strong>
                  {supplier.id === curSupplierId && <span className="tag-cur">当前</span>}
                  {isBest && <span className="tag-best">毛利最高</span>}
                </div>
                <div className="hero-bar-track">
                  <div
                    className={'hero-bar-fill ' + (isBest ? 'gold' : 'gray')}
                    style={{ width: Math.max(w, 2) + '%' }}
                  >
                    <span className="hero-bar-pct">{pct(result.mReal)}</span>
                  </div>
                </div>
                <div className="hero-bar-meta">
                  <span className={result.mReal >= 0.5 ? 'g' : 'r'}>{pct(result.mReal)}</span>
                  <span className="hero-bar-net">净利 {fmt(result.P - result.costTotal)}/份</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 省钱计算器 */}
        <div className="save-calc">
          <div className="save-calc-head">
            <span>💡 省钱计算器</span>
            <label className="daily-input">
              每天卖出
              <input
                type="number"
                min="0"
                value={dailySets}
                onChange={(e) => setDailySets(parseInt(e.target.value) || 0)}
              />
              份
            </label>
          </div>
          <div className="save-calc-body">
            <div className="save-item">
              <div className="save-label">
                用 <strong>{bestSupplier.supplier.name}</strong>（毛利最高）
                <br />相比 <strong>{worstSupplier.supplier.name}</strong>（毛利最低）
              </div>
              <div className="save-amount">
                <div className="save-num gold">省 {fmt(monthlySaveVsWorst)}</div>
                <div className="save-sub">/ 月（按 {monthlyDays} 天算）</div>
              </div>
            </div>
            {curSupplierId !== bestSupplier.supplier.id && curSupplierId !== '' && (
              <div className="save-item highlight">
                <div className="save-label">
                  你当前用的是 <strong>{curComparison?.supplier.name}</strong>
                  <br />如果换成 <strong>{bestSupplier.supplier.name}</strong>
                </div>
                <div className="save-amount">
                  <div className="save-num green">每月多赚 {fmt(monthlySaveVsCurrent)}</div>
                  <div className="save-sub">每份多赚 {fmt(bestNetProfit - curNetProfit)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 毛利对比卡片 */}
      <div className="compare-cards">
        {allComparisons.map(({ supplier, result, foodCost }) => {
          const isBest = supplier.id === bestSupplier.supplier.id;
          return (
            <div
              key={supplier.id}
              className={'compare-card ' + (supplier.id === curSupplierId ? 'active ' : '') + (isBest ? 'best' : '')}
            >
              {isBest && <div className="badge-best">★ 毛利最高</div>}
              <div className="cc-supplier">{supplier.name}</div>
              <div className="cc-nums">
                <div>
                  <div className="cc-label">食材成本</div>
                  <div className="cc-val">{fmt(foodCost)}</div>
                </div>
                <div>
                  <div className="cc-label">实际毛利率</div>
                  <div className={'cc-val ' + (result.mReal > 0.5 ? 'g' : 'r')}>
                    {pct(result.mReal)}
                  </div>
                </div>
                <div>
                  <div className="cc-label">净利率</div>
                  <div className={'cc-val ' + (result.mNet > 0.2 ? 'g' : 'r')}>
                    {pct(result.mNet)}
                  </div>
                </div>
                <div>
                  <div className="cc-label">每套净利</div>
                  <div className="cc-val">{fmt(result.P - result.costTotal)}</div>
                </div>
              </div>
              {supplier.id === curSupplierId && <div className="badge-cur">当前使用</div>}
            </div>
          );
        })}
      </div>

      {/* 套餐基本信息 */}
      <div className="meal-fields">
        <div className="field-row">
          <label>零售价（元）</label>
          <input
            type="number" step="any" value={meal.retail}
            onChange={(e) => updateMealField('retail', e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>折扣（如 5.1）</label>
          <input
            type="number" step="0.1" value={meal.discount}
            onChange={(e) => updateMealField('discount', e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>食材损耗率（%）</label>
          <input
            type="number" step="any" value={meal.loss}
            onChange={(e) => updateMealField('loss', e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>人工（元/套）</label>
          <input
            type="number" step="any" value={meal.lab}
            onChange={(e) => updateMealField('lab', e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>燃气水电（元/套）</label>
          <input
            type="number" step="any" value={meal.gas}
            onChange={(e) => updateMealField('gas', e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>租金分摊（元/套）</label>
          <input
            type="number" step="any" value={meal.rent}
            onChange={(e) => updateMealField('rent', e.target.value)}
          />
        </div>
      </div>

      {/* 食材明细表格 */}
      <div className="meal-items-wrap">
        <h3>📋 食材明细</h3>
        <p className="hint">
          食材成本由【食材库 × 当前供应商】自动算出。二选一/三选行会取<strong>最贵的那个</strong>计入合计。
        </p>
        <table className="meal-items">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>食材</th>
              <th style={{ width: '8%' }}>用量</th>
              <th style={{ width: '8%' }}>单位</th>
              <th style={{ width: '12%' }}>零售价</th>
              <th style={{ width: '14%' }}>成本价（自动）</th>
              <th style={{ width: '14%' }}>小计（×用量）</th>
            </tr>
          </thead>
          <tbody>
            {meal.items.map((it, idx) => {
              if (it.kind === 'group') {
                return (
                  <tr key={idx} className="group-row">
                    <td colSpan={6}>
                      <strong>🔀 {it.label}</strong>
                      <span className="hint-inline">
                        自动取组内最贵的计入合计
                      </span>
                    </td>
                  </tr>
                );
              }
              const ing = state.ingredients.find((i) => i.id === it.ingredientId);
              const curSupplier = state.suppliers.find((s) => s.id === curSupplierId);
              let itemCost = 0;
              if (ing && curSupplier && ing.prices?.[curSupplierId]) {
                const priceInfo = ing.prices[curSupplierId];
                if (ing.isCombo && ing.subRecipe) {
                  itemCost = mealFoodCost([it], state.ingredients, curSupplierId);
                } else {
                  itemCost = ingredientCost(
                    priceInfo.price, priceInfo.unit,
                    it.qty || 0, it.qtyUnit || 'g',
                    ing.yieldRate || 1
                  );
                }
              } else if (it.cost) {
                itemCost = it.cost;
              }
              const noPrice = ing && curSupplier && !ing.prices?.[curSupplierId] && !it.cost;
              return (
                <tr key={idx} className={noPrice ? 'warn-row' : ''}>
                  <td>
                    <select
                      value={it.ingredientId || ''}
                      onChange={(e) => {
                        const ing2 = state.ingredients.find((i) => i.id === e.target.value);
                        updateItem(idx, {
                          ingredientId: e.target.value,
                          name: ing2?.name || '',
                          qty: it.qty ?? 100,
                          qtyUnit: it.qtyUnit || (ing2?.isCombo ? '份' : 'g'),
                        });
                      }}
                    >
                      <option value="">-- 选食材 --</option>
                      {state.ingredients.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.isCombo ? '🔸 ' : ''}{i.name}
                        </option>
                      ))}
                    </select>
                    {noPrice && <span className="tag-warn">该供应商无报价</span>}
                  </td>
                  <td>
                    <input
                      type="number" step="any" min="0"
                      value={it.qty ?? ''}
                      onChange={(e) => updateItem(idx, { qty: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td>
                    <select
                      value={it.qtyUnit || 'g'}
                      onChange={(e) => updateItem(idx, { qtyUnit: e.target.value })}
                    >
                      {['g', 'kg', '斤', '份', '个', '包', '瓶', '锅'].map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number" step="any" min="0"
                      value={it.retail ?? ''}
                      onChange={(e) => updateItem(idx, { retail: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="cost-val">
                    {fmt(itemCost)}
                  </td>
                  <td className="cost-val total">
                    {fmt(itemCost)}
                  </td>
                </tr>
              );
            })}
            <tr className="sum-row">
              <td colSpan={4}><strong>食材成本小计（未计损耗）</strong></td>
              <td></td>
              <td className="cost-val total">
                <strong>{fmt(mealFoodCost(meal.items, state.ingredients, curSupplierId))}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="note">
        · 所有数据自动保存到浏览器本地<br />
        · 切换供应商 = 一键切换整套餐的成本结构和毛利对比<br />
        · 未来可对接 Supabase 同步给团队
      </div>
    </div>
  );
}

// ======== 样式 ========
const STYLES = `
  :root {
    --bg: #f7f8fa;
    --card: #fff;
    --ink: #1f2329;
    --sub: #6b7280;
    --line: #e5e7eb;
    --brand: #e0322d;
    --brand-soft: #fdecea;
    --green: #0a8f3c;
    --blue: #2563eb;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background: var(--bg);
    color: var(--ink);
    padding: 20px;
  }
  .wrap { max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 12px; }

  /* Tab 切换 */
  .tabs { display: flex; gap: 8px; margin-bottom: 14px; }
  .tab {
    padding: 10px 18px;
    border: 1px solid var(--line);
    border-radius: 10px 10px 2px 2px;
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    color: var(--sub);
    cursor: pointer;
    transition: all .15s;
  }
  .tab.on {
    background: var(--brand);
    color: #fff;
    border-color: var(--brand);
  }
  .tab:hover:not(.on) { border-color: var(--brand); color: var(--brand); }

  .panel {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 0 12px 12px 12px;
    padding: 20px;
  }

  /* 供应商栏 */
  .supplier-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--line);
    flex-wrap: wrap;
    gap: 10px;
  }
  .supplier-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .sp-tab {
    padding: 7px 14px;
    border: 1px solid var(--line);
    background: #fff;
    border-radius: 20px;
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    transition: all .15s;
  }
  .sp-tab.on {
    background: var(--brand);
    color: #fff;
    border-color: var(--brand);
  }
  .sp-tab:hover:not(.on) { border-color: var(--brand); }
  .sp-add {
    padding: 7px 12px;
    border: 1px dashed var(--brand);
    color: var(--brand);
    background: transparent;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
  }

  .mini-btn {
    padding: 6px 14px;
    border: 1px solid var(--line);
    background: #fff;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--brand);
    cursor: pointer;
  }
  .mini-btn.small { padding: 4px 8px; font-size: 11.5px; margin-right: 4px; }
  .mini-btn.danger { color: #dc2626; border-color: #fecaca; }

  .supplier-edit {
    background: #fafafa;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
  }
  .supplier-edit table { width: 100%; border-collapse: collapse; }
  .supplier-edit th, .supplier-edit td { padding: 6px; text-align: left; font-size: 13px; }
  .supplier-edit input {
    width: 100%;
    padding: 5px 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
  }

  /* 食材表格 */
  .cur-supplier-hint {
    font-size: 13px;
    color: var(--sub);
    margin-bottom: 10px;
    padding: 8px 12px;
    background: var(--brand-soft);
    border-radius: 8px;
  }
  .cur-supplier-hint strong { color: var(--brand); }
  .table-wrap { overflow-x: auto; }
  .ing-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ing-table th, .ing-table td {
    border-bottom: 1px solid var(--line);
    padding: 8px 8px;
    text-align: left;
    vertical-align: middle;
  }
  .ing-table thead th {
    background: #fafafa;
    font-weight: 600;
    color: var(--ink);
  }
  .ing-table .sub-head th {
    background: #f4f5f7;
    font-weight: 400;
    font-size: 12px;
    color: var(--sub);
    padding: 4px 8px;
  }
  .ing-table .sub-cell { display: flex; gap: 6px; justify-content: center; align-items: center; }
  .combo-row td { background: #fff9f8; }
  .combo-sub-row td { padding: 0; }
  .tag-main {
    display: inline-block;
    margin-left: 4px;
    background: var(--brand);
    color: #fff;
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 10px;
    vertical-align: middle;
  }
  .tag-warn {
    display: inline-block;
    margin-left: 6px;
    background: #fef3c7;
    color: #b45309;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
  }

  .ing-name {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .expand-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: var(--sub);
    padding: 0 2px;
  }
  .name-input {
    flex: 1;
    min-width: 80px;
    padding: 5px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    font-size: 13px;
    background: transparent;
  }
  .name-input:focus {
    border-color: var(--brand);
    background: #fff;
    outline: none;
  }
  .combo-badge {
    font-size: 11px;
    background: #fff7ed;
    color: #b45309;
    padding: 1px 7px;
    border-radius: 10px;
    border: 1px solid #fed7aa;
  }
  .rate-input {
    width: 60px;
    padding: 4px 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
    text-align: right;
  }
  .price-cell {
    text-align: center;
    font-size: 13px;
    color: var(--sub);
  }
  .price-cell.dual { display: flex; gap: 4px; justify-content: center; }
  .price-cell.dual input.mini { width: 50%; }
  input.mini {
    padding: 4px 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
  }
  input.mini.price { text-align: right; }
  input.mini.unit { text-align: left; min-width: 36px; }
  .muted { color: #9ca3af; font-size: 12px; }
  .action-cell { white-space: nowrap; }

  /* 组合食材配方 */
  .sub-recipe {
    margin: 6px 16px;
    background: #fafafa;
    border-radius: 10px;
    padding: 10px 12px;
    border: 1px dashed #fecaca;
  }
  .sub-recipe-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 8px;
    color: var(--brand);
  }
  .sub-recipe-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .sub-recipe-table th, .sub-recipe-table td {
    padding: 5px 6px;
    text-align: left;
    border-bottom: 1px solid var(--line);
  }
  .sub-recipe-table input, .sub-recipe-table select {
    padding: 4px 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
    width: 100%;
  }
  .sub-recipe-sum td { border-top: 2px solid var(--brand); background: var(--brand-soft); }
  .cost-ref { text-align: right; font-weight: 600; }
  .sub-recipe-sum td.cost-ref strong { color: var(--brand); }

  .add-row {
    margin-top: 10px;
    padding: 8px 16px;
    border: 1px dashed var(--brand);
    background: var(--brand-soft);
    color: var(--brand);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
  }

  .hint { color: var(--sub); font-size: 12px; margin-top: 10px; line-height: 1.6; }
  .hint-inline { color: var(--sub); font-size: 12px; margin-left: 8px; font-weight: 400; }
  .note { color: var(--sub); font-size: 12px; margin-top: 14px; line-height: 1.7; padding-top: 12px; border-top: 1px dashed var(--line); }

  /* ===== 供应商毛利对比条形图 ===== */
  .compare-hero {
    background: linear-gradient(135deg, #fff9f8 0%, #fffbeb 100%);
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .compare-hero-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .compare-hero-head h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
  .hero-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  .hero-bar {
    display: grid;
    grid-template-columns: 140px 1fr 150px;
    align-items: center;
    gap: 10px;
  }
  .hero-bar-name {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    flex-wrap: wrap;
  }
  .hero-bar-name strong { color: var(--ink); }
  .tag-cur {
    background: var(--brand);
    color: #fff;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    font-weight: 600;
  }
  .tag-best {
    background: #f59e0b;
    color: #fff;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    font-weight: 600;
  }
  .rank-gold { font-size: 14px; }
  .hero-bar-track {
    height: 26px;
    background: #f3f4f6;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .hero-bar-fill {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    transition: width .3s ease;
    min-width: 30px;
  }
  .hero-bar-fill.gold {
    background: linear-gradient(90deg, #f59e0b, #d97706);
  }
  .hero-bar-fill.gray {
    background: linear-gradient(90deg, #9ca3af, #6b7280);
  }
  .hero-bar-pct {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }
  .hero-bar-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-size: 12px;
  }
  .hero-bar-meta .g { color: var(--green); font-weight: 700; }
  .hero-bar-meta .r { color: var(--brand); font-weight: 700; }
  .hero-bar-net { color: var(--sub); }

  /* 省钱计算器 */
  .save-calc {
    background: #fff;
    border: 1px solid #fde68a;
    border-radius: 10px;
    padding: 14px;
  }
  .save-calc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .save-calc-head > span {
    font-weight: 700;
    font-size: 13px;
    color: #92400e;
  }
  .daily-input {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: var(--sub);
  }
  .daily-input input {
    width: 60px;
    padding: 5px 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    text-align: right;
  }
  .save-calc-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .save-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: #fafafa;
    border-radius: 8px;
    gap: 10px;
  }
  .save-item.highlight {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border: 1px solid #a7f3d0;
  }
  .save-label { font-size: 12.5px; color: var(--sub); line-height: 1.5; }
  .save-label strong { color: var(--ink); }
  .save-amount { text-align: right; flex: none; }
  .save-num { font-size: 18px; font-weight: 800; }
  .save-num.gold { color: #d97706; }
  .save-num.green { color: #059669; }
  .save-sub { font-size: 11.5px; color: var(--sub); margin-top: 2px; }

  /* ===== Tab 2：套餐 ===== */
  .meal-header { margin-bottom: 12px; }
  .header-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .header-row label { font-size: 13px; font-weight: 600; color: var(--sub); }
  .header-row label.ml { margin-left: 16px; }
  select {
    padding: 8px 12px;
    border: 1px solid var(--line);
    border-radius: 8px;
    font-size: 13px;
    background: #fff;
  }

  /* 毛利对比卡片 */
  .compare-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  .compare-card {
    position: relative;
    background: #fafafa;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 14px;
    transition: all .15s;
  }
  .compare-card.active {
    border-color: var(--brand);
    background: var(--brand-soft);
  }
  .compare-card.best { border-color: #f59e0b; background: #fffbeb; }
  .cc-supplier {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
  }
  .cc-nums {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .cc-label { font-size: 11px; color: var(--sub); }
  .cc-val { font-size: 15px; font-weight: 700; color: var(--ink); margin-top: 2px; }
  .cc-val.g { color: var(--green); }
  .cc-val.r { color: var(--brand); }
  .badge-best {
    position: absolute;
    top: -8px;
    right: -4px;
    background: #f59e0b;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
  }
  .badge-cur {
    position: absolute;
    top: -8px;
    left: 10px;
    background: var(--brand);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
  }

  /* 套餐字段 */
  .meal-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px dashed var(--line);
  }
  .field-row { display: flex; flex-direction: column; gap: 4px; }
  .field-row label { font-size: 12px; color: var(--sub); font-weight: 600; }
  .field-row input {
    padding: 7px 10px;
    border: 1px solid var(--line);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  /* 套餐明细 */
  .meal-items-wrap h3 { margin: 0 0 4px; font-size: 15px; }
  .meal-items {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin-top: 10px;
  }
  .meal-items th, .meal-items td {
    padding: 8px 6px;
    border-bottom: 1px solid var(--line);
    text-align: left;
    vertical-align: middle;
  }
  .meal-items thead th {
    background: #fafafa;
    font-weight: 600;
    color: var(--sub);
    font-size: 12px;
  }
  .meal-items input, .meal-items select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 13px;
  }
  .meal-items .group-row td {
    background: #fff9f8;
    color: var(--brand);
    font-weight: 600;
    font-size: 13px;
    padding: 8px 6px;
  }
  .meal-items .warn-row { background: #fffbeb; }
  .cost-val { font-weight: 600; text-align: right; color: var(--ink); }
  .cost-val.total { color: var(--brand); font-weight: 700; }
  .sum-row td {
    border-top: 2px solid var(--brand);
    background: var(--brand-soft);
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .tabs { flex-direction: column; }
    .tab { border-radius: 10px; }
    body { padding: 12px; }
    .panel { padding: 12px; border-radius: 12px; }
    .compare-cards { grid-template-columns: 1fr 1fr; }
    .meal-items, .ing-table { font-size: 12px; }
    .header-row label.ml { margin-left: 0; }
    .hero-bar { grid-template-columns: 100px 1fr 110px; }
    .hero-bar-name { font-size: 12px; }
    .save-calc-body { grid-template-columns: 1fr; }
  }
`;
