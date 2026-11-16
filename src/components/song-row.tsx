import { router } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import type { Song } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

import { PressableCard } from './pressable-card';
import { Text } from './text';

const LENGTH_LABEL = { quick: 'Quick', standard: 'Standard', epic: 'Epic' } as const;
const DIFFICULTY_LABEL = { easy: 'easy', medium: 'medium', hard: 'hard to remember' } as const;

/** Short summary under a song title: the hook if a hasher wrote one, else length and difficulty. */
export function songSummary(song: Song): string {
  const facts = `${LENGTH_LABEL[song.length]}, ${DIFFICULTY_LABEL[song.difficulty]}`;
  return song.hook ? `${song.hook} · ${facts}` : `${facts} · “${song.first_line}”`;
}

export function SongRow({ song }: { song: Song }) {
  const { colors } = useSettings();
  return (
    <PressableCard
      accessibilityLabel={`${song.title}. ${songSummary(song)}`}
      onPress={() => router.push({ pathname: '/song/[id]', params: { id: song.id } })}
      style={styles.card}>
      <View style={styles.text}>
        <Text variant="bodyBold">{song.title}</Text>
        {song.tune ? (
          <Text variant="secondary" color="textSecondary">
            To the tune of {song.tune}
          </Text>
        ) : null}
        <Text variant="secondary" color="textSecondary" numberOfLines={2}>
          {songSummary(song)}
        </Text>
      </View>
      <CaretRight size={20} color={colors.textSecondary} />
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.md - 4,
    gap: space.sm,
  },
  text: { flex: 1, gap: 2 },
});
