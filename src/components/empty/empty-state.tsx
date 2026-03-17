'use client';

import {Button} from '@/components/ui/button';
import styles from './empty-state.module.scss';

function EmptyState() {
  return (
    <div className={styles.inner__container__onBoarding}>
      <span className={styles.inner__container__onBoarding__title}>How to Start:</span>
      <div className={styles.inner__container__onBoarding__steps}>
        <span>1. Create a page</span>
        <span>2. Add boards to page</span>
      </div>
      {/* 페이지 추가 버튼 */}
      <Button
        variant={'outline'}
        className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
      >
        Add New Page
      </Button>
    </div>
  );
}

export default EmptyState;
