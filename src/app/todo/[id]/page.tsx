'use client';

import {Progress} from '@/components/ui/progress';
import {Button} from '@/components/ui/button';
import styles from './page.module.scss';
import LabelCalendar from '@/components/calendar/label-calendar';
import {usePathname} from 'next/navigation';
import {usePageStore} from '@/store/usePageStore';
import {debounce} from 'lodash';
import {PageEntity, TodoEntity} from '@/types'; // 💡 TodoEntity 추가
import {useCallback, useEffect, useMemo, useState} from 'react';
import BasicBoard from '@/components/board/basic-board';

function CreatePage() {
  const pathname = usePathname();
  const pageId = Number(pathname.split('/')[2]);

  const storePages = usePageStore((state) => state.storePages);
  const fetchSidebarPages = usePageStore((state) => state.fetchSidebarPages);
  const updateStorePage = usePageStore((state) => state.updateStorePage);

  const currentPage = storePages.find((p) => p.id === pageId);

  const [localTitle, setLocalTitle] = useState(currentPage?.page_title ?? '');
  const [lastSyncedTitle, setLastSyncedTitle] = useState(currentPage?.page_title);

  if (currentPage?.page_title !== lastSyncedTitle) {
    setLastSyncedTitle(currentPage?.page_title);
    setLocalTitle(currentPage?.page_title ?? '');
  }

  const debouncedDateUpdate = useMemo(
    () => debounce((data: Partial<PageEntity> & {id: number}) => updateStorePage(data), 100),
    [updateStorePage],
  );
  const debouncedTitleUpdate = useMemo(
    () => debounce((data: Partial<PageEntity> & {id: number}) => updateStorePage(data), 500),
    [updateStorePage],
  );

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setLocalTitle(nextValue);
    debouncedTitleUpdate({id: pageId, page_title: nextValue});
  };

  const handleUpdate = (fields: Partial<PageEntity>) => {
    debouncedDateUpdate({id: pageId, ...fields});
  };

  const parseDate = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
  };

  useEffect(() => {
    if (storePages.length === 0) fetchSidebarPages();
  }, [storePages.length, fetchSidebarPages]);

  useEffect(() => {
    return () => {
      debouncedDateUpdate.cancel();
      debouncedTitleUpdate.cancel();
    };
  }, [debouncedDateUpdate, debouncedTitleUpdate]);

  // ✅ [수정] 배열 형태로 Todo 목록 상태 관리
  const [todos, setTodos] = useState<TodoEntity[]>([]);

  const fetchTodos = useCallback(async () => {
    if (!pageId) return;
    try {
      const response = await fetch(`/api/todo/search/${pageId}`);
      const result = await response.json();
      if (result.success) {
        setTodos(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [pageId]);

  // ✅ [해결] useEffect 내부에서 async 함수를 만들고 그 안에서 호출하도록 변경!
  useEffect(() => {
    const initFetch = async () => {
      await fetchTodos();
    };

    initFetch();
  }, [fetchTodos]);

  // ✅ [추가] Add New Board 버튼 클릭 시 새 보드 생성
  const handleCreateNewBoard = async () => {};

  return (
    <div className={styles.inner__container}>
      <header className={styles.inner__container__header}>
        <div className={styles.inner__container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
            value={localTitle}
            onChange={onTitleChange}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            <Progress value={33} className="w-[30%] h-2" indicatorColor="bg-green-500" />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              <LabelCalendar
                label="From"
                selectedDate={parseDate(currentPage?.start_date)}
                onDateChange={(date) => handleUpdate({start_date: date ? date.toISOString() : null})}
              />
              <LabelCalendar
                label="To"
                selectedDate={parseDate(currentPage?.end_date)}
                onDateChange={(date) => handleUpdate({end_date: date ? date.toISOString() : null})}
              />
            </div>
            {/* ✅ 클릭 이벤트 연결 */}
            <Button
              onClick={handleCreateNewBoard}
              variant={'outline'}
              className="w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.inner__container__body}>
        {/* ✅ 가져온 데이터를 바탕으로 BasicBoard 리스트 렌더링 */}
        {todos.map((todo) => (
          <BasicBoard key={todo.id} data={todo} onRefresh={fetchTodos} />
        ))}
      </main>
    </div>
  );
}

export default CreatePage;
