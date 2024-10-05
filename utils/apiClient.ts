import axios from 'axios';
import { createClient } from './supabase/client';
// import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트
const supabase = createClient();
// Axios 클라이언트 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API의 기본 URL
});

// Request 인터셉터: 요청을 보내기 전에 실행
apiClient.interceptors.request.use(
  async (config) => {

    const { data: { session }, error } = await supabase.auth.getSession();
    console.log(session)
    if (error || !session) {
      throw new Error('Not authenticated or failed to get session');
    }

    // access token 만료 여부 확인
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      // 세션 갱신
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshedSession) {
        throw new Error('Failed to refresh session');
      }

      // 새로운 access token으로 업데이트
      config.headers.Authorization = `Bearer ${refreshedSession.access_token}`;
    } else {
      // 만료되지 않은 access token 사용
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 시 처리
    return Promise.reject(error);
  }
);

// Response 인터셉터: 응답을 받은 후 실행
apiClient.interceptors.response.use(
  (response) => {
    // 성공적으로 응답을 받은 경우
    return response;
  },
  async (error) => {
    // 에러가 발생한 경우
    if (error.response && error.response.status === 401) {
      // 만약 토큰이 만료된 경우라면 세션을 다시 갱신
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshedSession || refreshError) {
        return Promise.reject(error);
      }

      // 새로운 토큰으로 요청 헤더 업데이트
      error.config.headers.Authorization = `Bearer ${refreshedSession.access_token}`;

      // 요청을 한 번 더 시도합니다.
      return apiClient.request(error.config);
    }

    // error.response가 없을 경우 또는 다른 에러일 경우
    return Promise.reject(error);
  }
);

export default apiClient;
