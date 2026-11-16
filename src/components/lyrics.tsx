import { StyleSheet, View } from 'react-native';

import type { Line, Section } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { fonts, space, type as typeScale } from '@/theme/tokens';

import { Text } from './text';

type Props = {
  sections: Section[];
  /** Circle mode: maximum type, nothing else on screen. */
  circle?: boolean;
};

/**
 * Lyrics rendered from structured sections (never a flat block), per the style bible:
 * chorus bold on a tinted band, the caller's part in the accent colour,
 * gestures in smaller secondary text, verse numbers in the margin.
 */
export function Lyrics({ sections, circle = false }: Props) {
  const { colors, settings } = useSettings();
  const base = circle ? typeScale.lyricCircle : typeScale.lyric;
  const scale = settings.lyricScale;
  const lyric = { ...base, fontSize: base.fontSize * scale, lineHeight: base.lineHeight * scale };
  const noteSize = Math.round(lyric.fontSize * 0.68);

  const renderLine = (line: Line, key: number, bold: boolean) => {
    const partColor = line.part === 'leader' ? colors.accent : colors.textPrimary;
    return (
      <Text key={key} style={[lyric, { color: partColor }, bold && { fontFamily: fonts.bodyBold }]}>
        {line.part ? (
          <Text variant="label" style={{ color: partColor, fontSize: noteSize * 0.8 }}>
            {line.part === 'leader' ? 'LEADER  ' : 'ALL  '}
          </Text>
        ) : null}
        {line.segments.map((seg, i) =>
          seg.kind === 'note' ? (
            <Text
              key={i}
              style={{ fontFamily: fonts.body, fontSize: noteSize, color: colors.textSecondary }}>
              {`(${seg.text})`}
            </Text>
          ) : (
            seg.text
          ),
        )}
      </Text>
    );
  };

  return (
    <View style={{ gap: space.lg }}>
      {sections.map((section, si) => {
        if (section.type === 'note') {
          return (
            <View key={si} style={[styles.note, { borderColor: colors.divider }]}>
              {section.lines.map((line, li) => (
                <Text key={li} variant="secondary" color="textSecondary">
                  {line.segments.map((s) => s.text).join(' ')}
                </Text>
              ))}
            </View>
          );
        }
        const chorus = section.type === 'chorus';
        return (
          <View
            key={si}
            style={[styles.section, chorus && { backgroundColor: colors.surfaceTint, ...styles.chorus }]}
            accessibilityLabel={chorus ? 'Chorus' : `Verse ${section.number}`}>
            <View style={styles.margin}>
              <Text variant="label" color="textSecondary">
                {chorus ? 'CHO' : section.number}
              </Text>
            </View>
            <View style={styles.lines}>
              {chorus && section.repeat && !circle ? (
                <Text variant="label" color="textSecondary">
                  CHORUS AGAIN
                </Text>
              ) : null}
              {section.lines.map((line, li) => renderLine(line, li, chorus))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', gap: space.sm },
  chorus: { borderRadius: 12, paddingVertical: space.sm, marginHorizontal: -space.sm, paddingHorizontal: space.sm },
  margin: { width: 32, paddingTop: 8 },
  lines: { flex: 1 },
  note: { borderLeftWidth: 3, paddingLeft: space.md, gap: space.xs },
});
