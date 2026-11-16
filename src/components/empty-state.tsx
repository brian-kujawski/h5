import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme/tokens';

import { Text } from './text';

/** Jokes live in empty states (voice and copy rules), so keep them short and kind. */
export function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      {icon}
      <Text variant="title" style={styles.center}>
        {title}
      </Text>
      {body ? (
        <Text color="textSecondary" style={styles.center}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.sm, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  center: { textAlign: 'center' },
});
