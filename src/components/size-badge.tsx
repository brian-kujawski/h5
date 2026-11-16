import { StyleSheet, View } from 'react-native';

import { SIZE_NAMES, songSize } from '@/content/songbook';
import type { Song } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { radius } from '@/theme/tokens';

import { Text } from './text';

/**
 * S / M / L / XL badge: how big a song is at a glance. Colour-coded, but the
 * letter carries the meaning too, so it never relies on colour alone.
 */
export function SizeBadge({ song }: { song: Song }) {
  const { colors } = useSettings();
  const size = songSize(song);
  const color = colors[`size${size}`];
  return (
    <View
      accessible
      accessibilityLabel={`${SIZE_NAMES[size]} song`}
      style={[styles.badge, { borderColor: color }]}>
      <Text variant="label" style={[styles.text, { color }]}>
        {size}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 36,
    height: 28,
    paddingHorizontal: 6,
    borderWidth: 2,
    borderRadius: radius.card - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 14, letterSpacing: 0.5 },
});
