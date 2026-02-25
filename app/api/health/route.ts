export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/health`, { cache: 'no-store' });
  const data = await res.json();

  return Response.json(data, { status: res.status });
}
