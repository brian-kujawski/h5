import { useLocalSearchParams } from 'expo-router';
import { Funnel, MagnifyingGlass, X } from 'phosphor-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { FilterChip } from '@/components/filter-chip';
import { TabScreen } from '@/components/screen';
import { SongRow } from '@/components/song-row';
import { Text } from '@/components/text';
import {
  activeFilterCount,
  anyRecordings,
  findSongs,
  moments,
  NO_FILTERS,
  type SongFilters,
  stylesInUse,
} from '@/content/songbook';
import { DIFFICULTIES, LENGTHS, RATINGS } from '@/content/types';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP, type as typeScale } from '@/theme/tokens';

const LABELS: Record<string, string> = {
  clean: 'Clean',
  cheeky: 'Cheeky',
  explicit: 'Explicit',
  quick: 'Quick',
  standard: 'Standard',
  epic: 'Epic',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard to remember',
};
const label = (value: string) => LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

type ListKey = Exclude<keyof SongFilters, 'hasRecording'>;

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterGroup<T extends string>({
  title,
  values,
  selected,
  onToggle,
  labelFor = label,
  footnote,
}: {
  title: string;
  values: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  labelFor?: (value: T) => string;
  footnote?: string;
}) {
  return (
    <View style={styles.group} accessibilityRole="list" accessibilityLabel={title}>
      <Text variant="label" color="textSecondary">
        {title.toUpperCase()}
      </Text>
      <View style={styles.chips}>
        {values.map((v) => (
          <FilterChip key={v} label={labelFor(v)} selected={selected.includes(v)} onPress={() => onToggle(v)} />
        ))}
      </View>
      {footnote ? (
        <Text variant="secondary" color="textSecondary">
          {footnote}
        </Text>
      ) : null}
    </View>
  );
}

/** Songs tab: search titles and any lyric line (typos welcome), then narrow with filters. */
export default function SongsScreen() {
  const { settings, colors } = useSettings();
  const params = useLocalSearchParams<{ focus?: string }>();
  const input = useRef<TextInputInstance>(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SongFilters>(NO_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const active = activeFilterCount(filters);

  // The Circle tab's search shortcut lands here with the keyboard up.
  useEffect(() => {
    if (params.focus) input.current?.focus();
  }, [params.focus]);

  const results = useMemo(
    () => findSongs(query, filters, settings.cleanMode),
    [query, filters, settings.cleanMode],
  );

  const toggleIn = <K extends ListKey>(key: K) => (value: SongFilters[K][number]) =>
    setFilters((f) => ({ ...f, [key]: toggle(f[key] as SongFilters[K][number][], value) }));

  const hiddenByClean = settings.cleanMode && results.length === 0 ? findSongs(query, filters, false).length : 0;
  const ratings = settings.cleanMode ? RATINGS.filter((r) => r !== 'explicit') : RATINGS;
  const momentName = (id: string) => moments.find((m) => m.id === id)?.name ?? id;

  return (
    <TabScreen title="Songs" subtitle={settings.cleanMode ? 'Clean mode is on' : undefined}>
      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
        <MagnifyingGlass size={22} color={colors.textSecondary} />
        <TextInput
          ref={input}
          value={query}
          onChangeText={setQuery}
          placeholder="Title or any line you remember"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search songs"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={[typeScale.body, styles.input, { color: colors.textPrimary }]}
        />
        {query ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={12}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showFilters }}
          accessibilityLabel={active ? `Filters, ${active} on` : 'Filters'}
          onPress={() => setShowFilters((v) => !v)}
          style={[
            styles.filterButton,
            { borderColor: active ? colors.accent : colors.divider, backgroundColor: active ? colors.surfaceTint : colors.surface },
          ]}>
          <Funnel size={20} color={active ? colors.accent : colors.textPrimary} weight={active ? 'fill' : 'regular'} />
          <Text variant="bodyBold" color={active ? 'accent' : 'textPrimary'}>
            {active ? `Filters (${active})` : 'Filters'}
          </Text>
        </Pressable>
        {active ? (
          <Pressable accessibilityRole="button" onPress={() => setFilters(NO_FILTERS)} style={styles.clear} hitSlop={8}>
            <Text variant="bodyBold" color="accent">
              Clear
            </Text>
          </Pressable>
        ) : null}
        <View style={styles.fill} />
        <Text variant="label" color="textSecondary" accessibilityLiveRegion="polite">
          {results.length === 1 ? '1 SONG' : `${results.length} SONGS`}
        </Text>
      </View>

      {showFilters ? (
        <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
          <FilterGroup
            title="Moment"
            values={moments.map((m) => m.id)}
            selected={filters.moments}
            onToggle={toggleIn('moments')}
            labelFor={momentName}
          />
          <FilterGroup
            title="Rating"
            values={ratings}
            selected={filters.ratings}
            onToggle={toggleIn('ratings')}
            footnote={settings.cleanMode ? 'Clean mode hides explicit songs. Switch it off in More.' : undefined}
          />
          <FilterGroup title="Length" values={LENGTHS} selected={filters.lengths} onToggle={toggleIn('lengths')} />
          <FilterGroup
            title="Difficulty"
            values={DIFFICULTIES}
            selected={filters.difficulties}
            onToggle={toggleIn('difficulties')}
          />
          <FilterGroup title="Style" values={stylesInUse} selected={filters.styles} onToggle={toggleIn('styles')} />
          {anyRecordings ? (
            <View style={styles.chips}>
              <FilterChip
                label="Has a recording"
                selected={filters.hasRecording}
                onPress={() => setFilters((f) => ({ ...f, hasRecording: !f.hasRecording }))}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      {results.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
      {results.length === 0 ? (
        <EmptyState
          title="Nothing rhymes with that"
          body={
            hiddenByClean > 0
              ? `Clean mode is hiding ${hiddenByClean} ${hiddenByClean === 1 ? 'match' : 'matches'}. Switch it off in More if the kids have gone home.`
              : active
                ? 'Try clearing a filter or two.'
                : 'Try fewer words, or a line from the chorus.'
          }
        />
      ) : null}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
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
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: TAP,
    paddingHorizontal: space.md,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  clear: { minHeight: TAP, justifyContent: 'center', paddingHorizontal: space.sm },
  panel: { borderWidth: 1, borderRadius: radius.card, padding: space.md, gap: space.lg },
  group: { gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
