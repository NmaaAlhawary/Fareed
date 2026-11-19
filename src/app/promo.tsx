// Promo video stage (web only, used to render the marketing video; not linked from the app).
// Usage: /promo?lang=en|ar — the recorder calls window.__go(i) to switch scenes.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Fareed, { Action, Mood } from '../components/Fareed';
import { Confetti } from '../components/ui';
import { COMP } from '../lib/content';
import SCENES from '../../tools/promo/scenes.json';

const F = { b: 'BalooBhaijaan2_800ExtraBold', m: 'BalooBhaijaan2_600SemiBold' };
const BG: Record<string, string> = { hook: '#FFD36E', meet: '#4B2CA0', map: '#FFE9B8', catch: '#FFD6E0', beat: '#FFE3A8', float: '#CDEFF2', voice: '#F8D9C8', reef: '#CFE8F7', casel: '#E9E3FB', cta: '#FFD36E' };
const KEY = 'fareed-mobile-v1';

function seed(lang: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      name: lang === 'ar' ? 'كريم' : 'Kareem', lang, stars: 34,
      done: { charades: 1, monster: 1, feelmusic: 1, paint: 1, fmap: 1, guided: 1, float: 1, catch: 1 },
      moods: [{ d: Date.now(), m: 'happy' }], log: [],
    }));
  } catch (e) {}
}

