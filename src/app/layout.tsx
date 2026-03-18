import type {Metadata} from 'next';
import {Roboto} from 'next/font/google'; // Roboto 임포트
import '@/styles/globals.css';
import styles from './page.module.scss';
import {Toaster} from '@/components/ui/sonner';
import SideNavigation from '@/components/navigation/SideNavigation';

// Roboto 설정: 사용할 두께와 subsets를 정의합니다.
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto', // CSS 변수로 사용할 이름
});

export const metadata: Metadata = {
  title: 'shadecn UI - TodoBoard',
  description: 'Roboto font applied TodoBoard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* body에 roboto.className을 추가하여 기본 폰트로 적용합니다 */}
      <body className={`${roboto.className} antialiased overflow-hidden`}>
        <SideNavigation />
        <div className={styles.container}>{children}</div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
