// Jerash — Music Theatre: Echo the Beat, Feel the Music, Freeze Dance
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Fareed, { Action, Mood } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { Bubble, Btn, C, Card, Icon, Reward, Row, Screen, Txt } from '../components/ui';
import { FEELINGS, feeling } from '../lib/content';
import { useStore } from '../lib/store';
import BeatRun from '../games/BeatRun';
import { buzz, play, stop, stopAll } from '../lib/sound';

const ND = Platform.OS !== 'web';
const PADS = [{ c: '#FFC93C', i: 'star' }, { c: '#5CC8A8', i: 'bell-ring' }, { c: '#F25C78', i: 'heart' }, { c: '#7B5CE0', i: 'music-note' }];
const shuffle = <X,>(a: X[]) => a.map(v => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

function Tabs({ tab, setTab }) {
  const { t } = useStore();
  const items = [['beat', 'beatTitle', 'gamepad-variant'], ['echo', 'echoTitle', 'piano'], ['feel', 'feelMusicTitle', 'ear-hearing'], ['freeze', 'danceBreak', 'human-handsup']];
  return (
    <Row gap={8} style={{ justifyContent: 'center' }}>
      {items.map(([k, label, icon]) => (
        <Pressable key={k} onPress={() => { play('pop', 0.4); setTab(k); }} style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 16, backgroundColor: tab === k ? C.purple : C.white }}>
          <Icon name={icon} color={tab === k ? C.yellow : C.purple} />
          <Txt w={7} size={13} center color={tab === k ? C.white : C.purple}>{t(label)}</Txt>
        </Pressable>
      ))}
    </Row>
  );
}

// ---------- Echo the Beat (memory + focus) ----------
function Echo({ onWin }) {
  const { t, s, set } = useStore();
  const [seq, setSeq] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'show' | 'you' | 'over'>('idle');
  const [act, setAct] = useState<Action>('idle'); const [mood, setMood] = useState<Mood>('happy'); const [n, setN] = useState(0);
  const glow = useRef(PADS.map(() => new Animated.Value(0))).current;
  const alive = useRef(true); useEffect(() => () => { alive.current = false; }, []);

  const flash = (k: number) => {
    play('pad' + k); glow[k].setValue(1);
    Animated.timing(glow[k], { toValue: 0, duration: 380, useNativeDriver: ND }).start();
  };
  const show = async (sq: number[]) => {
    setPhase('show'); setAct('dance'); setMood('happy'); await wait(700);
    for (const k of sq) { if (!alive.current) return; flash(k); await wait(Math.max(330, 620 - sq.length * 25)); }
    if (!alive.current) return;
    setPhase('you'); setPos(0); setAct('listen'); setMood('think');
  };
  const start = () => { const sq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; setSeq(sq); show(sq); };
  const tap = (k: number) => {
    if (phase !== 'you') return;
    flash(k); buzz();
    if (seq[pos] !== k) {
      play('oops'); buzz('bad'); setPhase('over'); setAct('shake'); setMood('surprised'); setN(x => x + 1);
      const score = seq.length - 1;
      if (score > s.echoBest) set({ echoBest: score });
      setTimeout(() => onWin(Math.max(1, Math.ceil(score / 2)), `${t('beat')}: ${score}`), 900);
      return;
    }
    if (pos + 1 === seq.length) {
      setPhase('show'); setAct('jump'); setMood('excited'); setN(x => x + 1);
      setTimeout(() => play('ok'), 250);
      const sq = [...seq, Math.floor(Math.random() * 4)]; setSeq(sq);
      setTimeout(() => show(sq), 900);
    } else setPos(pos + 1);
  };
  const say = phase === 'idle' ? t('echoDesc') : phase === 'show' ? t('listen') : phase === 'you' ? t('yourTurn') : `${t('beat')} ${seq.length - 1}!`;
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ alignItems: 'center', gap: 6 }}>
        <Bubble text={say} />
        <Fareed size={150} mood={mood} action={act} nonce={n} onDone={() => setAct(phase === 'you' ? 'listen' : 'idle')} />
        <Row gap={18}><Txt w={7} color={C.muted}>{t('beat')}: {Math.max(0, seq.length - (phase === 'you' || phase === 'show' ? 1 : 0))}</Txt><Txt w={7} color={C.muted}>{t('best')}: {s.echoBest}</Txt></Row>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        {PADS.map((p, k) => (
          <Pressable key={k} onPress={() => tap(k)} style={{ width: '44%', aspectRatio: 1.25 }}>
            <Animated.View style={{ flex: 1, borderRadius: 28, backgroundColor: p.c, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: C.white,
              transform: [{ scale: glow[k].interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
              opacity: phase === 'you' || phase === 'show' ? glow[k].interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }) : 1 }}>
              <Icon name={p.i} size={46} color={C.white} />
            </Animated.View>
          </Pressable>
        ))}
      </View>
      {phase === 'idle' || phase === 'over' ? <Btn title={phase === 'idle' ? t('start') : t('again')} icon="play" onPress={start} /> : null}
    </View>
  );
}

