import {createClient} from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params;
    const {page_title, start_date, end_date} = await request.json();
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('pagetable')
      .update({page_title, start_date, end_date})
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '수정 실패';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
