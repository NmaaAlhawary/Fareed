// Aqaba — Kindness Reef: swim Fareed to collect kind actions (bubbles) and dodge unkind ones (jellyfish).
// Skill: recognising prosocial vs. hurtful behaviour (social awareness, relationship skills).
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Fareed from '../components/Fareed';
import { C, Icon, Txt } from '../components/ui';
import { T2 } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, clamp, rnd, useForce, useLoop } from './kit';

const H = 480, FS = 74, GAME = 60;
const KIND: { t: T2; i: string }[] = [
  { t: ['Share', 'شارك'], i: 'hand-heart' }, { t: ['Help', 'ساعد'], i: 'handshake' }, { t: ['Say thanks', 'قول شكرًا'], i: 'emoticon-happy' },
  { t: ['Include', 'ادمج غيرك'], i: 'account-multiple-plus' }, { t: ['Listen', 'اسمع'], i: 'ear-hearing' }, { t: ['Say sorry', 'اعتذر'], i: 'heart' },
  { t: ['Take turns', 'خذ دورك'], i: 'swap-horizontal' }, { t: ['Encourage', 'شجّع'], i: 'thumb-up' },
];
const UNKIND: T2[] = [['Tease', 'تمسخر'], ['Push', 'دفش'], ['Leave out', 'استبعد'], ['Grab', 'خطف'], ['Shout at', 'صرخ على'], ['Cheat', 'غش']];
type Obj = { id: number; x: number; y: number; v: number; ph: number; kind: boolean; k: number; got?: boolean };

