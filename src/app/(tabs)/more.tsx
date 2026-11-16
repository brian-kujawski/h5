import Constants from 'expo-constants';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { TabScreen } from '@/components/screen';
import { Text } from '@/components/text';
import { songs } from '@/content/songbook';
import { type ThemeChoice, useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

const GLOSSARY: [string, string][] = [
  ['Circle', 'The gathering at the end of trail where songs, beer and justice happen.'],
  ['Hares', 'The hashers who laid the trail.'],
  ['Down-down', 'Drinking your beverage while the circle sings at you.'],
  ['Virgin', 'Someone at their first hash.'],
  ['RA', 'Religious Advisor, who runs circle.'],
  ['FRB', 'Front-running bastard. Fastest one in.'],
  ['On on', 'Hello, goodbye, and this way.'],
];

const THEMES: { id: ThemeChoice; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useSettings();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.divider }]}>{children}</View>;
}

/** More tab: settings, glossary, about. */
export default function MoreScreen() {
  const { settings, update, colors } = useSettings();

  return (
    <TabScreen title="More">
      <Text variant="label" color="textSecondary">SETTINGS</Text>
      <Card>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text variant="bodyBold">Clean mode</Text>
            <Text variant="secondary" color="textSecondary">
              Hides explicit songs everywhere. Handy when kids are at circle.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Clean mode"
            value={settings.cleanMode}
            onValueChange={(cleanMode) => update({ cleanMode })}
            trackColor={{ true: colors.accent, false: colors.textSecondary }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={styles.rowText}>
          <Text variant="bodyBold">Theme</Text>
          <View style={styles.segment} accessibilityRole="radiogroup">
            {THEMES.map((t) => {
              const selected = settings.theme === t.id;
              return (
                <Pressable
                  key={t.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => update({ theme: t.id })}
                  style={[
                    styles.segmentItem,
                    { borderColor: colors.divider, backgroundColor: selected ? colors.surfaceTint : 'transparent' },
                  ]}>
                  <Text variant="bodyBold" color={selected ? 'accent' : 'textSecondary'}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      <Text variant="label" color="textSecondary">GLOSSARY FOR NEWCOMERS</Text>
      <Card>
        {GLOSSARY.map(([term, meaning]) => (
          <View key={term} style={styles.glossary}>
            <Text variant="bodyBold">{term}</Text>
            <Text color="textSecondary">{meaning}</Text>
          </View>
        ))}
      </Card>

      <Text variant="label" color="textSecondary">ABOUT</Text>
      <Card>
        <Text variant="bodyBold">H5: Harry’s Hash House Harrier Hymnal</Text>
        <Text color="textSecondary">
          {songs.length} songs, sung at MoA2H3 and DeMonH3. Seeded from the Motown Ann Arbor H3 Hymnal (rev. 20 April
          2009). Song sources are credited where known.
        </Text>
        <Text variant="secondary" color="textSecondary">
          Version {Constants.expoConfig?.version ?? 'dev'} · Phase 0 preview
        </Text>
      </Card>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, borderWidth: 1, padding: space.md, gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: TAP },
  rowText: { flex: 1, gap: space.sm },
  divider: { height: 1 },
  segment: { flexDirection: 'row', gap: space.sm },
  segmentItem: { flex: 1, minHeight: TAP, borderRadius: radius.card, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  glossary: { gap: 2 },
});
