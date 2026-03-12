import {NextResponse} from 'next/server';
// 만들어두신 서버용 클라이언트를 불러옵니다.
import {createClient} from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {title, content} = body;

    // 데이터 검증
    if (!title || !content) {
      return NextResponse.json({error: '제목이나 내용이 누락되었습니다.'}, {status: 400});
    }

    // 서버용 Supabase 인스턴스 생성
    const supabase = await createClient();

    // 데이터베이스에 Insert
    const {data, error} = await supabase.from('todos').insert([{title, content}]);

    if (error) {
      throw error; // 아래 catch문으로 에러를 넘김
    }

    return NextResponse.json({message: '성공적으로 생성되었습니다.', data}, {status: 201});
  } catch (error: unknown) {
    // error가 Error 객체인지 확인 (타입 가드)
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    // Error 객체가 아닐 경우의 기본 에러 처리
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
