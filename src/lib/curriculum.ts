// Fareed SEL curriculum — 5 units (one per CASEL competency), 20 sessions of 10–15 minutes.
// Design follows SAFE (Sequenced, Active, Focused, Explicit — Durlak et al., 2011): skills go from naming
// feelings → calming → others' feelings → relationships → problem-solving; every session names one skill,
// is practised through play, repeats earlier games at higher difficulty (Diamond & Lee, 2011), and ends
// with a real-life home mission so skills transfer outside the app (family involvement, CASEL).
import { T2 } from './content';

export type ActId = 'charades' | 'monster' | 'paint' | 'feelmusic' | 'fmap' | 'catch' | 'guided' | 'float' | 'freeze' | 'echo' | 'beat'
  | 'stopgo' | 'stories' | 'reef' | 'kindness' | 'talk' | 'voicerun';

export const ACTS: Record<ActId, { t: T2; route: string; tab?: string; icon: string; color: string }> = {
  charades: { t: ['Feelings Charades', 'تمثيل المشاعر'], route: '/feelings', tab: 'charades', icon: 'drama-masks', color: '#F25C78' },
  catch: { t: ['Feelings Catch', 'التقط الشعور'], route: '/feelings', tab: 'catch', icon: 'gamepad-variant', color: '#F25C78' },
  fmap: { t: ['Feelings Map', 'خريطة المشاعر'], route: '/feelings', tab: 'map', icon: 'map-marker-radius', color: '#F25C78' },
  monster: { t: ['Mood Monster', 'وحش المشاعر'], route: '/draw', tab: 'monster', icon: 'emoticon-outline', color: '#E07A5F' },
  paint: { t: ['Draw your feelings', 'ارسم مشاعرك'], route: '/draw', tab: 'paint', icon: 'palette', color: '#E07A5F' },
  feelmusic: { t: ['Feel the Music', 'احسّ بالموسيقى'], route: '/music', tab: 'feel', icon: 'ear-hearing', color: '#FFB020' },
  beat: { t: ['Beat Theatre', 'مسرح الإيقاع'], route: '/music', tab: 'beat', icon: 'music', color: '#FFB020' },
  echo: { t: ['Echo the Beat', 'ردّد الإيقاع'], route: '/music', tab: 'echo', icon: 'piano', color: '#FFB020' },
  freeze: { t: ['Freeze Dance', 'رقصة الثبات'], route: '/music', tab: 'freeze', icon: 'human-handsup', color: '#FFB020' },
  guided: { t: ['Guided breathing', 'تنفّس موجّه'], route: '/breathe', tab: 'guided', icon: 'weather-windy', color: '#2BB3C0' },
  float: { t: ['Balloon Float', 'طيران البالون'], route: '/breathe', tab: 'float', icon: 'balloon', color: '#2BB3C0' },
  talk: { t: ['Speak & record', 'احكي وسجّل'], route: '/speak', tab: 'talk', icon: 'microphone', color: '#C8553D' },
  voicerun: { t: ['Brave Voice Run', 'سباق الصوت الشجاع'], route: '/speak', tab: 'run', icon: 'run-fast', color: '#C8553D' },
  reef: { t: ['Kindness Reef', 'شعاب اللطف'], route: '/stories', tab: 'reef', icon: 'fish', color: '#4B2CA0' },
  stopgo: { t: ['Stop · Think · Go', 'قف · فكّر · امشِ'], route: '/stories', tab: 'stop', icon: 'traffic-light', color: '#4B2CA0' },
  stories: { t: ['Choose-your-path story', 'قصة إنت بتختار فيها'], route: '/stories', tab: 'stories', icon: 'book-open-variant', color: '#4B2CA0' },
  kindness: { t: ['Kind act (home screen)', 'فعل لطيف (الرئيسية)'], route: '/', icon: 'hand-heart', color: '#F25C78' },
};

export type Session = { id: string; t: T2; goal: T2; acts: ActId[]; why: T2; refs: string[] };
export type Unit = { id: string; comp: 'SA' | 'SM' | 'SO' | 'RS' | 'DM'; t: T2; big: T2; color: string; icon: string; sessions: Session[]; home: T2 };

