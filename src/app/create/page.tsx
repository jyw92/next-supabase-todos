import LabelCalendar from '@/components/common/calendar/label-calendar';

// Shadcn UI
import {Progress} from '@/components/ui/progress';
import {Button} from '@/components/ui/button';

// CSS
import styles from './page.module.scss';
import {LayersPlus} from 'lucide-react';
import BasicBoard from '@/components/common/board/basic-board';

function CreatePage() {
  return (
    <div className={styles.inner__container}>
      <header className={styles.inner__container__header}>
        <div className={styles.inner__container__header__contents}>
          <input type="text" placeholder="Enter Title Here" className={styles.input} />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 complated</span>
            {/* 프로그래스 바 UI */}
            <Progress value={33} className="w-[30%] h-2" indicatorColor="bg-green-500" />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              {/* 캘린더 UI */}
              <LabelCalendar label="From" />
              <LabelCalendar label="To" />
            </div>
            <Button
              variant={'outline'}
              className="w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.inner__container__body}>
        {/* <div className={styles.inner__container__infoBox}>
          <span className={styles.title}>There is no board yet</span>
          <span className={styles.subTitle}>Click the button and start flashing!</span>
          <button className={styles.button}>
            <LayersPlus color="#ff890b" size={74} />
          </button>
        </div> */}
        <BasicBoard />
      </main>
    </div>
  );
}

export default CreatePage;
