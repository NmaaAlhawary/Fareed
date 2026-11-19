// Jerash — Beat Theatre: a 4-lane rhythm game. Hitting notes on time plays the melody and lifts Fareed's mood.
// Skill: attention, timing & inhibitory control (self-management / executive function).
import React, { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Fareed, { Action, Mood } from '../components/Fareed';
import { C, Icon, Row, Txt } from '../components/ui';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, useForce, useLoop } from './kit';

const H = 470, HIT = H - 70, TRAVEL = 1.9, WIN = 0.2, PERFECT = 0.08;
const LANES = [{ c: '#FFC93C', i: 'star' }, { c: '#5CC8A8', i: 'bell-ring' }, { c: '#F25C78', i: 'heart' }, { c: '#7B5CE0', i: 'music-note' }];
// An original 4-phrase tune (lane = pitch), with rests (-1). Beat = 0.42s.
const TUNE = [0, 1, 2, -1, 2, 1, 0, -1, 0, 2, 3, -1, 3, 2, 1, -1, 1, 1, 2, 3, 2, 1, 0, -1, 0, 1, 2, 3, 3, 2, 1, 0, 2, -1, 2, 3, 1, -1, 1, 2, 0, 1, 2, 3, 2, 1, 0, -1];
const BEAT = 0.42;
type Note = { id: number; lane: number; t: number; hit: boolean; miss: boolean };

