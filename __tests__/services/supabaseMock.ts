/**
 * Minimal chainable fake of the Supabase JS client for service tests.
 * Records every call so tests can assert table names, columns and filters.
 */

export interface RecordedCall {
  method: string;
  args: unknown[];
}

export interface FakeResult {
  data?: unknown;
  error?: { message: string; code?: string } | null;
}

export function createSupabaseMock() {
  const calls: RecordedCall[] = [];
  const results: FakeResult[] = [];
  let throwNext: Error | null = null;

  const nextResult = (): Promise<FakeResult> => {
    if (throwNext) {
      const err = throwNext;
      throwNext = null;
      return Promise.reject(err);
    }
    const r = results.shift() ?? { data: null, error: null };
    return Promise.resolve({ data: r.data ?? null, error: r.error ?? null });
  };

  const builder: Record<string, unknown> = {};
  for (const method of ['select', 'insert', 'upsert', 'update', 'delete', 'eq', 'in', 'single']) {
    builder[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return builder;
    };
  }
  builder.then = (resolve: (v: FakeResult) => unknown, reject: (e: unknown) => unknown) =>
    nextResult().then(resolve, reject);

  const client = {
    from: (table: string) => {
      calls.push({ method: 'from', args: [table] });
      return builder;
    },
    rpc: (fn: string, params: unknown) => {
      calls.push({ method: 'rpc', args: [fn, params] });
      return nextResult();
    },
  };

  return {
    client,
    calls,
    /** Queue the result of the next awaited query. */
    respond(result: FakeResult) {
      results.push(result);
    },
    /** Make the next awaited query reject (network failure). */
    fail(err = new Error('network down')) {
      throwNext = err;
    },
    reset() {
      calls.length = 0;
      results.length = 0;
      throwNext = null;
    },
    callsTo(method: string) {
      return calls.filter((c) => c.method === method);
    },
  };
}
