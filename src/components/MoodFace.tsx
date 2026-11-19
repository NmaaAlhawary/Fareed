import React from 'react';
import Svg, { Circle, G, Path, Ellipse } from 'react-native-svg';
import { feeling } from '../lib/content';

// Simple round feeling face (used for check-ins and answer buttons)
export default function MoodFace({ id, size = 56 }: { id: string; size?: number }) {
  const c = feeling(id)?.color || '#FFC93C', ink = '#2A1E4F';
  const st = { stroke: ink, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  const big = id === 'surprised' || id === 'scared';
  const mouth = {
    happy: <Path d="M20 38 Q32 50 44 38" {...st} />, calm: <Path d="M22 40 Q32 45 42 40" {...st} />, sad: <Path d="M21 45 Q32 35 43 45" {...st} />,
    angry: <Path d="M22 44 Q32 38 42 44" {...st} />, scared: <Path d="M21 44 q3.5,-4 7,0 q3.5,4 7,0 q3.5,-4 7,0" {...st} />, surprised: <Ellipse cx={32} cy={43} rx={6} ry={7} fill={ink} />,
  }[id];
  const eyes = id === 'calm'
    ? <G><Path d="M18 27 Q23 31 28 27" {...st} /><Path d="M36 27 Q41 31 46 27" {...st} /></G>
    : <G><Circle cx={23} cy={27} r={big ? 4.2 : 3.3} fill={ink} /><Circle cx={41} cy={27} r={big ? 4.2 : 3.3} fill={ink} /></G>;
  const brows = id === 'angry' ? <G><Path d="M16 19 L28 23" {...st} /><Path d="M48 19 L36 23" {...st} /></G>
    : id === 'sad' || id === 'scared' ? <G><Path d="M17 21 L27 18" {...st} /><Path d="M47 21 L37 18" {...st} /></G> : null;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={29} fill={c} stroke={ink} strokeWidth={2.5} />
      {id === 'happy' ? <G><Circle cx={15} cy={37} r={4} fill="#ff8f8f" opacity={0.45} /><Circle cx={49} cy={37} r={4} fill="#ff8f8f" opacity={0.45} /></G> : null}
      {brows}{eyes}{mouth}
    </Svg>
  );
}
