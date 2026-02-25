import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'mainu — AI 메뉴 추천',
  description: '자연어로 원하는 메뉴를 말하면 AI가 추천해드립니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-stone-50">
        <Header />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
