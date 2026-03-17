import {TodoEntity} from '@/types';
import {createClient} from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest, {params}: {params: Promise<{pageId: string}>}) {
  try {
    const {pageId} = await params;
    const body: Omit<TodoEntity, 'id' | 'created_at'> = await request.json();
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('todotable')
      .insert([
        {
          todo_id: pageId || '',
          title: body.title || '',
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          content: body.content,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '생성 실패';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
