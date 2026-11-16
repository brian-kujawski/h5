/** Plain-text copy of a song for the group chat, plus an h5:// link that opens it in the app. */
import type { Line, Song } from './types';

export const songLink = (song: Song) => `h5://song/${song.id}`;

const lineText = (line: Line) => {
  const text = line.segments.map((seg) => (seg.kind === 'note' ? `(${seg.text})` : seg.text)).join('');
  return line.part === 'leader' ? `Leader: ${text}` : line.part === 'all' ? `All: ${text}` : text;
};

export function shareText(song: Song): string {
  const blocks: string[] = [song.title.toUpperCase()];
  if (song.tune) blocks.push(`To the tune of ${song.tune}`);
  for (const section of song.sections) {
    const lines = section.lines.map(lineText);
    if (section.type === 'chorus') blocks.push(['Chorus:', ...lines].join('\n'));
    else if (section.type === 'note') blocks.push(lines.map((l) => `[${l}]`).join('\n'));
    else blocks.push(lines.join('\n'));
  }
  if (song.ends_with_down_down) blocks.push('…drink it down, down, down!');
  blocks.push(`On on! Open in H5: ${songLink(song)}`);
  return blocks.join('\n\n');
}
