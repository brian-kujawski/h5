import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { MomentIcon } from '@/components/moment-icon';
import { SongRow } from '@/components/song-row';
import { Text } from '@/components/text';
import { getMoment, songsForMoment } from '@/content/songbook';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

/** Ranked list of songs for one moment. */
export default function MomentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, colors } = useSettings();
  const moment = getMoment(id);
  const list = moment ? songsForMoment(moment.id, settings.cleanMode) : [];
  const hiddenByClean = moment && settings.cleanMode ? songsForMoment(moment.id, false).length - list.length : 0;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: moment?.name ?? 'Moment' }} />
      {moment ? (
        <View style={styles.header}>
          <MomentIcon name={moment.icon} size={40} color={colors.accent} />
          <Text color="textSecondary">{moment.blurb}</Text>
        </View>
      ) : null}
      {list.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
      {list.length === 0 ? (
        <EmptyState
          title="No songs for that yet"
          body={
            hiddenByClean > 0
              ? `Clean mode is hiding ${hiddenByClean}. Turn it off in More if the kids have gone home.`
              : 'Know one? Add it to the songbook.'
          }
        />
      ) : hiddenByClean > 0 ? (
        <Text variant="secondary" color="textSecondary" style={styles.center}>
          Clean mode is hiding {hiddenByClean} more.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, gap: space.sm + 4, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingBottom: space.sm },
  center: { textAlign: 'center' },
});
