// app/api/todo/create/[pageId]/route.ts
import {TodoEntity} from '@/types';
import {createClient} from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}, // params는 Promise 타입입니다.
) {
  try {
    const {id} = await params; // 💡 여기서 경로의 [pageId]를 추출합니다.
    const body: Partial<TodoEntity> = await request.json(); // title, content 등은 body에서 받음

    const supabase = await createClient();
    const {data, error} = await supabase
      .from('todotable')
      .insert([
        {
          todo_id: id, // 부모 페이지 ID (숫자 타입인 경우 변환)
          title: body.title || 'New Board',
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          content: body.content || '',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    console.error('🚨 API 서버 에러:', error);
    const message = error instanceof Error ? error.message : '조회 실패';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
