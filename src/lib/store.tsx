// App state: profile, stars, CASEL skill points, moods, drawings — persisted with AsyncStorage.
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UI, T2 } from './content';

export type Stroke = { c: string; w: number; d: string };
export type Drawing = { id: string; prompt: number; strokes: Stroke[]; w: number; h: number; ts: number };
export type State = {
  name: string; lang: 'en' | 'ar'; stars: number;
  comp: Record<'SA' | 'SM' | 'SO' | 'RS' | 'DM', number>;
  moods: { d: number; m: string }[]; done: Record<string, number>; log: { id: string; ts: number; stars: number }[];
  drawings: Drawing[]; echoBest: number; kindness: { day: string; idx: number; done: boolean };
};
const KEY = 'fareed-mobile-v1';
export const fresh = (): State => ({
  name: '', lang: 'en', stars: 0, comp: { SA: 0, SM: 0, SO: 0, RS: 0, DM: 0 }, moods: [], done: {}, log: [],
  drawings: [], echoBest: 0, kindness: { day: '', idx: 0, done: false },
});
export const levelOf = (stars: number) => Math.floor(stars / 12) + 1;
export const levelProgress = (stars: number) => (stars % 12) / 12;

type Ctx = {
  s: State; ready: boolean; set: (p: Partial<State> | ((s: State) => Partial<State>)) => void;
  award: (id: string, stars: number, comps: string[]) => { levelUp: boolean };
  t: (k: string) => string; tr: (pair: T2) => string; rtl: boolean; reset: () => void;
};
const C = createContext<Ctx>(null as any);

export function StoreProvider({ children }) {
  const [s, setS] = useState<State>(fresh());
  const [ready, setReady] = useState(false);
  const ref = useRef(s); ref.current = s;
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => { if (v) try { setS({ ...fresh(), ...JSON.parse(v) }); } catch (e) {} }).finally(() => setReady(true));
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {}); }, [s, ready]);

  const set: Ctx['set'] = p => setS(prev => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));
  const award: Ctx['award'] = (id, stars, comps) => {
    // functional update so it never overwrites other changes made in the same tap (e.g. a saved drawing)
    const apply = (prev: State): State => {
      const comp = { ...prev.comp };
      comps.forEach(c => (comp[c] += Math.max(1, Math.round(stars / comps.length))));
      return { ...prev, stars: prev.stars + stars, comp, done: { ...prev.done, [id]: (prev.done[id] || 0) + 1 }, log: [...prev.log, { id, ts: Date.now(), stars }].slice(-60) };
    };
    const before = ref.current.stars;
    ref.current = apply(ref.current);
    setS(apply);
    return { levelUp: levelOf(before + stars) > levelOf(before) };
  };
  const tr = (pair: T2) => (pair ? pair[s.lang === 'ar' ? 1 : 0] : '');
  const t = (k: string) => (UI[k] ? tr(UI[k]) : k);
  const reset = () => setS({ ...fresh(), lang: ref.current.lang });
  return <C.Provider value={{ s, ready, set, award, t, tr, rtl: s.lang === 'ar', reset }}>{children}</C.Provider>;
}
export const useStore = () => useContext(C);
