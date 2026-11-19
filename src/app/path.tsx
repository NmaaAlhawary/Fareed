// Learning Path: the 5-unit, 20-session SEL curriculum. Sessions unlock in order; each names its skill,
// links its games, explains the research in plain words, and ends the unit with a home mission.
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import Fareed from '../components/Fareed';
import { Btn, C, Card, Icon, Row, Screen, Txt } from '../components/ui';
import { ACTS, REFS, SESSION_COUNT, UNITS, sessionStatus } from '../lib/curriculum';
import { COMP } from '../lib/content';
import { useStore } from '../lib/store';

export default function Path() {
  const { s, tr, rtl } = useStore();
  const status = sessionStatus(s.done);
  const doneN = status.filter(x => x.ok).length;
  const current = status.find(x => !x.ok);
  const [open, setOpen] = useState<string | null>(current?.s.id || null);

  const go = (a: string) => { const x = ACTS[a]; router.push((x.tab ? `${x.route}?tab=${x.tab}` : x.route) as any); };

  return (
    <Screen title={tr(['My Learning Path', 'مسار تعلّمي'])} bg="#F4F1FF" headerColor={C.purple}>
      <Card style={{ gap: 6 }}>
        <Row>
          <Fareed size={70} mood="happy" action="wave" nonce={1} />
          <View style={{ flex: 1, gap: 4 }}>
            <Txt w={8} size={18} color={C.purple}>{doneN} / {SESSION_COUNT} {tr(['sessions', 'جلسة'])}</Txt>
            <View style={{ height: 12, borderRadius: 6, backgroundColor: '#EEE9FA', overflow: 'hidden', flexDirection: rtl ? 'row-reverse' : 'row' }}>
              <View style={{ width: `${Math.max(4, (doneN / SESSION_COUNT) * 100)}%`, backgroundColor: C.purple }} />
            </View>
            <Txt size={13} color={C.muted}>{tr(['2–3 short sessions a week · about 8 weeks', '2–3 جلسات قصيرة بالأسبوع · حوالي 8 أسابيع'])}</Txt>
          </View>
        </Row>
      </Card>

      {UNITS.map((u, ui) => {
        const rows = status.filter(x => x.u.id === u.id);
        const unitDone = rows.every(r => r.ok);
        return (
          <View key={u.id} style={{ gap: 8 }}>
            <Row gap={10}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: u.color, alignItems: 'center', justifyContent: 'center' }}><Icon name={u.icon} color="#fff" /></View>
              <View style={{ flex: 1 }}>
                <Txt w={6} size={12} color={u.color}>{tr(['Unit', 'الوحدة'])} {ui + 1} · {tr(COMP[u.comp].n)}</Txt>
                <Txt w={8} size={19}>{tr(u.t)}</Txt>
              </View>
              {unitDone ? <Icon name="trophy" color="#FFB300" size={26} /> : null}
            </Row>
            <Txt size={14} color={C.muted}>{tr(u.big)}</Txt>
            {rows.map(({ s: se, ok }, k) => {
              const isCur = current?.s.id === se.id, locked = !ok && !isCur, expanded = open === se.id && !locked;
              return (
                <Pressable key={se.id} disabled={locked} onPress={() => setOpen(expanded ? null : se.id)}>
                  <Card style={{ padding: 12, gap: 8, opacity: locked ? 0.55 : 1, borderWidth: isCur ? 3 : 0, borderColor: u.color }}>
                    <Row>
                      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: ok ? C.green : isCur ? u.color : '#ddd', alignItems: 'center', justifyContent: 'center' }}>
                        {ok ? <Icon name="check" color="#fff" size={18} /> : locked ? <Icon name="lock" color="#fff" size={16} /> : <Txt w={8} color="#fff">{k + 1}</Txt>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt w={8} size={16}>{tr(se.t)}</Txt>
                        <Txt size={13} color={C.muted}>{tr(se.goal)}</Txt>
                      </View>
                      {!locked ? <Icon name={expanded ? 'chevron-up' : 'chevron-down'} color={C.muted} /> : null}
                    </Row>
                    {expanded ? (
                      <View style={{ gap: 8 }}>
                        {[...new Set(se.acts)].map(a => (
                          <Btn key={a} small title={tr(ACTS[a].t)} icon={ACTS[a].icon} color={ACTS[a].color} onPress={() => go(a)} style={{ alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
                        ))}
                        <View style={{ backgroundColor: '#F7F5FF', borderRadius: 12, padding: 10, gap: 2 }}>
                          <Row gap={4}><Icon name="flask-outline" size={16} color={C.purple} /><Txt w={7} size={13} color={C.purple}>{tr(['Why this works', 'ليش هذا بنفع'])}</Txt></Row>
                          <Txt size={13}>{tr(se.why)}</Txt>
                          <Txt size={11} color={C.muted}>{se.refs.map(r => REFS[r]?.short).join(' · ')}</Txt>
                        </View>
                      </View>
                    ) : null}
                  </Card>
                </Pressable>
              );
            })}
            <Card color="#FFF6E0" style={{ padding: 12 }}>
              <Row><Icon name="home-heart" color="#E89B2C" /><Txt w={8} size={14} color="#B5730F" style={{ flex: 1 }}>{tr(['Home mission', 'مهمّة البيت'])}</Txt></Row>
              <Txt size={14}>{tr(u.home)}</Txt>
            </Card>
          </View>
        );
      })}
      <Btn small title={tr(['The research behind Fareed', 'الأبحاث وراء فريد'])} icon="flask-outline" color={C.white} text={C.purple} onPress={() => router.push('/research')} />
    </Screen>
  );
}
