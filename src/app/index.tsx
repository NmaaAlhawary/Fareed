import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { router } from 'expo-router';
import Fareed, { Action, Mood } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { Btn, Bubble, C, Card, Confetti, Icon, Row, StarPill, Txt } from '../components/ui';
import { FEELINGS, KINDNESS, UI, WORLDS, feeling } from '../lib/content';
import { levelOf, levelProgress, useStore } from '../lib/store';
import { ACTS, SESSION_COUNT, sessionStatus } from '../lib/curriculum';
import { buzz, play } from '../lib/sound';

const ND = Platform.OS !== 'web';
const today = () => new Date().toDateString();

function LangToggle() {
  const { s, set } = useStore();
  return (
    <Row gap={0} style={{ borderRadius: 999, overflow: 'hidden', borderWidth: 2, borderColor: C.purple }}>
      {(['en', 'ar'] as const).map(l => (
        <Pressable key={l} onPress={() => { play('pop', 0.4); set({ lang: l }); }} style={{ paddingHorizontal: 12, paddingVertical: 3, backgroundColor: s.lang === l ? C.purple : C.white }}>
          <Txt w={7} size={14} color={s.lang === l ? C.white : C.purple}>{l === 'en' ? 'English' : 'العربية'}</Txt>
        </Pressable>
      ))}
    </Row>
  );
}

// ---------- first launch: Fareed runs in and says hello ----------
function Onboarding() {
  const { t, set } = useStore();
  const W = Dimensions.get('window').width;
  const x = useRef(new Animated.Value(-W)).current;
  const [action, setAction] = useState<Action>('run');
  const [mood, setMood] = useState<Mood>('excited');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [n, setN] = useState(0);
  const [boom, setBoom] = useState(0);
  useEffect(() => {
    play('whoosh');
    Animated.timing(x, { toValue: 0, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: ND }).start(() => { setAction('wave'); setMood('happy'); play('jump'); });
  }, []);
  const lines = [t('hello'), t('introA'), t('introB')];
  const next = () => {
    if (step < 2) { setStep(step + 1); setAction(step === 0 ? 'jump' : 'dance'); setN(n + 1); play('jump', 0.6); return; }
    if (step === 2) { setStep(3); setAction('think'); setMood('think'); return; }
    if (!name.trim()) return;
    setAction('celebrate'); setMood('excited'); setN(n + 1); setBoom(b => b + 1); play('celebrate');
    setTimeout(() => set({ name: name.trim() }), 1700);
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.yellow }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Row style={{ justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 8 }}>
          <Txt w={8} size={26} color={C.purple}>FAREED</Txt><LangToggle />
        </Row>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 18 }}>
          <Bubble text={step < 3 ? lines[step] : t('whatName')} style={{ maxWidth: 320 }} />
          <Animated.View style={{ transform: [{ translateX: x }] }}>
            <Fareed size={230} mood={mood} action={action} nonce={n} onDone={() => setAction(step === 3 ? 'think' : 'idle')} />
          </Animated.View>
          {step === 3 ? (
            <TextInput value={name} onChangeText={setName} placeholder={t('namePh')} placeholderTextColor="#B79A55" onSubmitEditing={next} autoFocus
              style={{ width: '100%', maxWidth: 320, backgroundColor: C.white, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12, fontSize: 22, fontFamily: 'BalooBhaijaan2_700Bold', color: C.purple, textAlign: 'center' }} />
          ) : null}
          <Btn title={step < 3 ? t('next') : t('letsGo')} icon={step < 3 ? 'arrow-right' : 'rocket-launch'} onPress={next} disabled={step === 3 && !name.trim()} style={{ minWidth: 200 }} />
          <Txt w={6} size={15} color={C.purple}>{t('appTag')}</Txt>
        </View>
      </SafeAreaView>
      <Confetti run={boom} />
    </View>
  );
}

