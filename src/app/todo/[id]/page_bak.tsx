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
import {Skeleton} from '@/components/ui/skeleton';

function CreatePage_bak() {
  const pathname = usePathname();
  const pageId = Number(pathname.split('/')[2]);
  console.log('pageId', pageId);
  const storePages = usePageStore((state) => state.storePages);
  const fetchSidebarPages = usePageStore((state) => state.fetchSidebarPages);
  const updateStorePage = usePageStore((state) => state.updateStorePage);
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await fetch(`/api/todo/search/${pageId}`, {next: {tags: ['todos']}});
      const result = await response.json();
      if (result.success) {
        setTodos(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  // ✅ [해결] useEffect 내부에서 async 함수를 만들고 그 안에서 호출하도록 변경!
  useEffect(() => {
    const initFetch = async () => {
      await fetchTodos();
    };

    initFetch();
  }, [fetchTodos]);

  const handleCreateNewBoard = async () => {
    if (!pageId) return;
    try {
      const response = await fetch(`/api/todo/create/${pageId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          title: '새로운 할 일 보드',
          content: '',
          start_date: new Date().toISOString(), // 💡 오늘 날짜 추가
          end_date: new Date().toISOString(), // 💡 종료 날짜 추가
        }),
      });

      const result = await response.json();

      if (result.success) {
        // ✅ 상태만 업데이트해서 즉시 반영 (추가적인 fetch 호출 없음)
        setTodos((prev) => [...prev, result.data]);
      } else {
        alert(`생성 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('네트워크 에러:', error);
    }
  };

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

      <main className={`${styles.inner__container__body} ${todos.length > 0 || 'items-center'}`}>
        {isLoading ? (
          // ✅ 로딩 중일 때 스켈레톤 UI 렌더링
          <div className="flex flex-col gap-4 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[184px] p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                {/* 제목 부분 스켈레톤 */}
                <Skeleton className="h-6 w-1/3 rounded-md" />
                {/* 날짜/진행률 부분 스켈레톤 */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-2 flex-1 rounded-full" />
                </div>
                {/* 하단 태그/인원 부분 스켈레톤 */}
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : todos.length > 0 ? (
          // ✅ 데이터 로딩 완료 후 목록 렌더링
          todos.map((todo) => <BasicBoard key={todo.id} data={todo} />)
        ) : (
          // ✅ 데이터가 없을 때 (Empty State)
          <div className="p-10 text-center text-gray-400 w-full h-full flex flex-1 justify-center items-center">
            등록된 보드가 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}

export default CreatePage;
