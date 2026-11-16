import { Text as RNText, type TextProps } from 'react-native';

import { useSettings } from '@/lib/settings';
import { type Colors, type as typeScale } from '@/theme/tokens';

type Variant = keyof typeof typeScale;

type Props = TextProps & {
  variant?: Variant;
  color?: keyof Colors;
};

/** Text in one of the style-bible type roles. Honours the system text size (allowFontScaling defaults on). */
export function Text({ variant = 'body', color = 'textPrimary', style, ...rest }: Props) {
  const { colors } = useSettings();
  return (
    <RNText
      maxFontSizeMultiplier={2}
      {...rest}
      style={[typeScale[variant], { color: colors[color] }, style]}
    />
  );
}
