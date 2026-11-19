// Petra — Mood Monster Maker: build a face that shows the asked feeling from eyes, brows, mouth and extras.
// Skill: knowing the facial cues of emotions (self-awareness) — the same cues children use to read others.
import React, { useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import Fareed, { Action, Mood } from '../components/Fareed';
import MoodFace from '../components/MoodFace';
import { Btn, C, Card, Icon, Row, Txt } from '../components/ui';
import { FeelingId, T2, feeling } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';

const ND = Platform.OS !== 'web';
const INK = '#2A1E4F';
type Parts = { eyes: string; brows: string; mouth: string; extra: string; color: string };
const EYES = ['round', 'happy', 'wide', 'angry', 'closed', 'sad'];
const BROWS = ['none', 'up', 'angry', 'worried', 'flat'];
const MOUTHS = ['smile', 'big', 'frown', 'O', 'wobbly', 'flat', 'tight'];
const EXTRAS = ['none', 'tear', 'blush', 'sweat', 'steam'];
const COLORS = ['#7BC96F', '#F8A5C2', '#7FB3F5', '#FFB25B', '#B79CE8', '#5CC8C0'];

// Which parts express each feeling (any listed option counts)
const RULES: Record<FeelingId, { mouth: string[]; eyes?: string[]; brows?: string[]; extra?: string[]; hint: T2 }> = {
  happy: { mouth: ['smile', 'big'], eyes: ['round', 'happy', 'wide'], hint: ['Happy faces smile — the mouth curves UP.', 'الوجه السعيد بيبتسم — التمّ لفوق.'] },
  sad: { mouth: ['frown', 'wobbly'], eyes: ['sad', 'round', 'closed'], brows: ['worried', 'none', 'flat'], hint: ['Sad mouths curve DOWN, and eyes look droopy.', 'التمّ الحزين لتحت والعيون نعسانة.'] },
  angry: { mouth: ['frown', 'tight', 'flat'], eyes: ['angry', 'round'], brows: ['angry'], hint: ['Angry eyebrows point DOWN to the middle.', 'حواجب الغضب بتنزل للنصّ.'] },
  scared: { mouth: ['wobbly', 'O'], eyes: ['wide'], brows: ['worried', 'up'], hint: ['Scared eyes are WIDE open, the mouth trembles.', 'العيون الخايفة مفتوحة كثير والتمّ برجف.'] },
  surprised: { mouth: ['O'], eyes: ['wide', 'round'], brows: ['up'], hint: ['Surprise = round “O” mouth + eyebrows up!', 'المفاجأة = تمّ مدوّر "O" + حواجب لفوق!'] },
  calm: { mouth: ['smile', 'flat'], eyes: ['closed', 'happy'], brows: ['none', 'flat'], hint: ['Calm faces are soft: relaxed eyes, gentle mouth.', 'الوجه الهادئ ناعم: عيون مرتاحة وتمّ هادي.'] },
};
const check = (f: FeelingId, p: Parts) => {
  const r = RULES[f];
  return r.mouth.includes(p.mouth) && (!r.eyes || r.eyes.includes(p.eyes)) && (!r.brows || r.brows.includes(p.brows));
};

function MonsterFace({ p, size = 220 }: { p: Parts; size?: number }) {
  const st = { stroke: INK, strokeWidth: 5, strokeLinecap: 'round' as const, fill: 'none' };
  const eye = (x: number) => {
    switch (p.eyes) {
      case 'happy': return <Path d={`M${x - 14},${92} Q${x},${74} ${x + 14},${92}`} {...st} />;
      case 'wide': return <G><Circle cx={x} cy={88} r={20} fill="#fff" stroke={INK} strokeWidth={4} /><Circle cx={x} cy={88} r={6} fill={INK} /></G>;
      case 'angry': return <G><Path d={`M${x - 16},${80} L${x + 16},${80} Q${x + 16},${102} ${x},${102} Q${x - 16},${102} ${x - 16},${80} Z`} fill="#fff" stroke={INK} strokeWidth={4} /><Circle cx={x} cy={90} r={6} fill={INK} /></G>;
      case 'closed': return <Path d={`M${x - 14},${86} Q${x},${98} ${x + 14},${86}`} {...st} />;
      case 'sad': return <G><Circle cx={x} cy={90} r={15} fill="#fff" stroke={INK} strokeWidth={4} /><Circle cx={x} cy={96} r={6} fill={INK} /><Path d={`M${x - 16},${84} L${x + 16},${84}`} stroke={p.color} strokeWidth={10} /></G>;
      default: return <G><Circle cx={x} cy={88} r={15} fill="#fff" stroke={INK} strokeWidth={4} /><Circle cx={x + 2} cy={86} r={7} fill={INK} /></G>;
    }
  };
  const brows = { none: null, up: <G><Path d="M58,52 Q76,38 94,52" {...st} /><Path d="M126,52 Q144,38 162,52" {...st} /></G>,
    angry: <G><Path d="M56,54 L96,68" {...st} strokeWidth={7} /><Path d="M164,54 L124,68" {...st} strokeWidth={7} /></G>,
    worried: <G><Path d="M58,66 L94,54" {...st} /><Path d="M162,66 L126,54" {...st} /></G>, flat: <G><Path d="M60,60 L94,60" {...st} /><Path d="M126,60 L160,60" {...st} /></G> }[p.brows];
  const mouth = { smile: <Path d="M80,140 Q110,166 140,140" {...st} />, big: <Path d="M74,134 Q110,186 146,134 Z" fill="#6B1F2A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />,
    frown: <Path d="M82,160 Q110,136 138,160" {...st} />, O: <Ellipse cx={110} cy={152} rx={14} ry={18} fill="#6B1F2A" stroke={INK} strokeWidth={4} />,
    wobbly: <Path d="M78,152 q8,-8 16,0 q8,8 16,0 q8,-8 16,0 q8,8 16,0" {...st} />, flat: <Path d="M86,150 L134,150" {...st} />,
    tight: <G><Path d="M82,146 L138,146 L138,158 L82,158 Z" fill="#fff" stroke={INK} strokeWidth={4} /><Path d="M96,146 L96,158 M110,146 L110,158 M124,146 L124,158" stroke={INK} strokeWidth={2} /></G> }[p.mouth];
  const extra = { none: null, tear: <Path d="M70,108 q-8,14 0,18 q8,-4 0,-18 Z" fill="#7CC6F2" stroke="#3E8FC0" strokeWidth={2} />,
    blush: <G><Ellipse cx={58} cy={122} rx={14} ry={8} fill="#FF7A90" opacity={0.6} /><Ellipse cx={162} cy={122} rx={14} ry={8} fill="#FF7A90" opacity={0.6} /></G>,
    sweat: <Path d="M176,60 q-8,14 0,18 q8,-4 0,-18 Z" fill="#9AD8F5" stroke="#3E8FC0" strokeWidth={2} />,
    steam: <G><Path d="M40,30 q-8,-10 0,-20 q8,-10 0,-20" {...st} stroke="#999" /><Path d="M180,30 q-8,-10 0,-20 q8,-10 0,-20" {...st} stroke="#999" /></G> }[p.extra];
  return (
    <Svg width={size} height={size} viewBox="0 -30 220 250">
      <Path d="M30,40 L18,0 L60,24 Z" fill={p.color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M190,40 L202,0 L160,24 Z" fill={p.color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M20,110 C20,40 60,18 110,18 C160,18 200,40 200,110 C200,170 170,210 110,210 C50,210 20,170 20,110 Z" fill={p.color} stroke={INK} strokeWidth={5} />
      <Ellipse cx={110} cy={180} rx={46} ry={22} fill="#fff" opacity={0.25} />
      {eye(76)}{eye(144)}{brows}{mouth}{extra}
    </Svg>
  );
}

function PartRow({ label, opts, value, onPick, render }) {
  const { rtl } = useStore();
  return (
    <View style={{ gap: 4 }}>
      <Txt w={7} size={13} color={C.muted}>{label}</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: rtl ? 'row-reverse' : 'row' }}>
        {opts.map((o: string) => (
          <Pressable key={o} onPress={() => { buzz(); play('pop', 0.35); onPick(o); }}
            style={{ width: 58, height: 58, borderRadius: 16, backgroundColor: value === o ? C.lav : C.white, borderWidth: 3, borderColor: value === o ? C.purple : '#eee', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {render(o)}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function MoodMonster({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const order = useMemo(() => (['happy', 'sad', 'angry', 'scared', 'surprised', 'calm'] as FeelingId[]).sort(() => Math.random() - 0.5), []);
  const blank: Parts = { eyes: 'round', brows: 'none', mouth: 'flat', extra: 'none', color: COLORS[0] };
  const [i, setI] = useState(0);
  const [p, setP] = useState<Parts>(blank);
  const [result, setResult] = useState<null | boolean>(null);
  const [firstTry, setFirstTry] = useState(0);
  const [tries, setTries] = useState(0);
  const [act, setAct] = useState<Action>('think'); const [mood, setMood] = useState<Mood>('think'); const [n, setN] = useState(0);
  const bounce = useRef(new Animated.Value(1)).current;
  const target = order[i];
  const set = (k: keyof Parts) => (v: string) => { setP(x => ({ ...x, [k]: v })); setResult(null); };

  const test = () => {
    const ok = check(target, p);
    setResult(ok); setN(x => x + 1);
    if (ok) {
      if (tries === 0) setFirstTry(x => x + 1);
      play('ok'); buzz('ok'); setMood(feeling(target).mood); setAct(feeling(target).action === 'idle' ? 'breatheIn' : feeling(target).action);
      Animated.sequence([Animated.spring(bounce, { toValue: 1.15, useNativeDriver: ND, speed: 30 }), Animated.spring(bounce, { toValue: 1, useNativeDriver: ND, bounciness: 14 })]).start();
    } else { setTries(x => x + 1); play('oops'); buzz('bad'); setMood('think'); setAct('shake'); }
  };
  const next = () => {
    if (i + 1 >= order.length) { onFinish(Math.max(1, firstTry), `${firstTry} / ${order.length}`); setI(0); setP(blank); setResult(null); setTries(0); setFirstTry(0); return; }
    setI(i + 1); setP({ ...blank, color: COLORS[(i + 1) % COLORS.length] }); setResult(null); setTries(0); setAct('think'); setMood('think');
  };
  const prev = (k: keyof Parts, v: string) => <MonsterFace p={{ ...blank, eyes: 'none' as any, mouth: 'none' as any, [k]: v, color: '#F2EEFF' } as Parts} size={56} />;

  return (
    <View style={{ gap: 10 }}>
      <Card style={{ gap: 6 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={8} style={{ flex: 1 }}><MoodFace id={target} size={40} />
            <View style={{ flex: 1 }}><Txt w={8} size={18} color={C.purple}>{tr(['Make the monster feel', 'خلّي الوحش يحس'])} {tr(feeling(target).n)}!</Txt>
              <Txt size={12} color={C.muted}>{i + 1} / {order.length}</Txt></View></Row>
          <Fareed size={64} mood={mood} action={act} nonce={n} onDone={() => setAct('idle')} />
        </Row>
        <Animated.View style={{ alignItems: 'center', transform: [{ scale: bounce }] }}><MonsterFace p={p} /></Animated.View>
        {result === false ? <Row><Icon name="lightbulb-on" color="#E89B2C" /><Txt size={14} style={{ flex: 1 }}>{tr(RULES[target].hint)}</Txt></Row> : null}
        {result === true ? <Row><Icon name="check-circle" color={C.green} /><Txt w={7} size={15} color={C.green} style={{ flex: 1 }}>{tr(['Yes! Anyone can see how your monster feels.', 'صح! أي حدا بيعرف شو شعور الوحش.'])}</Txt></Row> : null}
        {result === true ? <Btn title={tr(['Next monster', 'الوحش الجاي'])} icon="arrow-right" onPress={next} /> : <Btn title={tr(['Check my monster', 'افحص الوحش'])} icon="check" color="#E07A5F" onPress={test} />}
      </Card>
      <Card style={{ gap: 8 }}>
        <PartRow label={tr(['Eyes', 'عيون'])} opts={EYES} value={p.eyes} onPick={set('eyes')} render={(o: string) => prev('eyes', o)} />
        <PartRow label={tr(['Eyebrows', 'حواجب'])} opts={BROWS} value={p.brows} onPick={set('brows')} render={(o: string) => o === 'none' ? <Icon name="close" color={C.muted} /> : prev('brows', o)} />
        <PartRow label={tr(['Mouth', 'تمّ'])} opts={MOUTHS} value={p.mouth} onPick={set('mouth')} render={(o: string) => prev('mouth', o)} />
        <PartRow label={tr(['Extras', 'إضافات'])} opts={EXTRAS} value={p.extra} onPick={set('extra')} render={(o: string) => o === 'none' ? <Icon name="close" color={C.muted} /> : prev('extra', o)} />
        <PartRow label={tr(['Colour', 'لون'])} opts={COLORS} value={p.color} onPick={set('color')} render={(o: string) => <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: o }} />} />
      </Card>
    </View>
  );
}
