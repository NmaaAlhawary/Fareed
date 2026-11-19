// Fareed the panda: a rigged vector character. Every body part is its own layer that
// rotates around a real joint (hip, shoulder, neck), so he can run, jump, dance and celebrate.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import Svg, { Defs, Ellipse, G, Path, Pattern, Rect, Circle } from 'react-native-svg';

export type Mood = 'normal' | 'happy' | 'excited' | 'sad' | 'angry' | 'scared' | 'surprised' | 'calm' | 'think' | 'proud';
export type Action =
  | 'idle' | 'wave' | 'jump' | 'celebrate' | 'run' | 'dance' | 'sad' | 'angry' | 'scared'
  | 'surprised' | 'think' | 'listen' | 'breatheIn' | 'breatheOut' | 'nod' | 'shake' | 'spin' | 'freeze' | 'talk';

type Props = {
  size?: number; mood?: Mood; action?: Action; nonce?: number; facing?: 1 | -1;
  onDone?: () => void; style?: any; duration?: number;
};

const W = 200, H = 260;
const ND = Platform.OS !== 'web';
const RED = '#D7263D', INK = '#1F1A24';

const deg = (v: Animated.Value) => v.interpolate({ inputRange: [-720, 720], outputRange: ['-720deg', '720deg'] });

// A layer drawn in whole-character coordinates whose box is centred on its pivot,
// so RN's rotate-about-centre becomes rotate-about-joint.
function Part({ k, px, py, s, rot, children, extra = [] as any[] }) {
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: (px - s / 2) * k, top: (py - s / 2) * k, width: s * k, height: s * k,
      transform: [...extra, ...(rot ? [{ rotate: deg(rot) }] : [])] }}>
      <Svg width={s * k} height={s * k} viewBox={`${px - s / 2} ${py - s / 2} ${s} ${s}`}>{children}</Svg>
    </Animated.View>
  );
}

function Keffiyeh({ id }) {
  return (
    <Defs>
      <Pattern id={id} patternUnits="userSpaceOnUse" width="9" height="9">
        <Rect width="9" height="9" fill="#FFF7F2" />
        <Rect x="0" y="0" width="4.5" height="4.5" fill={RED} />
        <Rect x="4.5" y="4.5" width="4.5" height="4.5" fill={RED} opacity="0.35" />
      </Pattern>
    </Defs>
  );
}

