const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? err.msg ?? 'API 오류가 발생했습니다.');
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// Auth
export async function signUp(body: {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}): Promise<void> {
  await request('/user/v1/', { method: 'POST', body: JSON.stringify(body) });
}

export async function login(email: string, password: string): Promise<string> {
  return request<string>('/user/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Recommend
export interface ParsedFeature {
  feature_id: string;
  value: string;
}

export interface Menu {
  menu_id: string;
  name: string;
}

export interface RecommendResponse {
  parsed_features: ParsedFeature[];
  recommended_menus: Menu[];
}

export async function recommend(
  token: string,
  user_id: string,
  text: string
): Promise<RecommendResponse> {
  return request<RecommendResponse>('/recommend/v1/', {
    method: 'POST',
    token,
    body: JSON.stringify({ user_id, text }),
  });
}

// Select
export interface ChoiceResponse {
  choice_id: string;
  user_id: string;
  text: string;
  parsed_features: ParsedFeature[];
  selected_menu_id: string;
  created_dt: string;
  updated_dt: string;
}

export async function selectMenu(
  token: string,
  body: {
    user_id: string;
    text: string;
    menu_id: string;
    parsed_features: ParsedFeature[];
  }
): Promise<ChoiceResponse> {
  return request<ChoiceResponse>('/select/v1/', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}