export const UNITS: Unit[] = [
  {
    id: 'u1', comp: 'SA', t: ['Know My Feelings', 'أعرف مشاعري'], color: '#2BA3D4', icon: 'eye',
    big: ['I can notice and name what I feel — with more than “good” or “bad”.', 'بقدر ألاحظ وأسمّي شعوري — بأكثر من "منيح" و"مش منيح".'],
    home: ['At dinner, everyone names one feeling from today and where they felt it in their body.', 'على العشاء، كل واحد يسمّي شعور من اليوم ووين حسّه بجسمه.'],
    sessions: [
      { id: 'u1s1', t: ['Name it', 'سمّيه'], goal: ['Recognise 6 basic feelings from face and body.', 'أتعرّف على 6 مشاعر أساسية من الوجه والجسم.'], acts: ['charades'],
        why: ['Putting feelings into words (“affect labelling”) is linked to calmer emotional reactions.', 'تسمية المشاعر بالكلمات مرتبطة بردود فعل عاطفية أهدأ.'], refs: ['lieberman2007', 'casel'] },
      { id: 'u1s2', t: ['Faces tell feelings', 'الوجه بيحكي'], goal: ['Know which eyes, brows and mouth show each feeling.', 'أعرف أي عيون وحواجب وتمّ بتبيّن كل شعور.'], acts: ['monster'],
        why: ['Facial-cue practice builds the emotion-recognition skill used to read others.', 'التدرّب على ملامح الوجه بيبني مهارة قراءة مشاعر الآخرين.'], refs: ['casel', 'durlak2011'] },
      { id: 'u1s3', t: ['Feelings in music', 'المشاعر بالموسيقى'], goal: ['Hear happy, sad, angry or calm in music (tempo & mode).', 'أسمع الفرح والحزن والغضب والهدوء بالموسيقى.'], acts: ['feelmusic', 'paint'],
        why: ['From about age 5, children use tempo and mode to tell happy from sad music.', 'من عمر 5 تقريبًا، الأطفال بيميّزوا الموسيقى الفرحانة من الحزينة من سرعتها ونغمتها.'], refs: ['dallabella2001'] },
      { id: 'u1s4', t: ['Feelings map', 'خريطة المشاعر'], goal: ['Place feelings by energy and pleasantness; learn new feeling words.', 'أرتّب المشاعر حسب الطاقة واللطافة؛ وأتعلّم كلمات جديدة.'], acts: ['fmap'],
        why: ['Feelings can be described on two dimensions: energy (arousal) and pleasantness (valence).', 'المشاعر بتنوصف ببُعدين: الطاقة واللطافة.'], refs: ['russell1980'] },
    ],
  },
  {
    id: 'u2', comp: 'SM', t: ['Calm My Body', 'أهدّي جسمي'], color: '#E8B400', icon: 'weather-windy',
    big: ['When a big feeling comes, I can stop, breathe and choose what to do.', 'لما يجيني شعور كبير، بقدر أوقف وأتنفّس وأختار شو أعمل.'],
    home: ['Practise “turtle”: stop, tuck in, 3 slow breaths, then come out and think — try it once this week when upset.', 'تدرّبوا على "السلحفاة": قف، انكمش، 3 أنفاس بطيئة، ثم اطلع وفكّر — جرّبوها مرّة هالأسبوع وقت الزعل.'],
    sessions: [
      { id: 'u2s1', t: ['Slow breathing', 'تنفّس بطيء'], goal: ['Breathe at about 6 breaths a minute with Fareed.', 'أتنفّس تقريبًا 6 أنفاس بالدقيقة مع فريد.'], acts: ['guided', 'float'],
        why: ['Slow, paced breathing lowered anxiety in 7–12-year-olds; it helps most on worried days. It is a coping tool, not a cure.', 'التنفّس البطيء خفّف القلق عند أعمار 7–12؛ وبيساعد أكثر بالأيام المقلقة. هو أداة تهدئة مش علاج.'], refs: ['aranberri2022', 'kramer2022'] },
      { id: 'u2s2', t: ['Freeze & focus', 'ثبات وتركيز'], goal: ['Stop on a signal and hold a pattern in memory.', 'أوقف على الإشارة وأحفظ النمط بذاكرتي.'], acts: ['freeze', 'echo'],
        why: ['Self-control and working memory improve with repeated, increasingly hard practice — including games and music.', 'ضبط النفس والذاكرة العاملة بتتحسّن بالتدريب المتكرّر والأصعب تدريجيًا — حتى بالألعاب والموسيقى.'], refs: ['diamond2011', 'harvardEF'] },
      { id: 'u2s3', t: ['Wait for it', 'استنّى اللحظة'], goal: ['Act at the right moment — not too early.', 'أتصرّف باللحظة الصح — مش بدري.'], acts: ['beat'],
        why: ['Timing games train inhibitory control: holding back until the right moment.', 'ألعاب التوقيت بتدرّب على كبح الاندفاع لحد اللحظة المناسبة.'], refs: ['diamond2011'] },
      { id: 'u2s4', t: ['Red light, calm light', 'إشارة الهدوء'], goal: ['Stop my body on “red”, then breathe to reset.', 'أوقف جسمي عالأحمر، وأتنفّس لأرجع هادي.'], acts: ['stopgo', 'float'],
        why: ['Stop/go circle games improved self-regulation, especially for children who started with lower skills.', 'ألعاب "قف/امشِ" حسّنت تنظيم الذات، خصوصًا للي بدأوا بمهارات أقل.'], refs: ['tominey2011', 'csefel'] },
    ],
  },
  {
    id: 'u3', comp: 'SO', t: ['In Their Shoes', 'مكان غيري'], color: '#F07F2D', icon: 'hand-heart',
    big: ['I can imagine how others feel and choose to be kind.', 'بقدر أتخيّل شعور غيري وأختار ألطف تصرّف.'],
    home: ['Watch a cartoon together and pause: “How does this character feel? How do you know?”', 'احضروا كرتون سوا ووقّفوا: "شو شعور هالشخصية؟ كيف عرفت؟"'],
    sessions: [
      { id: 'u3s1', t: ['Read the situation', 'اقرأ الموقف'], goal: ['Guess how someone feels from what happened to them.', 'أخمّن شعور حدا من اللي صار معه.'], acts: ['catch'],
        why: ['Perspective-taking was the key ingredient of a school program that built friendships between Turkish and Syrian refugee children.', 'تبنّي وجهة نظر الآخر كان المكوّن الأساسي لبرنامج بنى صداقات بين أطفال أتراك ولاجئين سوريين.'], refs: ['alan2021'] },
      { id: 'u3s2', t: ['How would they feel?', 'شو رح يحس؟'], goal: ['Notice feelings of every character in a story.', 'ألاحظ مشاعر كل شخصية بالقصة.'], acts: ['stories'],
        why: ['Empathy and perspective-taking can be taught and improved in primary school.', 'التعاطف وتبنّي وجهة النظر مهارات بتنعلّم وبتتحسّن بالمدرسة الابتدائية.'], refs: ['schonert2015', 'alan2021'] },
      { id: 'u3s3', t: ['Kind or unkind?', 'لطيف ولّا مؤذي؟'], goal: ['Tell kind actions from hurtful ones quickly.', 'أميّز الأفعال اللطيفة من المؤذية بسرعة.'], acts: ['reef'],
        why: ['Children aged 9–11 who did kind acts became more accepted by peers.', 'الأطفال من 9 لـ 11 اللي عملوا أفعال لطيفة صاروا مقبولين أكثر بين زملائهم.'], refs: ['layous2012'] },
      { id: 'u3s4', t: ['Kindness quest', 'مهمّة اللطف'], goal: ['Do 3 real kind acts this week and tick them on the home screen.', 'أعمل 3 أفعال لطيفة حقيقية هالأسبوع وأسجّلها بالرئيسية.'], acts: ['kindness', 'kindness', 'kindness'],
        why: ['The study used 3 kind acts a week for 4 weeks; real-life practice helps skills transfer.', 'الدراسة استخدمت 3 أفعال لطيفة بالأسبوع لمدة 4 أسابيع؛ التطبيق بالحياة بساعد المهارة تنتقل.'], refs: ['layous2012', 'taylor2017'] },
    ],
  },
  {
    id: 'u4', comp: 'RS', t: ['Brave Voice, Good Friend', 'صوت شجاع وصديق منيح'], color: '#86A825', icon: 'handshake',
    big: ['I can say what I feel and need clearly and kindly.', 'بقدر أحكي شو بحس وشو بحتاج بوضوح ولطف.'],
    home: ['Use one “I feel… when… I need…” sentence at home this week instead of a complaint.', 'استخدم جملة "أنا بحس… لما… بحتاج…" بالبيت هالأسبوع بدل الشكوى.'],
    sessions: [
      { id: 'u4s1', t: ['I-messages', 'رسائل "أنا"'], goal: ['Build and say an “I feel… when… I need…” sentence.', 'أركّب وأحكي جملة "أنا بحس… لما… بحتاج…".'], acts: ['talk'],
        why: ['“I” statements tend to cause less anger than blaming “you” statements (a communication practice; evidence is limited).', 'جمل "أنا" غالبًا بتسبّب غضب أقل من جمل اللوم "إنت" (ممارسة تواصل؛ الأدلة محدودة).'], refs: ['kubany1992'] },
      { id: 'u4s2', t: ['Brave, clear voice', 'صوت واضح وشجاع'], goal: ['Speak up confidently: “No thanks!”, “My turn!”, “Help me, please!”', 'أحكي بثقة: "لا شكرًا!"، "دوري!"، "ساعدني لو سمحت!"'], acts: ['voicerun'],
        why: ['Asking for help and resisting negative pressure are CASEL relationship skills.', 'طلب المساعدة ومقاومة الضغط السلبي من مهارات العلاقات عند CASEL.'], refs: ['casel'] },
      { id: 'u4s3', t: ['Joining in', 'أنضم للّعب'], goal: ['Practise asking to join and handling a “not now”.', 'أتدرّب أطلب أنضم وأتعامل مع "مش هلّق".'], acts: ['stories', 'talk'],
        why: ['Social-skills games improved children’s social initiation and emotion regulation.', 'ألعاب المهارات الاجتماعية حسّنت المبادرة الاجتماعية وتنظيم المشاعر عند الأطفال.'], refs: ['craig2016'] },
      { id: 'u4s4', t: ['Good teammate', 'زميل فريق منيح'], goal: ['Choose kind team behaviours under time pressure.', 'أختار تصرّفات فريق لطيفة حتى تحت ضغط الوقت.'], acts: ['reef', 'voicerun'],
        why: ['Skills practised more often and in new settings are more likely to last.', 'المهارات اللي بنتدرّب عليها أكثر وبمواقف جديدة أكثر احتمال تدوم.'], refs: ['taylor2017'] },
    ],
  },
  {
    id: 'u5', comp: 'DM', t: ['Stop · Think · Go', 'قف · فكّر · امشِ'], color: '#4B2CA0', icon: 'sign-direction',
    big: ['When there is a problem I stop, think of options and their results, then choose.', 'لما يكون في مشكلة، بوقف، بفكّر بالخيارات ونتايجها، وبعدين بختار.'],
    home: ['Pick a small family problem (e.g., sharing the TV) and solve it together with Stop · Think · Go.', 'اختاروا مشكلة عائلية صغيرة (مثل مشاركة التلفزيون) وحلّوها سوا بخطوات قف · فكّر · امشِ.'],
    sessions: [
      { id: 'u5s1', t: ['Stop first', 'قف أولًا'], goal: ['Stop and name the problem and the feelings before acting.', 'أوقف وأسمّي المشكلة والمشاعر قبل ما أتصرّف.'], acts: ['stopgo'],
        why: ['Programs teaching stop–think–go problem-solving reduced aggression in classrooms.', 'برامج "قف–فكّر–امشِ" قلّلت العدوانية بالصفوف.'], refs: ['cpprg1999', 'low2015'] },
      { id: 'u5s2', t: ['Think of results', 'فكّر بالنتايج'], goal: ['Predict what happens after each choice.', 'أتوقّع شو بصير بعد كل خيار.'], acts: ['stories'],
        why: ['Anticipating and evaluating consequences is a core CASEL decision-making skill.', 'توقّع النتايج وتقييمها مهارة أساسية لاتخاذ القرار عند CASEL.'], refs: ['casel'] },
      { id: 'u5s3', t: ['Mixed challenge', 'تحدّي مختلط'], goal: ['Use calm + read feelings + choose well, all at once.', 'أستعمل الهدوء وقراءة المشاعر والاختيار الصح مع بعض.'], acts: ['stopgo', 'catch'],
        why: ['Executive skills must keep being challenged to keep improving.', 'المهارات التنفيذية لازم تضل تنتحدّى عشان تضل تتحسّن.'], refs: ['diamond2011'] },
      { id: 'u5s4', t: ['Celebrate & review', 'احتفال ومراجعة'], goal: ['Show all five superpowers and check in with my feelings.', 'أبيّن قواي الخمس وأسجّل شعوري.'], acts: ['fmap', 'float', 'beat'],
        why: ['SEL benefits can last for years; skills at the end of a program predict later well-being.', 'فوائد التعلّم الاجتماعي العاطفي ممكن تدوم سنين؛ والمهارات بآخر البرنامج بتتنبّأ بالرفاه لاحقًا.'], refs: ['taylor2017', 'durlak2011'] },
    ],
  },
];

