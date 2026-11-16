import { BeerStein } from 'phosphor-react-native';

import { EmptyState } from '@/components/empty-state';
import { TabScreen } from '@/components/screen';
import { SongRow } from '@/components/song-row';
import { Text } from '@/components/text';
import { getSong, isVisible } from '@/content/songbook';
import { useSettings } from '@/lib/settings';

/** Saved tab: favourites now; kennel setlists come with Custom Hymnals later. */
export default function SavedScreen() {
  const { settings, colors } = useSettings();
  const saved = settings.saved.map(getSong).filter((s) => s !== undefined);
  const visible = saved.filter((s) => isVisible(s, settings.cleanMode));
  const hidden = saved.length - visible.length;

  return (
    <TabScreen title="Saved">
      {visible.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
      {saved.length === 0 ? (
        <EmptyState
          icon={<BeerStein size={56} color={colors.accent} />}
          title="Your hymnal is thirsty"
          body="Tap Save on any song and it lands here, ready for circle."
        />
      ) : null}
      {hidden > 0 ? (
        <Text variant="secondary" color="textSecondary">
          Clean mode is hiding {hidden} saved {hidden === 1 ? 'song' : 'songs'}.
        </Text>
      ) : null}
    </TabScreen>
  );
}
