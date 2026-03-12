'use client';

//Shadcn UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Separator} from '@/components/ui/separator';

// Editor
import MDEditor from '@uiw/react-md-editor';

//CSS
import styles from './MarkdownDialog.module.scss';

//Custom UI
import LabelCalendar from '../calendar/label-calendar';
import {useState} from 'react';
import {toast} from 'sonner';

export default function MarkdownDialog() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('**Hello, World!!**');
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async () => {
    // 1. 클라이언트 측 검증
    if (!title || !content) {
      toast.error('기입되지 않은 데이터(값)가 있습니다.', {
        description: '제목, 날짜, 혹은 콘텐츠 값을 모두 작성해주세요.',
      });
      return;
    }

    try {
      // 2. REST API 호출 (fetch 사용)
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 서버로 보낼 데이터를 JSON 문자열로 변환합니다.
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      // 3. 서버의 응답 데이터를 파싱
      const data = await response.json();

      // 4. 상태 코드에 따른 에러 처리 (response.ok는 상태 코드가 200~299일 때 true)
      if (!response.ok) {
        throw new Error(data.error || '알 수 없는 에러가 발생했습니다.');
      }

      // 5. 성공 시 UI 처리
      toast.success('성공적으로 저장되었습니다!');
      setTitle('');
      setContent('**Hello, World!!**');
      setOpen(false);
    } catch (error: unknown) {
      // 네트워크 에러나 서버에서 던진 에러 캐치
      // 2. 블록 내부에서 error가 Error 객체인지 확인합니다.
      if (error instanceof Error) {
        toast.error('저장에 실패했습니다.', {
          description: error.message,
        });
      } else {
        // Error 객체가 아닌 알 수 없는 에러일 경우의 예외 처리
        toast.error('저장에 실패했습니다.', {
          description: '알 수 없는 에러가 발생했습니다.',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Content</span>
      </DialogTrigger>
      <DialogContent className="max-w-fit!">
        <DialogHeader className="w-[45vw]">
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write a title for your board."
                className={styles.dialog__titleBox__title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          <div className={styles.dialog__markdown} data-color-mode="light">
            <MDEditor height="100%" value={content} onChange={(val) => setContent(val || '')} />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button variant={'ghost'} className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={onSubmit}
              className="font-noraml  border-orange-500 bg-orange-400 text-white hover:bg-orange-50 hover:text-orange-400"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
