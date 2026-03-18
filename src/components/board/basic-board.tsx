'use client';

import {useState, useActionState, useEffect} from 'react'; // 💡 useEffect 추가
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {ChevronUp} from 'lucide-react';
import styles from './basic-board.module.scss';
import LabelCalendar from '@/components/calendar/label-calendar';
import MarkdownDialog from '@/components/dialog/MarkdownDialog';
import {TodoEntity} from '@/types';
import {updateTodoAction} from '@/app/actions/actions';
import {format} from 'date-fns';
import dynamic from 'next/dynamic';
const MDViewer = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown), {
  ssr: false,
  loading: () => <div className="h-[100px] bg-gray-50 animate-pulse rounded-md" />,
});
interface Props {
  data: TodoEntity;
}

function BasicBoard({data}: Props) {
  const [state, formAction, isPending] = useActionState(updateTodoAction, null);

  const [localTitle, setLocalTitle] = useState(data.title || '');
  const [localContent, setLocalContent] = useState(data.content || '');
  const [startDate, setStartDate] = useState<Date | undefined>(data.start_date ? new Date(data.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(data.end_date ? new Date(data.end_date) : undefined);

  // 💡 [추가] 저장이 완료되었을 때 알림을 띄우거나 후처리를 하고 싶을 때
  useEffect(() => {
    if (state?.success) {
      // 성공 피드백 (toast 라이브러리가 있다면 toast.success('저장됨') 으로 교체)
      alert('성공적으로 저장되었습니다!');

      // revalidatePath 덕분에 화면은 이미 새 데이터로 갱신될 준비가 되어 있습니다.
    } else if (state?.error) {
      alert(`저장 실패: ${state.error}`);
    }
  }, [state]);

  return (
    <form action={formAction} className={`${styles.inner__container} rounded-2xl`}>
      {/* 🤫 서버로 몰래 보낼 찐 데이터들 */}
      <input type="hidden" name="id" value={data.id} />
      <input type="hidden" name="isSave" value="true" />
      <input type="hidden" name="title" value={localTitle} />
      <input type="hidden" name="content" value={localContent} />
      <input type="hidden" name="start_date" value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} />
      <input type="hidden" name="end_date" value={endDate ? format(endDate, 'yyyy-MM-dd') : ''} />

      <div className={styles.inner__container__header}>
        <div className={styles.inner__container__header__titleBox}>
          <Checkbox className="w-5 h-5" checked={data.checked ?? false} />

          {/* 💡 input 태그로 제목 직접 수정 가능하게 유지 */}
          <span className={localTitle ? styles.title : `${styles.title} text-gray-400`}>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="bg-transparent outline-none w-full" // 스타일 추가 권장
            />
          </span>

          <Button type="button" variant="ghost">
            <ChevronUp />
          </Button>
        </div>
        <div className={styles.inner__container__body}>
          <div className={styles.inner__container__body__calendarBox}>
            <LabelCalendar label="From" selectedDate={startDate} onDateChange={setStartDate} />
            <LabelCalendar label="To" selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <div className={styles.inner__container__body__buttonBox}>
            <Button
              type="submit"
              disabled={isPending}
              variant="ghost"
              className="font-bold text-blue-500 hover:bg-blue-50 hover:text-blue-700"
            >
              {isPending ? '저장중...' : '저장'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="font-bold text-gray-400 hover:bg-red-50 hover:text-red-700"
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
      <div className={`${styles.inner__container__footer} flex flex-col items-start w-full gap-2`}>
        {/* 💡 2. 내용이 있으면 마크다운 뷰어로 예쁘게 보여줍니다. */}
        {localContent && (
          <div className="text-left p-4 bg-[#eeeeee] w-full rounded-xl overflow-hidden" data-color-mode="light">
            {/* 🚨 기존의 <MDEditor.Markdown ... /> 대신 이걸 쓰세요! */}
            <MDViewer source={localContent} style={{backgroundColor: 'transparent', color: 'inherit'}} />
          </div>
        )}

        <div className="w-full flex justify-center">
          <MarkdownDialog
            data={{content: localContent}}
            onConfirm={(newContent) => {
              setLocalContent(newContent);
            }}
          />
        </div>
      </div>
    </form>
  );
}

export default BasicBoard;