export default function BeatRun({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [W, setW] = useState(340);
  const [phase, setPhase] = useState<Phase>('ready');
  const [act, setAct] = useState<Action>('idle');
  const [n, setN] = useState(0);
  const force = useForce();
  const g = useRef<any>(null);
  const flash = useRef([0, 0, 0, 0]);

  const newGame = () => {
    let id = 0;
    const notes: Note[] = [];
    TUNE.forEach((lane, i) => { if (lane >= 0) notes.push({ id: id++, lane, t: 2.2 + i * BEAT, hit: false, miss: false }); });
    g.current = { t: 0, notes, score: 0, combo: 0, best: 0, mood: 50, perfect: 0, good: 0, missed: 0, pops: [] as Pop[], id: 1000, end: 2.2 + TUNE.length * BEAT + 1.2 };
    setPhase('play'); setAct('idle');
  };
  const moodOf = (m: number): Mood => (m < 25 ? 'sad' : m < 50 ? 'normal' : m < 80 ? 'happy' : 'excited');

  useLoop(phase === 'play', dt => {
    const st = g.current;
    st.t += dt;
    for (let k = 0; k < 4; k++) flash.current[k] = Math.max(0, flash.current[k] - dt * 4);
    for (const nt of st.notes) {
      if (!nt.hit && !nt.miss && st.t - nt.t > WIN) {
        nt.miss = true; st.combo = 0; st.missed++; st.mood = Math.max(0, st.mood - 7);
        st.pops.push({ id: st.id++, x: (nt.lane + 0.5) * (W / 4), y: HIT, text: tr(['Miss', 'فاتت']), color: '#999', t: 0 });
        if (st.mood < 25) setAct('sad');
      }
    }
    st.pops = agePops(st.pops, dt);
    if (st.t > st.end) {
      setPhase('over');
      const total = st.perfect + st.good + st.missed;
      const acc = total ? (st.perfect + st.good * 0.6) / total : 0;
      onFinish(Math.max(1, Math.round(acc * 5)), `${Math.round(acc * 100)}%`);
    }
    force();
  });

  const tap = (lane: number) => {
    const st = g.current;
    play('pad' + lane, 0.9); flash.current[lane] = 1;
    if (!st || phase !== 'play') return;
    let best: Note | null = null;
    for (const nt of st.notes) if (nt.lane === lane && !nt.hit && !nt.miss && Math.abs(nt.t - st.t) < WIN && (!best || Math.abs(nt.t - st.t) < Math.abs(best.t - st.t))) best = nt;
    if (!best) return;
    best.hit = true; buzz();
    const perfect = Math.abs(best.t - st.t) < PERFECT;
    st.combo++; st.best = Math.max(st.best, st.combo);
    st.score += perfect ? 3 : 1; perfect ? st.perfect++ : st.good++;
    st.mood = Math.min(100, st.mood + (perfect ? 6 : 3));
    st.pops.push({ id: st.id++, x: (lane + 0.5) * (W / 4), y: HIT - 30, text: perfect ? tr(['Perfect!', 'ممتاز!']) : tr(['Good', 'حلو']), color: perfect ? C.purple : C.green, t: 0 });
    if (st.combo === 4 || st.combo % 10 === 0) { setAct('dance'); setN(k => k + 1); }
    else if (st.mood >= 25 && act === 'sad') setAct('idle');
  };

  const s = g.current;
  const laneW = W / 4;
  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={s.score} label={<Row gap={4}><Icon name="fire" color="#FF7A00" /><Txt w={8}>{s.combo}</Txt></Row>} /> : null}
      <View onLayout={e => setW(Math.round(e.nativeEvent.layout.width))} style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#2A1E4F' }}>
        {/* Jerash columns */}
        <Row gap={0} style={{ position: 'absolute', left: 0, right: 0, top: 30, justifyContent: 'space-around', opacity: 0.18 }}>
          {[...Array(6)].map((_, i) => <View key={i} style={{ width: 16, height: 240, backgroundColor: '#F4DFA8', borderRadius: 3 }} />)}
        </Row>
        {/* Fareed's mood meter + Fareed */}
        {s ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: 8, left: 8, right: 8, alignItems: 'center', zIndex: 3 }}>
            <Txt w={7} size={12} color="#fff">{tr(['Make Fareed happy with your music!', 'فرّح فريد بموسيقاك!'])}</Txt>
            <View style={{ width: '70%', height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <View style={{ width: `${s.mood}%`, height: '100%', backgroundColor: s.mood < 25 ? '#6F9BE8' : s.mood < 80 ? '#FFC93C' : '#FF7A00' }} />
            </View>
          </View>
        ) : null}
        <View pointerEvents="none" style={{ position: 'absolute', top: 44, alignSelf: 'center', zIndex: 2 }}>
          <Fareed size={78} mood={s ? moodOf(s.mood) : 'happy'} action={act} nonce={n} onDone={() => setAct('idle')} />
        </View>
        {/* lanes */}
        {LANES.map((l, k) => (
          <Pressable key={k} onPressIn={() => tap(k)} style={{ position: 'absolute', left: k * laneW, width: laneW, top: 0, bottom: 0, borderLeftWidth: k ? 1 : 0, borderColor: 'rgba(255,255,255,0.08)' }}>
            <View style={{ position: 'absolute', left: laneW / 2 - 30, top: HIT - 30, width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: l.c,
              backgroundColor: flash.current[k] > 0 ? l.c : 'rgba(255,255,255,0.06)', opacity: 0.5 + flash.current[k] * 0.5, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={l.i} color="#fff" size={26} />
            </View>
          </Pressable>
        ))}
        {/* notes */}
        {s?.notes.filter((nt: Note) => !nt.hit && !nt.miss && nt.t - s.t < TRAVEL + 0.2).map((nt: Note) => {
          const y = HIT - ((nt.t - s.t) / TRAVEL) * (HIT - 130);
          return (
            <View key={nt.id} pointerEvents="none" style={{ position: 'absolute', left: nt.lane * laneW + laneW / 2 - 24, top: y - 24, width: 48, height: 48, borderRadius: 24,
              backgroundColor: LANES[nt.lane].c, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: y < 140 ? (y - 110) / 30 : 1 }}>
              <Icon name={LANES[nt.lane].i} color="#fff" size={22} />
            </View>
          );
        })}
        {s ? <Pops pops={s.pops} /> : null}
        <Overlay phase={phase} onStart={newGame} action="dance"
          skill={tr(['Self-management · focus & timing', 'إدارة الذات · التركيز والتوقيت'])}
          goal={tr(['Tap each circle when a note reaches it!', 'اضغط الدائرة لما توصلها النغمة!'])}
          how={tr(['Wait for the right moment — not too early, not too late. Good timing makes Fareed happy.', 'استنّى اللحظة الصح — مش بدري ولا متأخر. التوقيت الصح بفرّح فريد.'])}
          result={s ? <Txt w={8} size={18} center>{tr(['Perfect', 'ممتاز'])} {s.perfect} · {tr(['Good', 'حلو'])} {s.good} · {tr(['Best combo', 'أطول سلسلة'])} {s.best}</Txt> : null} />
      </View>
    </View>
  );
}
