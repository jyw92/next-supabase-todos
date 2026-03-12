import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    // 주의: 경로가 정확해야 합니다. @가 안 먹히면 상대경로로 적어주세요.
    prependData: `@use "@/styles/abstracts/mixins" as *;`,
  },
};

export default nextConfig;
