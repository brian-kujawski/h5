import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AgeGate } from '@/components/age-gate';
import { SettingsProvider, useSettings } from '@/lib/settings';
import { fonts } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppShell() {
  const { colors, scheme, settings } = useSettings();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.divider,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <Stack
          screenOptions={{
            headerTintColor: colors.accent,
            headerTitleStyle: { fontFamily: fonts.display, color: colors.textPrimary },
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="moment/[id]" options={{ title: '' }} />
          <Stack.Screen name="song/[id]" options={{ title: '' }} />
        </Stack>
        {settings.ageConfirmed ? null : (
          <View style={StyleSheet.absoluteFill}>
            <AgeGate />
          </View>
        )}
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_700Bold,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Fonts are bundled, so this is a few frames at most; fall back to system fonts on error.
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppShell />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
