import { MagnifyingGlass, X } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { TabScreen } from '@/components/screen';
import { SongRow } from '@/components/song-row';
import { Text } from '@/components/text';
import { searchSongs } from '@/content/songbook';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP, type as typeScale } from '@/theme/tokens';

/** Songs tab: search titles and any lyric line. Filters (length, style, difficulty) arrive in Phase 1. */
export default function SongsScreen() {
  const { settings, colors } = useSettings();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchSongs(query, settings.cleanMode), [query, settings.cleanMode]);

  return (
    <TabScreen title="Songs" subtitle={settings.cleanMode ? 'Clean mode is on' : undefined}>
      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
        <MagnifyingGlass size={22} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Title or any line you remember"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search songs"
          autoCorrect={false}
          returnKeyType="search"
          style={[typeScale.body, styles.input, { color: colors.textPrimary }]}
        />
        {query ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={12}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      <Text variant="label" color="textSecondary">
        {results.length === 1 ? '1 SONG' : `${results.length} SONGS`}
      </Text>
      {results.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
      {results.length === 0 ? (
        <EmptyState title="Nothing rhymes with that" body="Try fewer words, or a line from the chorus." />
      ) : null}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: TAP + 4,
    paddingHorizontal: space.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: space.sm },
});
