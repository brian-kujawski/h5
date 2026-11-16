import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowsClockwise, CaretRight, MusicNotes, MusicNotesPlus } from 'phosphor-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import type { RaStep } from '@/content/ra-script';
import { faveFor } from '@/lib/ra';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

import { SizeBadge } from './size-badge';
import { Text } from './text';

const tick = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
};

export const openPicker = (stepId: string) => router.push({ pathname: '/ra-pick/[step]', params: { step: stepId } });

/**
 * The song button on an RA step. First time: pick a fave from the moment's songs.
 * After that it opens the fave straight away; the recycle icon picks a different one.
 */
export function RaSongButton({ step }: { step: RaStep }) {
  const { colors, settings } = useSettings();
  const fave = faveFor(step, settings.raFaves, settings.cleanMode);
  const label = step.songLabel ?? step.title.toLowerCase();

  if (!fave) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Pick your ${label} song`}
        accessibilityHint="Choose the song this button opens from now on"
        onPress={() => {
          tick();
          openPicker(step.id);
        }}
        style={({ pressed }) => [styles.button, styles.empty, { borderColor: colors.accent }, pressed && styles.pressed]}>
        <View style={[styles.icon, { backgroundColor: colors.surfaceTint }]}>
          <MusicNotesPlus size={24} color={colors.accent} />
        </View>
        <View style={styles.text}>
          <Text variant="bodyBold">{`Pick your ${label} song`}</Text>
          <Text variant="secondary" color="textSecondary">
            First time here. Choose your go-to.
          </Text>
        </View>
        <CaretRight size={20} color={colors.textPrimary} />
      </Pressable>
    );
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Sing it: ${fave.title}`}
        onPress={() => {
          tick();
          router.push({ pathname: '/song/[id]', params: { id: fave.id } });
        }}
        style={({ pressed }) => [
          styles.button,
          styles.withRecycle,
          { borderColor: colors.accent, backgroundColor: colors.surfaceTint },
          pressed && styles.pressed,
        ]}>
        <View style={[styles.icon, { backgroundColor: colors.accent }]}>
          <MusicNotes size={24} color={colors.onAccent} />
        </View>
        <View style={styles.text}>
          <Text variant="label" color="accent">
            SING IT
          </Text>
          <Text variant="title" numberOfLines={2}>
            {fave.title}
          </Text>
        </View>
        <SizeBadge song={fave} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Change favourite ${label} song`}
        onPress={() => {
          tick();
          openPicker(step.id);
        }}
        style={styles.recycleHit}>
        <View style={[styles.recycle, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
          <ArrowsClockwise size={18} weight="bold" color={colors.textSecondary} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 76,
    borderRadius: radius.card,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 4,
    paddingVertical: space.sm + 4,
    paddingLeft: 14,
    paddingRight: 14,
  },
  empty: { borderStyle: 'dashed' },
  withRecycle: { paddingRight: 52 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
  recycleHit: { position: 'absolute', top: 2, right: 2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  recycle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.97 }] },
});
