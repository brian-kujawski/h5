import { router, useLocalSearchParams } from 'expo-router';
import { Check, X } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { SizeBadge } from '@/components/size-badge';
import { Text } from '@/components/text';
import { getMoment, songsForMoment } from '@/content/songbook';
import { getStep, setFave } from '@/lib/ra';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

/** Sheet for choosing an RA step's favourite song from that step's moment. */
export default function RaPickScreen() {
  const { step: stepId } = useLocalSearchParams<{ step: string }>();
  const { colors, settings, update } = useSettings();
  const step = getStep(stepId);
  const moment = step?.moment ? getMoment(step.moment) : undefined;
  const list = moment ? songsForMoment(moment.id, settings.cleanMode) : [];
  const current = step ? settings.raFaves[step.id] : undefined;
  const [picked, setPicked] = useState<string | undefined>(
    list.some((s) => s.id === current) ? current : list[0]?.id,
  );
  const label = step?.songLabel ?? step?.title.toLowerCase() ?? '';

  const sing = (save: boolean) => {
    if (!step || !picked) return;
    if (save) update({ raFaves: setFave(settings.raFaves, step.id, picked) });
    router.replace({ pathname: '/song/[id]', params: { id: picked } });
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.fill, { backgroundColor: colors.surface }]}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text variant="display" accessibilityRole="header" style={styles.flex}>
            {`Pick your ${label} song`}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => router.back()}
            style={styles.close}>
            <X size={24} weight="bold" color={colors.textSecondary} />
          </Pressable>
        </View>
        <Text variant="secondary" color="textSecondary" style={styles.intro}>
          This button opens it every time from now on. Changed your mind? Tap the recycle icon on the button.
        </Text>

        <ScrollView contentContainerStyle={styles.list}>
          {moment ? (
            <Text variant="label" color="textSecondary">
              {`${moment.name.toUpperCase()} SONGS · ${list.length}`}
            </Text>
          ) : null}
          {list.map((song) => {
            const on = song.id === picked;
            return (
              <Pressable
                key={song.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                onPress={() => setPicked(song.id)}
                style={[
                  styles.row,
                  on
                    ? { borderColor: colors.accent, backgroundColor: colors.surfaceTint, borderWidth: 2 }
                    : { borderColor: colors.divider, backgroundColor: colors.surface },
                ]}>
                <View
                  style={[
                    styles.radio,
                    { borderColor: on ? colors.accent : colors.textSecondary, backgroundColor: on ? colors.accent : 'transparent' },
                  ]}>
                  {on ? <Check size={14} weight="bold" color={colors.onAccent} /> : null}
                </View>
                <Text variant="bodyBold" style={styles.flex}>
                  {song.title}
                </Text>
                <SizeBadge song={song} />
              </Pressable>
            );
          })}
          {list.length === 0 ? (
            <EmptyState
              title="No songs for that yet"
              body={settings.cleanMode ? 'Clean mode may be hiding some. Turn it off in More.' : 'Know one? Add it to the songbook.'}
            />
          ) : null}
        </ScrollView>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={!picked}
            onPress={() => sing(true)}
            style={({ pressed }) => [
              styles.primary,
              { backgroundColor: colors.accent, opacity: picked ? 1 : 0.5 },
              pressed && styles.pressed,
            ]}>
            <Text variant="bodyBold" style={{ color: colors.onAccent }}>
              Make it my fave and sing it
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={!picked}
            onPress={() => sing(false)}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
            <Text variant="bodyBold" style={{ fontSize: 15 }}>
              Just sing it this once
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  page: { flex: 1, maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: space.md, paddingTop: space.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  close: { width: TAP, height: TAP, alignItems: 'center', justifyContent: 'center', marginRight: -space.sm, marginTop: -6 },
  intro: { marginTop: space.sm },
  list: { paddingVertical: space.md, gap: space.sm },
  row: {
    minHeight: 60,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 4,
    paddingHorizontal: space.sm + 4,
    paddingVertical: space.sm,
  },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actions: { paddingVertical: space.md, gap: space.xs },
  primary: { minHeight: 56, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  secondary: { minHeight: TAP, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.97 }] },
});