// ---------- journey map ----------
function JourneyMap() {
  const { s, tr, t } = useStore();
  const W = Math.min(Dimensions.get('window').width, 520) - 32;
  const GAP = 132, TOP = 130;
  const pts = WORLDS.map((w, i) => ({ x: i % 2 === 0 ? W * 0.28 : W * 0.72, y: TOP + i * GAP }));
  const H = TOP + (WORLDS.length - 1) * GAP + 90;
  const pos = useRef(new Animated.ValueXY({ x: pts[0].x, y: pts[0].y })).current;
  const [here, setHere] = useState(0);
  const [act, setAct] = useState<Action>('idle');
  const [face, setFace] = useState<1 | -1>(1);
  const [n, setN] = useState(0);
  const busy = useRef(false);
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; d += ` C${a.x},${a.y + GAP * 0.6} ${b.x},${b.y - GAP * 0.6} ${b.x},${b.y}`; }
  const go = (i: number) => {
    if (busy.current) return; busy.current = true; buzz();
    const target = pts[i];
    const done = () => { setAct('jump'); setN(x => x + 1); play('jump', 0.6); setTimeout(() => { busy.current = false; router.push(WORLDS[i].route as any); }, 650); };
    if (i === here) return done();
    setFace(target.x >= (pts[here].x) ? 1 : -1); setAct('run'); play('whoosh', 0.5);
    Animated.timing(pos, { toValue: target, duration: 450 + Math.abs(i - here) * 220, easing: Easing.inOut(Easing.quad), useNativeDriver: ND }).start(() => { setHere(i); done(); });
  };
  const F = 78;
  return (
    <View>
      <Txt w={8} size={22} color={C.purple} style={{ marginBottom: 4 }}>{t('journey')}</Txt>
      <View style={{ height: H, width: W, alignSelf: 'center' }}>
        <Svg width={W} height={H} style={{ position: 'absolute' }}>
          <Path d={d} stroke="#E9C77B" strokeWidth={22} fill="none" strokeLinecap="round" />
          <Path d={d} stroke="#FFF3CF" strokeWidth={4} strokeDasharray="10 12" fill="none" strokeLinecap="round" />
          {[...Array(14)].map((_, i) => <Circle key={i} cx={(i * 97) % W} cy={30 + ((i * 173) % (H - 40))} r={3 + (i % 3)} fill="#F4DFA8" />)}
        </Svg>
        {WORLDS.map((w, i) => {
          const p = pts[i], left = i % 2 === 0;
          const plays = Object.entries(ACTS).filter(([, a]) => a.route === w.route).reduce((m, [k]) => m + (s.done[k] || 0), 0);
          return (
            <Pressable key={w.id} onPress={() => go(i)} style={{ position: 'absolute', left: p.x - 40, top: p.y - 40, alignItems: 'center' }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: w.color, borderWidth: 5, borderColor: C.white, alignItems: 'center', justifyContent: 'center',
                shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 5 }}>
                <Icon name={w.icon} size={36} color={C.white} />
                {plays ? <View style={{ position: 'absolute', top: -6, right: -6, backgroundColor: C.green, borderRadius: 12, minWidth: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.white }}>
                  <Icon name="check" size={14} color={C.white} /></View> : null}
              </View>
              <View style={{ position: 'absolute', top: 6, [left ? 'left' : 'right']: 88, width: W * 0.42 }}>
                <Txt w={8} size={17} color={w.color} style={{ textAlign: left ? 'left' : 'right' }}>{tr(w.n as any)}</Txt>
                <Txt w={7} size={15} style={{ textAlign: left ? 'left' : 'right' }}>{tr(w.t as any)}</Txt>
                <Txt size={13} color={C.muted} style={{ textAlign: left ? 'left' : 'right' }}>{tr(w.d as any)}</Txt>
              </View>
            </Pressable>
          );
        })}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: -F * 0.5, top: -F * 1.3 - 34, transform: pos.getTranslateTransform() }}>
          <Fareed size={F} action={act} nonce={n} facing={face} mood={act === 'run' ? 'excited' : 'happy'} onDone={() => setAct('idle')} />
        </Animated.View>
      </View>
    </View>
  );
}

