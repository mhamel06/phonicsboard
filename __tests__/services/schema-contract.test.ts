/**
 * Contract test: the tables, columns and functions the app code uses must
 * exist in scripts/supabase-migration.sql. Catches the code/schema drift that
 * previously left cloud sync silently failing.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/utils/supabase', () => ({ supabase: {} }));

const { SYNC_TABLES, SYNC_COLUMNS } = await import('../../src/services/cloudSync');

const sql = readFileSync(
  path.resolve(__dirname, '../../scripts/supabase-migration.sql'),
  'utf8',
);

/** Returns the column names declared in CREATE TABLE public.<table> (...). */
function columnsOf(table: string): string[] {
  const match = sql.match(
    new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table} \\(([\\s\\S]*?)\\n\\);`),
  );
  if (!match) return [];
  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[a-z_]+\s/.test(line) && !line.startsWith('PRIMARY'))
    .map((line) => line.split(/\s+/)[0]);
}

describe('schema contract', () => {
  for (const [kind, { table, idColumn }] of Object.entries(SYNC_TABLES)) {
    describe(`${kind} → ${table}`, () => {
      it('table exists with every column the sync service reads/writes', () => {
        expect(columnsOf(table)).toEqual(expect.arrayContaining([idColumn, ...SYNC_COLUMNS]));
      });

      it('has a primary key matching the upsert conflict target', () => {
        expect(sql).toMatch(
          new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table} \\([\\s\\S]*?PRIMARY KEY \\(user_id, ${idColumn}\\)`),
        );
      });

      it('has row level security restricted to the owner', () => {
        expect(sql).toContain(`ALTER TABLE public.${table}`);
        expect(sql).toMatch(
          new RegExp(`ON public\\.${table}\\s+FOR ALL TO authenticated\\s+USING \\(auth\\.uid\\(\\) = user_id\\) WITH CHECK \\(auth\\.uid\\(\\) = user_id\\)`),
        );
      });
    });
  }

  it('shared_resources has the columns the sharing service inserts', () => {
    expect(columnsOf('shared_resources')).toEqual(
      expect.arrayContaining(['share_code', 'resource_type', 'resource_id', 'resource_data', 'shared_by']),
    );
  });

  it('shared_resources is not publicly listable', () => {
    expect(sql).not.toMatch(/ON public\.shared_resources\s+FOR SELECT[^;]*USING \(true\)/);
    expect(sql).not.toMatch(/shared_resources[^;]*TO anon/);
  });

  it('exposes get_shared_resource(code) to signed-out visitors', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.get_shared_resource(code TEXT)');
    expect(sql).toContain('GRANT EXECUTE ON FUNCTION public.get_shared_resource(TEXT) TO anon, authenticated;');
  });
});
