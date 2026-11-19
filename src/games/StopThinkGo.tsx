// Stop · Think · Go: hold to run on GREEN, let go on RED (impulse control). At each red light a problem
// appears: think of the options and choose the one with the best result (social problem-solving steps).
// Skill: responsible decision-making + self-management.
import React, { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Fareed, { Action } from '../components/Fareed';
import { C, Card, Icon, Row, Txt } from '../components/ui';
import { T2 } from '../lib/content';
import { useStore } from '../lib/store';
import { buzz, play } from '../lib/sound';
import { Hud, Overlay, Phase, Pop, Pops, agePops, rnd, useForce, useLoop } from './kit';

const H = 300, FS = 78, GOAL = 1600;
type Problem = { q: T2; opts: { t: T2; ok: 0 | 1; then: T2 }[] };
const PROBLEMS: Problem[] = [
  { q: ['Two friends both want the swing.', 'صاحبين بدهم المرجيحة الثنين.'], opts: [
    { t: ['Take turns: 10 pushes each', 'كل واحد 10 دفشات بالدور'], ok: 1, then: ['Both get to play and stay friends.', 'الثنين بلعبوا وبضلّوا صحاب.'] },
    { t: ['Push to get there first', 'يدفش عشان يوصل أول'], ok: 0, then: ['Someone could get hurt and the fun stops.', 'ممكن حدا يتأذى واللعب يخرب.'] },
    { t: ['Walk away and sulk', 'يروح زعلان'], ok: 0, then: ['The problem is still there and you feel worse.', 'المشكلة باقية وإنت بتزعل أكثر.'] }] },
  { q: ['You forgot your homework at home.', 'نسيت واجبك بالبيت.'], opts: [
    { t: ['Tell the teacher honestly and bring it tomorrow', 'تحكي للمعلّم بصراحة وتجيبه بكرا'], ok: 1, then: ['The teacher trusts you more.', 'المعلّم بيثق فيك أكثر.'] },
    { t: ['Copy a friend’s homework quickly', 'تنسخ واجب صاحبك بسرعة'], ok: 0, then: ['You don’t learn, and it isn’t fair.', 'ما بتتعلّم، وهذا مش عدل.'] },
    { t: ['Say the dog ate it', 'تقول الكلب أكله'], ok: 0, then: ['Lies make people stop trusting you.', 'الكذب بيخلّي الناس ما تثق فيك.'] }] },
  { q: ['A classmate is laughed at for a mistake.', 'زميلك صاروا يضحكوا عليه لأنه غلط.'], opts: [
    { t: ['Say “Everyone makes mistakes!” and stand with them', 'تقول "كلنا بنغلط!" وتوقف معه'], ok: 1, then: ['They feel safe, others stop laughing.', 'بيحس بالأمان والباقي بوقّفوا ضحك.'] },
    { t: ['Laugh too so you fit in', 'تضحك معهم عشان تكون منهم'], ok: 0, then: ['Your classmate feels even more alone.', 'زميلك بحس إنه لحاله أكثر.'] },
    { t: ['Do nothing', 'ما تعمل شي'], ok: 0, then: ['Staying silent can feel like agreeing.', 'السكوت ممكن ينفهم إنك موافق.'] }] },
  { q: ['Your team is losing and you feel angry.', 'فريقك خسران وإنت معصّب.'], opts: [
    { t: ['Take 3 breaths, then cheer your team', 'تاخذ 3 أنفاس وبعدين تشجّع فريقك'], ok: 1, then: ['You calm down and the team tries harder.', 'بتهدأ والفريق بيحاول أكثر.'] },
    { t: ['Kick the ball away', 'تشوط الطابة بعيد'], ok: 0, then: ['The game stops and everyone is upset.', 'اللعب بوقف والكل بيزعل.'] },
    { t: ['Blame a teammate', 'تلوم زميلك'], ok: 0, then: ['They feel bad and the team falls apart.', 'بيزعل والفريق بتفكّك.'] }] },
  { q: ['You find a phone on the school bus.', 'لقيت موبايل بباص المدرسة.'], opts: [
    { t: ['Give it to the driver or a teacher', 'تعطيه للسائق أو للمعلّم'], ok: 1, then: ['The owner gets it back — you made their day.', 'صاحبه بيرجعله — فرّحته.'] },
    { t: ['Keep it, nobody saw', 'تخلّيه معك، ما حدا شاف'], ok: 0, then: ['Someone is worried and it isn’t yours.', 'في حدا قلقان، وهو مش إلك.'] },
    { t: ['Leave it on the seat', 'تتركه عالكرسي'], ok: 0, then: ['It might get lost or broken.', 'ممكن يضيع أو ينكسر.'] }] },
];

export default function StopThinkGo({ onFinish }: { onFinish: (stars: number, msg: string) => void }) {
  const { tr } = useStore();
  const [phase, setPhase] = useState<Phase>('ready');
  const [act, setAct] = useState<Action>('idle');
  const force = useForce();
  const g = useRef<any>(null);

  const newGame = () => {
    g.current = { dist: 0, light: 'green', lightT: rnd(2.5, 4), hold: false, stopsOk: 0, slips: 0, wise: 0, pIdx: 0, problem: null, picked: null, think: 0, pops: [] as Pop[], id: 0, order: [...PROBLEMS].sort(() => Math.random() - 0.5) };
    setPhase('play'); setAct('idle');
  };
  useLoop(phase === 'play', dt => {
    const st = g.current;
    if (st.problem) { force(); return; }           // paused while thinking
    st.lightT -= dt;
    if (st.light === 'green' && st.lightT <= 0) { st.light = 'yellow'; st.lightT = 1.0; play('pop', 0.6); }
    else if (st.light === 'yellow' && st.lightT <= 0) { st.light = 'red'; st.lightT = 0.9; buzz(); }
    else if (st.light === 'red' && st.lightT <= 0) {
      // judged after a short grace period: did Fareed stop?
      if (st.hold) { st.slips++; play('oops'); st.pops.push({ id: st.id++, x: 120, y: 80, text: tr(['Too fast!', 'بسرعة كثير!']), color: '#F0544F', t: 0 }); }
      else { st.stopsOk++; play('ok', 0.5); st.pops.push({ id: st.id++, x: 120, y: 80, text: tr(['Great stop!', 'وقفة ممتازة!']), color: C.green, t: 0 }); }
      { const pr = st.order[st.pIdx % st.order.length]; st.problem = { ...pr, opts: [...pr.opts].sort(() => Math.random() - 0.5) }; } st.pIdx++; st.picked = null; st.hold = false; setAct('think');
    }
    if (st.hold) st.dist += (st.light === 'red' ? 40 : 190) * dt;
    const want = st.hold ? 'run' : 'idle';
    if (act !== want && act !== 'celebrate' && act !== 'shake') setAct(want as Action);
    st.pops = agePops(st.pops, dt);
    if (st.dist >= GOAL) {
      setPhase('over');
      onFinish(Math.max(1, Math.min(5, st.wise + (st.slips === 0 ? 1 : 0))), `${st.wise} / ${st.pIdx}`);
    }
    force();
  });

  const choose = (k: number) => {
    const st = g.current; if (!st?.problem || st.picked !== null) return;
    st.picked = k; const ok = st.problem.opts[k].ok === 1;
    if (ok) { st.wise++; play('ok'); buzz('ok'); setAct('celebrate'); } else { play('oops'); buzz('bad'); setAct('shake'); }
    force();
  };
  const go = () => { const st = g.current; st.problem = null; st.light = 'green'; st.lightT = rnd(2.5, 4.5); setAct('idle'); force(); };

  const s = g.current;
  const lightC = { green: '#3CC46B', yellow: '#FFC93C', red: '#F0544F' };
  return (
    <View style={{ gap: 8 }}>
      {s ? <Hud score={s.wise} label={<Row gap={4}><Icon name="hand-back-left" color="#F0544F" /><Txt w={8}>{s.stopsOk}</Txt></Row>} /> : null}
      <Pressable onPressIn={() => { if (g.current && !g.current.problem) g.current.hold = true; }} onPressOut={() => { if (g.current) g.current.hold = false; }}
        style={{ height: H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#DDF3E4' }}>
        {/* road */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: '#6E6A7C' }} />
        {[...Array(8)].map((_, i) => <View key={i} style={{ position: 'absolute', bottom: 36, height: 6, width: 30, borderRadius: 3, backgroundColor: '#fff', left: ((i * 60 - (s ? s.dist : 0)) % 480 + 480) % 480 - 30 }} />)}
        {/* traffic light */}
        <View style={{ position: 'absolute', right: 18, top: 16, width: 44, padding: 5, borderRadius: 14, backgroundColor: '#2A1E4F', gap: 5 }}>
          {(['red', 'yellow', 'green'] as const).map(l => <View key={l} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: lightC[l], opacity: s?.light === l ? 1 : 0.2 }} />)}
        </View>
        <Txt w={8} size={26} color={s ? lightC[s.light] : C.purple} style={{ position: 'absolute', left: 16, top: 14 }}>
          {s ? (s.light === 'green' ? tr(['GO', 'امشِ']) : s.light === 'yellow' ? tr(['Get ready…', 'استعد…']) : tr(['STOP', 'قف'])) : ''}
        </Txt>
        {/* progress flag */}
        <View style={{ position: 'absolute', left: 16, right: 80, top: 56, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <View style={{ width: `${s ? Math.min(100, (s.dist / GOAL) * 100) : 0}%`, height: '100%', borderRadius: 4, backgroundColor: C.purple }} />
        </View>
        <View pointerEvents="none" style={{ position: 'absolute', left: 60, bottom: 52 }}>
          <Fareed size={FS} action={act} nonce={s?.pIdx || 0} mood={act === 'think' ? 'think' : act === 'shake' ? 'surprised' : 'happy'} onDone={() => setAct(g.current?.problem ? 'think' : 'idle')} />
        </View>
        {s ? <Pops pops={s.pops} /> : null}
        <Overlay phase={phase} onStart={newGame} action="think" mood="think"
          skill={tr(['Responsible decisions · Self-management', 'قرارات مسؤولة · إدارة الذات'])}
          goal={tr(['STOP on red, THINK, then GO!', 'قف عالأحمر، فكّر، وبعدين امشِ!'])}
          how={tr(['Hold the screen to run on green. Let go on red. At every red light, think about each choice and pick the best one.', 'اضغط عالشاشة لتركض عالأخضر. اترك عالأحمر. عند كل إشارة حمرا، فكّر بكل خيار واختار الأحسن.'])}
          result={s ? <Txt w={8} size={18} center>{tr(['Wise choices', 'قرارات حكيمة'])}: {s.wise} · {tr(['Good stops', 'وقفات صحيحة'])}: {s.stopsOk}</Txt> : null} />
      </Pressable>
      {s?.problem ? (
        <Card style={{ gap: 8, borderWidth: 3, borderColor: '#F0544F' }}>
          <Row gap={6}><Icon name="thought-bubble" color={C.purple} /><Txt w={8} size={17} style={{ flex: 1 }}>{tr(s.problem.q)}</Txt></Row>
          <Txt size={13} color={C.muted}>{tr(['Think: what would happen after each choice?', 'فكّر: شو رح يصير بعد كل خيار؟'])}</Txt>
          {s.problem.opts.map((o: any, k: number) => {
            const shown = s.picked !== null, right = shown && o.ok, wrong = s.picked === k && !o.ok;
            return (
              <Pressable key={k} onPress={() => choose(k)} style={{ padding: 10, borderRadius: 14, borderWidth: 3, borderColor: right ? C.green : wrong ? '#F0544F' : '#E3DDF5', backgroundColor: right ? '#EAF8F0' : wrong ? '#FFF0F2' : C.white }}>
                <Txt w={7} size={15}>{tr(o.t)}</Txt>
                {shown ? <Txt size={13} color={C.muted}>→ {tr(o.then)}</Txt> : null}
              </Pressable>
            );
          })}
          {s.picked !== null ? (
            <Pressable onPress={go} style={{ alignSelf: 'center', backgroundColor: '#3CC46B', borderRadius: 999, paddingHorizontal: 26, paddingVertical: 10 }}>
              <Txt w={8} color="#fff">{tr(['GO!', 'امشِ!'])}</Txt>
            </Pressable>
          ) : null}
        </Card>
      ) : null}
    </View>
  );
}
