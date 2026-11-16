import { router } from 'expo-router';
import { Check, MusicNotes } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TabScreen } from '@/components/screen';
import { Text } from '@/components/text';
import { type Circle, CIRCLE_NAMES, type RaStep } from '@/content/ra-script';
import { faveFor, getStep, stepPosition, stepsFor } from '@/lib/ra';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

const openStep = (id: string) => router.push({ pathname: '/ra/[step]', params: { step: id } });

function StepRow({ step, number, state }: { step: RaStep; number: number; state: 'done' | 'current' | 'todo' }) {
  const { colors, settings } = useSettings();
  const fave = faveFor(step, settings.raFaves, settings.cleanMode);
  const sub = !step.moment ? 'No song needed' : fave ? fave.title : 'No fave yet';
  const ring = state === 'done' ? colors.onOn : state === 'current' ? colors.accent : colors.divider;
  const fill = state === 'todo' ? 'transparent' : ring;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Step ${number}, ${step.title}. ${sub}.${state === 'current' ? ' Where you left off.' : ''}`}
      onPress={() => openStep(step.id)}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.divider },
        state === 'current' && { backgroundColor: colors.surfaceTint },
        pressed && { opacity: 0.7 },
      ]}>
      <View style={[styles.dot, { borderColor: ring, backgroundColor: fill }]}>
        {state === 'done' ? (
          <Check size={14} weight="bold" color={colors.onAccent} />
        ) : (
          <Text variant="label" style={{ color: state === 'current' ? colors.onAccent : colors.textSecondary }}>
            {number}
          </Text>
        )}
      </View>
      <View style={styles.rowText}>
        <Text variant="bodyBold">{step.title}</Text>
        <View style={styles.sub}>
          {fave ? <MusicNotes size={14} color={colors.textPrimary} /> : null}
          <Text variant="secondary" color={fave ? 'textPrimary' : 'textSecondary'} numberOfLines={1} style={styles.flex}>
            {sub}
          </Text>
        </View>
      </View>
      {state === 'current' ? (
        <View style={[styles.resume, { backgroundColor: colors.accent }]}>
          <Text variant="label" style={{ color: colors.onAccent }}>
            RESUME
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** RA tab: the ceremony outline. Tap a step to walk the circle from there. */
export default function RaScreen() {
  const { settings, colors } = useSettings();
  const last = settings.raLastStep ? getStep(settings.raLastStep) : undefined;
  const [circle, setCircle] = useState<Circle>(last?.circle ?? 'end');
  const steps = stepsFor(circle);
  const currentIndex = last && last.circle === circle ? (stepPosition(last.id)?.index ?? -1) : -1;

  return (
    <TabScreen title="RA mode" subtitle="Your cheat sheet for running circle.">
      <View
        accessibilityRole="tablist"
        style={[styles.segments, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
        {(['start', 'end'] as const).map((c) => {
          const on = c === circle;
          return (
            <Pressable
              key={c}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => setCircle(c)}
              style={[styles.segment, on && { backgroundColor: colors.accent }]}>
              <Text variant="bodyBold" style={{ color: on ? colors.onAccent : colors.textSecondary, fontSize: 15 }}>
                {CIRCLE_NAMES[c]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View>
        {steps.map((step, i) => (
          <StepRow
            key={step.id}
            step={step}
            number={i + 1}
            state={currentIndex < 0 ? 'todo' : i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo'}
          />
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flexShrink: 1 },
  segments: { flexDirection: 'row', padding: space.xs, borderRadius: radius.card, borderWidth: 1 },
  segment: { flex: 1, minHeight: 44, borderRadius: radius.card - 3, alignItems: 'center', justifyContent: 'center' },
  row: {
    minHeight: TAP + 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 4,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    marginHorizontal: -space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.card - 2,
  },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 1 },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resume: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});
