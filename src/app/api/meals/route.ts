import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('hotpot_meals')
      .select('meal_id, name, data')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      {
        success: true,
        data: (data || []).map((row: any) => row.data),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || '获取失败' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meals } = body;

    if (!Array.isArray(meals) || meals.length === 0) {
      return NextResponse.json(
        { success: false, error: '套餐数据不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 先查现有记录
    const { data: existing, error: qErr } = await client
      .from('hotpot_meals')
      .select('meal_id');

    if (qErr) throw new Error(qErr.message);

    const existingIds = new Set((existing || []).map((r: any) => r.meal_id));

    // 批量 upsert
    for (const m of meals) {
      if (existingIds.has(m.id)) {
        const { error } = await client
          .from('hotpot_meals')
          .update({ name: m.name, data: m, updated_at: new Date().toISOString() })
          .eq('meal_id', m.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await client
          .from('hotpot_meals')
          .insert({ meal_id: m.id, name: m.name, data: m });
        if (error) throw new Error(error.message);
      }
    }

    return NextResponse.json(
      { success: true, count: meals.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || '保存失败' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}
