import { Stack } from 'expo-router';

import { useSettings } from '@/lib/settings';

/** RA mode keeps its own stack inside the tab, so the tab bar stays put while you step through circle. */
export default function RaLayout() {
  const { colors } = useSettings();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
