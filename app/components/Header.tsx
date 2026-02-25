'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, removeToken } from '../lib/auth';

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-500 tracking-tight">
          mainu
        </Link>
        <nav className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link
                href="/recommend"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                추천
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
