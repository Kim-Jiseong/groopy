import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500, // 0.5초 동안 데이터를 신선하다고 간주
      gcTime: 10 * 60 * 1000, // 30분 동안 캐시에 유지
      // refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
      retry: 3, // 실패 시 3번 재시도
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 재시도 간 지연시간
    },
    mutations: {
      retry: 3, // 실패 시 3번 재시도
      // onError: (error) => {
      //   console.error("뮤테이션 에러:", error);
      // },
      // onSuccess: (data) => {
      //   console.log("뮤테이션 성공:", data);
      // },
    },
  },
});
