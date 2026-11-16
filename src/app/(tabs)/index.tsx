import { router } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MomentIcon } from '@/components/moment-icon';
import { PressableCard } from '@/components/pressable-card';
import { TabScreen } from '@/components/screen';
import { Text } from '@/components/text';
import { momentsWithCounts } from '@/content/songbook';
import type { Moment } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

function MomentTile({ moment, count }: { moment: Moment; count: number }) {
  const { colors } = useSettings();
  const label = count === 0 ? 'No songs yet' : count === 1 ? '1 song' : `${count} songs`;
  return (
    <PressableCard
      accessibilityLabel={`${moment.name}. ${moment.blurb}. ${label}`}
      onPress={() => router.push({ pathname: '/moment/[id]', params: { id: moment.id } })}
      style={styles.tile}>
      <MomentIcon name={moment.icon} size={32} color={colors.accent} />
      <Text variant="bodyBold">{moment.name}</Text>
      <Text variant="secondary" color="textSecondary" numberOfLines={2}>
        {moment.blurb}
      </Text>
      <Text variant="label" color="textSecondary">
        {label.toUpperCase()}
      </Text>
    </PressableCard>
  );
}

/** Circle tab (home): pick a moment, get a short list of songs that fit. */
export default function CircleScreen() {
  const { settings, colors } = useSettings();
  const [showExtras, setShowExtras] = useState(false);
  const main = momentsWithCounts('circle', settings.cleanMode);
  const extras = momentsWithCounts('extra', settings.cleanMode);

  return (
    <TabScreen title="On on! Pick a moment" subtitle="Who's in the middle?">
      <PressableCard
        accessibilityLabel="Search songs"
        accessibilityHint="Opens the Songs tab with the keyboard up"
        onPress={() => router.navigate({ pathname: '/songs', params: { focus: String(Date.now()) } })}
        style={styles.search}>
        <MagnifyingGlass size={22} color={colors.textSecondary} />
        <Text color="textSecondary">Know the words? Search them</Text>
      </PressableCard>
      <View style={styles.grid}>
        {main.map(({ moment, count }) => (
          <MomentTile key={moment.id} moment={moment} count={count} />
        ))}
      </View>
      <PressableCard onPress={() => setShowExtras((v) => !v)} style={styles.more} accessibilityState={{ expanded: showExtras }}>
        <Text variant="bodyBold" color="accent">
          {showExtras ? 'Fewer moments' : 'More moments'}
        </Text>
      </PressableCard>
      {showExtras ? (
        <View style={styles.grid}>
          {extras.map(({ moment, count }) => (
            <MomentTile key={moment.id} moment={moment} count={count} />
          ))}
        </View>
      ) : null}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm + 4 },
  tile: { flexBasis: '47%', flexGrow: 1, padding: space.md, gap: space.xs, minHeight: 148 },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md },
  more: { alignItems: 'center', justifyContent: 'center' },
});