export default function Promo() {
  const { lang = 'en' } = useLocalSearchParams<{ lang?: string }>();
  const ar = lang === 'ar';
  const { width: W, height: H } = useWindowDimensions();
  const portrait = H > W * 1.2; // square posts use the side-by-side layout
  const k = !portrait && H / W > 0.8 ? 0.6 : 1; // shrink text on square posts
  const [ready] = useState(() => { seed(lang); return true; });
  const [i, setI] = useState(-1);
  const [ptr, setPtr] = useState('');
  const [act, setAct] = useState<Action>('idle');
  const [mood, setMood] = useState<Mood>('happy');
  const [n, setN] = useState(0);
  const [boom, setBoom] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const runX = useRef(new Animated.Value(0)).current;
  const sc = SCENES[i] as any;

  useEffect(() => { (window as any).__go = (k: number) => setI(k); (window as any).__ptr = (id: string) => setPtr(id); (window as any).__ready = true; }, []);
  useEffect(() => {
    if (!sc) return;
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
    const T: any[] = [];
    const at = (ms: number, f: () => void) => T.push(setTimeout(f, ms));
    if (sc.id === 'hook') {
      runX.setValue(-W); setMood('excited'); setAct('run'); setN(x => x + 1);
      Animated.timing(runX, { toValue: 0, duration: 1300, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
      at(1350, () => { setAct('jump'); setN(x => x + 1); });
      at(2300, () => { setMood('surprised'); setAct('surprised'); setN(x => x + 1); });
    } else if (sc.id === 'meet') {
      runX.setValue(0); setMood('happy'); setAct('wave'); setN(x => x + 1);
      at(2200, () => { setAct('dance'); setN(x => x + 1); });
    } else if (sc.id === 'cta') {
      runX.setValue(0); setMood('excited'); setAct('celebrate'); setN(x => x + 1); setBoom(b => b + 1);
      at(2600, () => { setAct('wave'); setMood('happy'); setN(x => x + 1); });
    }
    return () => T.forEach(clearTimeout);
  }, [i]);

  const phoneScenes = SCENES.filter((s: any) => s.route);
  // phone size
  const appW = 390, appH = 844;
  const scale = portrait ? Math.min((W * 0.62) / appW, (H * 0.66) / appH) : Math.min((H * 0.86) / appH, (W * 0.3) / appW);
  const pw = appW * scale, ph = appH * scale;
  const isPhone = !!sc?.route;
  const tx = (o: any) => (o ? o[ar ? 'ar' : 'en'] : '');
  const capStyle = (size: number, color: string) => ({ fontFamily: F.b, fontSize: size, color, textAlign: 'center' as const, lineHeight: size * 1.25, writingDirection: (ar ? 'rtl' : 'ltr') as any });
  const textColor = sc?.id === 'meet' ? '#fff' : '#33197A';

  const caption = sc ? (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }], alignItems: 'center', gap: 8, paddingHorizontal: 24 }}>
      <Text style={capStyle((isPhone ? (portrait ? 40 : 44) : portrait ? 50 : 58) * k, textColor)}>{tx(sc.cap)}</Text>
      {sc.sub ? <Text style={{ ...capStyle((portrait ? 22 : 26) * k, sc.id === 'meet' ? '#FFD36E' : '#7A3FB8'), fontFamily: F.m }}>{tx(sc.sub)}</Text> : null}
      {sc.id === 'casel' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 4, maxWidth: portrait ? W - 40 : W * 0.5 }}>
          {Object.values(COMP).map(c => <View key={c.color} style={{ backgroundColor: c.color, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 }}><Text style={{ fontFamily: F.m, color: '#fff', fontSize: 14 * (k < 1 ? 0.8 : 1) }}>{c.n[ar ? 1 : 0]}</Text></View>)}
        </View>
      ) : null}
    </Animated.View>
  ) : null;

  const phone = (
    <View style={{ width: pw + 16, height: ph + 16, borderRadius: 34 * scale + 8, backgroundColor: '#1F1A24', padding: 8, opacity: isPhone ? 1 : 0,
      shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } }}>
      <View style={{ width: pw, height: ph, borderRadius: 30 * scale, overflow: 'hidden', backgroundColor: '#fff' }}>
        {ready ? phoneScenes.map((s: any) => (
          <View key={s.id} style={{ position: 'absolute', left: 0, top: 0, width: appW, height: appH, transform: [{ translateX: -(appW - pw) / 2 }, { translateY: -(appH - ph) / 2 }, { scale }],
            opacity: sc?.id === s.id ? 1 : 0, zIndex: ptr === s.id ? 3 : sc?.id === s.id ? 2 : 1, pointerEvents: ptr === s.id ? 'auto' : 'none' } as any}>
            {React.createElement('iframe', { src: s.route, 'data-scene': s.id, title: s.id, style: { width: appW, height: appH, border: 0, display: 'block' } })}
          </View>
        )) : null}
      </View>
    </View>
  );

  const bigFareed = sc && !isPhone ? (
    <Animated.View style={{ transform: [{ translateX: runX }] }}>
      <Fareed size={portrait ? 300 : 260 * (k < 1 ? 0.85 : 1)} mood={mood} action={act} nonce={n} onDone={() => setAct('idle')} />
    </Animated.View>
  ) : null;

  return (
    <View style={{ width: W, height: H, backgroundColor: sc ? BG[sc.id] : '#FFD36E', overflow: 'hidden' }}>
      {/* soft decorative circles */}
      <View style={{ position: 'absolute', width: W * 0.9, height: W * 0.9, borderRadius: W, backgroundColor: 'rgba(255,255,255,0.18)', top: -W * 0.3, left: -W * 0.3 }} />
      <View style={{ position: 'absolute', width: W * 0.7, height: W * 0.7, borderRadius: W, backgroundColor: 'rgba(255,255,255,0.14)', bottom: -W * 0.25, right: -W * 0.25 }} />
      {/* logo */}
      <View style={{ position: 'absolute', top: portrait ? 26 : 20, left: 0, right: 0, alignItems: 'center', opacity: sc && sc.id !== 'cta' ? 1 : 0 }}>
        <Text style={{ fontFamily: F.b, fontSize: 22, color: sc?.id === 'meet' ? '#FFD36E' : '#4B2CA0', letterSpacing: 3 }}>FAREED · فريد</Text>
      </View>
      {portrait ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: isPhone ? 'flex-start' : 'center', paddingTop: isPhone ? 70 : 0, gap: isPhone ? 14 : 24 }}>
          {sc?.id === 'cta' ? <Text style={{ fontFamily: F.b, fontSize: 64, color: '#4B2CA0', letterSpacing: 4 }}>FAREED</Text> : null}
          {caption}
          {isPhone ? null : bigFareed}
          {sc?.id === 'cta' ? <Text style={capStyle(24, '#4B2CA0')}>{ar ? 'نربط التعلّم بالحياة!' : 'Linking Learning to LIFE!'}</Text> : null}
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: ar ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: 50 * k, paddingHorizontal: 50 * k, paddingTop: k < 1 ? 30 : 0 }}>
          <View style={{ flex: 1, alignItems: 'center', gap: 16 }}>
            {sc?.id === 'cta' ? <Text style={{ fontFamily: F.b, fontSize: 70 * k, color: '#4B2CA0', letterSpacing: 4 }}>FAREED</Text> : null}
            {caption}
            {isPhone ? <Fareed size={130 * k} mood="happy" action="dance" nonce={i} /> : null}
            {sc?.id === 'cta' ? <Text style={capStyle(26 * k, '#4B2CA0')}>{ar ? 'نربط التعلّم بالحياة!' : 'Linking Learning to LIFE!'}</Text> : null}
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>{isPhone ? <View style={{ width: pw + 16, height: ph + 16 }} /> : bigFareed}</View>
        </View>
      )}
      {/* keep iframes mounted (preloaded) even on non-phone scenes */}
      <View style={{ position: 'absolute', top: portrait ? H - ph - 16 - 34 : (H - ph - 16) / 2,
        left: !isPhone ? -5000 : portrait ? (W - pw - 16) / 2 : ar ? 50 : W - pw - 16 - 50 }}>{phone}</View>
      <Confetti run={boom} />
    </View>
  );
}