// ---------- Feel the Music (emotion recognition in sound) ----------
function FeelMusic({ onWin }) {
  const { t, tr } = useStore();
  const rounds = useMemo(() => shuffle(FEELINGS).slice(0, 5).map(f => f.id), []);
  const [i, setI] = useState(-1);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [act, setAct] = useState<Action>('idle'); const [mood, setMood] = useState<Mood>('normal'); const [n, setN] = useState(0);
  const r = rounds[i];
  const opts = useMemo(() => (r ? shuffle([r, ...shuffle(FEELINGS.map(f => f.id).filter(x => x !== r)).slice(0, 3)]) : []), [i]);
  const listen = (id = r) => { stopAll(); play(feeling(id).sound, 0.9); setAct('listen'); setMood('think'); setN(x => x + 1); };
  const begin = () => { setI(0); setPicked(null); setTimeout(() => listen(rounds[0]), 200); };
  const choose = (id: string) => {
    if (picked) return; setPicked(id);
    const ok = id === r, f = feeling(r);
    if (ok) setScore(x => x + 1);
    play(ok ? 'ok' : 'oops'); buzz(ok ? 'ok' : 'bad');
    setMood(f.mood); setAct(f.action === 'idle' ? 'breatheIn' : f.action); setN(x => x + 1);
  };
  const next = () => {
    stopAll();
    if (i + 1 >= rounds.length) return onWin(Math.max(1, Math.ceil(score / 2)) + 1, `${score} / ${rounds.length}`);
    setI(i + 1); setPicked(null); setTimeout(() => listen(rounds[i + 1]), 200);
  };
  useEffect(() => () => stopAll(), []);
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ alignItems: 'center', gap: 6 }}>
        <Bubble text={i < 0 ? t('feelMusicDesc') : picked ? (picked === r ? `${t('great')} ${tr(feeling(r).n)}!` : `${t('tryAgain')} → ${tr(feeling(r).n)}`) : t('whichFeeling')} />
        <Fareed size={150} mood={mood} action={act} nonce={n} />
        {i >= 0 ? <Txt w={7} color={C.muted}>{t('round')} {i + 1} / {rounds.length}</Txt> : null}
      </Card>
      {i < 0 ? <Btn title={t('start')} icon="play" onPress={begin} /> : (
        <>
          <Btn small title={t('playAgainMusic')} icon="replay" color={C.white} text={C.purple} onPress={() => listen()} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {opts.map(id => {
              const right = picked && id === r, wrong = picked === id && id !== r;
              return (
                <Pressable key={id} onPress={() => choose(id)} style={{ width: '46%', alignItems: 'center', paddingVertical: 10, borderRadius: 22, backgroundColor: C.white,
                  borderWidth: 4, borderColor: right ? C.green : wrong ? '#F0544F' : 'transparent', opacity: picked && !right && !wrong ? 0.5 : 1 }}>
                  <MoodFace id={id} size={54} /><Txt w={7}>{tr(feeling(id).n)}</Txt>
                </Pressable>
              );
            })}
          </View>
          {picked ? <Btn title={t('next')} icon="arrow-right" onPress={next} /> : null}
        </>
      )}
    </View>
  );
}

// ---------- Freeze Dance (impulse control) ----------
function Freeze({ onWin }) {
  const { t } = useStore();
  const [state, setState] = useState<'idle' | 'dance' | 'freeze'>('idle');
  const [round, setRound] = useState(0);
  const [n, setN] = useState(0);
  const timer = useRef<any>(null);
  useEffect(() => () => { clearTimeout(timer.current); stopAll(); }, []);
  const ROUNDS = 5;
  const dance = (r: number) => {
    setState('dance'); setRound(r); setN(x => x + 1); play('mel_happy', 0.9, true);
    timer.current = setTimeout(() => {
      stop('mel_happy'); play('pop'); buzz('bad'); setState('freeze');
      timer.current = setTimeout(() => {
        if (r + 1 >= ROUNDS) { setState('idle'); onWin(2, '5 / 5'); } else dance(r + 1);
      }, 2600);
    }, 2500 + Math.random() * 3500);
  };
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ alignItems: 'center', gap: 8, backgroundColor: state === 'freeze' ? '#DDF3FF' : C.white }}>
        {state === 'idle' ? <Bubble text={t('danceDesc')} /> : <Txt w={8} size={40} color={state === 'freeze' ? '#2BA3D4' : C.pink}>{state === 'freeze' ? t('freeze') : t('dance')}</Txt>}
        <Fareed size={190} mood={state === 'freeze' ? 'surprised' : 'excited'} action={state === 'dance' ? 'dance' : state === 'freeze' ? 'freeze' : 'idle'} nonce={n} />
        {state !== 'idle' ? <Row gap={6}>{[...Array(ROUNDS)].map((_, k) => <Icon key={k} name={k < round ? 'star' : k === round ? 'star-half-full' : 'star-outline'} color="#FFB300" />)}</Row> : null}
      </Card>
      {state === 'idle' ? <Btn title={t('start')} icon="play" onPress={() => dance(0)} /> : null}
    </View>
  );
}

export default function Music() {
  const { t, award } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'beat');
  const [key, setKey] = useState(0);
  const [reward, setReward] = useState<any>(null);
  const win = (stars: number, msg: string) => { const { levelUp } = award(({ beat: 'beat', echo: 'echo', feel: 'feelmusic', freeze: 'freeze' } as any)[tab], stars, tab === 'feel' ? ['SA', 'SO'] : ['SM']); setReward({ stars, levelUp, msg, game: tab === 'beat' }); };
  return (
    <Screen title={t('musicTitle')} bg="#FFF1D0" headerColor="#FFB020">
      <Tabs tab={tab} setTab={k => { stopAll(); setTab(k); setKey(x => x + 1); }} />
      {tab === 'beat' ? <BeatRun key={key} onFinish={win} /> : tab === 'echo' ? <Echo key={key} onWin={win} /> : tab === 'feel' ? <FeelMusic key={key} onWin={win} /> : <Freeze key={key} onWin={win} />}
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp} message={reward?.msg}
        onClose={() => { const g = reward?.game; setReward(null); if (!g) router.back(); }} onAgain={reward?.game ? null : () => { setReward(null); setKey(x => x + 1); }} />
    </Screen>
  );
}
