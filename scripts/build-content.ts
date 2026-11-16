/// <reference types="node" />
/**
 * Validate every song in content/songs and compile the songbook the app bundles.
 *
 *   npm run content          validate and write src/content/generated/songbook.json
 *   npm run content:check    validate and fail if the committed JSON is stale (used in CI)
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse as parseYaml } from 'yaml';

import { buildSong, splitFrontMatter, validateMeta, validateMoments } from '../src/content/parse';
import type { Song, Songbook } from '../src/content/types';

const root = join(__dirname, '..');
const songsDir = join(root, 'content', 'songs');
const momentsFile = join(root, 'content', 'moments.yml');
const outFile = join(root, 'src', 'content', 'generated', 'songbook.json');

export function compile(): { songbook: Songbook; errors: string[] } {
  const errors: string[] = [];

  const { moments, errors: momentErrors } = validateMoments(parseYaml(readFileSync(momentsFile, 'utf8')));
  errors.push(...momentErrors.map((e) => `content/moments.yml: ${e}`));
  const momentIds = new Set(moments.map((m) => m.id));

  const songs: Song[] = [];
  const files = readdirSync(songsDir).filter((f) => f.endsWith('.md')).sort();
  for (const file of files) {
    const where = `content/songs/${file}`;
    try {
      const { yaml, body } = splitFrontMatter(readFileSync(join(songsDir, file), 'utf8'));
      const meta = parseYaml(yaml) as Record<string, unknown>;
      const problems = validateMeta(meta, basename(file, '.md'), momentIds);
      if (problems.length) {
        errors.push(...problems.map((p) => `${where}: ${p}`));
        continue;
      }
      songs.push(buildSong(meta, body));
    } catch (e) {
      errors.push(`${where}: ${(e as Error).message}`);
    }
  }

  songs.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
  return { songbook: { schema: 1, moments, songs }, errors };
}

function main() {
  const check = process.argv.includes('--check');
  const { songbook, errors } = compile();
  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s) in the songbook:\n`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }

  const json = `${JSON.stringify(songbook, null, 2)}\n`;
  const unused = songbook.moments.filter((m) => {
    const ids = [m.id, ...(m.includes ?? [])];
    return !songbook.songs.some((s) => s.moments.some((id) => ids.includes(id)));
  });
  const summary = `${songbook.songs.length} songs, ${songbook.moments.length} moments`;

  if (check) {
    const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
    if (current !== json) {
      console.error('✗ src/content/generated/songbook.json is out of date. Run `npm run content` and commit it.');
      process.exit(1);
    }
    console.log(`✓ Songbook is valid and up to date (${summary}).`);
    return;
  }

  writeFileSync(outFile, json);
  console.log(`✓ Wrote ${summary} to src/content/generated/songbook.json`);
  if (unused.length) console.log(`  Moments with no songs yet: ${unused.map((m) => m.id).join(', ')}`);
}

if (require.main === module) main();