// ---------- home ----------
const TAPS: { a: Action; m: Mood; s: string }[] = [
  { a: 'jump', m: 'excited', s: 'jump' }, { a: 'dance', m: 'happy', s: 'mel_happy' }, { a: 'spin', m: 'excited', s: 'whoosh' },
  { a: 'wave', m: 'happy', s: 'pop' }, { a: 'celebrate', m: 'proud', s: 'celebrate' }, { a: 'run', m: 'excited', s: 'whoosh' },
];
const TAP_LINES: [string, string][] = [['Wheee!', 'ييي!'], ['Let’s dance!', 'يلا نرقص!'], ['I’m dizzy!', 'دخت!'], ['Marhaba!', 'مرحبا!'], ['You’re awesome!', 'إنت رائع!'], ['Catch me!', 'الحقني!']];

function Home() {
  const { s, set, t, tr, award, rtl } = useStore();
  const [act, setAct] = useState<Action>('wave');
  const [mood, setMood] = useState<Mood>('happy');
  const [n, setN] = useState(0);
  const [say, setSay] = useState(`${t('hi')} ${s.name}! ${t('tapFareed')}`);
  const [boom, setBoom] = useState(0);
  const lvl = levelOf(s.stars);
  const todayMood = s.moods.find(m => new Date(m.d).toDateString() === today());
  const dayIdx = Math.floor(Date.now() / 864e5) % KINDNESS.length;
  const kindDone = s.kindness.day === today() && s.kindness.done;
  const weekKind = s.log.filter(l => l.id === 'kindness' && Date.now() - l.ts < 7 * 864e5).length;
  const status = sessionStatus(s.done);
  const next = status.find(x => !x.ok);
  const doneN = status.filter(x => x.ok).length;

  const tap = () => {
    const pick = TAPS[Math.floor(Math.random() * TAPS.length)], i = TAPS.indexOf(pick);
    setAct(pick.a); setMood(pick.m); setN(x => x + 1); play(pick.s, 0.7); buzz();
    setSay(tr(TAP_LINES[i]));
    if (pick.a === 'run' || pick.a === 'dance') setTimeout(() => setAct('idle'), 2400);
  };
  const pickMood = (id: string) => {
    const f = feeling(id);
    set(p => ({ moods: [...p.moods.filter(m => new Date(m.d).toDateString() !== today()), { d: Date.now(), m: id }].slice(-60) }));
    setMood(f.mood); setAct(f.action); setN(x => x + 1); setSay(tr(f.reply)); buzz();
    if (id === 'sad' || id === 'angry' || id === 'scared' || id === 'calm') play('pop'); else play('jump', 0.6);
    if (f.action !== 'jump' && f.action !== 'surprised') setTimeout(() => { setAct('idle'); }, 3500);
  };
  const kind = () => {
    award('kindness', 2, ['SO', 'RS']); set({ kindness: { day: today(), idx: dayIdx, done: true } });
    setAct('celebrate'); setMood('proud'); setN(x => x + 1); setBoom(b => b + 1); play('celebrate'); setSay(t('didIt'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* header + Fareed stage */}
        <View style={{ backgroundColor: C.purple, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}>
          <SafeAreaView edges={['top']}>
            <Row style={{ paddingHorizontal: 18, paddingTop: 6, justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Txt w={8} size={26} color={C.white}>{t('hi')} {s.name}!</Txt>
                <Row gap={8}>
                  <View style={{ backgroundColor: C.yellow, borderRadius: 999, paddingHorizontal: 10 }}><Txt w={8} size={14} color={C.purple}>{t('level')} {lvl}</Txt></View>
                  <View style={{ flex: 1, maxWidth: 140, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', flexDirection: rtl ? 'row-reverse' : 'row' }}>
                    <View style={{ width: `${Math.max(6, levelProgress(s.stars) * 100)}%`, backgroundColor: C.yellow }} />
                  </View>
                </Row>
              </View>
              <StarPill n={s.stars} light />
              <Pressable onPress={() => router.push('/grownups')} hitSlop={10} style={{ marginStart: 8 }}><Icon name="cog" size={26} color={C.white} /></Pressable>
            </Row>
            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
              <Bubble text={say} style={{ maxWidth: 300, marginBottom: 12 }} />
              <Pressable onPress={tap}><Fareed size={190} mood={mood} action={act} nonce={n} onDone={() => setAct('idle')} /></Pressable>
            </View>
            {/* hills */}
            <Svg width="100%" height={40} viewBox="0 0 400 40" preserveAspectRatio="none" style={{ marginTop: -26 }}>
              <Path d="M0,22 C80,0 160,30 240,14 C310,0 360,14 400,10 L400,40 L0,40 Z" fill="#6A48C8" />
            </Svg>
          </SafeAreaView>
        </View>

        <View style={{ padding: 16, gap: 18, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
          <Card>
            <Txt w={8} size={20} color={C.purple}>{t('moodQ')}</Txt>
            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8, paddingTop: 8, justifyContent: 'space-between' }}>
              {FEELINGS.map(f => {
                const on = todayMood?.m === f.id;
                return (
                  <Pressable key={f.id} onPress={() => pickMood(f.id)} style={{ alignItems: 'center', padding: 6, borderRadius: 18, borderWidth: 3, borderColor: on ? f.color : 'transparent', backgroundColor: on ? '#FFFBEF' : '#FAF8FF', width: '31%' }}>
                    <MoodFace id={f.id} size={50} /><Txt w={6} size={13} center>{tr(f.n)}</Txt>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Pressable onPress={() => router.push('/path')}>
            <Card color={next ? next.u.color : C.green} style={{ gap: 4 }}>
              <Row>
                <Icon name="school" color="#fff" size={26} />
                <Txt w={7} size={13} color="#fff" style={{ flex: 1 }}>{next ? `${tr(['Today’s lesson', 'درس اليوم'])} · ${tr(next.u.t)}` : tr(['All 20 sessions done!', 'خلّصت الـ 20 جلسة!'])}</Txt>
                <Txt w={8} size={13} color="#fff">{doneN}/{SESSION_COUNT}</Txt>
              </Row>
              {next ? <Txt w={8} size={20} color="#fff">{tr(next.s.t)}</Txt> : null}
              {next ? <Txt size={14} color="#fff">{tr(next.s.goal)}</Txt> : null}
              <View style={{ alignSelf: rtl ? 'flex-start' : 'flex-end', backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 4, marginTop: 4 }}>
                <Txt w={8} size={14} color={next ? next.u.color : C.green}>{tr(['Open my learning path', 'افتح مسار تعلّمي'])} {rtl ? '‹' : '›'}</Txt>
              </View>
            </Card>
          </Pressable>

          <JourneyMap />

          <Card color={kindDone ? '#EAF8F0' : '#FFF1D0'}>
            <Row><Icon name="hand-heart" size={28} color={C.pink} /><Txt w={8} size={18} color={C.purple} style={{ flex: 1 }}>{t('todayChallenge')}</Txt>
              <Row gap={2}>{[0, 1, 2].map(k => <Icon key={k} name={k < weekKind ? 'heart' : 'heart-outline'} size={20} color={C.pink} />)}</Row></Row>
            <Txt size={13} color={C.muted}>{tr(['Kindness quest: 3 kind acts this week', 'مهمّة اللطف: 3 أفعال لطيفة هالأسبوع'])} ({Math.min(weekKind, 3)}/3)</Txt>
            <Txt w={6} size={17} style={{ marginVertical: 8 }}>{tr(KINDNESS[dayIdx])}</Txt>
            {kindDone ? <Row><Icon name="check-circle" color={C.green} /><Txt w={7} color={C.green}>{t('didIt')}</Txt></Row>
              : <Btn small title={t('iDidIt')} icon="check" color={C.pink} onPress={kind} style={{ alignSelf: rtl ? 'flex-end' : 'flex-start' }} />}
          </Card>
        </View>
      </ScrollView>
      <Confetti run={boom} />
    </View>
  );
}

export default function Index() {
  const { s } = useStore();
  return s.name ? <Home /> : <Onboarding />;
}
