'use server';

import {revalidatePath} from 'next/cache';

// 💡 1. 이 액션이 반환할 상태(State) 타입을 명확히 정의합니다.
export type UpdateTodoState = {
  success: boolean;
  message?: string;
  error?: string;
} | null;

// 💡 2. 함수 이름에서 'use'를 빼고, prevState 타입을 위에서 만든 타입으로 맞춥니다.
export async function updateTodoAction(
  _: unknown, // 안 쓰는 변수명은 _(언더바)를 붙이는 게 관례입니다.
  formData: FormData,
): Promise<UpdateTodoState> {
  // 1. Form에서 넘어온 데이터 추출
  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString() || '';
  const content = formData.get('content')?.toString() || '';
  const start_date = formData.get('start_date')?.toString() || null;
  const end_date = formData.get('end_date')?.toString() || null;

  // 💡 핵심: 넘어온 문자열 'true'를 실제 boolean 값으로 변환
  const isSave = formData.get('isSave') === 'true';

  if (!id) return {success: false, error: 'ID가 누락되었습니다.'};

  try {
    // 2. 작성해둔 PATCH API 호출 (절대경로 필수)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todo/update/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title,
        content,
        start_date,
        end_date,
        isSave,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // 3. ⭐️ DB 업데이트 성공 시 화면 최신화! (다이나믹 라우트 패턴 적용)
      revalidatePath('/todo/[id]', 'page');
      return {success: true, message: '저장 완료'};
    }

    return {success: false, error: result.error};
  } catch (error) {
    console.error('Server Action Error:', error);
    return {success: false, error: '서버 통신 실패'};
  }
}
