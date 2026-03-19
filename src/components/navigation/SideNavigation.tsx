'use client';

// Shadcn UI
import {Button} from '@/components/ui/button';
import {Dot, Search} from 'lucide-react';

// CSS
import styles from './SideNavigation.module.scss';
import {Input} from '@/components/ui/input';
import {usePageStore} from '@/store/usePageStore';
import {useEffect, useTransition} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

function SideNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const storePages = usePageStore((state) => state.storePages);
  const fetchSidebarPages = usePageStore((state) => state.fetchSidebarPages);
  const addPage = usePageStore((state) => state.addPage);
  useEffect(() => {
    // 💡 데이터가 이미 1개라도 있다면 굳이 또 서버에 가지 않음 (인메모리 캐싱)
    if (storePages.length === 0) {
      fetchSidebarPages();
    }
  }, [storePages.length, fetchSidebarPages]);

  const handleCreate = async () => {
    const newPage = await addPage();
    // newPage가 PageEntity 타입임을 인식하므로 .id를 쓸 수 있습니다.
    if (newPage && newPage.id) {
      startTransition(() => {
        router.push(`/todo/${newPage.id}`);
      });
    }
  };

  return (
    <div className={styles.container}>
      {isPending && <div className="loading-overlay">이동 중...</div>}
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input type="search" placeholder="검색어를 입력해주세요." className="focus-visible:ring-0" />
        <Button variant={'outline'} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={'outline'}
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
          onClick={handleCreate}
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To do</span>
        {/* Is Supabase Todos */}
        <div className={styles.container__todos__list}>
          {storePages &&
            storePages.map((item) => {
              return (
                <Link
                  href={`/todo/${item.id}`}
                  className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                  key={item.id}
                >
                  <Dot className="mr-1 text-green-400" />
                  <span className="text-sm">{item.page_title === '' ? '제목없음' : item.page_title}</span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
