import {
  ArrowUUpLeft,
  Backpack,
  BeerStein,
  Cake,
  Car,
  Clock,
  Confetti,
  Fire,
  HandWaving,
  Heart,
  Hourglass,
  type IconProps,
  Lightning,
  MegaphoneSimple,
  MoonStars,
  MusicNotes,
  Plant,
  Rabbit,
  Siren,
  SmileyXEyes,
  Sneaker,
  Tag,
  ThumbsDown,
  UsersThree,
  Warning,
} from 'phosphor-react-native';
import type { ComponentType } from 'react';

/**
 * Phosphor stand-ins for the custom moment icons the style bible asks for.
 * Names match the `icon` field in content/moments.yml; unknown names fall back to a beer mug.
 */
const ICONS: Record<string, ComponentType<IconProps>> = {
  ArrowUUpLeft,
  Backpack,
  BeerStein,
  Cake,
  Car,
  Clock,
  Confetti,
  Fire,
  HandWaving,
  Heart,
  Hourglass,
  Lightning,
  MegaphoneSimple,
  MoonStars,
  MusicNotes,
  Plant,
  Rabbit,
  Siren,
  SmileyXEyes,
  Sneaker,
  Tag,
  ThumbsDown,
  UsersThree,
  Warning,
};

export const MOMENT_ICON_NAMES = Object.keys(ICONS);

export function MomentIcon({ name, ...props }: IconProps & { name: string }) {
  const Icon = ICONS[name] ?? BeerStein;
  return <Icon {...props} />;
}
