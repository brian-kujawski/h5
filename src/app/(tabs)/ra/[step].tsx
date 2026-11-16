import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, ListNumbers } from 'phosphor-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { RaSongButton } from '@/components/ra-song-button';
import { Text } from '@/components/text';
import { CIRCLE_NAMES } from '@/content/ra-script';
import { stepPosition } from '@/lib/ra';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

const goToStep = (id: string) => router.replace({ pathname: '/ra/[step]', params: { step: id } });
const goToOutline = () => (router.canGoBack() ? router.back() : router.replace('/ra'));

/** One step of the ceremony: what to do, how to say it, and the song for it. */
export default function RaStepScreen() {
  useKeepAwake();
  const { step: stepId } = useLocalSearchParams<{ step: string }>();
  const { colors, update } = useSettings();
  const pos = stepPosition(stepId);

  useEffect(() => {
    if (pos) update({ raLastStep: pos.step.id });
  }, [pos?.step.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!pos) {
    return (
      <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
        <EmptyState title="Lost the trail" body="That step isn't in the cheat sheet. Head back to the RA tab." />
      </SafeAreaView>
    );
  }

  const { step, index, total, prev, next } = pos;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.fill, { backgroundColor: colors.background }]}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text variant="label" color="textSecondary">
              {`${CIRCLE_NAMES[step.circle].toUpperCase()} · STEP ${index + 1} OF ${total}`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="All steps"
              onPress={goToOutline}
              hitSlop={4}
              style={[styles.iconButton, { borderColor: colors.divider, backgroundColor: colors.surface }]}>
              <ListNumbers size={22} color={colors.textPrimary} />
            </Pressable>
          </View>
          <View style={styles.progress} accessible={false}>
            {Array.from({ length: total }, (_, i) => (
              <View key={i} style={[styles.segment, { backgroundColor: i <= index ? colors.accent : colors.divider }]} />
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <Text variant="display" accessibilityRole="header">
            {step.title}
          </Text>
          <Text>{step.blurb}</Text>
          <Text variant="label" color="textSecondary" style={styles.sayIt}>
            SAY IT LIKE THIS
          </Text>
          {step.prompts.map((p, i) => (
            <View key={i} style={[styles.prompt, { borderBottomColor: colors.divider }]}>
              {p.cue ? (
                <View style={[styles.cue, { backgroundColor: colors.surfaceTint }]}>
                  <Text variant="label" color="textSecondary">
                    {p.cue.toUpperCase()}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.promptText}>{`“${p.text}”`}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.dock, { borderTopColor: colors.divider }]}>
          {step.moment ? <RaSongButton step={step} /> : null}
          <View style={styles.nav}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={prev ? `Back to ${prev.title}` : 'Back to all steps'}
              onPress={() => (prev ? goToStep(prev.id) : goToOutline())}
              style={({ pressed }) => [
                styles.navButton,
                styles.back,
                { borderColor: colors.divider, backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}>
              <Text variant="bodyBold">Back</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => (next ? goToStep(next.id) : goToOutline())}
              style={({ pressed }) => [
                styles.navButton,
                styles.forward,
                { backgroundColor: colors.accent },
                pressed && styles.pressed,
              ]}>
              <Text variant="bodyBold" style={{ color: colors.onAccent }} numberOfLines={1}>
                {next ? `Next: ${next.title}` : 'Done. On on!'}
              </Text>
              {next ? <ArrowRight size={20} weight="bold" color={colors.onAccent} /> : null}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flex: 1, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { paddingHorizontal: space.md, paddingTop: space.sm, gap: space.sm + 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, borderRadius: radius.card, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  progress: { flexDirection: 'row', gap: space.xs },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  body: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.lg, gap: space.sm },
  sayIt: { marginTop: space.sm },
  prompt: { paddingVertical: space.sm + 4, gap: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  cue: { alignSelf: 'flex-start', paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: 6 },
  promptText: { fontSize: 18, lineHeight: 26 },
  dock: { padding: space.md, gap: space.sm + 4, borderTopWidth: StyleSheet.hairlineWidth },
  nav: { flexDirection: 'row', gap: space.sm + 4 },
  navButton: { minHeight: TAP + 4, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  back: { flex: 1, borderWidth: 1 },
  forward: { flex: 2, flexDirection: 'row', gap: space.sm, paddingHorizontal: space.md },
  pressed: { transform: [{ scale: 0.97 }] },
});
