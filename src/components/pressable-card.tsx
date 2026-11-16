import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useSettings } from '@/lib/settings';
import { radius, TAP } from '@/theme/tokens';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: boolean;
};

/** A card that presses in, with a light haptic tick, per "Motion and delight". */
export function PressableCard({ children, style, tint, onPress, ...rest }: Props) {
  const { colors } = useSettings();
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      onPress={(e) => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          minHeight: TAP,
          borderRadius: radius.card,
          backgroundColor: tint ? colors.surfaceTint : colors.surface,
          borderWidth: 1,
          borderColor: colors.divider,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}>
      {children}
    </Pressable>
  );
}
