import {createClient} from '@/utils/supabase/server';
import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('pagetable')
      .select('id, page_title, start_date, end_date')
      .order('created_at', {ascending: true});
    if (error) throw error;
    return NextResponse.json(
      {
        success: true, // 💡 추가
        message: '성공적으로 조회되었습니다.',
        data,
      },
      {status: 200},
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }
    return NextResponse.json({error: '서버 에러'}, {status: 500});
  }
}
