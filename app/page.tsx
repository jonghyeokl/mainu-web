'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isLoggedIn } from './lib/auth';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace('/recommend');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 text-center">
      <div className="max-w-lg w-full space-y-8">
        <div className="space-y-3">
          <div className="text-5xl font-bold text-orange-500 tracking-tight">mainu</div>
          <p className="text-lg text-stone-500 leading-relaxed">
            자연어로 말하면 AI가<br />딱 맞는 메뉴를 추천해드립니다.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl px-6 py-5 text-left space-y-2 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">예시</p>
          {[
            '기름지고 헤비한 중식 먹고 싶어',
            '매운 거 싫고 깔끔한 거 먹고 싶어',
            '친구들이랑 분위기 좋은 데서 먹을 거',
          ].map((ex) => (
            <p key={ex} className="text-sm text-stone-600">
              &ldquo;{ex}&rdquo;
            </p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-center"
          >
            시작하기
          </Link>
          <Link
            href="/login"
            className="flex-1 py-3 bg-white hover:bg-stone-50 text-stone-700 font-semibold rounded-xl border border-stone-200 transition-colors text-center"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
