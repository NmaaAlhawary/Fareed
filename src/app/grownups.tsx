// Grown-ups corner behind a simple maths gate: progress on the 5 CASEL skills, moods, settings
import React, { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import MoodFace from '../components/MoodFace';
import { Btn, C, Card, Icon, Row, Screen, Txt } from '../components/ui';
import { COMP, FEELINGS } from '../lib/content';
import { levelOf, useStore } from '../lib/store';
import { ACTS, SESSION_COUNT, sessionStatus } from '../lib/curriculum';

export default function Grownups() {
  const { t, tr, s, set, reset, rtl } = useStore();
  const [a, b] = useMemo(() => [6 + Math.floor(Math.random() * 7), 3 + Math.floor(Math.random() * 6)], []);
  const [ans, setAns] = useState('');
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  if (!open) {
    return (
      <Screen title={t('grownups')} bg={C.lav}>
        <Card style={{ gap: 12, alignItems: 'center' }}>
          <Icon name="lock" size={40} color={C.purple} />
          <Txt w={8} size={20} center>{t('gateQ')} {a} × {b}?</Txt>
          <TextInput value={ans} onChangeText={v => { setAns(v); if (Number(v) === a * b) setOpen(true); }} keyboardType="number-pad" autoFocus
            style={{ width: 140, textAlign: 'center', fontSize: 28, fontFamily: 'BalooBhaijaan2_700Bold', backgroundColor: C.cream, borderRadius: 16, paddingVertical: 8, color: C.purple }} />
        </Card>
      </Screen>
    );
  }
  const max = Math.max(10, ...Object.values(s.comp));
  const moods = s.moods.slice(-14).reverse();
  const counts = FEELINGS.map(f => ({ f, c: s.moods.filter(m => m.m === f.id).length })).filter(x => x.c);
  return (
    <Screen title={t('grownups')} bg={C.lav}>
      <Card style={{ gap: 6 }}>
        <Txt w={8} size={22} color={C.purple}>{s.name}</Txt>
        <Row gap={14}><Txt w={7}>{t('level')} {levelOf(s.stars)}</Txt><Txt w={7}>★ {s.stars} {t('stars')}</Txt><Txt w={7}>{s.drawings.length} {tr(['drawings', 'رسمة'])}</Txt></Row>
        <Txt size={14} color={C.muted}>{t('about')}</Txt>
        <Txt w={7} size={14}>{tr(['Curriculum', 'المنهج'])}: {sessionStatus(s.done).filter(x => x.ok).length} / {SESSION_COUNT} {tr(['sessions', 'جلسة'])}</Txt>
        <Row gap={8} wrap>
          <Btn small title={tr(['Learning path', 'مسار التعلّم'])} icon="school" onPress={() => router.push('/path')} />
          <Btn small title={tr(['Research', 'الأبحاث'])} icon="flask-outline" color={C.white} text={C.purple} onPress={() => router.push('/research')} />
        </Row>
      </Card>
      <Card style={{ gap: 10 }}>
        <Txt w={8} size={19} color={C.purple}>{t('progress')}</Txt>
        {Object.entries(COMP).map(([k, c]) => (
          <View key={k} style={{ gap: 2 }}>
            <Row><Icon name={c.icon} size={18} color={c.color} /><Txt w={7} size={15} style={{ flex: 1 }}>{tr(c.n)}</Txt><Txt w={7} color={C.muted}>{s.comp[k]}</Txt></Row>
            <View style={{ height: 12, borderRadius: 6, backgroundColor: '#EEE9FA', overflow: 'hidden', flexDirection: rtl ? 'row-reverse' : 'row' }}>
              <View style={{ width: `${(s.comp[k] / max) * 100}%`, backgroundColor: c.color, borderRadius: 6 }} />
            </View>
          </View>
        ))}
      </Card>
      <Card style={{ gap: 10 }}>
        <Txt w={8} size={19} color={C.purple}>{t('moodLog')}</Txt>
        {moods.length ? (
          <>
            <Row wrap gap={10}>{counts.map(({ f, c }) => <Row key={f.id} gap={4}><MoodFace id={f.id} size={26} /><Txt w={7}>{tr(f.n)} ×{c}</Txt></Row>)}</Row>
            <Row wrap gap={8}>{moods.map((m, i) => (
              <View key={i} style={{ alignItems: 'center' }}><MoodFace id={m.m} size={34} />
                <Txt size={10} color={C.muted}>{new Date(m.d).toLocaleDateString(s.lang === 'ar' ? 'ar-JO' : 'en-GB', { day: 'numeric', month: 'short' })}</Txt></View>
            ))}</Row>
          </>
        ) : <Txt color={C.muted}>{t('nothing')}</Txt>}
      </Card>
      <Card style={{ gap: 8 }}>
        <Txt w={8} size={19} color={C.purple}>{t('activities')}</Txt>
        {Object.entries(ACTS).map(([k, a]) => (
          <Row key={k}><Icon name={a.icon} color={a.color} /><Txt w={6} style={{ flex: 1 }}>{tr(a.t)}</Txt><Txt w={8}>{s.done[k] || 0}</Txt></Row>
        ))}
      </Card>
      <Card style={{ gap: 10 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt w={8} size={17}>{t('language')}</Txt>
          <Row gap={6}>{(['en', 'ar'] as const).map(l => <Btn key={l} small title={l === 'en' ? 'English' : 'العربية'} color={s.lang === l ? C.purple : C.white} text={s.lang === l ? C.white : C.purple} onPress={() => set({ lang: l })} />)}</Row>
        </Row>
        {confirm ? (
          <Row style={{ justifyContent: 'space-between' }}><Txt w={7}>{t('sure')}</Txt>
            <Row gap={6}><Btn small title={t('no')} color={C.white} text={C.purple} onPress={() => setConfirm(false)} /><Btn small title={t('yes')} color="#F0544F" onPress={() => { reset(); router.replace('/'); }} /></Row></Row>
        ) : <Btn small title={t('reset')} icon="restart" color={C.white} text="#F0544F" onPress={() => setConfirm(true)} />}
      </Card>
    </Screen>
  );
}
