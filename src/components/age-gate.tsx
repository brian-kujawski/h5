import { BeerStein } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

import { Text } from './text';

/**
 * One-time age check on first launch. H5 is rated 18+ as a whole
 * (Apple 18+, Google Play Mature 17+), so there are no per-song age badges.
 */
export function AgeGate() {
  const { colors, update } = useSettings();
  const [underage, setUnderage] = useState(false);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <BeerStein size={64} color={colors.accent} weight="fill" />
        <Text variant="display" style={styles.center} accessibilityRole="header">
          {underage ? 'Come back at 18' : 'On on! Quick check first'}
        </Text>
        <Text color="textSecondary" style={styles.center}>
          {underage
            ? 'Hash songs are written for grown-ups. H5 will be right here when you’re old enough.'
            : 'Hash songs are rude, crude and sung by adults. H5 is for people 18 and over.'}
        </Text>
      </View>
      {underage ? null : (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => update({ ageConfirmed: true })}
            style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 }]}>
            <Text variant="bodyBold" style={{ color: colors.onAccent }}>
              I’m 18 or over
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setUnderage(true)}
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
            <Text variant="bodyBold" color="accent">
              I’m under 18
            </Text>
          </Pressable>
          <Text variant="secondary" color="textSecondary" style={styles.center}>
            Clean mode starts on. You can turn it off in More.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.lg, justifyContent: 'space-between' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, maxWidth: 480, alignSelf: 'center' },
  actions: { gap: space.sm, paddingBottom: space.lg, width: '100%', maxWidth: 480, alignSelf: 'center' },
  button: { minHeight: TAP + 8, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});
