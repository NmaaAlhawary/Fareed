// Petra — Draw Your Feelings: finger-paint canvas with feeling colours and a gallery
import React, { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import Fareed from '../components/Fareed';
import { Btn, C, Card, Icon, Reward, Row, Screen, Txt } from '../components/ui';
import { DRAW_PROMPTS, PALETTE } from '../lib/content';
import WorldTabs from '../components/WorldTabs';
import MoodMonster from '../games/MoodMonster';
import { Stroke, useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

const SIZES = [5, 11, 20];

function Mini({ d, size }: { d: any; size: number }) {
  return (
    <Svg width={size} height={size * (d.h / d.w)} viewBox={`0 0 ${d.w} ${d.h}`}>
      <Rect width={d.w} height={d.h} fill="#fff" />
      {d.strokes.map((s: Stroke, i: number) => <Path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    </Svg>
  );
}

export default function Draw() {
  const { t, tr, s, set, award, rtl } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'monster');
  const [gReward, setGReward] = useState<any>(null);
  const gameDone = (stars: number, msg: string) => { const { levelUp } = award('monster', stars, ['SA', 'SM']); setGReward({ stars, levelUp, msg }); };
  const [prompt, setPrompt] = useState(Math.floor(Math.random() * DRAW_PROMPTS.length));
  const [color, setColor] = useState(PALETTE[0].c);
  const [w, setW] = useState(SIZES[1]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [cur, setCur] = useState<Stroke | null>(null);
  const [box, setBox] = useState({ w: 300, h: 300 });
  const [gallery, setGallery] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [n, setN] = useState(0);
  const curRef = useRef<Stroke | null>(null);

  const pt = (e: any) => `${Math.round(e.nativeEvent.locationX)},${Math.round(e.nativeEvent.locationY)}`;
  const begin = (e: any) => { const p = pt(e); curRef.current = { c: color, w, d: `M${p} L${p}` }; setCur(curRef.current); };
  const move = (e: any) => { if (!curRef.current) return; curRef.current = { ...curRef.current, d: curRef.current.d + ` L${pt(e)}` }; setCur(curRef.current); };
  const end = () => { const done = curRef.current; if (done) setStrokes(x => [...x, done]); curRef.current = null; setCur(null); };

  const saveIt = () => {
    if (!strokes.length) return;
    set(p => ({ drawings: [{ id: String(Date.now()), prompt, strokes, w: box.w, h: box.h, ts: Date.now() }, ...p.drawings].slice(0, 30) }));
    const { levelUp } = award('paint', 3, ['SA', 'SM']);
    setReward({ stars: 3, levelUp, msg: tr(['I love the colours you chose!', 'حبّيت الألوان اللي اخترتها!']) });
  };

  return (
    <Screen title={t('drawTitle')} bg="#FCEDE6" headerColor="#E07A5F" scroll={false}
      right={<Pressable onPress={() => setGallery(true)} hitSlop={10}><Icon name="image-multiple" size={26} color={C.white} /></Pressable>}>
      {tab === 'monster' ? (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 40 }}>
          <WorldTabs tab={tab} setTab={setTab} color="#E07A5F" tabs={[{ k: 'monster', t: ['Mood Monster', 'وحش المشاعر'], icon: 'gamepad-variant' }, { k: 'paint', t: ['Free drawing', 'رسم حر'], icon: 'palette' }]} />
          <MoodMonster onFinish={gameDone} />
        </ScrollView>
      ) : (<>
      <View style={{ flex: 1, padding: 12, gap: 10 }}>
        <WorldTabs tab={tab} setTab={setTab} color="#E07A5F" tabs={[{ k: 'monster', t: ['Mood Monster', 'وحش المشاعر'], icon: 'gamepad-variant' }, { k: 'paint', t: ['Free drawing', 'رسم حر'], icon: 'palette' }]} />
        <Row gap={6}>
          <Pressable onPress={() => { setN(x => x + 1); play('jump', 0.5); }}><Fareed size={66} mood="happy" action="jump" nonce={n} /></Pressable>
          <Card style={{ flex: 1, paddingVertical: 10 }}>
            <Txt w={7} size={16}>{tr(DRAW_PROMPTS[prompt])}</Txt>
            <Pressable onPress={() => { play('pop', 0.4); setPrompt((prompt + 1) % DRAW_PROMPTS.length); }}>
              <Row gap={4}><Icon name="lightbulb-on-outline" size={16} color="#E07A5F" /><Txt w={7} size={13} color="#E07A5F">{t('newPrompt')}</Txt></Row>
            </Pressable>
          </Card>
        </Row>
        {/* canvas */}
        <View onLayout={e => setBox({ w: Math.round(e.nativeEvent.layout.width), h: Math.round(e.nativeEvent.layout.height) })}
          style={{ flex: 1, backgroundColor: C.white, borderRadius: 22, overflow: 'hidden', borderWidth: 3, borderColor: '#F3C6B5' }}
          onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}
          onResponderGrant={begin} onResponderMove={move} onResponderRelease={end} onResponderTerminate={end}>
          <Svg width="100%" height="100%" pointerEvents="none">
            {strokes.map((st, i) => <Path key={i} d={st.d} stroke={st.c} strokeWidth={st.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
            {cur ? <Path d={cur.d} stroke={cur.c} strokeWidth={cur.w} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </Svg>
        </View>
        {/* palette */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, flexDirection: rtl ? 'row-reverse' : 'row' }}>
          {[...PALETTE, { c: '#FFFFFF', n: ['Eraser', 'ممحاة'] as [string, string] }].map(p => (
            <Pressable key={p.c} onPress={() => { setColor(p.c); buzz(); }} style={{ alignItems: 'center', width: 52 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: p.c, borderWidth: color === p.c ? 4 : 2, borderColor: color === p.c ? C.purple : '#ddd', alignItems: 'center', justifyContent: 'center' }}>
                {p.c === '#FFFFFF' ? <Icon name="eraser" size={18} color={C.muted} /> : null}
              </View>
              <Txt w={6} size={11} center>{tr(p.n)}</Txt>
            </Pressable>
          ))}
        </ScrollView>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}>
            {SIZES.map(sz => (
              <Pressable key={sz} onPress={() => setW(sz)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: w === sz ? C.lav : C.white, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: sz, height: sz, borderRadius: sz / 2, backgroundColor: color === '#FFFFFF' ? '#ccc' : color }} />
              </Pressable>
            ))}
          </Row>
          <Row gap={6}>
            <Btn small icon="undo" color={C.white} text={C.purple} onPress={() => setStrokes(x => x.slice(0, -1))} />
            <Btn small icon="delete-outline" color={C.white} text={C.purple} onPress={() => setStrokes([])} />
            <Btn small title={t('save')} icon="content-save" color="#E07A5F" onPress={saveIt} disabled={!strokes.length} />
          </Row>
        </Row>
      </View>

      </>)}

      <Modal visible={gallery} animationType="slide" onRequestClose={() => setGallery(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FCEDE6' }}>
          <Row style={{ padding: 16, justifyContent: 'space-between' }}>
            <Txt w={8} size={22} color="#E07A5F">{t('myGallery')}</Txt>
            <Pressable onPress={() => setGallery(false)} hitSlop={10}><Icon name="close" size={28} color={C.purple} /></Pressable>
          </Row>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 14, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {s.drawings.length ? s.drawings.map(d => (
              <Card key={d.id} style={{ padding: 8, width: 160, gap: 4 }}>
                <View style={{ borderRadius: 12, overflow: 'hidden' }}><Mini d={d} size={144} /></View>
                <Txt size={12} color={C.muted} numberOfLines={2}>{tr(DRAW_PROMPTS[d.prompt])}</Txt>
              </Card>
            )) : <View style={{ alignItems: 'center', gap: 10, marginTop: 40 }}><Fareed size={150} mood="think" action="think" /><Txt w={6} color={C.muted}>{t('emptyGallery')}</Txt></View>}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Reward visible={!!gReward} stars={gReward?.stars} levelUp={gReward?.levelUp} message={gReward?.msg} onClose={() => setGReward(null)} />
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp} message={reward?.msg}
        onClose={() => { setReward(null); setStrokes([]); setGallery(true); }} onAgain={() => { setReward(null); setStrokes([]); setPrompt((prompt + 1) % DRAW_PROMPTS.length); }} />
    </Screen>
  );
}