function Face({ mood, blink }: { mood: Mood; blink: boolean }) {
  const eyeL = 78, eyeR = 122, ey = 106;
  const closed = blink || mood === 'calm';
  let eyes: React.ReactNode, brows: React.ReactNode = null, mouth: React.ReactNode, extra: React.ReactNode = null;
  const stroke = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, fill: 'none' };
  const roundEyes = (r = 8, pr = 4.6, dx = 1.5, dy = -1.5) => (
    <G>{[eyeL, eyeR].map(x => (
      <G key={x}><Circle cx={x} cy={ey} r={r} fill="#fff" /><Circle cx={x + dx} cy={ey + dy} r={pr} fill={INK} /><Circle cx={x + dx + 1.6} cy={ey + dy - 1.8} r={1.6} fill="#fff" /></G>
    ))}</G>
  );
  if (closed) eyes = <G>{[eyeL, eyeR].map(x => <Path key={x} d={`M${x - 8},${ey} Q${x},${ey + 7} ${x + 8},${ey}`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />)}</G>;
  else if (mood === 'happy' || mood === 'proud') eyes = <G>{[eyeL, eyeR].map(x => <Path key={x} d={`M${x - 8},${ey + 3} Q${x},${ey - 8} ${x + 8},${ey + 3}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />)}</G>;
  else if (mood === 'excited') eyes = roundEyes(10, 6, 0, -1);
  else if (mood === 'scared') eyes = roundEyes(10, 3, 0, 1);
  else if (mood === 'surprised') eyes = roundEyes(10, 4, 0, 0);
  else if (mood === 'sad') eyes = roundEyes(8, 4.6, 0, 2.5);
  else if (mood === 'think') eyes = roundEyes(8, 4.4, -2.5, -3.5);
  else if (mood === 'angry') eyes = <G>{[eyeL, eyeR].map(x => <G key={x}><Path d={`M${x - 8},${ey - 1} L${x + 8},${ey - 1} Q${x + 8},${ey + 8} ${x},${ey + 8} Q${x - 8},${ey + 8} ${x - 8},${ey - 1} Z`} fill="#fff" /><Circle cx={x} cy={ey + 3} r={3.6} fill={INK} /></G>)}</G>;
  else eyes = roundEyes();

  if (mood === 'angry') brows = <G><Path d="M62,84 L90,94" {...stroke} strokeWidth={5} /><Path d="M138,84 L110,94" {...stroke} strokeWidth={5} /></G>;
  if (mood === 'sad' || mood === 'scared') brows = <G><Path d="M64,90 L88,82" {...stroke} /><Path d="M136,90 L112,82" {...stroke} /></G>;
  if (mood === 'surprised' || mood === 'excited') brows = <G><Path d="M66,82 Q77,74 88,82" {...stroke} /><Path d="M112,82 Q123,74 134,82" {...stroke} /></G>;
  if (mood === 'think') brows = <G><Path d="M66,86 Q77,80 88,86" {...stroke} /><Path d="M112,82 L134,86" {...stroke} /></G>;

  const my = 132;
  switch (mood) {
    case 'happy': case 'proud':
      mouth = <G><Path d={`M86,${my - 2} Q100,${my + 16} 114,${my - 2} Z`} fill="#6B1F2A" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" /><Ellipse cx={100} cy={my + 7} rx={6} ry={3.5} fill="#F78DA7" /></G>; break;
    case 'excited':
      mouth = <G><Path d={`M82,${my - 4} Q100,${my + 22} 118,${my - 4} Z`} fill="#6B1F2A" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" /><Ellipse cx={100} cy={my + 10} rx={8} ry={4} fill="#F78DA7" /></G>; break;
    case 'sad': mouth = <Path d={`M88,${my + 8} Q100,${my - 4} 112,${my + 8}`} {...stroke} />; break;
    case 'angry': mouth = <Path d={`M86,${my + 6} Q100,${my - 2} 114,${my + 6}`} {...stroke} strokeWidth={4} />; break;
    case 'scared': mouth = <Path d={`M86,${my + 4} q3.5,-4 7,0 q3.5,4 7,0 q3.5,-4 7,0 q3.5,4 7,0`} {...stroke} />; break;
    case 'surprised': mouth = <Ellipse cx={100} cy={my + 4} rx={7} ry={9} fill="#6B1F2A" stroke={INK} strokeWidth={2.5} />; break;
    case 'think': mouth = <Path d={`M92,${my + 3} L110,${my}`} {...stroke} />; break;
    case 'calm': mouth = <Path d={`M92,${my} Q100,${my + 6} 108,${my}`} {...stroke} />; break;
    default: mouth = <Path d={`M90,${my} Q100,${my + 9} 110,${my}`} {...stroke} />;
  }
  if (mood === 'sad') extra = <Path d="M64,118 q-5,9 0,12 q5,-3 0,-12 Z" fill="#7CC6F2" stroke="#3E8FC0" strokeWidth={1} />;
  if (mood === 'angry') extra = <G><Ellipse cx={66} cy={126} rx={8} ry={5} fill="#FF6B6B" opacity={0.55} /><Ellipse cx={134} cy={126} rx={8} ry={5} fill="#FF6B6B" opacity={0.55} /></G>;
  if (mood === 'happy' || mood === 'excited' || mood === 'proud') extra = <G><Ellipse cx={64} cy={124} rx={7} ry={4.5} fill="#FF9AA8" opacity={0.6} /><Ellipse cx={136} cy={124} rx={7} ry={4.5} fill="#FF9AA8" opacity={0.6} /></G>;
  if (mood === 'scared') extra = <Path d="M150,82 q-4,8 0,10 q4,-2 0,-10 Z" fill="#9AD8F5" />;

  return (
    <G>
      {/* eye patches */}
      <Ellipse cx={eyeL} cy={ey + 1} rx={16} ry={20} fill={INK} transform={`rotate(28 ${eyeL} ${ey})`} />
      <Ellipse cx={eyeR} cy={ey + 1} rx={16} ry={20} fill={INK} transform={`rotate(-28 ${eyeR} ${ey})`} />
      {eyes}{brows}
      <Ellipse cx={100} cy={122} rx={7.5} ry={5.5} fill={INK} />
      {mouth}{extra}
    </G>
  );
}

let uid = 0;
export default function Fareed({ size = 200, mood = 'normal', action = 'idle', nonce = 0, facing = 1, onDone, style, duration = 4000 }: Props) {
  const k = size / W;
  const pid = useRef('kf' + uid++).current;
  const v = useRef({
    x: new Animated.Value(0), y: new Animated.Value(0), rot: new Animated.Value(0), spin: new Animated.Value(0), sq: new Animated.Value(1), sc: new Animated.Value(1),
    armL: new Animated.Value(12), armR: new Animated.Value(-12), legL: new Animated.Value(0), legR: new Animated.Value(0), head: new Animated.Value(0),
  }).current;
  const [blink, setBlink] = useState(false);
  const anim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => { // blink every few seconds
    let t: any; const loop = () => { t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); loop(); }, 2200 + Math.random() * 2500); };
    loop(); return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    anim.current?.stop();
    const T = (val: Animated.Value, to: number, ms: number, ease = Easing.inOut(Easing.quad)) => Animated.timing(val, { toValue: to, duration: ms, easing: ease, useNativeDriver: ND });
    const P = Animated.parallel, S = Animated.sequence, L = (a: Animated.CompositeAnimation) => Animated.loop(a);
    const rest = (ms = 160) => P([T(v.x, 0, ms), T(v.y, 0, ms), T(v.rot, 0, ms), T(v.sq, 1, ms), T(v.sc, 1, ms), T(v.armL, 12, ms), T(v.armR, -12, ms), T(v.legL, 0, ms), T(v.legR, 0, ms), T(v.head, 0, ms)]);
    const hop = (h = 70, armsUp = true) => S([
      P([T(v.sq, 0.84, 120), T(v.y, 6, 120)]),
      P([T(v.y, -h, 300, Easing.out(Easing.quad)), T(v.sq, 1.08, 160), ...(armsUp ? [T(v.armL, 150, 200), T(v.armR, -150, 200)] : []), T(v.legL, 18, 200), T(v.legR, -18, 200)]),
      P([T(v.y, 0, 260, Easing.in(Easing.quad)), T(v.sq, 1, 200), T(v.legL, 0, 200), T(v.legR, 0, 200)]),
      T(v.sq, 0.9, 80), T(v.sq, 1, 120),
    ]);
    let a: Animated.CompositeAnimation, oneShot = true;
    switch (action) {
      case 'wave':
        a = S([P([T(v.armR, -160, 260), T(v.head, 8, 260)]), S([T(v.armR, -125, 200), T(v.armR, -165, 200), T(v.armR, -125, 200), T(v.armR, -165, 200), T(v.armR, -130, 200)]), rest(260)]); break;
      case 'jump': a = S([hop(), rest(200)]); break;
      case 'celebrate':
        a = S([hop(60), P([hop(90), S([T(v.spin, 360, 560, Easing.inOut(Easing.cubic)), T(v.spin, 0, 0)])]),
          P([T(v.armL, 160, 150), T(v.armR, -160, 150)]),
          S([T(v.armL, 120, 150), T(v.armL, 160, 150), T(v.armL, 120, 150), T(v.armL, 160, 150)]), rest(260)]); break;
      case 'spin': a = S([P([T(v.spin, 360, 700, Easing.inOut(Easing.cubic)), T(v.armL, 100, 300), T(v.armR, -100, 300)]), T(v.spin, 0, 0), rest()]); break;
      case 'surprised': a = S([P([T(v.y, -30, 160, Easing.out(Easing.quad)), T(v.armL, 95, 160), T(v.armR, -95, 160), T(v.sq, 1.06, 160)]), T(v.y, 0, 200), Animated.delay(500), rest(300)]); break;
      case 'nod': a = S([T(v.head, 0, 0), T(v.y, 4, 160), T(v.y, 0, 160), T(v.y, 4, 160), T(v.y, 0, 160)]); break;
      case 'shake': a = S([T(v.head, -12, 120), T(v.head, 12, 160), T(v.head, -12, 160), T(v.head, 0, 120)]); break;
      default: oneShot = false;
    }
    if (!oneShot) {
      switch (action) {
        case 'run':
          a = P([
            L(S([P([T(v.legL, 40, 170), T(v.legR, -40, 170), T(v.armL, -35, 170), T(v.armR, 35, 170), T(v.y, -8, 85)]),
                 P([T(v.legL, -40, 170), T(v.legR, 40, 170), T(v.armL, 45, 170), T(v.armR, -45, 170), T(v.y, 0, 85)])])),
            T(v.rot, 7, 200),
          ]); break;
        case 'dance':
          a = L(S([P([T(v.rot, -10, 300), T(v.armL, 150, 300), T(v.armR, -40, 300), T(v.y, -10, 150), T(v.legL, 15, 300), T(v.head, -8, 300)]),
                   P([T(v.rot, 10, 300), T(v.armL, 40, 300), T(v.armR, -150, 300), T(v.y, 0, 150), T(v.legL, 0, 300), T(v.legR, -15, 300), T(v.head, 8, 300)]),
                   T(v.legR, 0, 1)])); break;
        case 'sad':
          a = P([T(v.armL, 4, 500), T(v.armR, -4, 500), T(v.sq, 0.95, 500), T(v.y, 6, 500), L(S([T(v.head, 6, 1400), T(v.head, -3, 1400)]))]); break;
        case 'angry':
          a = L(S([P([T(v.legL, 25, 140), T(v.y, -6, 140), T(v.armL, -25, 140), T(v.armR, 25, 140), T(v.x, -3, 70)]), P([T(v.legL, 0, 120), T(v.y, 0, 120), T(v.x, 3, 60)]),
                   P([T(v.legR, -25, 140), T(v.y, -6, 140), T(v.x, -3, 70)]), P([T(v.legR, 0, 120), T(v.y, 0, 120), T(v.x, 0, 60)])])); break;
        case 'scared':
          a = P([T(v.armL, -150, 250), T(v.armR, 150, 250), T(v.sq, 0.92, 250), L(S([T(v.x, -3, 50), T(v.x, 3, 50)]))]); break;
        case 'think':
          a = P([T(v.armR, 150, 400), T(v.armL, 20, 400), L(S([T(v.head, -10, 1200), T(v.head, -4, 1200)]))]); break;
        case 'listen':
          a = P([T(v.armL, 155, 400), T(v.head, -10, 400), L(S([T(v.y, -3, 900), T(v.y, 0, 900)]))]); break;
        case 'breatheIn':
          a = P([T(v.sc, 1.12, duration, Easing.inOut(Easing.sin)), T(v.armL, 60, duration), T(v.armR, -60, duration), T(v.y, -14, duration)]); break;
        case 'breatheOut':
          a = P([T(v.sc, 1, duration, Easing.inOut(Easing.sin)), T(v.armL, 12, duration), T(v.armR, -12, duration), T(v.y, 0, duration)]); break;
        case 'talk':
          a = L(S([P([T(v.head, 6, 260), T(v.armR, -60, 260), T(v.y, -3, 260)]), P([T(v.head, -4, 260), T(v.armR, -25, 260), T(v.y, 0, 260)]),
                   P([T(v.head, 3, 220), T(v.armL, 40, 220)]), P([T(v.head, -2, 220), T(v.armL, 12, 220)])])); break;
        case 'freeze': a = Animated.delay(10); break; // hold the current pose
        default: // idle: gentle breathing bob
          a = S([rest(200), L(S([P([T(v.y, -4, 900), T(v.armL, 18, 900), T(v.armR, -18, 900), T(v.head, 3, 900)]),
                                 P([T(v.y, 0, 900), T(v.armL, 10, 900), T(v.armR, -10, 900), T(v.head, -2, 900)])]))]);
      }
    }
    anim.current = a;
    a.start(({ finished }) => { if (finished && oneShot) onDone?.(); });
    return () => a.stop();
  }, [action, nonce]);

  const s = { k };
  return (
    <View style={[{ width: W * k, height: H * k }, style]} pointerEvents="none">
      {/* ground shadow */}
      <Animated.View style={{ position: 'absolute', left: 50 * k, top: 246 * k, width: 100 * k, height: 12 * k, borderRadius: 50 * k, backgroundColor: 'rgba(40,20,80,0.18)',
        transform: [{ scaleX: v.y.interpolate({ inputRange: [-100, 0, 10], outputRange: [0.45, 1, 1.05] }) }] }} />
      <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: W * k, height: H * k,
        transform: [{ translateX: Animated.multiply(v.x, k) }, { translateY: Animated.multiply(v.y, k) }, { scaleX: facing }, { rotate: deg(v.spin) },
          { translateY: (H * k) / 2 }, { rotate: deg(v.rot) }, { scaleY: v.sq }, { scale: v.sc }, { translateY: -(H * k) / 2 }] }}>
        {/* backpack */}
        <Part {...s} px={100} py={180} s={170} rot={null}>
          <Rect x={124} y={148} width={40} height={58} rx={12} fill="#A0562C" stroke="#5A2D12" strokeWidth={3} />
          <Rect x={130} y={176} width={28} height={20} rx={6} fill="#C06F3B" stroke="#5A2D12" strokeWidth={2} />
        </Part>
        {/* legs */}
        <Part {...s} px={84} py={210} s={100} rot={v.legL}>
          <Rect x={70} y={198} width={28} height={46} rx={14} fill={INK} />
          <Ellipse cx={84} cy={240} rx={9} ry={5} fill="#4A4350" />
        </Part>
        <Part {...s} px={116} py={210} s={100} rot={v.legR}>
          <Rect x={102} y={198} width={28} height={46} rx={14} fill={INK} />
          <Ellipse cx={116} cy={240} rx={9} ry={5} fill="#4A4350" />
        </Part>
        {/* body */}
        <Part {...s} px={100} py={190} s={140} rot={null}>
          <Ellipse cx={100} cy={188} rx={44} ry={44} fill={INK} />
          <Ellipse cx={100} cy={196} rx={34} ry={34} fill="#fff" />
          <Path d="M124,152 Q118,180 128,206" stroke="#7A3E1C" strokeWidth={6} fill="none" strokeLinecap="round" />
        </Part>
        {/* head (pivots at the neck) */}
        <Part {...s} px={100} py={150} s={300} rot={v.head}>
          <Keffiyeh id={pid} />
          {/* keffiyeh drape behind the head */}
          <Path d="M40,92 C30,130 30,160 40,176 L66,160 C58,140 56,120 58,104 Z" fill={`url(#${pid})`} stroke={INK} strokeWidth={2.5} />
          <Path d="M160,92 C170,130 172,162 160,180 L134,160 C142,140 144,120 142,104 Z" fill={`url(#${pid})`} stroke={INK} strokeWidth={2.5} />
          <Ellipse cx={100} cy={100} rx={62} ry={54} fill="#fff" stroke={INK} strokeWidth={3} />
          {/* keffiyeh cap + agal */}
          <Path d="M36,104 C30,46 68,22 100,22 C132,22 170,46 164,104 C152,82 132,70 100,70 C68,70 48,82 36,104 Z" fill={`url(#${pid})`} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M42,62 C66,44 134,44 158,62" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M40,74 C64,56 136,56 160,74" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Face mood={mood} blink={blink} />
        </Part>
        {/* arms (pivot at the shoulders) */}
        <Part {...s} px={64} py={160} s={110} rot={v.armL}>
          <Rect x={52} y={152} width={24} height={50} rx={12} fill={INK} />
        </Part>
        <Part {...s} px={136} py={160} s={110} rot={v.armR}>
          <Rect x={124} y={152} width={24} height={50} rx={12} fill={INK} />
        </Part>
      </Animated.View>
    </View>
  );
}
