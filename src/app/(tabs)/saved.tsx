import { ArrowDown, ArrowUp, BeerStein, Trash } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { TabScreen } from '@/components/screen';
import { SongRow } from '@/components/song-row';
import { Text } from '@/components/text';
import { getSong, isVisible } from '@/content/songbook';
import type { Song } from '@/content/types';
import { moveSaved } from '@/lib/saved';
import { useSettings } from '@/lib/settings';
import { radius, space, TAP } from '@/theme/tokens';

function IconButton({ label, onPress, disabled, children }: { label: string; onPress: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, { opacity: disabled ? 0.3 : pressed ? 0.6 : 1 }]}>
      {children}
    </Pressable>
  );
}

function EditRow({ song, first, last, visible }: { song: Song; first: boolean; last: boolean; visible: Set<string> }) {
  const { settings, update, colors } = useSettings();
  const move = (dir: 1 | -1) => update({ saved: moveSaved(settings.saved, song.id, dir, visible) });
  return (
    <View style={[styles.editRow, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
      <Text variant="bodyBold" style={styles.fill} numberOfLines={2}>
        {song.title}
      </Text>
      <IconButton label={`Move ${song.title} up`} disabled={first} onPress={() => move(-1)}>
        <ArrowUp size={22} color={colors.textPrimary} />
      </IconButton>
      <IconButton label={`Move ${song.title} down`} disabled={last} onPress={() => move(1)}>
        <ArrowDown size={22} color={colors.textPrimary} />
      </IconButton>
      <IconButton label={`Remove ${song.title}`} onPress={() => update({ saved: settings.saved.filter((id) => id !== song.id) })}>
        <Trash size={22} color={colors.checkBack} />
      </IconButton>
    </View>
  );
}

/** Saved tab: your songs in the order you want them at circle. Kennel setlists come with Custom Hymnals later. */
export default function SavedScreen() {
  const { settings, colors } = useSettings();
  const [editing, setEditing] = useState(false);
  const saved = settings.saved.map(getSong).filter((s) => s !== undefined);
  const visible = saved.filter((s) => isVisible(s, settings.cleanMode));
  const hidden = saved.length - visible.length;
  const visibleIds = new Set(visible.map((s) => s.id));

  return (
    <TabScreen title="Saved" subtitle={saved.length ? 'In the order you’ll sing them' : undefined}>
      {visible.length > 1 || editing ? (
        <View style={styles.toolbar}>
          <Pressable accessibilityRole="button" onPress={() => setEditing((v) => !v)} style={styles.edit} hitSlop={8}>
            <Text variant="bodyBold" color="accent">
              {editing ? 'Done' : 'Reorder'}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {visible.map((song, i) =>
        editing ? (
          <EditRow key={song.id} song={song} first={i === 0} last={i === visible.length - 1} visible={visibleIds} />
        ) : (
          <SongRow key={song.id} song={song} />
        ),
      )}
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

const styles = StyleSheet.create({
  fill: { flex: 1 },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end' },
  edit: { minHeight: TAP, justifyContent: 'center', paddingHorizontal: space.sm },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingLeft: space.md,
    paddingRight: space.xs,
    minHeight: TAP + 8,
  },
  iconButton: { width: TAP, height: TAP, alignItems: 'center', justifyContent: 'center' },
});
