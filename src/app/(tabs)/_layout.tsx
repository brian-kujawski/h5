import { Tabs } from 'expo-router/js-tabs';
import { BookmarkSimple, ClipboardText, DotsThreeCircle, type IconProps, MagnifyingGlass, UsersThree } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import type { ColorValue } from 'react-native';

import { useSettings } from '@/lib/settings';
import { fonts } from '@/theme/tokens';

function tabIcon(Icon: ComponentType<IconProps>) {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Icon size={26} color={String(color)} weight={focused ? 'fill' : 'regular'} />;
  }
  return TabIcon;
}

/** Tabs: Circle, Songs, RA (the circle leader's cheat sheet), Saved, More. Icons always carry a label. */
export default function TabLayout() {
  const { colors } = useSettings();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.divider, minHeight: 64 },
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: 12 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Circle', tabBarIcon: tabIcon(UsersThree) }} />
      <Tabs.Screen name="songs" options={{ title: 'Songs', tabBarIcon: tabIcon(MagnifyingGlass) }} />
      <Tabs.Screen name="ra" options={{ title: 'RA', tabBarIcon: tabIcon(ClipboardText) }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: tabIcon(BookmarkSimple) }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: tabIcon(DotsThreeCircle) }} />
    </Tabs>
  );
}
