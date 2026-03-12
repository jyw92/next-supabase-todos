//Shadcn UI
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {ChevronUp} from 'lucide-react';

//CSS
import styles from './basic-board.module.scss';

//Custom UI
import LabelCalendar from '../calendar/label-calendar';
import MarkdownDialog from '../dialog/MarkdownDialog';

function BasicBoard() {
  return (
    <div className={styles.inner__container}>
      <div className={styles.inner__container__header}>
        <div className={styles.inner__container__header__titleBox}>
          <Checkbox className="w-5 h-5" />
          <span className={styles.title}>Please enter a title for the</span>
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
        <MarkdownDialog />
      </div>
    </div>
  );
}

export default BasicBoard;
