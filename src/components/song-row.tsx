import { router } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { SIZE_NAMES, songSize } from '@/content/songbook';
import type { Song } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

import { PressableCard } from './pressable-card';
import { SizeBadge } from './size-badge';
import { Text } from './text';

/** A song card: just the title and an S/M/L/XL size badge, so a list reads at a glance at circle. */
export function SongRow({ song }: { song: Song }) {
  const { colors } = useSettings();
  return (
    <PressableCard
      accessibilityLabel={`${song.title}. ${SIZE_NAMES[songSize(song)]}.`}
      onPress={() => router.push({ pathname: '/song/[id]', params: { id: song.id } })}
      style={styles.card}>
      <View style={styles.text}>
        <Text variant="bodyBold">{song.title}</Text>
      </View>
      <SizeBadge song={song} />
      <CaretRight size={20} color={colors.textSecondary} />
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 4,
    gap: space.sm + 4,
  },
  text: { flex: 1 },
});
