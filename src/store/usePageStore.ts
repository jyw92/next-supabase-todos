// store/usePageStore.ts
import {PageEntity} from '@/types';
import {create} from 'zustand';

export interface Page {
  id: number;
  page_title: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
}

interface PageState {
  storePages: Page[];
  fetchSidebarPages: () => Promise<void>;
  // 💡 인자 타입을 Partial을 허용하는 형태로 변경
  updateStorePage: (params: Partial<Page> & {id: number}) => Promise<void>;
  addPage: () => Promise<PageEntity | undefined>;
}

export const usePageStore = create<PageState>((set, get) => ({
  storePages: [],
  updateStorePage: async ({id, ...rest}) => {
    // 로컬 스토어 업데이트
    set((state) => ({
      storePages: state.storePages.map((page) =>
        page.id === id
          ? {...page, ...rest} // 기존 데이터에 rest(수정된 값들)를 덮어씀
          : page,
      ),
    }));

    try {
      // 서버 전송 (PATCH)
      await fetch(`/api/page/patch/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(rest),
      });
    } catch (error) {
      console.error('DB 업데이트 실패:', error);
    }
  },
  fetchSidebarPages: async () => {
    // 💡 get()을 통해 현재 스토어의 상태를 확인합니다.
    const {storePages} = get();

    // 이미 데이터가 있다면 아무것도 하지 않고 함수 종료 (캐싱 효과)
    if (storePages.length > 0) return;

    try {
      const response = await fetch('/api/page/search');
      const result = await response.json();

      if (result.success) {
        set({storePages: result.data});
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  },

  addPage: async () => {
    // 1. 서버에 먼저 저장 (ID를 받아와야 하니까요!)
    try {
      const response = await fetch('/api/page/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          page_title: '새로운 프로젝트',
          start_date: null,
          end_date: null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 2. 서버 응답이 성공하면 로컬 스토어에 추가
        set((state) => ({
          // 💡 (state) => ({ ... }) 구조를 확인하세요!
          storePages: [...state.storePages, result.data],
        }));

        return result.data as PageEntity; // 생성된 페이지 정보를 반환 (이동할 때 쓰려고)
      }
    } catch (error) {
      console.error('페이지 생성 실패:', error);
    }
  },
}));
