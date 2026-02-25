export default async function ApiTestPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/health`, { cache: 'no-store' });
  const data = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1>API Test</h1>
      <pre>{JSON.stringify({ base, data }, null, 2)}</pre>
    </main>
  );
}
