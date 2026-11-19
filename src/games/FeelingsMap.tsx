// Amman — Feelings Map: place feeling words on a 2-D map of ENERGY (low–high) × PLEASANT (unpleasant–pleasant).
// Based on the circumplex model of affect (Russell, 1980). Learning more precise feeling words
// ("frustrated", not just "bad") is the emotion-vocabulary part of self-awareness.
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Fareed, { Action, Mood } from '../components/Fareed';
import { Btn, C, Card, Icon, Row, Txt } from '../components/ui';
import { T2 } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

type Q = 'hp' | 'hu' | 'lp' | 'lu'; // high/low energy × pleasant/unpleasant
const WORDS: { t: T2; q: Q; mood: Mood; act: Action }[] = [
  { t: ['Excited', 'متحمّس'], q: 'hp', mood: 'excited', act: 'jump' }, { t: ['Proud', 'فخور'], q: 'hp', mood: 'proud', act: 'celebrate' },
  { t: ['Joyful', 'فرحان'], q: 'hp', mood: 'happy', act: 'dance' }, { t: ['Calm', 'هادئ'], q: 'lp', mood: 'calm', act: 'breatheIn' },
  { t: ['Relaxed', 'مرتاح'], q: 'lp', mood: 'calm', act: 'idle' }, { t: ['Grateful', 'ممتن'], q: 'lp', mood: 'happy', act: 'nod' },
  { t: ['Angry', 'غاضب'], q: 'hu', mood: 'angry', act: 'angry' }, { t: ['Frustrated', 'متضايق'], q: 'hu', mood: 'angry', act: 'shake' },
  { t: ['Scared', 'خايف'], q: 'hu', mood: 'scared', act: 'scared' }, { t: ['Nervous', 'متوتّر'], q: 'hu', mood: 'scared', act: 'scared' },
  { t: ['Sad', 'حزين'], q: 'lu', mood: 'sad', act: 'sad' }, { t: ['Lonely', 'وحيد'], q: 'lu', mood: 'sad', act: 'sad' },
  { t: ['Bored', 'زهقان'], q: 'lu', mood: 'normal', act: 'idle' }, { t: ['Tired', 'تعبان'], q: 'lu', mood: 'calm', act: 'sad' },
];
const QUAD: Record<Q, { c: string; t: T2 }> = {
  hu: { c: '#F0544F', t: ['High energy · unpleasant', 'طاقة عالية · مزعج'] }, hp: { c: '#FFC93C', t: ['High energy · pleasant', 'طاقة عالية · لطيف'] },
  lu: { c: '#6F9BE8', t: ['Low energy · unpleasant', 'طاقة قليلة · مزعج'] }, lp: { c: '#5CC8A8', t: ['Low energy · pleasant', 'طاقة قليلة · لطيف'] },
};

export default function FeelingsMap({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr, set } = useStore();
  const rounds = useMemo(() => [...WORDS].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<Q | null>(null);
  const [score, setScore] = useState(0);
  const [mine, setMine] = useState(false);
  const [n, setN] = useState(0);
  const w = rounds[i];

  const choose = (q: Q) => {
    if (mine) {  // final step: where am I right now?
      const m = { hp: 'happy', lp: 'calm', hu: 'angry', lu: 'sad' }[q];
      set(p => ({ moods: [...p.moods, { d: Date.now(), m }].slice(-60) }));
      play('ok'); onFinish(Math.max(1, Math.round(score / 2)), `${score} / ${rounds.length}`);
      setI(0); setScore(0); setMine(false); setPick(null); return;
    }
    if (pick) return;
    setPick(q); setN(x => x + 1);
    if (q === w.q) { setScore(s => s + 1); play('ok'); buzz('ok'); } else { play('oops'); buzz('bad'); }
  };
  const next = () => { if (i + 1 >= rounds.length) { setMine(true); setPick(null); return; } setI(i + 1); setPick(null); setN(x => x + 1); };

  const Cell = ({ q }: { q: Q }) => {
    const right = pick && q === w.q, wrong = pick === q && q !== w.q;
    return (
      <Pressable onPress={() => choose(q)} style={{ flex: 1, aspectRatio: 1, margin: 3, borderRadius: 18, backgroundColor: QUAD[q].c, opacity: pick && !right && !wrong ? 0.45 : 1,
        borderWidth: 4, borderColor: right ? '#fff' : wrong ? C.ink : 'transparent', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
        <Txt w={7} size={12} color="#fff" center>{tr(QUAD[q].t)}</Txt>
        {right ? <Icon name="check-circle" color="#fff" size={28} /> : wrong ? <Icon name="close-circle" color={C.ink} size={28} /> : null}
      </Pressable>
    );
  };
  return (
    <View style={{ gap: 10 }}>
      <Card style={{ alignItems: 'center', gap: 4 }}>
        {mine ? (
          <>
            <Fareed size={110} mood="think" action="think" nonce={n} />
            <Txt w={8} size={19} center color={C.purple}>{tr(['Last one: where are YOU on the map right now?', 'آخر سؤال: وين إنت عالخريطة هلّق؟'])}</Txt>
          </>
        ) : (
          <>
            <Txt size={12} color={C.muted}>{i + 1} / {rounds.length}</Txt>
            <Fareed size={110} mood={w.mood} action={w.act} nonce={n} />
            <Txt w={8} size={26} color={C.purple}>{tr(w.t)}</Txt>
            <Txt size={13} color={C.muted} center>{tr(['How much energy? Pleasant or unpleasant?', 'قدّيش طاقة؟ لطيف ولّا مزعج؟'])}</Txt>
          </>
        )}
      </Card>
      {/* the map: top = high energy, right = pleasant */}
      <Row gap={4} style={{ alignItems: 'stretch' }}>
        <View style={{ width: 22, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
          <Icon name="lightning-bolt" color="#FF7A00" /><View style={{ flex: 1, width: 3, backgroundColor: '#ddd', marginVertical: 4 }} /><Icon name="sleep" color="#6F9BE8" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}><Cell q="hu" /><Cell q="hp" /></View>
          <View style={{ flexDirection: 'row' }}><Cell q="lu" /><Cell q="lp" /></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 }}>
            <Txt w={6} size={12} color={C.muted}>☹ {tr(['unpleasant', 'مزعج'])}</Txt><Txt w={6} size={12} color={C.muted}>{tr(['pleasant', 'لطيف'])} ☺</Txt>
          </View>
        </View>
      </Row>
      {pick && !mine ? <Btn title={tr(['Next feeling', 'الشعور الجاي'])} icon="arrow-right" onPress={next} /> : null}
    </View>
  );
}
