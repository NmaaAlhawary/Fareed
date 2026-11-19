// Dead Sea — Balloon Float: hold = breathe in (Fareed rises), let go = breathe out (he floats down).
// The stars follow a slow 5-second-in / 5-second-out wave (about 6 breaths a minute), so collecting them trains paced breathing.
// Skill: calming the body (self-management).
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Fareed from '../components/Fareed';
import { C, Icon, Txt } from '../components/ui';
import { useStore } from '../lib/store';
import { play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, clamp, useForce, useLoop } from './kit';

const H = 470, PERIOD = 10, SPEED = 70, GAME = 70, FX = 90, FS = 92;
type Star = { id: number; x: number; y: number; got: boolean };

export default function BreathFloat({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [W, setW] = useState(340);
  const [phase, setPhase] = useState<Phase>('ready');
  const force = useForce();
  const g = useRef<any>(null);
  const MID = H * 0.55, AMP = H * 0.27;
  // y of the breathing guide at time t (top = full breath in)
  const guide = (t: number) => MID + AMP * Math.cos((2 * Math.PI * t) / PERIOD);

  const newGame = () => {
    g.current = { t: 0, y: MID + AMP, vy: 0, hold: false, stars: [] as Star[], spawn: 0, got: 0, total: 0, id: 0, pops: [] as Pop[], wasHold: false };
    setPhase('play');
  };
  useLoop(phase === 'play', dt => {
    const st = g.current;
    st.t += dt;
    // physics: holding lifts, releasing sinks gently
    const target = st.hold ? -75 : 60;
    st.vy += (target - st.vy) * Math.min(1, dt * 3);
    st.y = clamp(st.y + st.vy * dt, 90, H - 70);
    if (st.hold !== st.wasHold) { st.wasHold = st.hold; play(st.hold ? 'breathe_in' : 'breathe_out', 0.35); }
    // stars spawn at the right edge, placed so they meet Fareed exactly on the breathing wave
    st.spawn -= dt;
    if (st.spawn <= 0 && st.t < GAME - (W - FX) / SPEED) {
      st.spawn = 0.5;
      const arrive = st.t + (W - FX) / SPEED;
      st.stars.push({ id: st.id++, x: W + 10, y: guide(arrive), got: false }); st.total++;
    }
    for (const s of st.stars) {
      s.x -= SPEED * dt;
      if (!s.got && Math.abs(s.x - FX) < 30 && Math.abs(s.y - (st.y - 40)) < 46) {
        s.got = true; st.got++; play('pop', 0.25);
        st.pops.push({ id: st.id++, x: s.x, y: s.y, text: '+1', color: C.green, t: 0 });
      }
    }
    st.stars = st.stars.filter((s: Star) => s.x > -20 && !s.got);
    st.pops = agePops(st.pops, dt);
    if (st.t >= GAME) {
      setPhase('over');
      const ratio = st.total ? st.got / st.total : 0;
      onFinish(Math.max(1, Math.round(ratio * 5)), `${Math.round(ratio * 100)}%`);
    }
    force();
  });

  const s = g.current;
  const rising = s ? Math.sin((2 * Math.PI * (s.t + (W - FX) / SPEED * 0)) / PERIOD) > 0 : true;
  const cue = s ? (rising ? tr(['Breathe in… (hold)', 'شهيق… (اضغط)']) : tr(['Breathe out… (let go)', 'زفير… (اترك)'])) : '';
  const balloon = s ? clamp(1.25 - (s.y - 90) / (H - 160) * 0.7, 0.55, 1.25) : 0.8;
  // dotted guide ahead of Fareed
  let d = '';
  if (s) for (let x = FX; x <= W; x += 12) { const t = s.t + (x - FX) / SPEED; d += `${x === FX ? 'M' : 'L'}${x},${guide(t) - 40} `; }

  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={s.got} time={GAME - s.t} label={<Txt w={8} size={15} color="#1B7D8F">{cue}</Txt>} /> : null}
      <View onLayout={e => setW(Math.round(e.nativeEvent.layout.width))} style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FFC9A8' }}
        onStartShouldSetResponder={() => phase === 'play'} onResponderGrant={() => { if (g.current) g.current.hold = true; }}
        onResponderRelease={() => { if (g.current) g.current.hold = false; }} onResponderTerminate={() => { if (g.current) g.current.hold = false; }}>
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: H * 0.45, backgroundColor: '#FFD9B8' }} />
        <View pointerEvents="none" style={{ position: 'absolute', right: 40, top: 40, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF1C1' }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: H * 0.45, bottom: 0, backgroundColor: '#5FC9D3' }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: H * 0.75, bottom: 0, backgroundColor: '#3FAFC2' }} />
        <Svg pointerEvents="none" width={W} height={H} style={{ position: 'absolute' }}>
          {d ? <Path d={d} stroke="#fff" strokeWidth={3} strokeDasharray="4 8" fill="none" opacity={0.8} /> : null}
          {s?.stars.map((st: Star) => <Circle key={st.id} cx={st.x} cy={st.y - 40} r={11} fill="#FFD23F" stroke="#E8A400" strokeWidth={2} />)}
        </Svg>
        {/* Fareed + balloon */}
        <View pointerEvents="none" style={{ position: 'absolute', left: FX - FS / 2, top: (s ? s.y : MID + AMP) - FS * 1.3 + 20 }}>
          <View style={{ position: 'absolute', left: FS * 0.62, top: -70 * balloon, transform: [{ scale: balloon }] }}>
            <Svg width={60} height={90} viewBox="0 0 60 90">
              <Path d="M30,4 C52,4 58,28 50,46 C44,60 36,64 30,66 C24,64 16,60 10,46 C2,28 8,4 30,4 Z" fill="#FF8FA3" stroke="#C2405B" strokeWidth={3} />
              <Path d="M30,66 Q24,78 34,90" stroke="#555" strokeWidth={2} fill="none" />
            </Svg>
          </View>
          <Fareed size={FS} mood="calm" action={s?.hold ? 'breatheIn' : 'breatheOut'} duration={1500} />
        </View>
        {s ? <Pops pops={s.pops} /> : null}
        {s && phase === 'play' ? (
          <View pointerEvents="none" style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 999, paddingHorizontal: 12 }}>
            <Icon name={s.hold ? 'arrow-up-bold' : 'arrow-down-bold'} color="#1B7D8F" size={18} />
            <Txt w={7} size={13} color="#1B7D8F">{s.hold ? tr(['Holding = breathing in', 'ضاغط = شهيق']) : tr(['Let go = breathing out', 'تارك = زفير'])}</Txt>
          </View>
        ) : null}
        <Overlay phase={phase} onStart={newGame} mood="calm" action="breatheIn"
          skill={tr(['Self-management · calming my body', 'إدارة الذات · تهدئة جسمي'])}
          goal={tr(['Breathe slowly with Fareed and collect the stars.', 'تنفّس ببطء مع فريد واجمع النجوم.'])}
          how={tr(['Press and hold while you breathe IN through your nose (Fareed rises). Let go while you breathe OUT slowly (he floats down). Follow the dotted wave.', 'اضغط وأنت بتاخذ شهيق من أنفك (فريد بيطلع). اترك وأنت بتطلّع زفير ببطء (بينزل). امشِ مع الموجة المنقّطة.'])}
          result={s ? <Txt w={8} size={18} center>{tr(['Stars collected', 'نجوم جمعتها'])}: {s.got} / {s.total}</Txt> : null} />
      </View>
    </View>
  );
}