// Session completion: cumulative — the n-th time an activity appears in the path it needs n completions,
// so repeats count as real repeated practice.
export function sessionStatus(done: Record<string, number>) {
  const need: Record<string, number> = {};
  const out: { s: Session; u: Unit; ok: boolean }[] = [];
  for (const u of UNITS) for (const s of u.sessions) {
    let ok = true;
    for (const a of s.acts) { need[a] = (need[a] || 0) + 1; if ((done[a] || 0) < need[a]) ok = false; }
    out.push({ s, u, ok });
  }
  // a session is only "done" if the earlier ones are too (sequenced)
  let all = true;
  for (const o of out) { o.ok = all && o.ok; all = o.ok; }
  return out;
}
export const SESSION_COUNT = UNITS.reduce((n, u) => n + u.sessions.length, 0);

export const REFS: Record<string, { short: string; apa: string; url: string }> = {
  casel: { short: 'CASEL', apa: 'CASEL. (n.d.). What is the CASEL framework?', url: 'https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/' },
  durlak2011: { short: 'Durlak et al., 2011', apa: 'Durlak, J. A., Weissberg, R. P., Dymnicki, A. B., Taylor, R. D., & Schellinger, K. B. (2011). The impact of enhancing students’ social and emotional learning: A meta-analysis of school-based universal interventions. Child Development, 82(1).', url: 'https://doi.org/10.1111/j.1467-8624.2010.01564.x' },
  taylor2017: { short: 'Taylor et al., 2017', apa: 'Taylor, R. D., Oberle, E., Durlak, J. A., & Weissberg, R. P. (2017). Promoting positive youth development through school-based social and emotional learning interventions: A meta-analysis of follow-up effects. Child Development, 88(4).', url: 'https://doi.org/10.1111/cdev.12864' },
  lieberman2007: { short: 'Lieberman et al., 2007', apa: 'Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421–428. (Adult sample.)', url: 'https://doi.org/10.1111/j.1467-9280.2007.01916.x' },
  russell1980: { short: 'Russell, 1980', apa: 'Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161–1178.', url: 'https://doi.org/10.1037/h0077714' },
  dallabella2001: { short: 'Dalla Bella et al., 2001', apa: 'Dalla Bella, S., Peretz, I., Rousseau, L., & Gosselin, N. (2001). A developmental study of the affective value of tempo and mode in music. Cognition, 80(3), B1–B10.', url: 'https://doi.org/10.1016/S0010-0277(00)00136-0' },
  aranberri2022: { short: 'Aranberri-Ruiz et al., 2022', apa: 'Aranberri-Ruiz, A., et al. (2022). Reducing anxiety and social stress in primary education: A breath-focused heart rate variability biofeedback intervention. IJERPH, 19(16), 10181. (Non-randomised.)', url: 'https://doi.org/10.3390/ijerph191610181' },
  kramer2022: { short: 'Kramer et al., 2022', apa: 'Kramer, A. C., Neubauer, A. B., & Schmiedek, F. (2022). The effectiveness of a slow-paced diaphragmatic breathing exercise in children’s daily life: A micro-randomized trial. Journal of Clinical Child & Adolescent Psychology.', url: 'https://doi.org/10.1080/15374416.2022.2084743' },
  diamond2011: { short: 'Diamond & Lee, 2011', apa: 'Diamond, A., & Lee, K. (2011). Interventions shown to aid executive function development in children 4 to 12 years old. Science, 333(6045), 959–964.', url: 'https://doi.org/10.1126/science.1204529' },
  harvardEF: { short: 'Harvard Center on the Developing Child', apa: 'Center on the Developing Child, Harvard University. Activities guide: Enhancing and practicing executive function skills.', url: 'https://developingchild.harvard.edu/resources/handouts-tools/activities-guide-enhancing-and-practicing-executive-function-skills/' },
  tominey2011: { short: 'Tominey & McClelland, 2011', apa: 'Tominey, S. L., & McClelland, M. M. (2011). Red light, purple light: Findings from a randomized trial using circle time games to improve behavioral self-regulation in preschool. Early Education and Development, 22(3), 489–519. (Preschool sample.)', url: 'https://doi.org/10.1080/10409289.2011.574258' },
  csefel: { short: 'CSEFEL Turtle Technique', apa: 'Center on the Social and Emotional Foundations for Early Learning (CSEFEL), Vanderbilt University. Tucker the Turtle / Turtle Technique handout.', url: 'https://csefel.vanderbilt.edu/modules-archive/module2/handouts/7.html' },
  alan2021: { short: 'Alan et al., 2021', apa: 'Alan, S., Baysan, C., Gumren, M., & Kubilay, E. (2021). Building social cohesion in ethnically mixed schools: An intervention on perspective taking. The Quarterly Journal of Economics, 136(4), 2147–2194.', url: 'https://doi.org/10.1093/qje/qjab009' },
  schonert2015: { short: 'Schonert-Reichl et al., 2015', apa: 'Schonert-Reichl, K. A., et al. (2015). Enhancing cognitive and social–emotional development through a simple-to-administer mindfulness-based school program for elementary school children: A randomized controlled trial. Developmental Psychology, 51(1), 52–66.', url: 'https://doi.org/10.1037/a0038454' },
  layous2012: { short: 'Layous et al., 2012', apa: 'Layous, K., Nelson, S. K., Oberle, E., Schonert-Reichl, K. A., & Lyubomirsky, S. (2012). Kindness counts: Prompting prosocial behavior in preadolescents boosts peer acceptance and well-being. PLOS ONE, 7(12), e51380.', url: 'https://doi.org/10.1371/journal.pone.0051380' },
  kubany1992: { short: 'Kubany et al., 1992', apa: 'Kubany, E. S., et al. (1992). Verbalized anger and accusatory “you” messages as cues for anger and antagonism among adolescents. Adolescence, 27(107), 505–516.', url: 'https://eric.ed.gov/?q=Kubany+accusatory+you+messages' },
  craig2016: { short: 'Craig et al., 2016', apa: 'Craig, A. B., Brown, E. R., Upright, J., & DeRosier, M. E. (2016). Enhancing children’s social emotional functioning through virtual game-based delivery of social skills training. Journal of Child and Family Studies, 25(3), 959–968.', url: 'https://doi.org/10.1007/s10826-015-0274-8' },
  cpprg1999: { short: 'CPPRG, 1999', apa: 'Conduct Problems Prevention Research Group. (1999). Initial impact of the Fast Track prevention trial for conduct problems: II. Classroom effects. Journal of Consulting and Clinical Psychology, 67(5), 648–657.', url: 'https://doi.org/10.1037/0022-006X.67.5.648' },
  low2015: { short: 'Low et al., 2015', apa: 'Low, S., Cook, C. R., Smolkowski, K., & Buntain-Ricklefs, J. (2015). Promoting social–emotional competence: An evaluation of the elementary version of Second Step. Journal of School Psychology, 53(6), 463–477.', url: 'https://doi.org/10.1016/j.jsp.2015.09.002' },
  schoneveld2016: { short: 'Schoneveld et al., 2016', apa: 'Schoneveld, E. A., et al. (2016). A neurofeedback video game (MindLight) to prevent anxiety in children: A randomized controlled trial. Computers in Human Behavior, 63, 321–333.', url: 'https://doi.org/10.1016/j.chb.2016.05.005' },
  bryant2022: { short: 'Bryant et al., 2022 (EASE, Jordan)', apa: 'Bryant, R. A., et al. (2022). Effectiveness of a brief group behavioural intervention on psychological distress in young adolescent Syrian refugees: A randomised controlled trial. PLOS Medicine, 19(8), e1004046.', url: 'https://doi.org/10.1371/journal.pmed.1004046' },
  ahlansimsim: { short: 'Ahlan Simsim (NYU Global TIES)', apa: 'NYU Global TIES for Children. Ahlan Simsim evaluation (Jordan, preschool).', url: 'https://globaltiesforchildren.nyu.edu/ahlan-simsim' },
};

