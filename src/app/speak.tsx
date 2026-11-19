// Wadi Rum — Echo Canyon: speaking challenges, "I feel" sentences, record yourself and hear your echo
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import Fareed, { Action, Mood } from '../components/Fareed';
import { Bubble, Btn, C, Card, Icon, Reward, Row, Screen, Txt } from '../components/ui';
import { I_FEEL, NEED, SPEAK_PROMPTS, T2, WHEN } from '../lib/content';
import WorldTabs from '../components/WorldTabs';
import VoiceJump from '../games/VoiceJump';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

function Chips({ items, value, onPick, color }: { items: T2[]; value: number; onPick: (i: number) => void; color: string }) {
  const { tr } = useStore();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {items.map((it, i) => (
        <Pressable key={i} onPress={() => { buzz(); onPick(i); }} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 2, borderColor: color, backgroundColor: value === i ? color : C.white }}>
          <Txt w={7} size={14} color={value === i ? C.white : C.ink}>{tr(it)}</Txt>
        </Pressable>
      ))}
    </View>
  );
}

export default function Speak() {
  const { t, tr, s, award } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'run');
  const [gReward, setGReward] = useState<any>(null);
  const gameDone = (stars: number, msg: string) => { const { levelUp } = award('voicerun', stars, ['RS', 'SA']); setGReward({ stars, levelUp, msg }); };
  const [mode, setMode] = useState<'challenge' | 'ifeel'>('challenge');
  const [pi, setPi] = useState(0);
  const [f, setF] = useState(4), [w, setW] = useState(0), [nd, setNd] = useState(2);
  const [act, setAct] = useState<Action>('wave'); const [mood, setMood] = useState<Mood>('happy'); const [n, setN] = useState(0);
  const [uri, setUri] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [reward, setReward] = useState<any>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const rec = useAudioRecorderState(recorder);
  const player = useAudioPlayer(null);
  const echo = useAudioPlayer(null);

  const prompt = SPEAK_PROMPTS[pi];
  const sentence = s.lang === 'ar'
    ? `${tr(['', 'أنا بحس'])} ${tr(I_FEEL[f])} ${tr(['', 'لما'])} ${tr(WHEN[w])}، ${tr(['', 'وبحتاج'])} ${tr(NEED[nd])}.`
    : `I feel ${I_FEEL[f][0]} when ${WHEN[w][0]}, and I need ${NEED[nd][0]}.`;
  const text = mode === 'challenge' ? tr(prompt.t) : sentence;

  useEffect(() => () => { Speech.stop(); }, []);
  const say = () => {
    Speech.stop(); setAct('talk'); setMood('happy'); setN(x => x + 1);
    Speech.speak(text, { language: s.lang === 'ar' ? 'ar-SA' : 'en-US', rate: 0.92, pitch: 1.2, onDone: () => setAct('idle'), onStopped: () => setAct('idle'), onError: () => setAct('idle') });
  };
  const startRec = async () => {
    setErr('');
    try {
      const p = await AudioModule.requestRecordingPermissionsAsync();
      if (!p.granted) { setErr(t('micNeeded')); setAct('sad'); setMood('sad'); return; }
      Speech.stop();
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record(); buzz();
      setAct('listen'); setMood('think'); setN(x => x + 1);
    } catch (e) { setErr(t('micNeeded')); }
  };
  const stopRec = async () => {
    try { await recorder.stop(); } catch (e) {}
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {});
    setUri(recorder.uri); setAct('celebrate'); setMood('excited'); setN(x => x + 1); play('ok');
    const comps = mode === 'challenge' ? prompt.comp : ['SA', 'RS'];
    setTimeout(() => { const { levelUp } = award('talk', 2, comps); setReward({ stars: 2, levelUp, msg: tr(['What a brave voice! Tap “Hear me” to hear your echo in Wadi Rum.', 'صوت شجاع! اضغط "اسمع صوتي" لتسمع صداك بوادي رم.']) }); }, 1400);
  };
  const hear = () => {
    if (!uri) return;
    player.replace({ uri }); player.volume = 1; player.play();
    setTimeout(() => { echo.replace({ uri }); echo.volume = 0.35; echo.play(); }, 420); // canyon echo
    setAct('dance'); setMood('happy'); setN(x => x + 1); setTimeout(() => setAct('idle'), 3000);
  };

  return (
    <Screen title={t('speakTitle')} bg="#F8E6DD" headerColor="#C8553D">
      <WorldTabs tab={tab} setTab={setTab} color="#C8553D" tabs={[{ k: 'run', t: ['Brave Voice Run', 'سباق الصوت الشجاع'], icon: 'gamepad-variant' }, { k: 'talk', t: ['Speak & record', 'احكي وسجّل'], icon: 'microphone' }]} />
      {tab === 'run' ? <VoiceJump onFinish={gameDone} /> : (<>
      <Row gap={8}>
        {(['challenge', 'ifeel'] as const).map(m => (
          <Pressable key={m} onPress={() => { play('pop', 0.4); setMode(m); setUri(null); }} style={{ flex: 1, paddingVertical: 8, borderRadius: 16, alignItems: 'center', backgroundColor: mode === m ? '#C8553D' : C.white }}>
            <Txt w={7} size={14} color={mode === m ? C.white : '#C8553D'}>{m === 'challenge' ? t('challenges') : t('iFeelBuilder')}</Txt>
          </Pressable>
        ))}
      </Row>
      <Card style={{ alignItems: 'center', gap: 8, backgroundColor: '#FFF4EC' }}>
        <Bubble text={rec.isRecording ? `${t('recording')} ${Math.floor((rec.durationMillis || 0) / 1000)}s` : text} style={{ maxWidth: 340 }} />
        <Fareed size={170} mood={mood} action={act} nonce={n} onDone={() => setAct('idle')} />
      </Card>

      {mode === 'challenge' ? (
        <Row style={{ justifyContent: 'space-between' }}>
          <Btn small icon="chevron-left" color={C.white} text={C.purple} onPress={() => { setPi((pi + SPEAK_PROMPTS.length - 1) % SPEAK_PROMPTS.length); setUri(null); }} />
          <Txt w={7} color={C.muted}>{pi + 1} / {SPEAK_PROMPTS.length}</Txt>
          <Btn small icon="chevron-right" color={C.white} text={C.purple} onPress={() => { setPi((pi + 1) % SPEAK_PROMPTS.length); setUri(null); }} />
        </Row>
      ) : (
        <Card style={{ gap: 10 }}>
          <Txt w={8} color="#C8553D">{t('iFeel')}…</Txt><Chips items={I_FEEL} value={f} onPick={setF} color="#F25C78" />
          <Txt w={8} color="#C8553D">{t('when')}…</Txt><Chips items={WHEN} value={w} onPick={setW} color="#2BA3D4" />
          <Txt w={8} color="#C8553D">{t('iNeed')}…</Txt><Chips items={NEED} value={nd} onPick={setNd} color="#5CC8A8" />
          <Txt size={14} color={C.muted}>{t('sayIt')}</Txt>
        </Card>
      )}

      <Row gap={10} style={{ justifyContent: 'center' }} wrap>
        <Btn icon="volume-high" title={t('hearFareed')} color={C.white} text={C.purple} onPress={say} />
        {rec.isRecording
          ? <Btn icon="stop" title={t('stop')} color="#F0544F" onPress={stopRec} />
          : <Btn icon="microphone" title={t('record')} color="#C8553D" onPress={startRec} />}
        {uri && !rec.isRecording ? <Btn icon="play" title={t('playMine')} color={C.green} onPress={hear} /> : null}
      </Row>
      {err ? <Row style={{ justifyContent: 'center' }}><Icon name="microphone-off" color="#F0544F" /><Txt color="#F0544F">{err}</Txt></Row> : null}
      </>)}
      <Reward visible={!!gReward} stars={gReward?.stars} levelUp={gReward?.levelUp} message={gReward?.msg} onClose={() => setGReward(null)} />
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp} message={reward?.msg}
        onClose={() => setReward(null)} onAgain={null} />
    </Screen>
  );
}
