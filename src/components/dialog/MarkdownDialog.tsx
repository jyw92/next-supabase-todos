'use client';

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
import MDEditor from '@uiw/react-md-editor';
import styles from './MarkdownDialog.module.scss';
import LabelCalendar from '@/components/calendar/label-calendar';
import {useEffect, useState} from 'react';
import {TodoEntity} from '@/types'; // 💡 타입 임포트 경로 확인

interface Props {
  data: TodoEntity;
  onRefresh: () => void;
}

export default function MarkdownDialog({data, onRefresh}: Props) {
  const [open, setOpen] = useState(false);

  // ✅ 부모로부터 받은 데이터를 기본값으로 세팅
  const [title, setTitle] = useState(data.title || '');
  const [content, setContent] = useState(data.content || '');
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = ''; // 또는 'auto'
      }, 150); // 모달이 닫히는 애니메이션 시간(약 0.15초) 이후에 실행
    }
  }, [open]);
  const onSubmit = async () => {
    try {
      // ✅ 1. Todo 업데이트 API 호출 (PATCH /api/todo/[todo_id] 형태의 API가 필요합니다)
      const response = await fetch(`/api/todo/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다.');
      }

      // ✅ 2. 저장 성공 후 모달 닫기 & 목록 새로고침
      setOpen(false);
      onRefresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          {data.content ? 'Edit Content' : 'Add Content'}
        </span>
      </DialogTrigger>

      {/* max-w-[800px] 등은 화면에 맞게 조절하세요 */}
      <DialogContent className="sm:max-w-fit">
        <DialogHeader className="w-full">
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" checked={data.checked ?? false} />
              <input
                type="text"
                placeholder="Write a title for your board."
                className={styles.dialog__titleBox__title}
                value={title}
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
            <MDEditor height={400} value={content} onChange={(val) => setContent(val || '')} />
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
              type="button"
              onClick={onSubmit}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-50 hover:text-orange-400"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
