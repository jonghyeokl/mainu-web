'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import FeatureBadge from '../components/FeatureBadge';
import MenuCard from '../components/MenuCard';
import { Menu, ParsedFeature, recommend, selectMenu } from '../lib/api';
import { getToken, getUserIdFromToken, isLoggedIn } from '../lib/auth';

type Step = 'input' | 'loading' | 'result' | 'confirmed';

export default function RecommendPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('input');
  const [text, setText] = useState('');
  const [parsedFeatures, setParsedFeatures] = useState<ParsedFeature[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) router.replace('/login');
  }, [router]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    if (step === 'input') textareaRef.current?.focus();
  }, [step]);

  async function handleRecommend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const token = getToken();
    if (!token) { router.replace('/login'); return; }
    const userId = getUserIdFromToken(token);
    if (!userId) { router.replace('/login'); return; }

    setError('');
    setStep('loading');

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await recommend(token, userId, text, controller.signal);

      if (res.recommended_menus.length === 0) {
        setError('추천할 메뉴를 찾지 못했습니다. 다른 표현으로 다시 시도해보세요.');
        setStep('input');
        return;
      }

      setParsedFeatures(res.parsed_features);
      setMenus(res.recommended_menus);
      setSelectedMenu(null);
      setStep('result');
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : '추천 중 오류가 발생했습니다.');
      setStep('input');
    }
  }

  async function handleSelect(menu: Menu) {
    setSelectedMenu(menu);
    setStep('confirmed');

    const token = getToken();
    if (!token) return;
    const userId = getUserIdFromToken(token);
    if (!userId) return;

    try {
      await selectMenu(token, {
        user_id: userId,
        text,
        menu_id: menu.menu_id,
        parsed_features: parsedFeatures,
      });
    } catch {
      // 선택 저장 실패는 UX에 영향 없이 무시
    }
  }

  function handleReset() {
    abortRef.current?.abort();
    setText('');
    setParsedFeatures([]);
    setMenus([]);
    setSelectedMenu(null);
    setStep('input');
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

      {/* 입력 영역 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-stone-900">
          어떤 메뉴가 먹고 싶으세요?
        </h1>
        <p className="text-sm text-stone-500">자유롭게 말해주세요. AI가 분석해서 추천해드립니다.</p>
      </div>

      <form onSubmit={handleRecommend} className="space-y-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (step !== 'loading' && step !== 'confirmed' && text.trim()) {
                handleRecommend(e as unknown as React.FormEvent);
              }
            }
          }}
          disabled={step === 'loading' || step === 'confirmed'}
          rows={3}
          placeholder="예) 기름지고 헤비한 중식 먹고 싶어"
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none disabled:bg-stone-50 disabled:text-stone-400"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!text.trim() || step === 'loading' || step === 'confirmed'}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {step === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> 분석 중…
              </span>
            ) : '추천 받기'}
          </button>
          {(step === 'result' || step === 'confirmed') && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 bg-white border border-stone-200 hover:border-stone-300 text-stone-600 font-medium rounded-xl transition-colors"
            >
              다시하기
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      {/* 분석된 특성 */}
      {parsedFeatures.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            분석된 특성
          </p>
          <div className="flex flex-wrap gap-2">
            {parsedFeatures.map((f) => (
              <FeatureBadge key={f.feature_id} feature={f} />
            ))}
          </div>
        </div>
      )}

      {/* 추천 메뉴 목록 */}
      {(step === 'result' || step === 'confirmed') && menus.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            추천 메뉴 {menus.length}개
          </p>
          <div className="space-y-2">
            {menus.map((menu) => (
              <MenuCard
                key={menu.menu_id}
                menu={menu}
                selected={selectedMenu?.menu_id === menu.menu_id}
                confirmed={step === 'confirmed'}
                onSelect={handleSelect}
              />
            ))}
          </div>
          {step === 'result' && (
            <p className="text-xs text-stone-400 text-center">메뉴를 클릭하면 선택됩니다.</p>
          )}
        </div>
      )}

      {/* 선택 완료 */}
      {step === 'confirmed' && selectedMenu && (
        <div className="flex items-center gap-3 px-5 py-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <span className="text-orange-500 text-lg">✓</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {selectedMenu.name}을(를) 선택했습니다!
            </p>
            <p className="text-xs text-stone-500 mt-0.5">선택이 저장되었습니다.</p>
          </div>
        </div>
      )}

    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
