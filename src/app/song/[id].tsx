import { useKeepAwake } from 'expo-keep-awake';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BookmarkSimple, ArrowsOut, MicrophoneStage, TextAa, X } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Lyrics } from '@/components/lyrics';
import { Text } from '@/components/text';
import { getMoment, getSong } from '@/content/songbook';
import type { Song } from '@/content/types';
import { LYRIC_SCALES, useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

function Chip({ label }: { label: string }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.chip, { borderColor: colors.divider, backgroundColor: colors.surface }]}>
      <Text variant="label" color="textSecondary">
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function SongMeta({ song }: { song: Song }) {
  const chips = [
    ...song.moments.map((m) => getMoment(m)?.name ?? m),
    song.length,
    song.difficulty,
    ...song.style.map((s) => s.replace(/-/g, ' ')),
  ];
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="display" accessibilityRole="header">
        {song.title}
      </Text>
      {song.tune ? <Text color="textSecondary">To the tune of {song.tune}</Text> : null}
      {song.hook ? <Text>{song.hook}</Text> : null}
      <View style={styles.chips}>
        {chips.map((c, i) => (
          <Chip key={`${c}-${i}`} label={c} />
        ))}
      </View>
    </View>
  );
}

function ToolButton({
  label,
  onPress,
  children,
  active,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={({ pressed }) => [styles.tool, { opacity: pressed ? 0.6 : 1 }]}>
      {children}
      <Text variant="label" color={active ? 'accent' : 'textSecondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Circle mode: full-screen lyrics at maximum size. Tap to move down roughly a verse. */
function CircleMode({ song, onClose }: { song: Song; onClose: () => void }) {
  const { colors } = useSettings();
  const { height } = useWindowDimensions();
  const scroller = useRef<ScrollViewInstance>(null);
  const offset = useRef(0);

  return (
    <Modal visible animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
        <View style={styles.circleBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave circle mode"
            onPress={onClose}
            style={[styles.close, { backgroundColor: colors.surface }]}>
            <X size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          ref={scroller}
          onScroll={(e) => (offset.current = e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={64}
          contentContainerStyle={styles.circleContent}>
          <Pressable
            accessibilityHint="Tap to scroll down"
            onPress={() => scroller.current?.scrollTo({ y: offset.current + height * 0.6, animated: true })}>
            <Lyrics sections={song.sections} circle />
            {song.ends_with_down_down ? <DownDown circle /> : null}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function DownDown({ circle }: { circle?: boolean }) {
  return (
    <Text variant={circle ? 'title' : 'bodyBold'} color="accent" style={{ marginTop: space.lg }}>
      …drink it down, down, down!
    </Text>
  );
}

export default function SongScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, update, toggleSaved, colors } = useSettings();
  const [circle, setCircle] = useState(false);
  const song = getSong(id);

  if (!song) {
    return <EmptyState title="That song wandered off trail" body="It may have been removed from the songbook." />;
  }
  const saved = settings.saved.includes(song.id);
  const nextScale = () => {
    const i = LYRIC_SCALES.indexOf(settings.lyricScale as (typeof LYRIC_SCALES)[number]);
    update({ lyricScale: LYRIC_SCALES[(i + 1) % LYRIC_SCALES.length] });
  };
  const hiddenByClean = settings.cleanMode && song.rating === 'explicit';

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <SongMeta song={song} />
        {song.review_flags.length ? (
          <View style={[styles.flag, { borderColor: colors.checkBack }]}>
            <Text variant="label" color="checkBack">
              KENNEL REVIEW: {song.review_flags.join(', ').toUpperCase()}
            </Text>
          </View>
        ) : null}
        {hiddenByClean ? (
          <EmptyState title="Clean mode is on" body="This one's explicit. Turn clean mode off in More to see the words." />
        ) : (
          <>
            <Lyrics sections={song.sections} />
            {song.ends_with_down_down ? <DownDown /> : null}
          </>
        )}
        {song.origin ? (
          <Text variant="secondary" color="textSecondary" style={{ marginTop: space.lg }}>
            Source: {song.origin}
          </Text>
        ) : null}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
        <View style={styles.player}>
          <MicrophoneStage size={22} color={colors.textSecondary} />
          <Text variant="secondary" color="textSecondary" style={styles.fill}>
            {song.recordings.length ? 'Recording available' : 'No recording yet. Sing it, we’ll add it.'}
          </Text>
        </View>
        <View style={styles.tools}>
          <ToolButton label={saved ? 'Saved' : 'Save'} active={saved} onPress={() => toggleSaved(song.id)}>
            <BookmarkSimple size={26} color={saved ? colors.accent : colors.textPrimary} weight={saved ? 'fill' : 'regular'} />
          </ToolButton>
          <ToolButton label={`Size ${Math.round(settings.lyricScale * 100)}%`} onPress={nextScale}>
            <TextAa size={26} color={colors.textPrimary} />
          </ToolButton>
          {hiddenByClean ? null : (
            <ToolButton label="Circle mode" onPress={() => setCircle(true)}>
              <ArrowsOut size={26} color={colors.textPrimary} />
            </ToolButton>
          )}
        </View>
      </SafeAreaView>
      {circle ? <CircleMode song={song} onClose={() => setCircle(false)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: space.md, paddingBottom: space.xxl, gap: space.lg, maxWidth: 720, width: '100%', alignSelf: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs + 2 },
  chip: { borderWidth: 1, borderRadius: radius.chip, paddingHorizontal: space.sm + 2, paddingVertical: space.xs },
  flag: { borderWidth: 1, borderRadius: radius.card, padding: space.sm },
  bar: { borderTopWidth: 1, paddingHorizontal: space.md, paddingTop: space.sm },
  player: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 32 },
  tools: { flexDirection: 'row', justifyContent: 'space-around' },
  tool: { minWidth: TAP + 24, minHeight: TAP + 8, alignItems: 'center', justifyContent: 'center', gap: 2 },
  circleBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space.md, paddingTop: space.sm },
  close: {
    width: TAP,
    height: TAP,
    borderRadius: TAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContent: { padding: space.lg, paddingTop: space.sm, paddingBottom: 400 },
});
