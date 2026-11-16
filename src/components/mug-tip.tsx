import { BeerStein } from 'phosphor-react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * The signature "down-down" moment from the style bible: a mug tips back and
 * returns when a song is saved. With Reduce Motion on, the mug just appears.
 */
export function MugTip({ size, color, onDone }: { size: number; color: string; onDone: () => void }) {
  const reduced = useReducedMotion();
  const tilt = useSharedValue(0);

  useEffect(() => {
    if (!reduced) {
      tilt.value = withSequence(withTiming(-55, { duration: 200 }), withDelay(260, withTiming(0, { duration: 180 })));
    }
    const t = setTimeout(onDone, reduced ? 500 : 720);
    return () => clearTimeout(t);
  }, [reduced, tilt, onDone]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }] }));
  return (
    <Animated.View style={style}>
      <BeerStein size={size} color={color} weight="fill" />
    </Animated.View>
  );
}