export default function ReefDive({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [W, setW] = useState(340);
  const [phase, setPhase] = useState<Phase>('ready');
  const force = useForce();
  const g = useRef<any>(null);

  const newGame = () => {
    g.current = { t: 0, x: W / 2, y: H / 2, tx: W / 2, ty: H / 2, face: 1, objs: [] as Obj[], spawn: 0, kind: 0, hearts: 3, inv: 0, id: 0, pops: [] as Pop[], words: [] as string[] };
    setPhase('play');
  };
  useLoop(phase === 'play', dt => {
    const st = g.current;
    st.t += dt;
    const dx = st.tx - st.x, dy = st.ty - st.y;
    st.x += dx * Math.min(1, dt * 4); st.y += dy * Math.min(1, dt * 4);
    if (Math.abs(dx) > 3) st.face = dx > 0 ? 1 : -1;
    st.inv = Math.max(0, st.inv - dt);
    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = Math.max(0.55, 1.1 - st.t * 0.008);
      const kind = Math.random() < 0.6;
      st.objs.push({ id: st.id++, x: rnd(30, W - 30), y: H + 40, v: rnd(55, 85) + st.t * 0.8, ph: rnd(0, 6), kind, k: Math.floor(Math.random() * (kind ? KIND.length : UNKIND.length)) });
    }
    for (const o of st.objs) {
      o.y -= o.v * dt;
      const ox = o.x + Math.sin(st.t * 1.6 + o.ph) * 14;
      if (Math.abs(ox - st.x) < 42 && Math.abs(o.y - (st.y - 30)) < 46) {
        if (o.kind) { o.got = true; st.kind++; play('ok', 0.5); buzz(); st.pops.push({ id: st.id++, x: ox, y: o.y, text: tr(KIND[o.k].t) + ' +1', color: C.green, t: 0 }); }
        else if (!st.inv) { o.got = true; st.hearts--; st.inv = 1.2; play('oops'); buzz('bad'); st.pops.push({ id: st.id++, x: ox, y: o.y, text: tr(UNKIND[o.k]), color: '#A783E0', t: 0 }); }
      }
    }
    st.objs = st.objs.filter((o: Obj) => o.y > -60 && !o.got);
    st.pops = agePops(st.pops, dt);
    if (st.hearts <= 0 || st.t >= GAME) { setPhase('over'); onFinish(Math.max(1, Math.min(5, Math.round(st.kind / 5))), `${st.kind}`); }
    force();
  });
  const steer = (e: any) => { if (g.current) { g.current.tx = clamp(e.nativeEvent.locationX, 30, W - 30); g.current.ty = clamp(e.nativeEvent.locationY + 30, 90, H - 10); } };

  const s = g.current;
  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={s.kind} hearts={s.hearts} time={GAME - s.t} /> : null}
      <View onLayout={e => setW(Math.round(e.nativeEvent.layout.width))} style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#1E88B5' }}
        onStartShouldSetResponder={() => phase === 'play'} onMoveShouldSetResponder={() => phase === 'play'} onResponderGrant={steer} onResponderMove={steer}>
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 140, backgroundColor: '#3FB4D8' }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 140, height: 160, backgroundColor: '#2A9FCB' }} />
        {/* coral */}
        <Svg pointerEvents="none" width={W} height={110} style={{ position: 'absolute', bottom: 0 }}>
          <Path d={`M0,110 L0,70 Q20,40 40,70 Q55,30 70,72 L90,110 Z`} fill="#F07F86" />
          <Path d={`M${W - 120},110 Q${W - 110},40 ${W - 90},60 Q${W - 80},20 ${W - 60},58 Q${W - 40},30 ${W - 30},70 L${W},110 Z`} fill="#FFB25B" />
          <Path d={`M${W / 2 - 40},110 Q${W / 2 - 30},70 ${W / 2},80 Q${W / 2 + 30},60 ${W / 2 + 40},110 Z`} fill="#B57EDC" />
          <Circle cx={W * 0.3} cy={100} r={14} fill="#F4DFA8" /><Circle cx={W * 0.7} cy={104} r={10} fill="#F4DFA8" />
        </Svg>
        {s?.objs.map((o: Obj) => {
          const ox = o.x + Math.sin(s.t * 1.6 + o.ph) * 14;
          return o.kind ? (
            <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: ox - 36, top: o.y - 30, width: 72, alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={KIND[o.k].i} size={24} color="#fff" />
              </View>
              <Txt w={8} size={11} color="#fff" center>{tr(KIND[o.k].t)}</Txt>
            </View>
          ) : (
            <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: ox - 36, top: o.y - 30, width: 72, alignItems: 'center' }}>
              <Svg width={46} height={50} viewBox="0 0 46 50">
                <Path d="M3,24 C3,6 43,6 43,24 Z" fill="#B47BE8" stroke="#7A3FB8" strokeWidth={2} />
                {[8, 16, 24, 32, 40].map(x => <Path key={x} d={`M${x},24 q-4,8 0,13 q4,5 0,12`} stroke="#B47BE8" strokeWidth={2.5} fill="none" />)}
                <Circle cx={16} cy={17} r={2} fill="#3B1C5A" /><Circle cx={30} cy={17} r={2} fill="#3B1C5A" />
              </Svg>
              <Txt w={8} size={11} color="#F3E5FF" center>{tr(UNKIND[o.k])}</Txt>
            </View>
          );
        })}
        <View pointerEvents="none" style={{ position: 'absolute', left: (s ? s.x : W / 2) - FS / 2, top: (s ? s.y : H / 2) - FS * 1.3 + 10, transform: [{ rotate: s ? `${(s.face * 12)}deg` : '0deg' }], opacity: s && s.inv > 0 && Math.floor(s.inv * 10) % 2 ? 0.4 : 1 }}>
          <Fareed size={FS} action={phase === 'play' ? 'run' : 'idle'} facing={s?.face || 1} mood="happy" />
        </View>
        {s ? <Pops pops={s.pops} /> : null}
        <Overlay phase={phase} onStart={newGame}
          skill={tr(['Social awareness · Relationship skills', 'الوعي الاجتماعي · مهارات العلاقات'])}
          goal={tr(['Collect kind actions, swim away from unkind ones!', 'اجمع الأفعال اللطيفة، وابعد عن غير اللطيفة!'])}
          how={tr(['Drag your finger to swim. Bubbles = kind. Jellyfish = unkind (they sting!).', 'حرّك إصبعك لتسبح. الفقاعات = لطف. قناديل البحر = تصرّف مؤذي (بتلسع!).'])}
          result={s ? <Txt w={8} size={18} center>{tr(['Kind actions collected', 'أفعال لطيفة جمعتها'])}: {s.kind}</Txt> : null} />
      </View>
    </View>
  );
}
