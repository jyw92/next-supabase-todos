// 경로: src/app/api/todo/search/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {createClient} from '@/utils/supabase/server';

// 💡 params 타입이 { id: string } 으로 변경되었습니다. (폴더명과 동일)
export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    // 💡 URL에서 id 값을 꺼냅니다. (예: /api/todo/search/4 -> id는 '4')
    const {id} = await params;

    console.log('요청받은 id:', id);

    const supabase = await createClient();

    // 💡 DB 조회 (todo_id 컬럼에 id 값을 넣어서 검색)
    // 만약 Supabase 컬럼명이 todo_id가 아니라면 알맞게 수정해주세요.
    const {data, error} = await supabase.from('todotable').select('*').eq('todo_id', id); // DB의 todo_id 값과 URL의 id 값이 같은 것을 찾음

    if (error) {
      console.error('🚨 Supabase DB 에러:', error);
      throw error;
    }

    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    console.error('🚨 API 서버 에러:', error);
    const message = error instanceof Error ? error.message : '조회 실패';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
