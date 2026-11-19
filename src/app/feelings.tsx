// Amman — Feelings Charades: Fareed acts a feeling (or a story describes one) and the child names it.
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Fareed, { Action, Mood } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { Bubble, C, Card, Reward, Row, Screen, Txt, Icon } from '../components/ui';
import { FEELINGS, SCENARIOS, feeling, T2 } from '../lib/content';
import WorldTabs from '../components/WorldTabs';
import FeelingsCatch from '../games/FeelingsCatch';
import FeelingsMap from '../games/FeelingsMap';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

const CLUES: Record<string, T2> = {
  happy: ['Big smile, sparkly cheeks and jumping!', 'ابتسامة كبيرة وخدود حمرا ونطّ!'],
  sad: ['Droopy head, sad eyebrows and a tear.', 'راس منزّل وحواجب حزينة ودمعة.'],
  angry: ['Frowning eyebrows, red cheeks and stomping feet.', 'حواجب معقودة وخدود حمرا ودبدبة.'],
  scared: ['Shaking, hiding his face, wobbly mouth.', 'برجف ومخبّي وجهه وتمّه بيرجف.'],
  surprised: ['Wide eyes, round mouth, jumped back!', 'عيون واسعة وتم مدوّر ونطّ لورا!'],
  calm: ['Closed eyes, slow breathing, soft smile.', 'عيون مسكّرة وتنفّس بطيء وابتسامة ناعمة.'],
};
const shuffle = <X,>(a: X[]) => a.map(v => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(v => v[1]);

export default function Feelings() {
  const { t, tr, award } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'catch');
  const [gReward, setGReward] = useState<any>(null);
  const gameDone = (stars: number, msg: string) => { const { levelUp } = award(tab === 'map' ? 'fmap' : 'catch', stars, ['SA', 'SO']); setGReward({ stars, levelUp, msg }); };
  const rounds = useMemo(() => {
    const acts = shuffle(FEELINGS).slice(0, 4).map(f => ({ kind: 'act' as const, a: f.id }));
    const sc = shuffle(SCENARIOS).slice(0, 4).map(s => ({ kind: 'story' as const, a: s.a, t: s.t }));
    return acts.flatMap((a, i) => [a, sc[i]]);
  }, []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [act, setAct] = useState<Action>('idle');
  const [mood, setMood] = useState<Mood>('normal');
  const [n, setN] = useState(0);
  const [reward, setReward] = useState<any>(null);
  const r = rounds[i];
  const options = useMemo(() => r ? shuffle([r.a, ...shuffle(FEELINGS.map(f => f.id).filter(x => x !== r.a)).slice(0, 3)]) : [], [i]);

  // Fareed performs the feeling (repeat one-shot moves so he keeps acting)
  useEffect(() => {
    if (!r || picked) return;
    if (r.kind === 'act') {
      const f = feeling(r.a); setMood(f.mood); setAct(f.action); setN(x => x + 1);
      if (f.action === 'jump' || f.action === 'surprised') {
        const id = setInterval(() => setN(x => x + 1), 1900); return () => clearInterval(id);
      }
    } else { setMood('think'); setAct('think'); }
  }, [i, picked]);

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    const ok = id === r.a;
    if (ok) { setScore(s => s + 1); play('ok'); buzz('ok'); setMood('excited'); setAct('celebrate'); }
    else { play('oops'); buzz('bad'); setMood('think'); setAct('shake'); }
    setN(x => x + 1);
  };
  const next = () => {
    if (i + 1 >= rounds.length) {
      const stars = Math.max(1, Math.ceil(score / 2));
      const { levelUp } = award('charades', stars, ['SA', 'SO']);
      setReward({ stars, levelUp, msg: `${score} / ${rounds.length}` });
      return;
    }
    setPicked(null); setI(i + 1);
  };

  if (!r) return null;
  const ok = picked === r.a;
  return (
    <Screen title={tr(['Amman · Feelings', 'عمّان · المشاعر'])} bg="#FFE9EE" headerColor="#F25C78">
      <WorldTabs tab={tab} setTab={setTab} color="#F25C78" tabs={[{ k: 'catch', t: ['Feelings Catch', 'التقط الشعور'], icon: 'gamepad-variant' }, { k: 'map', t: ['Feelings Map', 'خريطة المشاعر'], icon: 'map-marker-radius' }, { k: 'charades', t: ['Charades', 'تمثيل المشاعر'], icon: 'drama-masks' }]} />
      {tab === 'catch' ? <FeelingsCatch onFinish={gameDone} /> : tab === 'map' ? <FeelingsMap onFinish={gameDone} /> : (<>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt w={7} color={C.muted}>{t('round')} {i + 1} / {rounds.length}</Txt>
        <Row gap={4}>{rounds.map((_, k) => <View key={k} style={{ width: 18, height: 8, borderRadius: 4, backgroundColor: k < i ? '#F25C78' : k === i ? C.purple : '#F5C9D3' }} />)}</Row>
      </Row>
      <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 20 }}>
        {r.kind === 'story'
          ? <Bubble text={tr(r.t)} style={{ maxWidth: 330 }} />
          : <Txt w={7} size={18} color={C.purple} center>{picked ? '' : t('watchFareed')}</Txt>}
        <Fareed size={200} mood={mood} action={act} nonce={n} />
        <Txt w={8} size={20} center>{r.kind === 'act' ? t('whatFeel') : t('whichFeeling')}</Txt>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {options.map(id => {
          const f = feeling(id), isRight = picked && id === r.a, isWrong = picked === id && id !== r.a;
          return (
            <Pressable key={id} onPress={() => choose(id)} style={{ width: '46%', alignItems: 'center', gap: 2, paddingVertical: 10, borderRadius: 22, backgroundColor: C.white,
              borderWidth: 4, borderColor: isRight ? C.green : isWrong ? '#F0544F' : 'transparent', opacity: picked && !isRight && !isWrong ? 0.5 : 1 }}>
              <MoodFace id={id} size={58} /><Txt w={7} size={17}>{tr(f.n)}</Txt>
            </Pressable>
          );
        })}
      </View>
      {picked ? (
        <Card color={ok ? '#EAF8F0' : '#FFF6E5'} style={{ gap: 10 }}>
          <Row><Icon name={ok ? 'check-circle' : 'lightbulb-on'} color={ok ? C.green : '#E89B2C'} size={26} />
            <Txt w={8} size={18} style={{ flex: 1 }}>{ok ? t('great') : `${t('tryAgain')} → ${tr(feeling(r.a).n)}`}</Txt></Row>
          {r.kind === 'act' ? <Txt size={16}>{tr(CLUES[r.a])}</Txt> : null}
          <Pressable onPress={next} style={{ alignSelf: 'flex-end', backgroundColor: C.purple, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 10 }}>
            <Txt w={7} color={C.white}>{t('next')}</Txt>
          </Pressable>
        </Card>
      ) : null}
      </>)}
      <Reward visible={!!gReward} stars={gReward?.stars} levelUp={gReward?.levelUp} message={gReward?.msg} onClose={() => setGReward(null)} />
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp} message={reward?.msg}
        onClose={() => { setReward(null); router.back(); }} onAgain={() => { setReward(null); router.replace('/feelings'); }} />
    </Screen>
  );
}
