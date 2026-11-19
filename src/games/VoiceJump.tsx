// Wadi Rum — Brave Voice Run: Fareed runs through the desert; say a brave word out loud (or tap) to jump the rocks.
// Using a clear, confident voice is practised as assertive communication (relationship skills).
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import Fareed from '../components/Fareed';
import { C, Icon, Row, Txt } from '../components/ui';
import { T2 } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, rnd, useForce, useLoop } from './kit';

const H = 400, GROUND = H - 70, FS = 80, FX = 70, GRAV = 1500, JUMP = -640, GAME = 60, VOICE_DB = -28;
const WORDS: T2[] = [['Yalla!', 'يلّا!'], ['I can!', 'بقدر!'], ['Stop, please!', 'وقّف لو سمحت!'], ['My turn!', 'دوري!'], ['No thanks!', 'لا شكرًا!'], ['Help me, please!', 'ساعدني لو سمحت!']];
type Obj = { id: number; x: number; kind: 'rock' | 'star'; y: number; w: number; h: number; hit?: boolean };

export default function VoiceJump({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [W, setW] = useState(340);
  const [phase, setPhase] = useState<Phase>('ready');
  const [mic, setMic] = useState<'off' | 'on' | 'denied'>('off');
  const [n, setN] = useState(0);
  const force = useForce();
  const g = useRef<any>(null);
  const recorder = useAudioRecorder({ ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true });
  const rec = useAudioRecorderState(recorder, 80);
  const level = typeof rec.metering === 'number' ? rec.metering : -160;

  const startMic = async () => {
    try {
      const p = await AudioModule.requestRecordingPermissionsAsync();
      if (!p.granted) { setMic('denied'); return; }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync({ ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true });
      recorder.record(); setMic('on');
    } catch (e) { setMic('denied'); }
  };
  const stopMic = async () => {
    try { if (recorder.isRecording) await recorder.stop(); } catch (e) {}
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {});
  };
  useEffect(() => () => { stopMic(); }, []);

  const jump = () => {
    const st = g.current;
    if (!st || phase !== 'play' || st.y < GROUND - 1) return;
    st.vy = JUMP; play('jump', 0.6); buzz();
    st.word = WORDS[Math.floor(Math.random() * WORDS.length)]; st.wordT = 1;
  };
  const newGame = () => {
    g.current = { t: 0, y: GROUND, vy: 0, objs: [] as Obj[], spawn: 1.2, hearts: 3, score: 0, stars: 0, inv: 0, id: 0, pops: [] as Pop[], off: 0, word: null, wordT: 0, jumps: 0 };
    setPhase('play'); setN(k => k + 1);
  };

  useLoop(phase === 'play', dt => {
    const st = g.current;
    st.t += dt;
    const speed = 210 + st.t * 3;
    st.off = (st.off + speed * dt) % 400;
    // voice jump
    if (mic === 'on' && level > VOICE_DB && st.y >= GROUND - 1) { jump(); st.jumps++; }
    st.vy += GRAV * dt; st.y = Math.min(GROUND, st.y + st.vy * dt);
    if (st.y >= GROUND) st.vy = 0;
    st.inv = Math.max(0, st.inv - dt); st.wordT = Math.max(0, st.wordT - dt);
    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = rnd(1.3, 2.3) * (230 / speed);
      const big = Math.random() < 0.3;
      st.objs.push({ id: st.id++, x: W + 30, kind: 'rock', y: GROUND, w: big ? 46 : 34, h: big ? 46 : 32 });
      if (Math.random() < 0.6) st.objs.push({ id: st.id++, x: W + 30, kind: 'star', y: GROUND - 150, w: 26, h: 26 });
    }
    const fTop = st.y - FS * 1.1, fL = FX - 22, fR = FX + 22;
    for (const o of st.objs) {
      o.x -= speed * dt;
      if (o.hit) continue;
      const oL = o.x - o.w / 2, oR = o.x + o.w / 2, oT = o.y - o.h;
      if (oR > fL && oL < fR && oT < st.y && o.y > fTop) {
        if (o.kind === 'star') { o.hit = true; st.stars++; st.score += 3; play('ok', 0.5); st.pops.push({ id: st.id++, x: o.x, y: oT, text: '+3', color: C.green, t: 0 }); }
        else if (!st.inv && oT < st.y - 6) { o.hit = true; st.hearts--; st.inv = 1.2; play('oops'); buzz('bad'); }
      }
    }
    st.objs = st.objs.filter((o: Obj) => o.x > -60 && !(o.kind === 'star' && o.hit));
    st.score += dt * 2;
    st.pops = agePops(st.pops, dt);
    if (st.hearts <= 0 || st.t >= GAME) {
      setPhase('over'); stopMic(); setMic(m => (m === 'on' ? 'off' : m));
      onFinish(Math.max(1, Math.min(5, Math.round(st.score / 30))), `${Math.round(st.score)}`);
    }
    force();
  });

  const s = g.current;
  const meter = Math.max(0, Math.min(1, (level + 60) / 50));
  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={Math.round(s.score)} hearts={s.hearts} time={GAME - s.t} /> : null}
      <Pressable onPressIn={jump} style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FFB98A' }} onLayout={e => setW(Math.round(e.nativeEvent.layout.width))}>
        {/* sky + rock formations + sand */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 160, backgroundColor: '#FFD2A6' }} />
        {[0, 1, 2].map(i => (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', top: 120, left: ((i * 220 - (s ? s.off * 0.3 : 0)) % 660 + 660) % 660 - 120, width: 150, height: 150,
            backgroundColor: '#C8553D', borderTopLeftRadius: 60, borderTopRightRadius: 30, opacity: 0.55 }} />
        ))}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: GROUND, bottom: 0, backgroundColor: '#E8A06A' }} />
        {[...Array(8)].map((_, i) => (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', top: GROUND + 18 + (i % 2) * 16, left: ((i * 70 - (s ? s.off : 0)) % 560 + 560) % 560 - 40, width: 26, height: 4, borderRadius: 2, backgroundColor: '#D48A55' }} />
        ))}
        {s?.objs.map((o: Obj) => o.kind === 'rock'
          ? <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: o.x - o.w / 2, top: o.y - o.h, width: o.w, height: o.h, backgroundColor: '#8A4B2E', borderTopLeftRadius: o.w / 2, borderTopRightRadius: o.w / 3, borderRadius: 8, opacity: o.hit ? 0.4 : 1 }} />
          : <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: o.x - 14, top: o.y - 28 }}><Icon name="star" size={30} color="#FFD23F" /></View>)}
        <View pointerEvents="none" style={{ position: 'absolute', left: FX - FS / 2, top: (s ? s.y : GROUND) - FS * 1.3 + 6, opacity: s && s.inv > 0 && Math.floor(s.inv * 10) % 2 ? 0.4 : 1 }}>
          <Fareed size={FS} action={phase === 'play' ? 'run' : 'idle'} nonce={n} mood={s && s.y < GROUND - 1 ? 'excited' : 'happy'} />
        </View>
        {s && s.wordT > 0 && s.word ? (
          <View pointerEvents="none" style={{ position: 'absolute', left: FX + 30, top: s.y - FS * 1.5, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 10, borderWidth: 2, borderColor: C.ink, opacity: s.wordT }}>
            <Txt w={8} size={16} color="#C8553D">{tr(s.word)}</Txt>
          </View>
        ) : null}
        {s ? <Pops pops={s.pops} /> : null}
        {/* voice meter */}
        {mic === 'on' ? (
          <View pointerEvents="none" style={{ position: 'absolute', right: 10, top: 10, width: 14, height: 120, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.5)', overflow: 'hidden', justifyContent: 'flex-end' }}>
            <View style={{ height: `${meter * 100}%`, backgroundColor: level > VOICE_DB ? C.green : '#C8553D' }} />
          </View>
        ) : null}
        <Overlay phase={phase} onStart={newGame} action="talk"
          skill={tr(['Relationship skills · a brave, clear voice', 'مهارات العلاقات · صوت واضح وشجاع'])}
          goal={tr(['Say a brave word out loud to make Fareed jump!', 'احكي كلمة شجاعة بصوت عالي عشان فريد ينط!'])}
          how={tr(['Turn on your voice below and say “Yalla!” or “I can!” — or tap the screen. Jump over rocks, grab stars.', 'شغّل صوتك تحت واحكي "يلّا!" أو "بقدر!" — أو اضغط الشاشة. نطّ فوق الصخور واجمع النجوم.'])}
          result={s ? <Txt w={8} size={18} center>{tr(['Distance', 'المسافة'])}: {Math.round(s.score)} · ★ {s.stars}</Txt> : null} />
      </Pressable>
      <Row style={{ justifyContent: 'center' }} gap={10}>
        {mic === 'on'
          ? <Row gap={6}><Icon name="microphone" color={C.green} /><Txt w={7} color={C.green}>{tr(['Voice jump is ON — speak up!', 'القفز بالصوت شغّال — احكي بصوت عالي!'])}</Txt></Row>
          : <Pressable onPress={startMic} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#C8553D', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Icon name="microphone" color="#fff" /><Txt w={7} color="#fff">{mic === 'denied' ? tr(['Microphone not allowed — tap to jump', 'الميكروفون مش مسموح — اضغط لتنط']) : tr(['Use my voice to jump', 'استخدم صوتي للقفز'])}</Txt>
            </Pressable>}
      </Row>
      {Platform.OS === 'web' ? <Txt size={12} center color={C.muted}>{tr(['Voice control works best on the phone.', 'التحكّم بالصوت بشتغل أحسن عالموبايل.'])}</Txt> : null}
    </View>
  );
}
