'use client';

import { useEffect, useRef, useState } from 'react';

// ===== 5 个套餐默认数据 =====
function build(list: any[][]) {
  return list.map((r) =>
    r[0] === 'group'
      ? { kind: 'group', label: r[1] }
      : {
          kind: 'item',
          name: r[0],
          pnum: r[1],
          punit: r[2],
          unitPrice: r[3],
          retail: r[4],
          cost: r[5],
          note: r[6],
          retailLock: false,
        }
  );
}

const I1 = [
  ['现熬牛骨汤', '', '锅', '', 25, null, ''],
  ['牛腩', '', '克', '', 58, 15, ''],
  ['牛杂', '', '克', '', 50, 15, ''],
  ['鲜牛肉', '100', 'g', 0.28, 28, 12, ''],
  ['牛肉饼', '4', '个', 7, 28, 4.8, ''],
  ['生菜', '', 'g', '', 15, 2, ''],
  ['秘制白萝卜', '', '克', '', 15, 1, ''],
  ['炸腐竹', '', 'g', '', 15, 2.5, ''],
  ['group', '二选一'],
  ['粿条', '1', '份', 5, 5, 2, ''],
  ['蟹黄面', '1', '包', 5, 5, 2, ''],
  ['group', '二选一'],
  ['狗毛膏', '2', '份', 6, 12, null, ''],
  ['可乐', '2', '份', 5, 10, null, ''],
  ['group', '二选一'],
  ['自制腐乳辣椒', '2', '份', 6, 12, null, ''],
  ['沙茶酱', '2', '份', 6, 12, null, ''],
];
const I2 = [
  ['现熬牛骨汤', '', '锅', '', 25, null, ''],
  ['牛腩', '', '克', '', 58, null, ''],
  ['牛杂', '', '克', '', 50, null, ''],
  ['牛排骨', '', '克', '', 38, null, ''],
  ['吊龙', '100', 'g', 0.38, 38, null, ''],
  ['牛肉丸', '4', '个', 8.75, 35, null, ''],
  ['牛肉饼', '4', '个', 7, 28, null, ''],
  ['时蔬', '', 'g', '', 15, null, ''],
  ['炸腐竹', '', 'g', '', 15, null, ''],
  ['group', '二选一'],
  ['粿条', '1', '份', 5, 5, null, ''],
  ['蟹黄面', '1', '包', 5, 5, null, ''],
  ['group', '二选一'],
  ['狗毛膏', '2', '份', 6, 12, null, ''],
  ['可乐', '2', '份', 5, 10, null, ''],
  ['group', '二选一'],
  ['自制腐乳辣椒', '2', '份', 6, 12, null, ''],
  ['沙茶酱', '2', '份', 6, 12, null, ''],
];
const I3 = [
  ['现熬牛骨汤', '', '锅', '', 25, null, ''],
  ['牛腩', '', '克', '', 65, null, ''],
  ['牛杂', '', '克', '', 60, null, ''],
  ['牛排骨', '', '克', '', 38, null, ''],
  ['吊龙', '100', 'g', 0.38, 38, null, ''],
  ['鲜牛肉', '100', 'g', 0.28, 28, null, ''],
  ['牛肉丸', '4', '个', 9.5, 38, null, ''],
  ['牛肉饼', '4', '个', 7, 28, null, ''],
  ['时蔬', '', 'g', '', 15, null, ''],
  ['炸腐竹', '', 'g', '', 15, null, ''],
  ['group', '三选二'],
  ['米饭', '2', '份', 5, 10, null, ''],
  ['粿条', '1', '份', 5, 5, null, ''],
  ['蟹黄面', '1', '包', 5, 5, null, ''],
  ['group', '二选一'],
  ['狗毛膏', '4', '份', 6, 24, null, ''],
  ['可乐', '4', '份', 5, 20, null, ''],
  ['group', '二选一'],
  ['自制腐乳辣椒', '4', '份', 6, 24, null, ''],
  ['沙茶酱', '4', '份', 6, 24, null, ''],
];
const I4 = [
  ['现熬牛骨汤', '', '锅', '', 25, null, ''],
  ['牛腩', '', '克', '', 78, null, ''],
  ['牛杂', '', '克', '', 70, null, ''],
  ['牛排骨', '', '克', '', 38, null, ''],
  ['吊龙', '100', 'g', 0.38, 38, null, ''],
  ['鲜牛肉', '100', 'g', 0.28, 28, null, ''],
  ['牛肉丸', '', '个', '', 38, null, ''],
  ['牛肉饼', '', '个', '', 28, null, ''],
  ['时蔬', '', 'g', '', 15, null, ''],
  ['炸腐竹', '', 'g', '', 15, null, ''],
  ['group', '三选二'],
  ['米饭', '2', '份', 5, 10, null, ''],
  ['粿条', '1', '份', 5, 5, null, ''],
  ['蟹黄面', '1', '包', 5, 5, null, ''],
  ['group', '二选一'],
  ['狗毛膏', '6', '份', 6, 36, null, ''],
  ['可乐', '6', '份', 5, 30, null, ''],
  ['group', '二选一'],
  ['自制腐乳辣椒', '6', '份', 6, 36, null, ''],
  ['沙茶酱', '6', '份', 6, 36, null, ''],
];
const I5 = [
  ['现熬牛骨汤', '', '锅', '', 50, null, ''],
  ['牛腩', '', '克', '', 130, null, ''],
  ['牛杂', '', '克', '', 120, null, ''],
  ['牛排骨', '', '克', '', 76, null, ''],
  ['吊龙', '200', 'g', 0.38, 76, null, ''],
  ['鲜牛肉', '200', 'g', 0.28, 56, null, ''],
  ['牛肉丸', '', '个', '', 76, null, ''],
  ['牛肉饼', '', '个', '', 56, null, ''],
  ['牛筒骨', '2', '个', 25, 50, null, ''],
  ['生菜', '', '克', '', 20, null, ''],
  ['金针菇', '', 'g', '', 12, null, ''],
  ['娃娃菜', '', 'g', '', 10, null, ''],
  ['炸腐竹', '', '克', '', 30, null, ''],
  ['group', '三选二'],
  ['米饭', '4', '份', 5, 20, null, ''],
  ['粿条', '1', '份', 5, 5, null, ''],
  ['蟹黄面', '1', '包', 5, 5, null, ''],
  ['group', '二选一'],
  ['狗毛膏', '8', '份', 6, 48, null, ''],
  ['1.25L可乐', '1', '份', 5, 5, null, ''],
  ['group', '二选一'],
  ['自制腐乳辣椒', '8', '份', 6, 48, null, ''],
  ['沙茶酱', '8', '份', 6, 48, null, ''],
];

