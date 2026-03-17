import {PageEntity} from '@/types';
import {createClient} from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

// Partial<T>: "전부 다 선택 사항으로 바꿔줄게 (필수 해제)"
// Omit<T, K>: "특정 필드만 빼고 나머지는 그대로 유지할게 (필드 제외)"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body: Omit<PageEntity, 'id' | 'created_at'> = await request.json();

    const {data, error} = await supabase
      .from('pagetable')
      .insert([
        {
          page_title: body.page_title || '',
          start_date: body.start_date || null,
          end_date: body.end_date || null,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }
    return NextResponse.json({error: '서버 에러'}, {status: 500});
  }
}
