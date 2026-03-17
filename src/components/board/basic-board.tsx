'use client';

import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {ChevronUp} from 'lucide-react';
import styles from './basic-board.module.scss';
import LabelCalendar from '@/components/calendar/label-calendar';
import MarkdownDialog from '@/components/dialog/MarkdownDialog'; // 💡 경로 확인해주세요
import {TodoEntity} from '@/types';

interface Props {
  data: TodoEntity;
  onRefresh: () => void; // 💡 상태 갱신 함수 추가
}

function BasicBoard({data, onRefresh}: Props) {
  return (
    <div className={styles.inner__container}>
      <div className={styles.inner__container__header}>
        <div className={styles.inner__container__header__titleBox}>
          <Checkbox className="w-5 h-5" checked={data.checked ?? false} />

          <span className={data.title ? styles.title : `${styles.title} text-gray-400`}>
            {data.title || 'Please enter a title for the board'}
          </span>

          <Button variant={'ghost'}>
            <ChevronUp />
          </Button>
        </div>
        <div className={styles.inner__container__body}>
          <div className={styles.inner__container__body__calendarBox}>
            <LabelCalendar label={'From'} />
            <LabelCalendar label={'To'} />
          </div>
          <div className={styles.inner__container__body__buttonBox}>
            <Button variant={'ghost'} className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500">
              Duplicate
            </Button>
            <Button variant={'ghost'} className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500">
              Delete
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.inner__container__footer}>
        {/* ✅ 모달 컴포넌트에 데이터와 갱신 함수 전달 */}
        <MarkdownDialog data={data} onRefresh={onRefresh} />
      </div>
    </div>
  );
}

export default BasicBoard;
