import { useKeepAwake } from 'expo-keep-awake';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  ArrowsOut,
  BookmarkSimple,
  CaretDown,
  CaretUp,
  MicrophoneStage,
  ShareNetwork,
  TextAa,
  X,
} from 'phosphor-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Lyrics } from '@/components/lyrics';
import { MugTip } from '@/components/mug-tip';
import { Text } from '@/components/text';
import { shareText } from '@/content/share';
import { getMoment, getSong } from '@/content/songbook';
import type { Song } from '@/content/types';
import { LYRIC_SCALES, nextStop, stepScale } from '@/lib/circle';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

function Chip({ label, onPress }: { label: string; onPress?: () => void }) {
  const { colors } = useSettings();
  const body = (
    <Text variant="label" color={onPress ? 'accent' : 'textSecondary'}>
      {label.toUpperCase()}
    </Text>
  );
  const style = [styles.chip, { borderColor: onPress ? colors.accent : colors.divider, backgroundColor: colors.surface }];
  return onPress ? (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`More songs for ${label}`}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [...style, { opacity: pressed ? 0.6 : 1 }]}>
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}

function SongMeta({ song }: { song: Song }) {
  const facts = [song.length, song.difficulty, ...song.style.map((s) => s.replace(/-/g, ' '))];
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="display" accessibilityRole="header">
        {song.title}
      </Text>
      {song.alt_titles.length ? (
        <Text variant="secondary" color="textSecondary">
          Also known as {song.alt_titles.join(', ')}
        </Text>
      ) : null}
      {song.tune ? <Text color="textSecondary">To the tune of {song.tune}</Text> : null}
      {song.hook ? <Text>{song.hook}</Text> : null}
      <View style={styles.chips}>
        {song.moments.map((m) => {
          const moment = getMoment(m);
          return (
            <Chip
              key={m}
              label={moment?.name ?? m}
              onPress={moment ? () => router.push({ pathname: '/moment/[id]', params: { id: m } }) : undefined}
            />
          );
        })}
        {facts.map((c, i) => (
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

/** − / + lyric size control that opens above the toolbar. */
function SizeControl() {
  const { settings, update, colors } = useSettings();
  const min = settings.lyricScale <= LYRIC_SCALES[0];
  const max = settings.lyricScale >= LYRIC_SCALES[LYRIC_SCALES.length - 1];
  const step = (dir: 1 | -1) => update({ lyricScale: stepScale(settings.lyricScale, dir) });
  const btn = (dir: 1 | -1, disabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dir === 1 ? 'Bigger lyrics' : 'Smaller lyrics'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => step(dir)}
      style={[styles.sizeButton, { borderColor: colors.divider, opacity: disabled ? 0.4 : 1 }]}>
      <Text variant={dir === 1 ? 'title' : 'bodyBold'}>{dir === 1 ? 'A+' : 'A−'}</Text>
    </Pressable>
  );
  return (
    <View style={styles.sizeRow} accessibilityRole="adjustable" accessibilityValue={{ text: `${Math.round(settings.lyricScale * 100)}%` }}>
      {btn(-1, min)}
      <Text variant="bodyBold" style={styles.sizeValue}>
        {Math.round(settings.lyricScale * 100)}%
      </Text>
      {btn(1, max)}
    </View>
  );
}

/**
 * Circle mode: full-screen lyrics at maximum size, everything else hidden.
 * Tap the lower part of the screen for the next verse, the top strip to go back one.
 */
function CircleMode({ song, onClose }: { song: Song; onClose: () => void }) {
  const { colors } = useSettings();
  const scroller = useRef<ScrollViewInstance>(null);
  const offset = useRef(0);
  const lyricsTop = useRef(0);
  const stops = useRef<number[]>([]);
  const [height, setHeight] = useState(0);

  const go = (direction: 1 | -1) => {
    const all = stops.current.map((y) => y + lyricsTop.current - space.sm);
    const target = nextStop(all, offset.current, direction);
    scroller.current?.scrollTo({ y: target, animated: true });
  };

  return (
    <Modal visible animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
        <View style={styles.circleBar}>
          <Text variant="title" numberOfLines={1} style={styles.fill}>
            {song.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous verse"
            onPress={() => go(-1)}
            style={[styles.round, { backgroundColor: colors.surface }]}>
            <CaretUp size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next verse"
            onPress={() => go(1)}
            style={[styles.round, { backgroundColor: colors.surface }]}>
            <CaretDown size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave circle mode"
            onPress={onClose}
            style={[styles.round, { backgroundColor: colors.surface }]}>
            <X size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          ref={scroller}
          onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
          onScroll={(e) => (offset.current = e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={64}
          contentContainerStyle={[styles.circleContent, { paddingBottom: Math.max(400, height * 0.8) }]}>
          <Pressable
            accessibilityHint="Tap to go to the next verse"
            onPress={(e) => go(e.nativeEvent.locationY - offset.current < height * 0.25 ? -1 : 1)}>
            <View onLayout={(e) => (lyricsTop.current = e.nativeEvent.layout.y)}>
              <Lyrics sections={song.sections} circle onSectionLayout={(i, y) => (stops.current[i] = y)} />
            </View>
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
  const { settings, toggleSaved, colors } = useSettings();
  const [circle, setCircle] = useState(false);
  const [sizing, setSizing] = useState(false);
  const [cheers, setCheers] = useState(false);
  const endCheers = useCallback(() => setCheers(false), []);
  const song = getSong(id);

  if (!song) {
    return <EmptyState title="That song wandered off trail" body="It may have been removed from the songbook." />;
  }
  const saved = settings.saved.includes(song.id);
  const hiddenByClean = settings.cleanMode && song.rating === 'explicit';

  const onSave = () => {
    if (!saved) setCheers(true);
    toggleSaved(song.id);
  };
  const onShare = () => {
    Share.share({ title: song.title, message: shareText(song) }).catch(() => {});
  };

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
        {song.notes ? (
          <Text variant="secondary" color="textSecondary">
            {song.notes}
          </Text>
        ) : null}
        {song.origin ? (
          <Text variant="secondary" color="textSecondary" style={{ marginTop: space.lg }}>
            Source: {song.origin}
          </Text>
        ) : null}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
        {sizing ? <SizeControl /> : null}
        <View style={styles.player}>
          <MicrophoneStage size={22} color={colors.textSecondary} />
          <Text variant="secondary" color="textSecondary" style={styles.fill}>
            {song.recordings.length ? 'Recordings arrive in the next update.' : 'No recording yet. Sing it, we’ll add it.'}
          </Text>
        </View>
        <View style={styles.tools}>
          <ToolButton label={saved ? 'Saved' : 'Save'} active={saved} onPress={onSave}>
            {cheers ? (
              <MugTip size={26} color={colors.accent} onDone={endCheers} />
            ) : (
              <BookmarkSimple size={26} color={saved ? colors.accent : colors.textPrimary} weight={saved ? 'fill' : 'regular'} />
            )}
          </ToolButton>
          {hiddenByClean ? null : (
            <ToolButton label="Text size" active={sizing} onPress={() => setSizing((v) => !v)}>
              <TextAa size={26} color={sizing ? colors.accent : colors.textPrimary} />
            </ToolButton>
          )}
          {hiddenByClean ? null : (
            <ToolButton label="Share" onPress={onShare}>
              <ShareNetwork size={26} color={colors.textPrimary} />
            </ToolButton>
          )}
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
  tool: { minWidth: TAP + 16, minHeight: TAP + 8, alignItems: 'center', justifyContent: 'center', gap: 2 },
  sizeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.md, paddingBottom: space.sm },
  sizeButton: { minWidth: TAP + 8, minHeight: TAP, borderWidth: 1, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  sizeValue: { minWidth: 56, textAlign: 'center' },
  circleBar: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingTop: space.sm },
  round: {
    width: TAP,
    height: TAP,
    borderRadius: TAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContent: { padding: space.lg, paddingTop: space.sm },
});
