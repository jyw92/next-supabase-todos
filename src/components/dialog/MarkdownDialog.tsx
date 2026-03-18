'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle, // 💡 다시 가져옵니다!
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import MDEditor from '@uiw/react-md-editor';
import styles from './MarkdownDialog.module.scss';
import {useEffect, useState} from 'react';
import {TodoEntity} from '@/types';

interface Props {
  data: TodoEntity;
  onConfirm: (newContent: string) => void;
}

export default function MarkdownDialog({data, onConfirm}: Props) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(data.content || '');

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
      }, 150);
    }
  }, [open]);

  const handleDone = () => {
    onConfirm(content);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          {content ? 'Edit Content' : 'Add Content'}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader className="w-full">
          {/* 💡 에러 해결: 화면엔 안 보이지만 에러는 막아주는 투명 타이틀! */}
          <DialogTitle className="sr-only">내용 편집기</DialogTitle>

          <div className={styles.dialog__markdown} data-color-mode="light">
            <MDEditor height={400} value={content} onChange={(val) => setContent(val || '')} />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleDone}
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
