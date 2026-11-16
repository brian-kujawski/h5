import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

import { Text } from './text';

/** Tab screen frame: big display title, 16 pt margins, scrolling content. */
export function TabScreen({
  title,
  subtitle,
  children,
  scroll = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
}) {
  const { colors } = useSettings();
  const header = (
    <View style={styles.header}>
      <Text variant="display" accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text color="textSecondary">{subtitle}</Text> : null}
    </View>
  );
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.fill, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: space.md, paddingBottom: space.xl, gap: space.md, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { paddingTop: space.md, gap: space.xs },
});
