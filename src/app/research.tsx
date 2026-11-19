// Research & curriculum notes for parents and teachers: CASEL competencies, SAFE design, evidence and references.
import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { C, Card, Icon, Row, Screen, Txt } from '../components/ui';
import { EVIDENCE, REFS, UNITS } from '../lib/curriculum';
import { COMP, T2 } from '../lib/content';
import { useStore } from '../lib/store';

const DEFS: Record<string, T2> = {
  SA: ['Understanding one’s own emotions, thoughts and values and how they influence behaviour.', 'فهم مشاعري وأفكاري وقيمي وكيف بتأثّر على سلوكي.'],
  SM: ['Managing emotions, thoughts and behaviours effectively and working toward goals.', 'إدارة مشاعري وأفكاري وتصرّفاتي بفعالية والسعي لأهدافي.'],
  SO: ['Understanding others’ perspectives and empathising, including people from diverse backgrounds.', 'فهم وجهات نظر الآخرين والتعاطف معهم، حتى المختلفين عنّي.'],
  RS: ['Building and keeping healthy, supportive relationships and working well with others.', 'بناء علاقات صحيّة وداعمة والحفاظ عليها والعمل منيح مع الآخرين.'],
  DM: ['Making caring and constructive choices about behaviour and social interactions.', 'اتخاذ قرارات لطيفة وبنّاءة بسلوكي وتعاملي مع الناس.'],
};
const SAFE: [string, T2][] = [
  ['S', ['Sequenced — 5 units build from naming feelings to solving problems.', 'متسلسل — 5 وحدات من تسمية المشاعر لحل المشكلات.']],
  ['A', ['Active — every skill is practised through play, voice, drawing and movement.', 'نشط — كل مهارة بتنتمارس باللعب والصوت والرسم والحركة.']],
  ['F', ['Focused — 20 short sessions, 2–3 a week, with repeated practice.', 'مركّز — 20 جلسة قصيرة، 2–3 بالأسبوع، مع تكرار.']],
  ['E', ['Explicit — each session names its skill and learning goal.', 'صريح — كل جلسة بتسمّي مهارتها وهدفها.']],
];

export default function Research() {
  const { tr } = useStore();
  return (
    <Screen title={tr(['Research & curriculum', 'الأبحاث والمنهج'])} bg="#F4F1FF" headerColor={C.purple}>
      <Card style={{ gap: 8 }}>
        <Txt w={8} size={19} color={C.purple}>{tr(['Built on the CASEL framework', 'مبني على إطار CASEL'])}</Txt>
        <Txt size={14} color={C.muted}>{tr(['Fareed teaches the five CASEL Social & Emotional Learning competencies for ages 8–12. Fareed is not endorsed by CASEL.', 'فريد بعلّم كفايات CASEL الخمس للتعلّم الاجتماعي والعاطفي لأعمار 8–12. فريد غير معتمد رسميًا من CASEL.'])}</Txt>
        {Object.entries(COMP).map(([k, c]) => (
          <Row key={k} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} color="#fff" size={18} /></View>
            <View style={{ flex: 1 }}>
              <Txt w={8} size={15}>{tr(c.n)} <Txt size={12} color={C.muted}>— {tr(['Unit', 'الوحدة'])} {UNITS.findIndex(u => u.comp === k) + 1}</Txt></Txt>
              <Txt size={13} color={C.muted}>{tr(DEFS[k])}</Txt>
            </View>
          </Row>
        ))}
      </Card>
      <Card style={{ gap: 8 }}>
        <Txt w={8} size={19} color={C.purple}>{tr(['How the curriculum is designed (SAFE)', 'كيف صمّمنا المنهج (SAFE)'])}</Txt>
        {SAFE.map(([l, t]) => (
          <Row key={l} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' }}><Txt w={8} color={C.purple}>{l}</Txt></View>
            <Txt size={14} style={{ flex: 1 }}>{tr(t)}</Txt>
          </Row>
        ))}
        <Txt size={13} color={C.muted}>{tr(['Plus: home missions at the end of every unit, because SEL works better when it reaches the home.', 'وكمان: مهمّة بيتية بآخر كل وحدة، لأن التعلّم الاجتماعي العاطفي بشتغل أحسن لما يوصل للبيت.'])}</Txt>
      </Card>
      <Card style={{ gap: 10 }}>
        <Txt w={8} size={19} color={C.purple}>{tr(['What the evidence says', 'شو بتقول الأدلّة'])}</Txt>
        {EVIDENCE.map((e, i) => (
          <View key={i} style={{ gap: 2 }}>
            <Txt size={14}>{tr(e.t)}</Txt>
            <Txt size={11} color={C.muted}>{e.refs.map(r => REFS[r].short).join(' · ')}</Txt>
          </View>
        ))}
      </Card>
      <Card style={{ gap: 10 }}>
        <Txt w={8} size={19} color={C.purple}>{tr(['References', 'المراجع'])}</Txt>
        {Object.values(REFS).map(r => (
          <Pressable key={r.url} onPress={() => Linking.openURL(r.url)}>
            <Txt size={12} style={{ textAlign: 'left', writingDirection: 'ltr' }}>{r.apa}</Txt>
            <Txt size={11} color="#2BA3D4" style={{ textAlign: 'left', writingDirection: 'ltr' }}>{r.url}</Txt>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}
