'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { login, signUp } from '../lib/api';
import { isLoggedIn, setToken } from '../lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace('/recommend');
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp({ ...form, name: form.name.trim(), email: form.email.trim() });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      setLoading(false);
      return;
    }

    try {
      const token = await login(form.email.trim(), form.password);
      setToken(token);
      router.push('/recommend');
    } catch {
      // 회원가입은 성공했으나 자동 로그인 실패 → 로그인 페이지로
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">회원가입</h1>
          <p className="text-sm text-stone-500">AI 메뉴 추천을 시작해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              name="name"
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <input
              name="email"
              type="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <input
              name="phone_number"
              type="tel"
              placeholder="전화번호"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? '처리 중…' : '시작하기'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