// Plain-language evidence notes for the grown-ups Research screen (with honest limits)
export const EVIDENCE: { t: T2; refs: string[] }[] = [
  { t: ['Across 213 school SEL programs (270,034 students), SEL improved skills, behaviour and well-being, and academic results by about 11 percentile points. Programs that were Sequenced, Active, Focused and Explicit (SAFE) worked best — Fareed is built on SAFE.', 'في 213 برنامج مدرسي (270,034 طالب)، حسّن التعلّم الاجتماعي العاطفي المهارات والسلوك والرفاه، والتحصيل بحوالي 11 درجة مئينية. البرامج المتسلسلة والنشطة والمركّزة والصريحة (SAFE) كانت الأفضل — وفريد مبني عليها.'], refs: ['durlak2011'] },
  { t: ['Benefits were still visible 6 months to 18 years later (82 programs, 97,406 students).', 'الفوائد ضلّت ظاهرة بعد 6 شهور لحد 18 سنة (82 برنامج، 97,406 طالب).'], refs: ['taylor2017'] },
  { t: ['In Jordan, a WHO group program for 10–14-year-old refugees (feelings, breathing, problem-solving + caregiver sessions) reduced emotional problems.', 'بالأردن، برنامج جماعي من منظمة الصحة العالمية لأعمار 10–14 (مشاعر، تنفّس، حل مشكلات + جلسات للأهل) خفّف المشاكل العاطفية.'], refs: ['bryant2022', 'ahlansimsim'] },
  { t: ['Honest limits: a game alone is not automatically better than other activities (one anxiety game did no better than a control game). Fareed works best as part of a program with adults, conversation and home missions.', 'حدود بصراحة: اللعبة لحالها مش بالضرورة أحسن من غيرها (لعبة للقلق ما كانت أحسن من لعبة مقارنة). فريد بشتغل أحسن كجزء من برنامج فيه كبار وحوار ومهمّات بيتية.'], refs: ['schoneveld2016'] },
  { t: ['Some techniques were studied with adults or preschoolers (affect labelling, red-light games); Fareed adapts them for ages 8–12 and does not claim the same effects.', 'بعض الأساليب انْدرست على كبار أو أطفال روضة (تسمية المشاعر، ألعاب الإشارة)؛ فريد بكيّفها لأعمار 8–12 وما بيدّعي نفس النتايج.'], refs: ['lieberman2007', 'tominey2011'] },
];
