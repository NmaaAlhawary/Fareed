// Amman — Feelings Catch: read a situation, then move Fareed to catch only the matching feeling.
// Skill: identifying emotions in others' situations (self- & social awareness).
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Fareed, { Action } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { C, Icon, Txt, Row } from '../components/ui';
import { FEELINGS, SCENARIOS, feeling } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, clamp, rnd, useForce, useLoop } from './kit';

const H = 470, FS = 84, ITEM = 50, GAME_TIME = 60, PER_ROUND = 4;
type Item = { id: number; x: number; y: number; f: string; v: number };

export default function FeelingsCatch({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [W, setW] = useState(340);
  const [phase, setPhase] = useState<Phase>('ready');
  const [act, setAct] = useState<Action>('idle');
  const [n, setN] = useState(0);
  const force = useForce();
  const g = useRef<any>(null);
  const lock = useRef(false);

  const newGame = () => {
    const order = [...SCENARIOS].sort(() => Math.random() - 0.5);
    g.current = { x: W / 2, tx: W / 2, items: [] as Item[], score: 0, hearts: 3, time: GAME_TIME, spawn: 0, order, round: 0, inRound: 0, id: 0, pops: [] as Pop[], face: 1, moving: false, right: 0, wrong: 0 };
    setPhase('play'); setAct('idle');
  };
  const s = g.current;
  const target = s ? s.order[s.round % s.order.length] : SCENARIOS[0];

  useLoop(phase === 'play', dt => {
    const st = g.current;
    st.time -= dt;
    // spawn: ~45% the target feeling, the rest distractors
    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = Math.max(0.5, 1.0 - st.score * 0.025);
      const tgt = st.order[st.round % st.order.length].a;
      const f = Math.random() < 0.45 ? tgt : FEELINGS.filter(x => x.id !== tgt)[Math.floor(Math.random() * 5)].id;
      st.items.push({ id: st.id++, x: rnd(ITEM / 2, W - ITEM / 2), y: -ITEM, f, v: 110 + st.score * 5 + rnd(0, 40) });
    }
    // move Fareed toward the finger
    const dx = clamp(st.tx - st.x, -460 * dt, 460 * dt);
    st.x += dx;
    const moving = Math.abs(st.tx - st.x) > 4;
    if (Math.abs(dx) > 0.5) st.face = dx > 0 ? 1 : -1;
    if (moving !== st.moving && !lock.current) { st.moving = moving; setAct(moving ? 'run' : 'idle'); }
    // fall + catch
    const catchY = H - FS * 1.3 * 0.62;
    const tgt = st.order[st.round % st.order.length].a;
    st.items = st.items.filter((it: Item) => {
      it.y += it.v * dt;
      if (it.y > catchY - ITEM && it.y < catchY + 20 && Math.abs(it.x - st.x) < FS * 0.55) {
        if (it.f === tgt) {
          st.score++; st.inRound++; st.right++; play('ok', 0.6); buzz();
          st.pops.push({ id: st.id++, x: it.x, y: it.y, text: '+1', color: C.green, t: 0 });
          lock.current = true; setAct('jump'); setN(k => k + 1);
          if (st.inRound >= PER_ROUND) { st.round++; st.inRound = 0; st.items = []; play('celebrate', 0.5); }
        } else {
          st.hearts--; st.wrong++; play('oops'); buzz('bad');
          st.pops.push({ id: st.id++, x: it.x, y: it.y, text: tr(feeling(it.f).n), color: '#F0544F', t: 0 });
          lock.current = true; setAct('shake'); setN(k => k + 1);
        }
        return false;
      }
      return it.y < H + ITEM;
    });
    st.pops = agePops(st.pops, dt);
    if (st.time <= 0 || st.hearts <= 0) {
      setPhase('over');
      onFinish(Math.max(1, Math.round(st.score / 4)), `${st.score} ✓`);
    }
    force();
  });

  const toFinger = (e: any) => { if (g.current) g.current.tx = clamp(e.nativeEvent.locationX, FS / 2, W - FS / 2); };

  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={s.score} hearts={s.hearts} time={s.time} /> : null}
      <View onLayout={e => setW(Math.round(e.nativeEvent.layout.width))}
        style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FFE3EA' }}
        onStartShouldSetResponder={() => phase === 'play'} onMoveShouldSetResponder={() => phase === 'play'}
        onResponderGrant={toFinger} onResponderMove={toFinger}>
        {/* city skyline */}
        <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, flexDirection: 'row', alignItems: 'flex-end', opacity: 0.25 }}>
          {[60, 90, 50, 110, 70, 95, 55, 80].map((h, i) => <View key={i} style={{ flex: 1, height: h, backgroundColor: '#B34A6A', marginHorizontal: 2, borderTopLeftRadius: i % 3 === 0 ? 20 : 2, borderTopRightRadius: i % 3 === 0 ? 20 : 2 }} />)}
        </View>
        {/* the situation to read */}
        {s ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: 8, left: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 8, zIndex: 5 }}>
            <Row gap={8}>
              <Icon name="help-circle" size={34} color="#F25C78" />
              <View style={{ flex: 1 }}>
                <Txt w={7} size={14}>{tr(target.t)}</Txt>
                <Txt w={6} size={12} color={C.muted}>{tr(['Catch how they feel!', 'امسك شعورهم!'])} {s.inRound}/{PER_ROUND}</Txt>
              </View>
            </Row>
          </View>
        ) : null}
        {s?.items.map((it: Item) => (
          <View key={it.id} pointerEvents="none" style={{ position: 'absolute', left: it.x - ITEM / 2, top: it.y }}><MoodFace id={it.f} size={ITEM} /></View>
        ))}
        <View pointerEvents="none" style={{ position: 'absolute', left: (s ? s.x : W / 2) - FS / 2, top: H - FS * 1.3 - 4 }}>
          <Fareed size={FS} action={act} nonce={n} facing={s?.face || 1} mood={act === 'shake' ? 'surprised' : 'excited'} onDone={() => { lock.current = false; if (g.current) g.current.moving = false; setAct('idle'); }} />
        </View>
        {s ? <Pops pops={s.pops} /> : null}
        <Overlay phase={phase} onStart={newGame}
          skill={tr(['Self-awareness · Social awareness', 'الوعي بالذات · الوعي الاجتماعي'])}
          goal={tr(['Read the situation. Catch the feeling that fits!', 'اقرأ الموقف. امسك الشعور المناسب!'])}
          how={tr(['Drag your finger to move Fareed. Wrong feelings cost a heart.', 'حرّك إصبعك ليتحرّك فريد. الشعور الغلط بيكلّفك قلب.'])}
          result={s ? <Txt w={8} size={20} center>{tr(['You caught', 'مسكت'])} {s.right} {tr(['feelings!', 'شعور!'])}</Txt> : null} />
      </View>
    </View>
  );
}
