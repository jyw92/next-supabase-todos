import {createClient} from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

export async function PATCH(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}, // Next.js 15 권장 (Promise 타입)
) {
  try {
    const {id} = await params;
    const body = await request.json();
    const supabase = await createClient();

    const {data, error} = await supabase
      .from('todotable') // 사용하시는 테이블 이름에 맞게 수정하세요 (ex: pagetable)
      .update({
        title: body.title,
        content: body.content,
        start_date: body.start_date,
        end_date: body.end_date,
        isSave: body.isSave, // ✅ 저장/편집 상태 업데이트
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '실패';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