const DEFAULT_MEALS = [
  {
    id: 'double',
    name: '牛腩牛杂火锅双人餐（4.6折）',
    retail: 273,
    discount: 4.6,
    loss: 10,
    tableStd: 2,
    tableAct: 2,
    tableUnit: 0,
    one: 0,
    lab: 0,
    gas: 0,
    rent: 0,
    items: build(I1),
  },
  {
    id: 'p23',
    name: '牛腩牛杂火锅2-3人餐（5.1折）',
    retail: 341,
    discount: 5.1,
    loss: 10,
    tableStd: 2,
    tableAct: 2,
    tableUnit: 0,
    one: 0,
    lab: 0,
    gas: 0,
    rent: 0,
    items: build(I2),
  },
  {
    id: 'p34',
    name: '牛腩牛杂火锅3-4人餐（5.4折）',
    retail: 433,
    discount: 5.4,
    loss: 10,
    tableStd: 4,
    tableAct: 4,
    tableUnit: 0,
    one: 0,
    lab: 0,
    gas: 0,
    rent: 0,
    items: build(I3),
  },
  {
    id: 'p56',
    name: '牛腩牛杂火锅5-6人餐（6.8折）',
    retail: 490,
    discount: 6.8,
    loss: 10,
    tableStd: 6,
    tableAct: 6,
    tableUnit: 0,
    one: 0,
    lab: 0,
    gas: 0,
    rent: 0,
    items: build(I4),
  },
  {
    id: 'p78',
    name: '牛腩牛杂火锅7-8人餐（5.9折）',
    retail: 923,
    discount: 5.9,
    loss: 10,
    tableStd: 8,
    tableAct: 8,
    tableUnit: 0,
    one: 0,
    lab: 0,
    gas: 0,
    rent: 0,
    items: build(I5),
  },
];

const FIELDS = ['retail', 'discount', 'loss', 'tableStd', 'tableAct', 'tableUnit', 'one', 'lab', 'gas', 'rent'];

type Meal = any;

