// Aqaba — Kindness Reef: choose-your-path stories that Fareed acts out
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import Fareed, { Action, Mood } from '../components/Fareed';
import { Bubble, Btn, C, Card, Icon, Reward, Row, Screen, Txt } from '../components/ui';
import { COMP, STORIES } from '../lib/content';
import WorldTabs from '../components/WorldTabs';
import ReefDive from '../games/ReefDive';
import StopThinkGo from '../games/StopThinkGo';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

const ACT_FOR: Record<string, Action> = { scared: 'scared', angry: 'angry', sad: 'sad', think: 'think', surprised: 'surprised', happy: 'jump' };

export default function Stories() {
  const { t, tr, s, award, rtl } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'reef');
  const [gReward, setGReward] = useState<any>(null);
  const gameDone = (stars: number, msg: string) => { const { levelUp } = award(tab === 'stop' ? 'stopgo' : 'reef', stars, tab === 'stop' ? ['DM', 'SM'] : ['SO', 'RS']); setGReward({ stars, levelUp, msg }); };
  const [sid, setSid] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const [good, setGood] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [act, setAct] = useState<Action>('idle'); const [mood, setMood] = useState<Mood>('normal'); const [n, setN] = useState(0);
  const [reward, setReward] = useState<any>(null);
  const story = STORIES.find(x => x.id === sid);
  const raw = story?.scenes[i];
  // shuffle answer order once per scene so the kind choice isn't always first
  const scene = useMemo(() => (raw ? { ...raw, ch: [...raw.ch].sort(() => Math.random() - 0.5) } : undefined), [sid, i]);

  useEffect(() => { if (scene && pick === null) { setMood(scene.mood); setAct(ACT_FOR[scene.mood] || 'idle'); setN(x => x + 1); } }, [sid, i, pick]);
  useEffect(() => () => { Speech.stop(); }, []);
  const read = () => { if (!scene) return; Speech.stop(); Speech.speak(tr(scene.txt) + ' ' + (scene.q ? tr(scene.q) : ''), { language: s.lang === 'ar' ? 'ar-SA' : 'en-US', rate: 0.92 }); };

  const choose = (k: number) => {
    if (pick !== null || !scene) return;
    setPick(k); const ok = scene.ch[k].ok === 1;
    if (ok) { setGood(g => g + 1); play('ok'); buzz('ok'); setMood('excited'); setAct('celebrate'); }
    else { play('oops'); buzz('bad'); setMood('think'); setAct('shake'); }
    setN(x => x + 1);
  };
  const next = () => {
    Speech.stop();
    if (i + 1 < story!.scenes.length) { setI(i + 1); setPick(null); return; }
    const stars = good + 1; const { levelUp } = award('stories', stars, story!.comp);
    setReward({ stars, levelUp, msg: tr(story!.end) });
  };

  if (!story) {
    return (
      <Screen title={t('storiesTitle')} bg="#ECE7FB" headerColor={C.purple}>
        <WorldTabs tab={tab} setTab={setTab} color={C.purple} tabs={[{ k: 'reef', t: ['Kindness Reef', 'شعاب اللطف'], icon: 'gamepad-variant' }, { k: 'stop', t: ['Stop · Think · Go', 'قف · فكّر · امشِ'], icon: 'traffic-light' }, { k: 'stories', t: ['Stories', 'قصص'], icon: 'book-open-variant' }]} />
        {tab === 'reef' ? <ReefDive onFinish={gameDone} /> : tab === 'stop' ? <StopThinkGo onFinish={gameDone} /> : (<>
        <Card style={{ alignItems: 'center' }}><Fareed size={150} mood="happy" action="wave" nonce={1} /></Card>
        {STORIES.map(st => (
          <Pressable key={st.id} onPress={() => { play('pop', 0.5); setSid(st.id); setI(0); setGood(0); setPick(null); }}>
            <Card style={{ borderLeftWidth: rtl ? 0 : 8, borderRightWidth: rtl ? 8 : 0, borderColor: st.color }}>
              <Row>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: st.color, alignItems: 'center', justifyContent: 'center' }}><Icon name="book-open-variant" color={C.white} size={28} /></View>
                <View style={{ flex: 1 }}>
                  <Txt w={8} size={18}>{tr(st.t)}</Txt><Txt size={14} color={C.muted}>{tr(st.s)}</Txt>
                  <Row gap={6} wrap style={{ marginTop: 4 }}>{st.comp.map(c => <View key={c} style={{ borderWidth: 1.5, borderColor: COMP[c].color, borderRadius: 999, paddingHorizontal: 8 }}><Txt size={11} w={6}>{tr(COMP[c].n)}</Txt></View>)}</Row>
                </View>
                <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={28} color={C.muted} />
              </Row>
            </Card>
          </Pressable>
        ))}
        </>)}
        <Reward visible={!!gReward} stars={gReward?.stars} levelUp={gReward?.levelUp} message={gReward?.msg} onClose={() => setGReward(null)} />
      </Screen>
    );
  }
  const ch = pick !== null ? scene!.ch[pick] : null;
  return (
    <Screen title={tr(story.t)} bg="#ECE7FB" headerColor={story.color} onBack={() => { Speech.stop(); setSid(null); }}>
      <Row gap={6} style={{ justifyContent: 'center' }}>{story.scenes.map((_, k) => <View key={k} style={{ width: 34, height: 8, borderRadius: 4, backgroundColor: k < i ? C.teal : k === i ? C.purple : '#D6CEF2' }} />)}</Row>
      <Card style={{ alignItems: 'center', gap: 10 }}>
        <Fareed size={170} mood={mood} action={act} nonce={n} onDone={() => setAct('idle')} />
        <Txt size={18} w={6} center>{tr(scene!.txt)}</Txt>
        <Pressable onPress={read}><Row gap={4}><Icon name="volume-high" size={18} color={C.purple} /><Txt w={7} size={14} color={C.purple}>{tr(['Read to me', 'اقرألي'])}</Txt></Row></Pressable>
      </Card>
      {scene!.q ? <Txt w={8} size={19} color={C.purple}>{tr(scene!.q)}</Txt> : null}
      <View style={{ gap: 10 }}>
        {scene!.ch.map((c, k) => {
          const right = pick !== null && c.ok === 1, wrong = pick === k && c.ok === 0;
          return (
            <Pressable key={k} onPress={() => choose(k)} style={{ padding: 14, borderRadius: 18, backgroundColor: right ? '#EAF8F0' : wrong ? '#FFF0F2' : C.white, borderWidth: 3, borderColor: right ? C.green : wrong ? '#F0544F' : '#E3DDF5' }}>
              <Txt w={6} size={16}>{tr(c.t)}</Txt>
            </Pressable>
          );
        })}
      </View>
      {ch ? (
        <Card color={ch.ok ? '#EAF8F0' : '#FFF6E5'} style={{ gap: 10 }}>
          <Row><Icon name={ch.ok ? 'heart' : 'lightbulb-on'} color={ch.ok ? C.pink : '#E89B2C'} /><Txt size={16} style={{ flex: 1 }}>{tr(ch.r)}</Txt></Row>
          <Btn small title={i + 1 < story.scenes.length ? t('continue') : t('theEnd')} icon="arrow-right" onPress={next} style={{ alignSelf: rtl ? 'flex-start' : 'flex-end' }} />
        </Card>
      ) : null}
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp} message={reward?.msg}
        onClose={() => { setReward(null); setSid(null); }} onAgain={() => { setReward(null); setI(0); setGood(0); setPick(null); }} />
    </Screen>
  );
}
