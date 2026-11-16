import * as Haptics from 'expo-haptics';
import { Check } from 'phosphor-react-native';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

import { Text } from './text';

/** A toggle chip for filters. Selection shows a check icon as well as colour, per the style bible. */
export function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      hitSlop={4}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? colors.accent : colors.divider,
          backgroundColor: selected ? colors.surfaceTint : colors.surface,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}>
      {selected ? <Check size={16} weight="bold" color={colors.accent} /> : null}
      <Text variant="bodyBold" color={selected ? 'accent' : 'textPrimary'} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: TAP - 8,
    paddingHorizontal: space.md - 2,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  label: { fontSize: 15 },
});