export default function HotpotCalculator() {
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);
  const [cur, setCur] = useState(0);
  const [editing, setEditing] = useState(false);
  const [backup, setBackup] = useState<Meal[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [dbStatus, setDbStatus] = useState('');
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [costsExpanded, setCostsExpanded] = useState(false);
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const m = meals[cur];

  // 工具函数
  const clone = (o: any) => JSON.parse(JSON.stringify(o));
  const num = (v: any) => {
    const n = parseFloat(v);
    return isNaN(n) || n < 0 ? 0 : n;
  };
  const pct = (x: number) => (x * 100).toFixed(1) + '%';
  const fmt = (x: number) => '¥' + x.toFixed(1);
  const priceOf = (meal: Meal) => meal.retail * meal.discount / 10;
  const foodRaw = (meal: Meal) => {
    const items = meal.items;
    let sum = 0;
    let i = 0;
    while (i < items.length) {
      const it = items[i];
      if (it.kind === 'group') {
        // 解析"X选Y" → 取最贵的 Y 个
        const m = /(\d+)\s*选\s*(\d+)/.exec(it.label || '');
        const pick = m ? parseInt(m[2]) : 1;
        const groupItems: any[] = [];
        i++;
        while (i < items.length && items[i].kind === 'item') {
          groupItems.push(items[i]);
          i++;
        }
        const costs = groupItems.map((g) => (g.cost != null ? g.cost : 0)).sort((a, b) => b - a);
        sum += costs.slice(0, pick).reduce((s, c) => s + c, 0);
      } else if (it.kind === 'item') {
        sum += it.cost != null ? it.cost : 0;
        i++;
      } else {
        i++;
      }
    }
    return sum;
  };
  const itemGroupPrice = (it: any) =>
    it.retail != null ? it.retail * meals[cur].discount / 10 : 0;

  // 计算
  const compute = (meal: Meal) => {
    const P = priceOf(meal);
    const fr = foodRaw(meal);
    const foodReal = fr * (1 + meal.loss / 100);
    const tableCost = meal.tableUnit * meal.tableAct;
    const tableStd = meal.tableUnit * meal.tableStd;
    const grossCost = foodReal + tableCost + meal.one;
    const costTotal = grossCost + meal.lab + meal.gas + meal.rent;
    const theoFood = fr + tableStd + meal.one;
    return {
      P,
      fr,
      foodReal,
      tableCost,
      grossCost,
      costTotal,
      theoFood,
      mTheo: P > 0 ? (P - theoFood) / P : 0,
      mReal: P > 0 ? (P - grossCost) / P : 0,
      mNet: P > 0 ? (P - costTotal) / P : 0,
      tLoss: meal.tableStd > 0 ? (meal.tableAct - meal.tableStd) / meal.tableStd : 0,
    };
  };

  const r = compute(m);
  const itemCount = m.items.filter((it: any) => it.kind === 'item').length;
  const missingCostCount = m.items.filter(
    (it: any) => it.kind === 'item' && (it.cost == null || it.cost === 0)
  ).length;

  // 从数据库加载（彻底禁用缓存，避免部署/刷新后回到旧数据）
  const load = async (showLoading = true) => {
    if (showLoading) setDbStatus('正在加载...');
    try {
      const res = await fetch('/api/meals?t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const j = await res.json();
      if (j.success && j.data && j.data.length > 0) {
        // 合并：库内有数据的套餐用库内的，否则用默认值
        const map: Record<string, any> = {};
        j.data.forEach((d: any) => {
          if (d.id && d.items && d.items.length) map[d.id] = d;
        });
        const merged = DEFAULT_MEALS.map((def) =>
          map[def.id] ? { ...def, ...map[def.id] } : def
        );
        setMeals(merged);
        setDbStatus('已从数据库加载（' + j.data.length + ' 个套餐）');
      } else {
        setDbStatus('使用内置默认数据（库内暂无记录）');
      }
    } catch (e: any) {
      setDbStatus('数据库连接失败，使用本地默认数据：' + (e.message || e));
      console.warn('加载失败', e);
    }
  };

  useEffect(() => {
    setMounted(true);
    load();
  }, []);

  // 编辑控制
  const startEdit = () => {
    setBackup(clone(meals));
    setEditing(true);
    setItemsExpanded(true); // 编辑时自动展开食材明细
    setCostsExpanded(true);
    setExpensesExpanded(true);
  };

  const cancelEdit = () => {
    if (backup) {
      setMeals(clone(backup));
      setBackup(null);
    }
    setEditing(false);
    setItemsExpanded(false); // 退出编辑恢复折叠
    setCostsExpanded(false);
    setExpensesExpanded(false);
  };

  // 保存到数据库
  const saveToDb = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meals }),
      });
      const j = await res.json();
      if (j.success) {
        alert('已保存 ✓（' + j.count + ' 个套餐已同步）');
        setEditing(false);
        setBackup(null);
        setItemsExpanded(false); // 保存后恢复折叠
        setCostsExpanded(false);
        setExpensesExpanded(false);
        setDbStatus('已保存，正在刷新...');
        // 保存后立即重新加载，确保内存数据与数据库一致
        await load(false);
      } else {
        alert('保存失败：' + (j.error || '未知错误'));
      }
    } catch (e: any) {
      alert('保存失败：' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  // 切换套餐
  const switchMeal = (idx: number) => {
    setCur(idx);
  };

  // 更新单个字段输入
  const handleFieldInput = (field: string, val: string) => {
    const newMeals = [...meals];
    newMeals[cur] = { ...newMeals[cur], [field]: num(val) };
    setMeals(newMeals);
  };

  // 更新菜品条目
  const updateItem = (idx: number, field: string, value: any) => {
    const newMeals = [...meals];
    const newItems = [...newMeals[cur].items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    newMeals[cur] = { ...newMeals[cur], items: newItems };
    setMeals(newMeals);
  };

  // 自动计算零售价
  const tryAutoRetail = (idx: number) => {
    const it = meals[cur].items[idx];
    if (it.retailLock) return;
    const n = parseFloat(it.pnum);
    const p = parseFloat(it.unitPrice);
    if (!isNaN(n) && !isNaN(p) && n > 0 && p >= 0) {
      updateItem(idx, 'retail', Math.round(n * p * 100) / 100);
    }
  };

  // 手动修改零售价 → 锁定
  const handleRetailChange = (idx: number, v: string) => {
    updateItem(idx, 'retail', v === '' ? null : parseFloat(v));
    updateItem(idx, 'retailLock', true);
  };

  // 成本价变更
  const handleCostChange = (idx: number, v: string) => {
    updateItem(idx, 'cost', v === '' ? null : parseFloat(v));
  };

  const disabledAttr = editing ? {} : { disabled: true };

  // 移动端折叠块内容片段（桌面端直接渲染原内容）
  const costsBlock = (
    <>
      <div className="row" style={{ marginTop: '10px' }}>
        <label>食材损耗率（%）</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.loss}
          onChange={(e) => handleFieldInput('loss', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="hint">切配下脚料 + 化冻失水 + 剩菜 + 报损，火锅店常见 8%~15%</div>

      <div className="sub-h">一次性餐具（按实际用量）</div>
      <div className="row">
        <label>套餐给的套数（标准）</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={m.tableStd}
          onChange={(e) => handleFieldInput('tableStd', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="row">
        <label>实际平均用量（套/套）</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={m.tableAct}
          onChange={(e) => handleFieldInput('tableAct', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="row">
        <label>单套餐具成本（元）</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.tableUnit}
          onChange={(e) => handleFieldInput('tableUnit', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="row">
        <label>一次性用品（桌布/纸巾）（元）</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.one}
          onChange={(e) => handleFieldInput('one', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="pill">餐具超额使用率：{(r.tLoss * 100).toFixed(0)}%</div>
    </>
  );

  const expensesBlock = (
    <>
      <h2>
        ② 营运费用 <span className="tag">计入净利</span>
      </h2>
      <div className="hint">固定/半固定开支，不随每套餐具用量变，放净利层看</div>
      <div className="row">
        <label>人工分摊</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.lab}
          onChange={(e) => handleFieldInput('lab', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="row">
        <label>燃气 / 水电</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.gas}
          onChange={(e) => handleFieldInput('gas', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="row">
        <label>租金 / 其他分摊</label>
        <input
          type="number"
          step="any"
          min="0"
          value={m.rent}
          onChange={(e) => handleFieldInput('rent', e.target.value)}
          {...disabledAttr}
        />
      </div>
      <div className="note" style={{ marginTop: '14px' }}>
        · 双人餐给 2 套、实际用 3 套 → 餐具多耗 50%，直接吃毛利。
        <br />
        · 改「折扣」售价自动跟着变。
        <br />
        · 填完点「保存」可同步给团队。
      </div>
    </>
  );

  if (!mounted) {
    return (
      <div className="loading-wrap">
        <div className="loading-hotpot">
          <div className="loading-pot"></div>
          <div className="loading-steam">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="loading-brand">火锅毛利率</div>
        <div className="loading-dots">加载中</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h1>火锅套餐毛利率计算器 · 多套餐</h1>
      <p className="tip">
        下拉切换套餐 → 点「编辑」填写 → 点「保存」同步到数据库。默认只读防误改。
        <span style={{ marginLeft: '8px', color: '#6b7280' }}>{dbStatus}</span>
      </p>

      <div className="selbar">
        <label>选择套餐：</label>
        <select value={cur} onChange={(e) => switchMeal(parseInt(e.target.value))}>
          {meals.map((m, i) => (
            <option key={m.id} value={i}>
              {m.name}
            </option>
          ))}
        </select>
        {!editing ? (
          <button className="btn" onClick={startEdit}>
            编辑
          </button>
        ) : (
          <>
            <button className="btn" onClick={saveToDb} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
            <button className="btn ghost" onClick={cancelEdit}>
              取消
            </button>
          </>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h2>
            ① 套餐与可变成本 <span className="tag">计入毛利</span>
          </h2>
          <div className="row">
            <label>零售价（原价，元）</label>
            <input
              type="number"
              step="any"
              min="0"
              value={m.retail}
              onChange={(e) => handleFieldInput('retail', e.target.value)}
              {...disabledAttr}
            />
          </div>
          <div className="row">
            <label>折扣（折，如 4.6）</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={m.discount}
              onChange={(e) => handleFieldInput('discount', e.target.value)}
              {...disabledAttr}
            />
          </div>
          <div className="hint">售价（团购成交价）= 零售价 × 折扣，自动计算</div>
          <div className="priceview">售价（团购价）= {fmt(r.P)}</div>

          <div className="items-desktop">
            <div className="collapse-head">
              <span className="t">
                食材明细（{itemCount}项）· 小计 {fmt(foodRaw(m))}
                {missingCostCount > 0 && <span className="mt-warn"> · {missingCostCount} 项未填成本价</span>}
              </span>
              <button type="button" className="collapse-btn" onClick={() => setItemsExpanded(!itemsExpanded)}>
                {itemsExpanded ? '收起 ↑' : '展开 ↓'}
              </button>
            </div>
            <div className={itemsExpanded ? '' : 'collapsed'}>
            <table className="items">
              <thead>
                <tr>
                  <th>菜品名字</th>
                  <th>分量</th>
                  <th>单位</th>
                  <th>零售单价（元）</th>
                  <th>零售价（元）</th>
                  <th>团购价</th>
                  <th>成本价（必填·元）</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {m.items.map((it: any, idx: number) => {
                  if (it.kind === 'group') {
                    return (
                      <tr key={'g' + idx} className="group">
                        <td colSpan={8}>{it.label}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={idx}>
                      <td>{it.name}</td>
                      <td>
                        <input
                          className="pn"
                          value={it.pnum != null ? it.pnum : ''}
                          type="number"
                          step="any"
                          onChange={(e) => updateItem(idx, 'pnum', e.target.value)}
                          onBlur={() => tryAutoRetail(idx)}
                          {...disabledAttr}
                        />
                      </td>
                      <td>
                        <input
                          className="pu"
                          value={it.punit != null ? it.punit : ''}
                          onChange={(e) => updateItem(idx, 'punit', e.target.value)}
                          {...disabledAttr}
                        />
                      </td>
                      <td className="num">
                        <input
                          className="up"
                          value={it.unitPrice != null ? it.unitPrice : ''}
                          type="number"
                          step="any"
                          onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                          onBlur={() => tryAutoRetail(idx)}
                          {...disabledAttr}
                        />
                      </td>
                      <td className="num">
                        <input
                          className={'ret' + (it.retailLock ? ' locked' : '')}
                          value={it.retail != null ? it.retail : ''}
                          type="number"
                          step="any"
                          onChange={(e) => handleRetailChange(idx, e.target.value)}
                          {...disabledAttr}
                        />
                      </td>
                      <td className="num">{fmt(itemGroupPrice(it))}</td>
                      <td className="num">
                        <input
                          className={'cost' + (it.cost == null || it.cost === 0 ? ' zero' : '')}
                          value={it.cost == null ? '' : it.cost}
                          type="number"
                          step="any"
                          onChange={(e) => handleCostChange(idx, e.target.value)}
                          {...disabledAttr}
                        />
                      </td>
                      <td>
                        <input
                          className="note"
                          value={it.note != null ? it.note : ''}
                          placeholder="如：100g/份"
                          onChange={(e) => updateItem(idx, 'note', e.target.value)}
                          {...disabledAttr}
                        />
                      </td>
                    </tr>
                  );
                })}
                <tr className="sum">
                  <td colSpan={6}>食材成本小计（未计损耗）</td>
                  <td className="num">{fmt(foodRaw(m))}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>

          <div className="items-mobile">
            {!itemsExpanded ? (
              <button type="button" className="m-toggle" onClick={() => setItemsExpanded(true)}>
                <span className="mt-info">
                  <span className="mt-title">食材明细（{itemCount}项）</span>
                  <span className="mt-sub">
                    食材成本小计 {fmt(foodRaw(m))} · 点开查看
                    {missingCostCount > 0 && (
                      <span className="mt-warn"> · {missingCostCount} 项未填成本价</span>
                    )}
                  </span>
                </span>
                <span className="mt-arrow">查看 ↓</span>
              </button>
            ) : (
              <>
                <button type="button" className="m-toggle-inline" onClick={() => setItemsExpanded(false)}>
                  收起食材明细 ↑
                </button>
                {m.items.map((it: any, idx: number) => {
                  if (it.kind === 'group') {
                    return (
                      <div key={'g' + idx} className="m-group">
                        {it.label}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="m-card">
                      <div className="m-head">
                        <span className="m-name">{it.name}</span>
                        {it.cost == null || it.cost === 0 ? (
                          <span className="cost-miss">未填成本</span>
                        ) : (
                          <span className="m-price">{fmt(itemGroupPrice(it))}</span>
                        )}
                      </div>
                      <div className="m-fields">
                        <label>
                          <span>分量</span>
                          <input
                            type="number"
                            step="any"
                            value={it.pnum != null ? it.pnum : ''}
                            onChange={(e) => updateItem(idx, 'pnum', e.target.value)}
                            onBlur={() => tryAutoRetail(idx)}
                            {...disabledAttr}
                          />
                        </label>
                        <label>
                          <span>单位</span>
                          <input
                            className="pu"
                            value={it.punit != null ? it.punit : ''}
                            onChange={(e) => updateItem(idx, 'punit', e.target.value)}
                            {...disabledAttr}
                          />
                        </label>
                        <label>
                          <span>零售单价（元）</span>
                          <input
                            type="number"
                            step="any"
                            value={it.unitPrice != null ? it.unitPrice : ''}
                            onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                            onBlur={() => tryAutoRetail(idx)}
                            {...disabledAttr}
                          />
                        </label>
                        <label>
                          <span>零售价（元）</span>
                          <input
                            className={'ret' + (it.retailLock ? ' locked' : '')}
                            type="number"
                            step="any"
                            value={it.retail != null ? it.retail : ''}
                            onChange={(e) => handleRetailChange(idx, e.target.value)}
                            {...disabledAttr}
                          />
                        </label>
                        <label className="full">
                          <span className="cost-label">成本价（必填·元）</span>
                          <input
                            className={'cost' + (it.cost == null || it.cost === 0 ? ' zero' : '')}
                            type="number"
                            step="any"
                            placeholder="必填，如 12.5"
                            value={it.cost == null ? '' : it.cost}
                            onChange={(e) => handleCostChange(idx, e.target.value)}
                            {...disabledAttr}
                          />
                        </label>
                        <label className="full">
                          <span>备注</span>
                          <input
                            className="note"
                            value={it.note != null ? it.note : ''}
                            placeholder="如：100g/份"
                            onChange={(e) => updateItem(idx, 'note', e.target.value)}
                            {...disabledAttr}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
                <div className="m-sum">
                  <span>食材成本小计（未计损耗）</span>
                  <span>{fmt(foodRaw(m))}</span>
                </div>
                <button type="button" className="m-toggle-inline" onClick={() => setItemsExpanded(false)}>
                  收起食材明细 ↑
                </button>
              </>
            )}
          </div>
          <div className="costs-desktop">
            <div className="collapse-head">
              <span className="t">损耗与餐具</span>
              <button type="button" className="collapse-btn" onClick={() => setCostsExpanded(!costsExpanded)}>
                {costsExpanded ? '收起 ↑' : '展开 ↓'}
              </button>
            </div>
            <div className={costsExpanded ? '' : 'collapsed'}>{costsBlock}</div>
          </div>
          <div className="costs-mobile">
            {!costsExpanded ? (
              <button type="button" className="m-toggle" onClick={() => setCostsExpanded(true)}>
                <span className="mt-info">
                  <span className="mt-title">损耗与餐具</span>
                  <span className="mt-sub">
                    损耗 {m.loss ?? 0}% · 餐具超额 {((r.tLoss || 0) * 100).toFixed(0)}% · 一次性用品 {fmt(m.one || 0)}
                  </span>
                </span>
                <span className="mt-arrow">查看 ↓</span>
              </button>
            ) : (
              <>
                {costsBlock}
                <button type="button" className="m-toggle-inline" onClick={() => setCostsExpanded(false)}>
                  收起 ↑
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card expenses-desktop">
          {!expensesExpanded ? (
            <button type="button" className="collapse-head-btn" onClick={() => setExpensesExpanded(true)}>
              <span className="ch-info">
                <span className="ch-title">② 营运费用</span>
                <span className="ch-sub">
                  人工 {fmt(m.lab || 0)} · 燃气 {fmt(m.gas || 0)} · 租金 {fmt(m.rent || 0)}
                </span>
              </span>
              <span className="ch-arrow">展开 ↓</span>
            </button>
          ) : (
            <>
              <div className="collapse-head">
                <span className="t">② 营运费用</span>
                <button type="button" className="collapse-btn" onClick={() => setExpensesExpanded(false)}>
                  收起 ↑
                </button>
              </div>
              {expensesBlock}
            </>
          )}
        </div>
        <div className="card expenses-mobile">
          {!expensesExpanded ? (
            <button type="button" className="m-toggle" onClick={() => setExpensesExpanded(true)}>
              <span className="mt-info">
                <span className="mt-title">营运费用</span>
                <span className="mt-sub">
                  人工 {fmt(m.lab || 0)} · 燃气 {fmt(m.gas || 0)} · 租金 {fmt(m.rent || 0)}
                </span>
              </span>
              <span className="mt-arrow">查看 ↓</span>
            </button>
          ) : (
            <>
              {expensesBlock}
              <button type="button" className="m-toggle-inline" onClick={() => setExpensesExpanded(false)}>
                收起 ↑
              </button>
            </>
          )}
        </div>
      </div>

      <div className="result">
        <div className="big">
          <div className="metric">
            <div className="k">理论毛利率（标准用量）</div>
            <div className="v green">{pct(r.mTheo)}</div>
            <div className="d">
              食材+餐具(标准) {fmt(foodRaw(m) + m.tableUnit * m.tableStd + m.one)}
            </div>
          </div>
          <div className="metric">
            <div className="k">实际毛利率（含损耗+餐具）</div>
            <div className="v red">{pct(r.mReal)}</div>
            <div className="d">
              实际成本 {fmt(r.foodReal + m.tableUnit * m.tableAct + m.one)}
            </div>
          </div>
          <div className="metric">
            <div className="k">净利率（扣全部费用）</div>
            <div className="v blue">{pct(r.mNet)}</div>
            <div className="d">
              每套净利{' '}
              {fmt(r.P - (r.foodReal + m.tableUnit * m.tableAct + m.one + m.lab + m.gas + m.rent))}
            </div>
          </div>
        </div>

        <div className="bars">
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            当前套餐成本结构（售价 100% 去了哪）
          </div>
          {[
            { id: 'bFood', name: '食材(含损耗/锅底/蘸料/饮品)', val: r.foodReal, cls: 'f-food' },
            { id: 'bTable', name: '一次性餐具', val: r.tableCost, cls: 'f-table' },
            { id: 'bOne', name: '一次性用品', val: m.one, cls: 'f-one' },
            { id: 'bLab', name: '人工', val: m.lab, cls: 'f-lab' },
            { id: 'bGas', name: '燃气水电', val: m.gas, cls: 'f-gas' },
            { id: 'bRent', name: '租金其他', val: m.rent, cls: 'f-rent' },
          ].map((bar) => {
            const ratio = r.P > 0 ? bar.val / r.P : 0;
            const w = Math.min(ratio * 100, 100);
            const showInside = w >= 8;
            return (
              <div className="bar" key={bar.id}>
                <span className="name">{bar.name}</span>
                <div className="track">
                  <div
                    className={'fill ' + bar.cls}
                    style={{ width: Math.max(w, 0.01) + '%' }}
                  >
                    {showInside && r.P > 0 ? pct(ratio) : ''}
                  </div>
                </div>
                {!showInside && r.P > 0 ? <span className="bar-pct">{pct(ratio)}</span> : null}
              </div>
            );
          })}
          <div
            className="warn"
            style={{ display: r.mReal < 0.5 || r.mNet < 0.15 ? 'block' : 'none' }}
          >
            ⚠️ 实际毛利率低于 50% 或净利率低于 15%，这套餐定价偏紧，建议复核售价或压损耗。
          </div>
        </div>

        <div style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 2px' }}>
          5 个套餐横向对比
        </div>
        <div className="cmp-wrap">
          <table className="cmp">
            <thead>
              <tr>
                <th>套餐</th>
                <th>成本价</th>
                <th>团购价</th>
                <th>利润</th>
                <th>理论毛利率</th>
                <th>实际毛利率</th>
                <th>净利率</th>
                <th>餐具超额</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, i) => {
                const cr = compute(meal);
                return (
                  <tr key={meal.id}>
                    <td>
                      {meal.name}
                      {i === cur ? ' ·' : ''}
                    </td>
                    <td>{fmt(cr.grossCost)}</td>
                    <td>{fmt(cr.P)}</td>
                    <td>{fmt(cr.P - cr.grossCost)}</td>
                    <td className="g">{pct(cr.mTheo)}</td>
                    <td className="g">{pct(cr.mReal)}</td>
                    <td className="b">{pct(cr.mNet)}</td>
                    <td>{(cr.tLoss * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="note">
          注：对比表读取各套餐已填写的数值。改完任一套餐后切回它即可刷新对比。成本未填的套餐毛利率会虚高，先补全再比。
        </div>
      </div>

      <style jsx global>{`
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
          --amber: #b7791f;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
          background: var(--bg);
          color: var(--ink);
          padding: 20px;
          line-height: 1.5;
        }
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        h1 {
          font-size: 20px;
          margin: 0 0 4px;
        }
        .tip {
          color: var(--sub);
          font-size: 13px;
          margin: 0 0 10px;
        }
        .banner {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12.5px;
          margin: 0 0 14px;
          line-height: 1.6;
        }
        .banner b {
          color: #b45309;
        }
        .selbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .selbar label {
          font-size: 14px;
          font-weight: 600;
        }
        select {
          padding: 9px 12px;
          border: 1px solid var(--line);
          border-radius: 9px;
          font-size: 14px;
          background: #fff;
          color: var(--ink);
          min-width: 220px;
        }
        .btn {
          padding: 8px 14px;
          border: 1px solid var(--brand);
          background: var(--brand);
          color: #fff;
          border-radius: 9px;
          font-size: 13px;
          cursor: pointer;
        }
        .btn.ghost {
          background: #fff;
          color: var(--brand);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          align-items: start;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 16px;
        }
        .card h2 {
          font-size: 15px;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card h2 .tag {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 20px;
          background: var(--brand-soft);
          color: var(--brand);
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px 0;
          gap: 10px;
        }
        .row label {
          font-size: 14px;
          color: #374151;
          flex: 1;
        }
        .row input {
          width: 110px;
          padding: 7px 9px;
          border: 1px solid var(--line);
          border-radius: 8px;
          font-size: 14px;
          text-align: right;
          background: #fff;
          color: var(--ink);
        }
        .row input:focus {
          outline: none;
          border-color: var(--brand);
        }
        .priceview {
          text-align: right;
          font-size: 17px;
          font-weight: 700;
          color: var(--brand);
          margin: 2px 0 4px;
        }
        .hint {
          font-size: 11px;
          color: var(--sub);
          margin: -2px 0 6px;
        }
        .sub-h {
          font-size: 12px;
          font-weight: 600;
          color: var(--brand);
          margin: 14px 0 6px;
          border-top: 1px dashed var(--line);
          padding-top: 10px;
        }
        table.items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4px;
          table-layout: fixed;
        }
        table.items th,
        table.items td {
          padding: 7px 5px;
          text-align: left;
          font-size: 13px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        table.items th {
          color: var(--sub);
          font-weight: 600;
          background: #fafafa;
        }
        table.items td.num,
        table.items th.num {
          text-align: right;
        }
        table.items th:nth-child(1) {
          width: 18%;
        }
        table.items th:nth-child(2),
        table.items th:nth-child(3) {
          width: 9%;
        }
        table.items th:nth-child(4),
        table.items th:nth-child(5),
        table.items th:nth-child(6),
        table.items th:nth-child(7) {
          width: 12%;
        }
        table.items th:nth-child(8) {
          width: 16%;
        }
        table.items input {
          width: 100%;
          padding: 5px 6px;
          border: 1px solid var(--line);
          border-radius: 7px;
          font-size: 13px;
          color: var(--ink);
        }
        table.items input:focus {
          outline: none;
          border-color: var(--brand);
        }
        table.items input.cost {
          text-align: right;
        }
        table.items input.cost.zero {
          border-color: #dc2626;
          border-width: 2px;
          background: #fff1f0;
        }
        table.items input.pn {
          text-align: right;
        }
        table.items input.pu {
          text-align: left;
        }
        table.items input.ret {
          text-align: right;
          background: #fff;
        }
        table.items input.ret.locked {
          background: #fffbeb;
          border-color: #fde68a;
        }
        table.items input.note {
          text-align: left;
        }
        table.items tr.group td {
          background: #f4f5f7;
          color: var(--brand);
          font-weight: 600;
          font-size: 12px;
          padding-left: 6px;
        }
        table.items tr.sum td {
          font-weight: 700;
          border-top: 2px solid var(--line);
        }
        .items-mobile {
          display: none;
        }
        .costs-mobile,
        .expenses-mobile {
          display: none;
        }

        /* ===== 桌面端折叠（上下排列的卡片） ===== */
        .collapse-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 14px 0 6px;
          border-top: 1px dashed var(--line);
          padding-top: 10px;
        }
        .collapse-head .t {
          font-size: 12px;
          font-weight: 600;
          color: var(--brand);
        }
        .collapse-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--brand);
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 5px 12px;
          cursor: pointer;
        }
        .collapse-btn:hover {
          background: var(--brand-soft);
        }
        .collapsed {
          display: none;
        }
        .collapse-head-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        .collapse-head-btn .ch-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .collapse-head-btn .ch-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
        }
        .collapse-head-btn .ch-sub {
          font-size: 12px;
          color: var(--sub);
        }
        .collapse-head-btn .ch-arrow {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          flex: none;
        }
        input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .result {
          margin-top: 18px;
        }
        .big {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 14px;
        }
        @media (max-width: 640px) {
          .big {
            grid-template-columns: 1fr;
          }
        }
        .metric {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .metric .k {
          font-size: 13px;
          color: var(--sub);
        }
        .metric .v {
          font-size: 28px;
          font-weight: 700;
          margin-top: 6px;
        }
        .metric .d {
          font-size: 12px;
          color: var(--sub);
          margin-top: 4px;
        }
        .v.red {
          color: var(--brand);
        }
        .v.green {
          color: var(--green);
        }
        .v.blue {
          color: var(--blue);
        }
        .bars {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 14px;
        }
        .bar {
          display: flex;
          align-items: center;
          margin: 10px 0;
          font-size: 13px;
        }
        .bar .name {
          width: 170px;
          color: #374151;
          flex: none;
        }
        .bar .track {
          flex: 1;
          height: 22px;
          background: #f0f1f3;
          border-radius: 6px;
          overflow: hidden;
        }
        .bar .fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          color: #fff;
          font-size: 12px;
          border-radius: 6px;
          min-width: 4px;
        }
        .bar-pct {
          margin-left: 8px;
          font-size: 12px;
          color: var(--sub);
          flex: none;
          min-width: 38px;
          text-align: right;
        }
        .f-food {
          background: var(--brand);
        }
        .f-table {
          background: #0891b2;
        }
        .f-one {
          background: #7c3aed;
        }
        .f-lab {
          background: #475569;
        }
        .f-gas {
          background: #64748b;
        }
        .f-rent {
          background: #9333ea;
        }
        .note {
          font-size: 12px;
          color: var(--sub);
          margin-top: 10px;
          line-height: 1.6;
        }
        .warn {
          background: var(--brand-soft);
          border: 1px solid #f5c6c2;
          color: #a8201a;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          margin-top: 12px;
          display: none;
        }
        .pill {
          display: inline-block;
          background: #fff7ed;
          color: var(--amber);
          font-size: 12px;
          padding: 3px 9px;
          border-radius: 20px;
          margin-top: 8px;
          border: 1px solid #fde0b5;
        }
        table.cmp {
          width: 100%;
          border-collapse: collapse;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 6px;
        }
        table.cmp th,
        table.cmp td {
          padding: 10px 8px;
          text-align: center;
          font-size: 13px;
          border-bottom: 1px solid var(--line);
        }
        table.cmp th {
          background: #fafafa;
          color: var(--sub);
          font-weight: 600;
        }
        table.cmp td:first-child {
          text-align: left;
          font-weight: 600;
          color: #374151;
        }
        .g {
          color: var(--green);
          font-weight: 600;
        }
        .b {
          color: var(--blue);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          body {
            padding: 12px;
          }
          h1 {
            font-size: 18px;
          }
          .tip {
            font-size: 12px;
          }
          .banner {
            font-size: 12px;
            padding: 8px 10px;
          }
          .selbar {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          .selbar label {
            font-size: 13px;
          }
          select {
            width: 100%;
            min-width: 0;
            font-size: 16px;
            padding: 10px 12px;
          }
          .btn {
            width: 100%;
            padding: 10px 0;
            font-size: 15px;
          }
          .grid {
            gap: 10px;
          }
          .card {
            padding: 12px;
            border-radius: 10px;
          }
          .card h2 {
            font-size: 14px;
          }
          .row {
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            margin: 10px 0;
          }
          .row label {
            font-size: 13px;
          }
          .row input {
            width: 100%;
            font-size: 16px;
            padding: 10px 12px;
            text-align: left;
          }
          .priceview {
            font-size: 18px;
            text-align: left;
            margin: 8px 0;
          }
          .sub-h {
            font-size: 12px;
            margin: 12px 0 8px;
          }
          .items-desktop {
            display: none;
          }
          .costs-desktop,
          .expenses-desktop {
            display: none;
          }
          .items-mobile,
          .costs-mobile,
          .expenses-mobile {
            display: block;
          }
          .m-toggle {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 14px 16px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          }
          .m-toggle .mt-info {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }
          .m-toggle .mt-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--ink);
          }
          .m-toggle .mt-sub {
            font-size: 12px;
            color: var(--sub);
          }
          .m-toggle .mt-warn {
            color: #dc2626;
            font-weight: 700;
          }
          .m-toggle .mt-arrow {
            font-size: 13px;
            font-weight: 600;
            color: var(--brand);
            flex: none;
          }
          .m-toggle-inline {
            width: 100%;
            padding: 10px 0;
            background: transparent;
            border: none;
            color: var(--brand);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
          }
          .m-card {
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          }
          .m-group {
            color: var(--brand);
            font-weight: 600;
            font-size: 12px;
            padding: 8px 0 4px;
            margin-top: 6px;
          }
          .m-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .m-name {
            font-weight: 600;
            font-size: 14px;
          }
          .m-price {
            color: var(--brand);
            font-weight: 700;
            font-size: 14px;
          }
          .cost-miss {
            flex: none;
            font-size: 11px;
            font-weight: 700;
            color: #fff;
            background: #dc2626;
            padding: 2px 7px;
            border-radius: 6px;
          }
          .m-fields {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .m-fields label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
          }
          .m-fields label span {
            width: 72px;
            flex: none;
            color: var(--sub);
          }
          .m-fields input {
            flex: 1;
            min-width: 0;
            min-height: 44px;
            font-size: 16px;
            padding: 11px 12px;
            border: 1px solid var(--line);
            border-radius: 9px;
            color: var(--ink);
            background: #fff;
            text-align: left;
          }
          .m-fields input:focus {
            outline: none;
            border-color: var(--brand);
            box-shadow: 0 0 0 3px rgba(224, 50, 45, 0.08);
          }
          .m-fields input:disabled {
            background: #f3f4f6;
            color: #9ca3af;
          }
          .m-fields input.ret {
            background: #fff;
          }
          .m-fields input.ret.locked {
            background: #fffbeb;
            border-color: #fde68a;
          }
          .m-fields label span.cost-label {
            width: 72px;
            color: #dc2626;
            font-weight: 700;
          }
          .m-fields input.cost.zero {
            border-color: #dc2626;
            border-width: 2px;
            background: #fff1f0;
          }
          .m-sum {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: #fafafa;
            border: 1px solid var(--line);
            border-radius: 10px;
            font-weight: 700;
            font-size: 13px;
            margin-top: 4px;
          }
          .cmp-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin: 0 -12px;
            padding: 0 12px;
          }
          .cmp {
            min-width: 680px;
          }
          .big {
            gap: 10px;
            margin-bottom: 10px;
          }
          .metric {
            padding: 12px;
          }
          .metric .k {
            font-size: 12px;
          }
          .metric .v {
            font-size: 24px;
          }
          .metric .d {
            font-size: 11px;
          }
          .bars {
            padding: 12px;
          }
          .bar {
            margin: 8px 0;
          }
          .bar .name {
            width: 100px;
            font-size: 12px;
          }
          .bar .track {
            height: 20px;
          }
          .bar-pct {
            min-width: 34px;
            font-size: 11px;
          }
          .pill {
            font-size: 12px;
          }
          .note {
            font-size: 11px;
          }
        }

        /* ===== 首屏 Loading ===== */
        .loading-wrap{
          position:fixed;inset:0;display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          background:#fff;z-index:9999;
        }
        .loading-hotpot{
          position:relative;width:80px;height:64px;margin-bottom:24px;
        }
        /* 锅身 */
        .loading-pot{
          position:absolute;left:50%;bottom:0;transform:translateX(-50%);
          width:64px;height:36px;
          background:linear-gradient(180deg,#e0322d 0%,#b9231e 100%);
          border-radius:0 0 32px 32px;
          box-shadow:inset 0 -4px 0 rgba(0,0,0,.12);
        }
        /* 锅沿 */
        .loading-pot::before{
          content:"";position:absolute;top:-4px;left:-4px;right:-4px;height:10px;
          background:#c72823;border-radius:6px;
          box-shadow:0 2px 4px rgba(0,0,0,.15);
        }
        /* 锅把手 */
        .loading-pot::after{
          content:"";position:absolute;top:-2px;left:-12px;right:-12px;height:4px;
          background:#8c1c18;border-radius:2px;
        }
        /* 蒸汽 */
        .loading-steam{
          position:absolute;bottom:38px;left:50%;transform:translateX(-50%);
          display:flex;gap:6px;
        }
        .loading-steam span{
          display:block;width:6px;height:16px;border-radius:3px;
          background:rgba(224,50,45,.25);
          animation:steam 1.4s ease-in-out infinite;
        }
        .loading-steam span:nth-child(1){ animation-delay: 0s; }
        .loading-steam span:nth-child(2){ animation-delay: .25s; }
        .loading-steam span:nth-child(3){ animation-delay: .5s; }
        .loading-steam span:nth-child(4){ animation-delay: .75s; }
        .loading-steam span:nth-child(5){ animation-delay: 1s; }
        @keyframes steam{
          0%   { transform: translateY(0) scaleY(.6); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(-22px) scaleY(1); opacity: 0; }
        }
        .loading-brand{
          font-size:18px;font-weight:700;color:#1f2329;letter-spacing:2px;
          margin-bottom:6px;
        }
        .loading-dots{
          font-size:13px;color:#9ca3af;letter-spacing:1px;
        }
        .loading-dots::after{
          content:"...";display:inline-block;width:20px;text-align:left;
          animation:dots 1.2s steps(4,end) infinite;overflow:hidden;vertical-align:bottom;
        }
        .loading-hotpot{
          position:relative;width:80px;height:64px;margin-bottom:24px;
        }
        /* 锅身 */
        .loading-pot{
          position:absolute;left:50%;bottom:0;transform:translateX(-50%);
          width:64px;height:36px;
          background:linear-gradient(180deg,#e0322d 0%,#b9231e 100%);
          border-radius:0 0 32px 32px;
          box-shadow:inset 0 -4px 0 rgba(0,0,0,.12);
        }
        /* 锅沿 */
        .loading-pot::before{
          content:"";position:absolute;top:-4px;left:-4px;right:-4px;height:10px;
          background:#c72823;border-radius:6px;
          box-shadow:0 2px 4px rgba(0,0,0,.15);
        }
        /* 锅把手 */
        .loading-pot::after{
          content:"";position:absolute;top:-2px;left:-12px;right:-12px;height:4px;
          background:#8c1c18;border-radius:2px;
        }
        /* 蒸汽 */
        .loading-steam{
          position:absolute;bottom:38px;left:50%;transform:translateX(-50%);
          display:flex;gap:6px;
        }
        .loading-steam span{
          display:block;width:6px;height:16px;border-radius:3px;
          background:rgba(224,50,45,.25);
          animation:steam 1.4s ease-in-out infinite;
        }
        .loading-steam span:nth-child(1){ animation-delay: 0s; }
        .loading-steam span:nth-child(2){ animation-delay: .25s; }
        .loading-steam span:nth-child(3){ animation-delay: .5s; }
        .loading-steam span:nth-child(4){ animation-delay: .75s; }
        .loading-steam span:nth-child(5){ animation-delay: 1s; }
        @keyframes steam{
          0%   { transform: translateY(0) scaleY(.6); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(-22px) scaleY(1); opacity: 0; }
        }
        .loading-brand{
          font-size:18px;font-weight:700;color:#1f2329;letter-spacing:2px;
          margin-bottom:6px;
        }
        .loading-dots{
          font-size:13px;color:#9ca3af;letter-spacing:1px;
        }
        .loading-dots::after{
          content:"...";display:inline-block;width:20px;text-align:left;
          animation:dots 1.2s steps(4,end) infinite;overflow:hidden;vertical-align:bottom;
        }
        @keyframes dots{
          0%  { width: 0; }
          100%{ width: 24px; }
        }
      `}</style>
    </div>
  );
}
