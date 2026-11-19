// Small game engine: frame loop, HUD, start/finish overlays shared by all Fareed mini-games.
import React, { useEffect, useReducer, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Fareed, { Action, Mood } from '../components/Fareed';
import { Btn, C, Card, Icon, Row, Txt } from '../components/ui';
import { useStore } from '../lib/store';

export type Phase = 'ready' | 'play' | 'over';

// Calls step(dt) every animation frame while `run` is true (dt in seconds, capped).
export function useLoop(run: boolean, step: (dt: number) => void) {
  const cb = useRef(step);
  cb.current = step;
  useEffect(() => {
    if (!run) return;
    let id = 0, last = 0;
    const f = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t; cb.current(dt); id = requestAnimationFrame(f);
    };
    id = requestAnimationFrame(f);
    return () => cancelAnimationFrame(id);
  }, [run]);
}
export const useForce = () => useReducer((x: number) => x + 1, 0)[1];
export const rnd = (a: number, b: number) => a + Math.random() * (b - a);
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function Hearts({ n, max = 3 }) {
  return <Row gap={2}>{[...Array(max)].map((_, i) => <Icon key={i} name={i < n ? 'heart' : 'heart-outline'} size={20} color="#F25C78" />)}</Row>;
}
export function Hud({ score, hearts = null, time = null, label = null }: any) {
  return (
    <Row style={{ justifyContent: 'space-between', paddingHorizontal: 4 }}>
      <Row gap={4}><Icon name="star" color="#FFB300" /><Txt w={8} size={18}>{score}</Txt></Row>
      {label}
      {time !== null ? <Row gap={4}><Icon name="timer-outline" color={C.purple} /><Txt w={8} size={18}>{Math.ceil(time)}</Txt></Row> : null}
      {hearts !== null ? <Hearts n={hearts} /> : null}
    </Row>
  );
}

// Overlay shown before a game starts (goal + how to play) and when it ends
export function Overlay({ phase, goal, how, skill, onStart, result = null, mood = 'happy', action = 'wave' }:
  { phase: Phase; goal: string; how: string; skill?: string; onStart: () => void; result?: React.ReactNode; mood?: Mood; action?: Action }) {
  const { t, tr } = useStore();
  if (phase === 'play') return null;
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(42,30,79,0.45)', alignItems: 'center', justifyContent: 'center', padding: 18, zIndex: 50 }]}>
      <Card style={{ width: '100%', maxWidth: 360, alignItems: 'center', gap: 6 }}>
        <Fareed size={110} mood={phase === 'over' ? 'excited' : mood} action={phase === 'over' ? 'celebrate' : action} nonce={phase === 'over' ? 2 : 1} />
        {phase === 'ready' ? (
          <>
            {skill ? <View style={{ backgroundColor: C.lav, borderRadius: 999, paddingHorizontal: 10 }}><Txt w={7} size={12} color={C.purple}>{skill}</Txt></View> : null}
            <Txt w={8} size={18} center color={C.purple}>{goal}</Txt>
            <Txt size={15} center color={C.muted}>{how}</Txt>
            <Btn title={t('start')} icon="play" onPress={onStart} style={{ marginTop: 6, minWidth: 170 }} />
          </>
        ) : (
          <>
            {result}
            <Btn title={tr(['Play again', 'العب مرّة ثانية'])} icon="refresh" onPress={onStart} style={{ marginTop: 6, minWidth: 170 }} />
          </>
        )}
      </Card>
    </View>
  );
}

// Floating "+1 / Perfect!" texts
export type Pop = { id: number; x: number; y: number; text: string; color: string; t: number };
export function Pops({ pops }: { pops: Pop[] }) {
  return (
    <>
      {pops.map(p => (
        <View key={p.id} pointerEvents="none" style={{ position: 'absolute', left: p.x - 60, top: p.y - 30 - p.t * 40, width: 120, alignItems: 'center', opacity: Math.max(0, 1 - p.t) }}>
          <Txt w={8} size={18} color={p.color} center style={{ textShadowColor: '#fff', textShadowRadius: 4 }}>{p.text}</Txt>
        </View>
      ))}
    </>
  );
}
export function agePops(pops: Pop[], dt: number) {
  for (const p of pops) p.t += dt * 1.2;
  return pops.filter(p => p.t < 1);
}
