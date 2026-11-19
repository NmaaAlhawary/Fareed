import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import Fareed from './Fareed';

export const C = {
  purple: '#4B2CA0', purpleD: '#33197A', yellow: '#FFD36E', cream: '#FFF8E7', orange: '#FFB74D', lav: '#E9E3FB',
  ink: '#2A1E4F', muted: '#7A7396', white: '#fff', green: '#2E9E6B', pink: '#F25C78', teal: '#5CC8A8',
};
const FONT = { 4: 'BalooBhaijaan2_400Regular', 5: 'BalooBhaijaan2_500Medium', 6: 'BalooBhaijaan2_600SemiBold', 7: 'BalooBhaijaan2_700Bold', 8: 'BalooBhaijaan2_800ExtraBold' };
const ND = Platform.OS !== 'web';

export function Txt({ w = 5, size = 16, color = C.ink, center = false, style = null, children, ...rest }: any) {
  const { rtl } = useStore();
  return <Text {...rest} style={[{ fontFamily: FONT[w], fontSize: size, color, lineHeight: size * 1.35, textAlign: center ? 'center' : rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' }, style]}>{children}</Text>;
}
export function Icon({ name, size = 22, color = C.ink, style = null }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
export function Row({ children, style = null, gap = 8, wrap = false }: any) {
  const { rtl } = useStore();
  return <View style={[{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap' }, style]}>{children}</View>;
}

// Bouncy button
export function Btn({ title = '', icon = null, onPress, color = C.purple, text = C.white, small = false, style = null, disabled = false, sound = 'pop' }: any) {
  const sc = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(sc, { toValue: v, useNativeDriver: ND, speed: 40, bounciness: 12 }).start();
  return (
    <Pressable disabled={disabled} onPressIn={() => to(0.92)} onPressOut={() => to(1)}
      onPress={() => { buzz(); if (sound) play(sound, 0.5); onPress?.(); }}>
      <Animated.View style={[{ backgroundColor: color, opacity: disabled ? 0.5 : 1, borderRadius: 999, paddingVertical: small ? 8 : 13, paddingHorizontal: small ? 14 : 22,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, transform: [{ scale: sc }],
        shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 }, style]}>
        {icon ? <Icon name={icon} size={small ? 18 : 22} color={text} /> : null}
        {title ? <Txt w={7} size={small ? 15 : 18} color={text}>{title}</Txt> : null}
      </Animated.View>
    </Pressable>
  );
}

export function Card({ children, style = null, color = C.white }: any) {
  return <View style={[{ backgroundColor: color, borderRadius: 24, padding: 16, shadowColor: '#4B2CA0', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, style]}>{children}</View>;
}

export function StarPill({ n, light = false }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: light ? 'rgba(255,255,255,0.9)' : C.white, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
      <Icon name="star" size={18} color="#FFB300" /><Txt w={8} size={16} color="#B07A00">{n}</Txt>
    </View>
  );
}

export function Bubble({ text, style = null, tail = 'down' }: any) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => { pop.setValue(0.6); Animated.spring(pop, { toValue: 1, useNativeDriver: ND, bounciness: 14 }).start(); }, [text]);
  if (!text) return null;
  return (
    <Animated.View style={[{ zIndex: 10, backgroundColor: C.white, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 3, borderColor: C.ink, transform: [{ scale: pop }] }, style]}>
      <Txt w={6} size={16} center>{text}</Txt>
      {tail === 'down' ? <View style={{ position: 'absolute', bottom: -12, alignSelf: 'center', width: 18, height: 18, backgroundColor: C.white, borderRightWidth: 3, borderBottomWidth: 3, borderColor: C.ink, transform: [{ rotate: '45deg' }] }} /> : null}
    </Animated.View>
  );
}

// Screen with header (back + title + stars)
export function Screen({ title = '', bg = C.cream, headerColor = null, scroll = true, children, right = null, onBack = null }: any) {
  const { s, rtl } = useStore();
  const Body = scroll ? ScrollView : View;
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: headerColor || bg }}>
        <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 10 }}>
          <Pressable onPress={() => { play('pop', 0.4); onBack ? onBack() : router.canGoBack() ? router.back() : router.replace('/'); }} hitSlop={12}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={rtl ? 'arrow-right' : 'arrow-left'} size={24} color={C.purple} />
          </Pressable>
          <Txt w={8} size={21} color={headerColor ? C.white : C.purple} style={{ flex: 1 }} numberOfLines={1}>{title}</Txt>
          {right}
          <StarPill n={s.stars} />
        </View>
      </SafeAreaView>
      <Body style={{ flex: 1 }} contentContainerStyle={scroll ? { padding: 16, paddingBottom: 60, gap: 16 } : undefined}>{children}</Body>
    </View>
  );
}

// Falling confetti
export function Confetti({ run }: { run: number }) {
  const { width, height } = Dimensions.get('window');
  const pieces = useRef([...Array(36)].map((_, i) => ({ x: Math.random() * width, d: Math.random() * 500, r: Math.random() * 360, c: ['#4B2CA0', '#FFC93C', '#5CC8A8', '#F25C78', '#2BA3D4', '#FF9440'][i % 6], v: new Animated.Value(0) }))).current;
  useEffect(() => {
    if (!run) return;
    pieces.forEach(p => { p.v.setValue(0); Animated.timing(p.v, { toValue: 1, duration: 1800 + Math.random() * 900, delay: p.d, easing: Easing.in(Easing.quad), useNativeDriver: ND }).start(); });
  }, [run]);
  if (!run) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View key={i} style={{ position: 'absolute', left: p.x, top: -20, width: 10, height: 16, borderRadius: 3, backgroundColor: p.c,
          transform: [{ translateY: p.v.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) }, { rotate: p.v.interpolate({ inputRange: [0, 1], outputRange: [`${p.r}deg`, `${p.r + 720}deg`] }) }],
          opacity: p.v.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] }) }} />
      ))}
    </View>
  );
}

// Reward popup: Fareed celebrates
export function Reward({ visible, stars, levelUp, message = '', onClose, onAgain = null }: any) {
  const { t, s } = useStore();
  const [n, setN] = React.useState(0);
  useEffect(() => { if (visible) { play('celebrate'); buzz('ok'); setN(x => x + 1); } }, [visible]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(42,30,79,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Card style={{ width: '100%', maxWidth: 380, alignItems: 'center', gap: 6, paddingTop: 22 }}>
          {levelUp ? <Txt w={8} size={20} color={C.pink}>{t('levelUp')} {t('level')} {Math.floor(s.stars / 12) + 1}</Txt> : null}
          <Fareed size={170} mood="excited" action="celebrate" nonce={n} />
          <Txt w={8} size={26} color={C.purple} center>{t('great')}</Txt>
          {message ? <Txt size={16} center color={C.muted}>{message}</Txt> : null}
          <Row style={{ marginVertical: 6 }}><Txt w={7} size={18}>{t('youEarned')}</Txt><StarPill n={`+${stars}`} /></Row>
          <Row gap={10} style={{ marginTop: 6 }}>
            {onAgain ? <Btn small title={t('again')} icon="refresh" color={C.lav} text={C.purple} onPress={onAgain} /> : null}
            <Btn small title={t('done')} icon="check" onPress={onClose} />
          </Row>
        </Card>
        <Confetti run={visible ? n : 0} />
      </View>
    </Modal>
  );
}
