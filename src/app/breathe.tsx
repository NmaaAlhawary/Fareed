// Dead Sea — Float & Breathe: Fareed floats and fills a balloon with the child's breaths
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Ellipse, Circle } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import Fareed, { Action, Mood } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { Btn, C, Card, Icon, Reward, Row, Screen, Txt } from '../components/ui';
import { FEELINGS } from '../lib/content';
import WorldTabs from '../components/WorldTabs';
import BreathFloat from '../games/BreathFloat';
import { useStore } from '../lib/store';
import { buzz, play, stopAll } from '../lib/sound';

const ND = Platform.OS !== 'web';
const IN = 4, HOLD = 2, OUT = 5, TOTAL = 5;

export default function Breathe() {
  const { t, tr, award, set } = useStore();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(tabParam || 'float');
  const [gReward, setGReward] = useState<any>(null);
  const gameDone = (stars: number, msg: string) => { const { levelUp } = award('float', stars, ['SM']); setGReward({ stars, levelUp, msg }); };
  const [phase, setPhase] = useState<'ready' | 'in' | 'hold' | 'out' | 'after'>('ready');
  const [count, setCount] = useState(0);
  const [breath, setBreath] = useState(0);
  const [act, setAct] = useState<Action>('idle'); const [mood, setMood] = useState<Mood>('calm'); const [n, setN] = useState(0);
  const [reward, setReward] = useState<any>(null);
  const balloon = useRef(new Animated.Value(0.35)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const timers = useRef<any[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(bob, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: ND }),
      Animated.timing(bob, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: ND })])).start();
    return () => { timers.current.forEach(clearTimeout); stopAll(); };
  }, []);

  const tick = (secs: number) => { setCount(secs); for (let k = 1; k < secs; k++) later(() => setCount(secs - k), k * 1000); };
  const cycle = (b: number) => {
    setBreath(b); setPhase('in'); tick(IN); play('breathe_in', 0.7); buzz();
    setAct('breatheIn'); setMood('calm'); setN(x => x + 1);
    Animated.timing(balloon, { toValue: 1.15, duration: IN * 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: ND }).start();
    later(() => { setPhase('hold'); tick(HOLD); }, IN * 1000);
    later(() => {
      setPhase('out'); tick(OUT); play('breathe_out', 0.7); setAct('breatheOut'); setN(x => x + 1);
      Animated.timing(balloon, { toValue: 0.35, duration: OUT * 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: ND }).start();
    }, (IN + HOLD) * 1000);
    later(() => { if (b + 1 >= TOTAL) { setBreath(TOTAL); setPhase('after'); setAct('celebrate'); setMood('happy'); setN(x => x + 1); } else cycle(b + 1); }, (IN + HOLD + OUT) * 1000);
  };
  const after = (id: string) => {
    set(p => ({ moods: [...p.moods, { d: Date.now(), m: id }].slice(-60) }));
    const { levelUp } = award('guided', 3, ['SM']);
    setReward({ stars: 3, levelUp });
  };
  const label = phase === 'in' ? t('breatheIn') : phase === 'hold' ? t('hold') : phase === 'out' ? t('breatheOut') : '';

  return (
    <Screen title={t('breatheTitle')} bg="#E2F6F7" headerColor="#2BB3C0">
      <WorldTabs tab={tab} setTab={setTab} color="#2BB3C0" tabs={[{ k: 'float', t: ['Balloon Float', 'طيران البالون'], icon: 'gamepad-variant' }, { k: 'guided', t: ['Guided breathing', 'تنفّس موجّه'], icon: 'weather-windy' }]} />
      {tab === 'float' ? <BreathFloat onFinish={gameDone} /> : (<>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <View style={{ height: 380 }}>
          <Svg width="100%" height="100%" viewBox="0 0 360 380" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
            <Defs>
              <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#FFD6A5" /><Stop offset="1" stopColor="#FFB4A2" /></LinearGradient>
              <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#5FC9D3" /><Stop offset="1" stopColor="#2B8FA8" /></LinearGradient>
            </Defs>
            <Rect width="360" height="380" fill="url(#sky)" />
            <Circle cx="290" cy="80" r="34" fill="#FFF1C1" opacity="0.9" />
            <Path d="M0,210 L60,170 L110,195 L170,150 L230,190 L290,160 L360,200 L360,240 L0,240 Z" fill="#C98B6B" opacity="0.7" />
            <Rect y="230" width="360" height="150" fill="url(#sea)" />
            <Path d="M0,250 Q30,242 60,250 T120,250 T180,250 T240,250 T300,250 T360,250" stroke="#E6FBFF" strokeWidth="3" fill="none" opacity="0.7" />
            <Ellipse cx="90" cy="330" rx="40" ry="6" fill="#fff" opacity="0.35" />
            <Ellipse cx="270" cy="300" rx="30" ry="5" fill="#fff" opacity="0.35" />
          </Svg>
          {/* balloon */}
          <Animated.View style={{ position: 'absolute', alignSelf: 'center', top: 20, marginLeft: 120, transform: [{ scale: balloon }] }}>
            <Svg width={110} height={150} viewBox="0 0 110 150">
              <Ellipse cx="55" cy="55" rx="46" ry="52" fill="#FF8FA3" stroke="#C2405B" strokeWidth="3" />
              <Ellipse cx="38" cy="36" rx="10" ry="16" fill="#fff" opacity="0.5" />
              <Path d="M50,106 L60,106 L55,114 Z" fill="#C2405B" />
              <Path d="M55,114 Q45,130 58,150" stroke="#555" strokeWidth="2" fill="none" />
            </Svg>
          </Animated.View>
          <Animated.View style={{ position: 'absolute', alignSelf: 'center', top: 120, transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }] }}>
            <Fareed size={170} mood={mood} action={act} nonce={n} duration={(act === 'breatheIn' ? IN : OUT) * 1000} />
          </Animated.View>
          {label ? (
            <View style={{ position: 'absolute', top: 18, left: 18, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, alignItems: 'center' }}>
              <Txt w={8} size={20} color="#1B7D8F">{label}</Txt><Txt w={8} size={34} color={C.purple}>{count}</Txt>
            </View>
          ) : null}
        </View>
      </Card>
      {phase === 'ready' ? (
        <Card style={{ gap: 12 }}>
          <Txt size={17}>{t('breatheDesc')}</Txt>
          <Btn title={t('start')} icon="weather-windy" color="#2BB3C0" onPress={() => cycle(0)} />
        </Card>
      ) : phase === 'after' ? (
        <Card style={{ gap: 8 }}>
          <Txt w={8} size={20} color={C.purple}>{t('howNow')}</Txt>
          <Row wrap gap={8} style={{ justifyContent: 'center' }}>
            {FEELINGS.map(f => (
              <Pressable key={f.id} onPress={() => after(f.id)} style={{ alignItems: 'center', width: 72 }}>
                <MoodFace id={f.id} size={48} /><Txt w={6} size={13} center>{tr(f.n)}</Txt>
              </Pressable>
            ))}
          </Row>
        </Card>
      ) : (
        <Row style={{ justifyContent: 'center' }} gap={8}>
          <Txt w={7} color={C.muted}>{t('breaths')}</Txt>
          {[...Array(TOTAL)].map((_, k) => <Icon key={k} name={k < breath ? 'circle' : 'circle-outline'} size={18} color="#2BB3C0" />)}
        </Row>
      )}
      </>)}
      <Reward visible={!!gReward} stars={gReward?.stars} levelUp={gReward?.levelUp} message={gReward?.msg} onClose={() => setGReward(null)} />
      <Reward visible={!!reward} stars={reward?.stars} levelUp={reward?.levelUp}
        onClose={() => { setReward(null); router.back(); }} onAgain={() => { setReward(null); router.replace('/breathe'); }} />
    </Screen>
  );
}
