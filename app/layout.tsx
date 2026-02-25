// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Project mainu',
  description: 'AI 메뉴 추천 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #eee',
          }}
        >
          <Link href='/' style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            mainu
          </Link>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>테스트 계정</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
