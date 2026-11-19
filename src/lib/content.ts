// All Fareed content in English + Arabic: [en, ar]
import type { Action, Mood } from '../components/Fareed';

export type T2 = [string, string];

export const UI: Record<string, T2> = {
  appTag: ['Linking Learning to LIFE!', 'نربط التعلّم بالحياة!'],
  hello: ['Marhaba! I’m Fareed.', 'مرحبا! أنا فريد.'],
  introA: ['I’m a panda from Jordan, and I collect feelings like treasure.', 'أنا باندا من الأردن، وبجمع المشاعر زي الكنوز.'],
  introB: ['Let’s travel across Jordan together and grow our superpowers!', 'يلا نسافر سوا عبر الأردن ونكبّر قوانا الخارقة!'],
  whatName: ['What’s your name?', 'شو اسمك؟'], namePh: ['Type your name', 'اكتب اسمك'],
  letsGo: ['Let’s go!', 'يلا بينا!'], next: ['Next', 'التالي'], back: ['Back', 'رجوع'], done: ['Done', 'تم'],
  hi: ['Hi', 'أهلًا'], level: ['Level', 'المستوى'], stars: ['stars', 'نجمة'],
  moodQ: ['How do you feel right now?', 'كيف حاسس هلّق؟'],
  journey: ['Fareed’s Jordan Journey', 'رحلة فريد في الأردن'],
  todayChallenge: ['Today’s kindness mission', 'مهمّة اللطف لليوم'], iDidIt: ['I did it!', 'عملتها!'], didIt: ['Mission complete!', 'المهمّة تمّت!'],
  tapFareed: ['Tap me!', 'اضغط عليّ!'], play: ['Play', 'العب'], start: ['Start', 'ابدأ'], again: ['Again', 'مرّة ثانية'],
  great: ['Amazing!', 'رائع!'], tryAgain: ['Nice try!', 'محاولة حلوة!'], youEarned: ['You earned', 'ربحت'],
  levelUp: ['Level up!', 'مستوى جديد!'], home: ['Home', 'الرئيسية'], grownups: ['For grown-ups', 'للكبار'],
  // feelings
  whatFeel: ['How is Fareed feeling?', 'شو شعور فريد؟'], watchFareed: ['Watch Fareed act it out…', 'شوف فريد وهو يمثّل…'],
  whichFeeling: ['Which feeling fits?', 'أي شعور مناسب؟'], round: ['Round', 'جولة'],
  // music
  musicTitle: ['Music Challenges', 'تحدّيات الموسيقى'],
  beatTitle: ['Beat Theatre', 'مسرح الإيقاع'], echoTitle: ['Echo the Beat', 'ردّد الإيقاع'], echoDesc: ['Fareed plays a beat. Can you play it back?', 'فريد بعزف إيقاع. بتقدر تعيده؟'],
  feelMusicTitle: ['Feel the Music', 'احسّ بالموسيقى'], feelMusicDesc: ['Listen. Which feeling does the music sound like?', 'اسمع. الموسيقى شو شعورها؟'],
  listen: ['Listen…', 'اسمع…'], yourTurn: ['Your turn!', 'دورك!'], beat: ['Beat', 'إيقاع'], best: ['Best', 'أفضل'],
  playAgainMusic: ['Play the music again', 'شغّل الموسيقى مرّة ثانية'],
  danceBreak: ['Dance break!', 'استراحة رقص!'], danceDesc: ['Dance with Fareed — then freeze when the music stops!', 'ارقص مع فريد — ووقف مكانك لما توقف الموسيقى!'],
  freeze: ['FREEZE!', 'ثبات!'], dance: ['DANCE!', 'ارقص!'],
  // draw
  drawTitle: ['Draw Your Feelings', 'ارسم مشاعرك'], save: ['Save', 'حفظ'], undo: ['Undo', 'تراجع'], clear: ['Clear', 'مسح'],
  myGallery: ['My gallery', 'معرضي'], newPrompt: ['New idea', 'فكرة جديدة'], emptyGallery: ['Your drawings will live here.', 'رسماتك رح تكون هون.'],
  colorMeans: ['Colours can show feelings', 'الألوان بتعبّر عن المشاعر'],
  // speak
  speakTitle: ['Brave Voice', 'صوتي الشجاع'], record: ['Record', 'سجّل'], stop: ['Stop', 'إيقاف'], playMine: ['Hear me', 'اسمع صوتي'],
  hearFareed: ['Hear Fareed', 'اسمع فريد'], iFeelBuilder: ['Build an “I feel” sentence', 'ركّب جملة "أنا بحس"'],
  iFeel: ['I feel', 'أنا بحس'], when: ['when', 'لما'], iNeed: ['and I need', 'وبحتاج'],
  sayIt: ['Now say it out loud and record it!', 'هلّق احكيها بصوت عالي وسجّلها!'], micNeeded: ['Fareed needs the microphone to hear you.', 'فريد بحتاج الميكروفون عشان يسمعك.'],
  recording: ['Recording…', 'عم بسجّل…'], challenges: ['Speaking challenges', 'تحدّيات الكلام'],
  // breathe
  breatheTitle: ['Float & Breathe', 'اطفُ وتنفّس'], breatheIn: ['Breathe in…', 'شهيق…'], breatheOut: ['Breathe out…', 'زفير…'], hold: ['Hold…', 'احبس…'],
  breatheDesc: ['Fill Fareed’s balloon with slow breaths. In through your nose, out through your mouth.', 'عبّي بالون فريد بأنفاس بطيئة. شهيق من الأنف وزفير من الفم.'],
  breaths: ['Breaths', 'أنفاس'], howNow: ['How do you feel now?', 'كيف حاسس هلّق؟'],
  // stories
  storiesTitle: ['Kindness Stories', 'قصص اللطف'], continue: ['Continue', 'تابع'], theEnd: ['The end', 'النهاية'],
  // grown ups
  gateQ: ['Grown-ups only: what is', 'للكبار فقط: كم'], progress: ['Progress', 'التقدّم'], moodLog: ['Mood check-ins', 'تسجيل المشاعر'],
  activities: ['Activities done', 'الأنشطة المكتملة'], reset: ['Reset all progress', 'مسح كل التقدّم'], language: ['Language', 'اللغة'],
  about: ['Fareed builds the 5 CASEL Social & Emotional Learning skills through play.', 'فريد بيبني مهارات التعلّم الاجتماعي والعاطفي الخمس (إطار CASEL) من خلال اللعب.'],
  nothing: ['Nothing yet.', 'لا شيء بعد.'], sure: ['Are you sure?', 'متأكد؟'], yes: ['Yes', 'نعم'], no: ['No', 'لا'],
};

export const COMP: Record<string, { color: string; icon: string; n: T2 }> = {
  SA: { color: '#2BA3D4', icon: 'eye', n: ['Self-awareness', 'الوعي بالذات'] },
  SM: { color: '#E8B400', icon: 'weather-windy', n: ['Self-management', 'إدارة الذات'] },
  SO: { color: '#F07F2D', icon: 'hand-heart', n: ['Social awareness', 'الوعي الاجتماعي'] },
  RS: { color: '#86A825', icon: 'handshake', n: ['Relationship skills', 'مهارات العلاقات'] },
  DM: { color: '#4B2CA0', icon: 'sign-direction', n: ['Responsible decisions', 'قرارات مسؤولة'] },
};

export type FeelingId = 'happy' | 'sad' | 'angry' | 'scared' | 'surprised' | 'calm';
export const FEELINGS: { id: FeelingId; n: T2; color: string; mood: Mood; action: Action; sound: string; reply: T2 }[] = [
  { id: 'happy', n: ['Happy', 'سعيد'], color: '#FFC93C', mood: 'happy', action: 'jump', sound: 'mel_happy', reply: ['Yay! Share that smile with someone today.', 'يا سلام! شارك ابتسامتك مع حدا اليوم.'] },
  { id: 'calm', n: ['Calm', 'هادئ'], color: '#5CC8A8', mood: 'calm', action: 'idle', sound: 'mel_calm', reply: ['Calm is a superpower. Nice!', 'الهدوء قوّة خارقة. حلو!'] },
  { id: 'sad', n: ['Sad', 'حزين'], color: '#6F9BE8', mood: 'sad', action: 'sad', sound: 'mel_sad', reply: ['It’s okay to feel sad. Want to breathe with me at the Dead Sea?', 'عادي تحس بالحزن. بدك تتنفّس معي بالبحر الميت؟'] },
  { id: 'angry', n: ['Angry', 'غاضب'], color: '#F0544F', mood: 'angry', action: 'angry', sound: 'mel_angry', reply: ['Anger is a normal feeling. Let’s stomp it out, then breathe.', 'الغضب شعور طبيعي. يلا ندبدب برجلينا، وبعدين نتنفّس.'] },
  { id: 'scared', n: ['Worried', 'قلق'], color: '#A783E0', mood: 'scared', action: 'scared', sound: 'mel_scared', reply: ['Everyone feels worried sometimes. Naming it already helps!', 'كل الناس بتقلق أحيانًا. إنك سمّيته هذا بساعد!'] },
  { id: 'surprised', n: ['Surprised', 'متفاجئ'], color: '#FF9440', mood: 'surprised', action: 'surprised', sound: 'mel_surprised', reply: ['Whoa! Something new today? Tell someone about it!', 'واو! في شي جديد اليوم؟ احكيه لحدا!'] },
];
export const feeling = (id: string) => FEELINGS.find(f => f.id === id)!;

export const WORLDS = [
  { id: 'amman', route: '/feelings', n: ['Amman', 'عمّان'], t: ['Feelings Charades', 'تمثيل المشاعر'], d: ['Guess how Fareed feels', 'خمّن شعور فريد'], color: '#F25C78', icon: 'drama-masks', comp: ['SA', 'SO'] },
  { id: 'jerash', route: '/music', n: ['Jerash', 'جرش'], t: ['Music Theatre', 'مسرح الموسيقى'], d: ['Beats, songs & freeze dance', 'إيقاعات وأغاني ورقص'], color: '#FFB020', icon: 'music', comp: ['SM', 'SA'] },
  { id: 'deadsea', route: '/breathe', n: ['Dead Sea', 'البحر الميت'], t: ['Float & Breathe', 'اطفُ وتنفّس'], d: ['Calm your body', 'هدّي جسمك'], color: '#2BB3C0', icon: 'weather-windy', comp: ['SM'] },
  { id: 'petra', route: '/draw', n: ['Petra', 'البترا'], t: ['Draw the Rose City', 'ارسم المدينة الوردية'], d: ['Draw your feelings', 'ارسم مشاعرك'], color: '#E07A5F', icon: 'palette', comp: ['SA', 'SM'] },
  { id: 'wadirum', route: '/speak', n: ['Wadi Rum', 'وادي رم'], t: ['Echo Canyon', 'وادي الصدى'], d: ['Speak with a brave voice', 'احكِ بصوت شجاع'], color: '#C8553D', icon: 'microphone', comp: ['RS', 'SA'] },
  { id: 'aqaba', route: '/stories', n: ['Aqaba', 'العقبة'], t: ['Kindness Reef', 'شعاب اللطف'], d: ['Stories where you choose', 'قصص إنت بتختار فيها'], color: '#4B2CA0', icon: 'book-open-variant', comp: ['RS', 'DM', 'SO'] },
];

export const KINDNESS: T2[] = [
  ['Give someone a real compliment.', 'قول لحدا مديح حقيقي.'],
  ['Invite someone who is alone to play.', 'اعزم حدا قاعد لحاله يلعب معك.'],
  ['Help at home without being asked.', 'ساعد بالبيت بدون ما حدا يطلب.'],
  ['Say thank you to a teacher or the school bus driver.', 'قول شكرًا لمعلّم أو لسائق الباص.'],
  ['Share your snack or your colours.', 'شارك أكلك أو ألوانك.'],
  ['Ask a friend: “How was your day?” and really listen.', 'اسأل صاحبك: "كيف كان يومك؟" واسمعه منيح.'],
  ['Draw a picture for someone in your family.', 'ارسم رسمة لحدا من عيلتك.'],
];

// Charades: Fareed acts the feeling; scenario rounds describe a situation.
export const SCENARIOS: { t: T2; a: FeelingId }[] = [
  { t: ['Lina got a gold star for her drawing.', 'لينا أخذت نجمة ذهبية على رسمتها.'], a: 'happy' },
  { t: ['Yousef’s best friend moved to another city.', 'صاحب يوسف المفضّل انتقل لمدينة ثانية.'], a: 'sad' },
  { t: ['Someone cut in front of Hala in the line.', 'حدا قطع الدور قدّام هالة.'], a: 'angry' },
  { t: ['Tomorrow Omar must read in front of the whole school.', 'بكرا عمر لازم يقرأ قدّام كل المدرسة.'], a: 'scared' },
  { t: ['Mira opened the door and everyone shouted “Surprise!”', 'فتحت ميرا الباب والكل صرخ "مفاجأة!"'], a: 'surprised' },
  { t: ['Ali lies on the warm sand in Wadi Rum looking at the stars.', 'علي متمدّد عالرمل الدافي بوادي رم وبطّلع عالنجوم.'], a: 'calm' },
  { t: ['Nour’s tower of blocks fell down for the third time.', 'برج نور من المكعّبات وقع للمرّة الثالثة.'], a: 'angry' },
  { t: ['Sami’s cat is lost and he can’t find it.', 'بسّة سامي ضايعة ومش لاقيها.'], a: 'sad' },
];

export const DRAW_PROMPTS: T2[] = [
  ['Draw something that makes you HAPPY.', 'ارسم شي بفرّحك.'],
  ['If your anger was weather, what would it look like?', 'لو غضبك كان طقس، كيف شكله؟'],
  ['Draw your calm, safe place.', 'ارسم مكانك الهادئ والآمن.'],
  ['Draw a gift for a friend who feels sad.', 'ارسم هدية لصاحب حزين.'],
  ['Draw a “worry monster” — then make it smile!', 'ارسم "وحش القلق" — وبعدين خلّيه يبتسم!'],
  ['Draw Petra at sunset in your favourite feeling colours.', 'ارسم البترا وقت الغروب بألوان شعورك المفضّل.'],
  ['Draw yourself being brave.', 'ارسم حالك وإنت شجاع.'],
];
export const PALETTE: { c: string; n: T2 }[] = [
  { c: '#FFC93C', n: ['Joy', 'فرح'] }, { c: '#F0544F', n: ['Anger', 'غضب'] }, { c: '#6F9BE8', n: ['Sad', 'حزن'] },
  { c: '#5CC8A8', n: ['Calm', 'هدوء'] }, { c: '#A783E0', n: ['Worry', 'قلق'] }, { c: '#FF9440', n: ['Excited', 'حماس'] },
  { c: '#F78DA7', n: ['Love', 'حب'] }, { c: '#8B5A2B', n: ['Petra', 'البترا'] }, { c: '#1F1A24', n: ['Ink', 'حبر'] },
];

export const SPEAK_PROMPTS: { t: T2; comp: string[] }[] = [
  { t: ['Introduce yourself like a superhero! Say your name and your superpower.', 'عرّف عن حالك زي بطل خارق! احكِ اسمك وقوّتك الخارقة.'], comp: ['SA'] },
  { t: ['Tell Fareed about a time you felt proud.', 'احكي لفريد عن مرّة حسّيت فيها بالفخر.'], comp: ['SA'] },
  { t: ['Say something kind to a friend — as if they are here.', 'احكي كلمة حلوة لصاحبك — كأنه قدّامك.'], comp: ['RS', 'SO'] },
  { t: ['Practise saying NO politely: “No thank you, I don’t want to.”', 'تدرّب تقول لا بأدب: "لا شكرًا، ما بدّي."'], comp: ['DM', 'RS'] },
  { t: ['Say sorry and how you will fix it: “I’m sorry I…, next time I will…”', 'اعتذر واحكي كيف رح تصلّحها: "آسف إني…، المرّة الجاية رح…"'], comp: ['RS', 'DM'] },
  { t: ['Ask for help with a brave voice: “Can you help me, please?”', 'اطلب مساعدة بصوت شجاع: "ممكن تساعدني لو سمحت؟"'], comp: ['RS', 'SM'] },
];
export const I_FEEL: T2[] = [['happy', 'مبسوط'], ['sad', 'زعلان'], ['angry', 'معصّب'], ['worried', 'قلقان'], ['left out', 'مُستبعَد'], ['proud', 'فخور']];
export const WHEN: T2[] = [['my friends don’t include me', 'صحابي ما بدخّلوني معهم'], ['I finish something hard', 'بخلّص شي صعب'], ['someone takes my things', 'حدا بوخذ أغراضي'],
  ['I have a test', 'يكون عندي امتحان'], ['someone helps me', 'حدا بساعدني'], ['people shout', 'الناس بتصرخ']];
export const NEED: T2[] = [['a hug', 'حضن'], ['some quiet time', 'شوية هدوء'], ['to talk about it', 'أحكي عنه'], ['help', 'مساعدة'], ['to try again', 'أجرّب مرّة ثانية'], ['to celebrate', 'أحتفل']];

export type Scene = { txt: T2; q?: T2; mood: Mood; ch: { t: T2; ok: 0 | 1; r: T2 }[] };
export const STORIES: { id: string; t: T2; s: T2; comp: string[]; color: string; scenes: Scene[]; end: T2 }[] = [
  {
    id: 'st-game', t: ['Kareem’s Big Game', 'مباراة كريم الكبيرة'], s: ['Being brave and joining in', 'الشجاعة والانضمام'], comp: ['RS', 'SA'], color: '#2BA3D4',
    scenes: [
      { mood: 'scared', txt: ['At break time, Kareem sees his classmates playing football. He wants to play, but his tummy feels fluttery and his hands are sweaty.', 'في الاستراحة، شاف كريم زملاءه بلعبوا كرة قدم. بدّه يلعب، بس حسّ بفراشات ببطنه وإيديه عرقانين.'],
        q: ['How is Kareem feeling?', 'شو شعور كريم؟'],
        ch: [{ t: ['Nervous', 'متوتّر'], ok: 1, r: ['Yes! A fluttery tummy and sweaty hands are signs of feeling nervous.', 'صح! الفراشات بالبطن والإيدين العرقانين علامات توتّر.'] },
             { t: ['Angry', 'غضبان'], ok: 0, r: ['Look at the clues: fluttery tummy, sweaty hands… that sounds like nervous.', 'شوف العلامات: فراشات وإيدين عرقانين… هاي توتّر.'] },
             { t: ['Bored', 'زهقان'], ok: 0, r: ['He really WANTS to play. His body says he feels nervous.', 'هو بدّه يلعب كثير. جسمه بقول إنه متوتّر.'] }] },
      { mood: 'think', txt: ['Kareem takes a deep breath. What could he do now?', 'أخذ كريم نفس عميق. شو ممكن يعمل هلّق؟'],
        ch: [{ t: ['Walk up and ask: “Can I play too?”', 'يروح ويسأل: "ممكن ألعب معكم؟"'], ok: 1, r: ['Brave! Asking kindly is the best way to join in.', 'شجاع! السؤال بلطف أحسن طريقة للانضمام.'] },
             { t: ['Stand alone and hope someone notices', 'يوقف لحاله ويستنّى حدا ينتبه'], ok: 0, r: ['Shy is okay, but others can’t read minds. Use your words!', 'عادي تكون خجول، بس الناس ما بتقرأ الأفكار. احكي!'] },
             { t: ['Kick the ball away so they notice', 'يشوط الطابة بعيد عشان ينتبهوا'], ok: 0, r: ['They’d notice… but they might get upset. There’s a kinder way.', 'رح ينتبهوا… بس ممكن يزعلوا. في طريقة ألطف.'] }] },
      { mood: 'sad', txt: ['Ali says: “Sorry, the teams are full right now.”', 'قال علي: "آسفين، الفرق مكتملة هلّق."'],
        ch: [{ t: ['“Okay! Can I join the next round?”', '"ماشي! بقدر أنضم بالجولة الجاية؟"'], ok: 1, r: ['You stayed calm and found a solution. Ali smiles: “Sure!”', 'ضليت هادي ولقيت حل. ابتسم علي: "أكيد!"'] },
             { t: ['Shout: “That’s not fair!”', 'يصرخ: "هذا مش عدل!"'], ok: 0, r: ['Disappointed is normal, but shouting pushes friends away.', 'خيبة الأمل طبيعية، بس الصراخ بيبعّد الأصحاب.'] }] },
    ],
    end: ['Kareem joined the next round — and scored a goal! Being brave and kind opened the door.', 'انضم كريم للجولة الجاية — وسجّل هدف! الشجاعة واللطف فتحوله الباب.'],
  },
  {
    id: 'st-controller', t: ['The Broken Controller', 'يد التحكّم المكسورة'], s: ['Handling big angry feelings', 'التعامل مع الغضب'], comp: ['SM', 'DM'], color: '#F0544F',
    scenes: [
      { mood: 'angry', txt: ['Dareen finds her game controller broken. Her little brother Omar was playing with it. Her face gets hot and her fists squeeze.', 'لقت دارين يد التحكّم مكسورة. أخوها الصغير عمر كان يلعب فيها. وجهها صار سخن وقبضت إيديها.'],
        q: ['What should Dareen do first?', 'شو أول شي تعمله دارين؟'],
        ch: [{ t: ['Stop and take 3 slow breaths', 'توقف وتاخذ 3 أنفاس بطيئة'], ok: 1, r: ['Yes! Breathing first lets the angry storm pass.', 'صح! التنفّس أولًا بخلّي عاصفة الغضب تمرق.'] },
             { t: ['Break one of Omar’s toys', 'تكسر لعبة لعمر'], ok: 0, r: ['Then two things are broken and two people are sad.', 'هيك بصير في شيئين مكسورين وشخصين زعلانين.'] },
             { t: ['Scream as loud as she can', 'تصرخ بأعلى صوتها'], ok: 0, r: ['Big feelings need a safe way out. Breathing works better.', 'المشاعر الكبيرة بدها طريقة آمنة. التنفّس أحسن.'] }] },
      { mood: 'scared', txt: ['Omar looks scared and says, “I’m sorry, it fell.”', 'عمر خايف وبقول: "آسف، وقعت مني."'],
        q: ['How might Omar feel?', 'شو ممكن يكون شعور عمر؟'],
        ch: [{ t: ['Scared and sorry', 'خايف وندمان'], ok: 1, r: ['Right. Seeing how others feel is called empathy.', 'صح. إنك تشوف شعور غيرك اسمه تعاطف.'] },
             { t: ['Happy he broke it', 'مبسوط إنه كسرها'], ok: 0, r: ['He looks scared and said sorry. It was probably an accident.', 'شكله خايف واعتذر. غالبًا كانت بالغلط.'] }] },
      { mood: 'think', txt: ['What is a fair way to solve this?', 'شو الطريقة العادلة للحل؟'],
        ch: [{ t: ['Tell Omar how she feels and ask Mama to help fix it', 'تحكي لعمر شو حاسّة وتطلب من ماما تساعدهم'], ok: 1, r: ['A responsible decision: honest, calm and looking for a fix.', 'قرار مسؤول: صادق وهادي وبدوّر على حل.'] },
             { t: ['Never talk to Omar again', 'ما تحكي مع عمر أبدًا'], ok: 0, r: ['Staying angry forever hurts you both. Families solve things together.', 'الزعل للأبد بيأذي الثنين. العيلة بتحل مشاكلها سوا.'] }] },
    ],
    end: ['Dareen and Omar fixed the controller with tape and played together. Calm first, then solve!', 'صلّحت دارين وعمر يد التحكّم بلزّيق ولعبوا سوا. أهدأ أولًا، بعدين أحل!'],
  },
  {
    id: 'st-reef', t: ['The Reef Clean-up', 'تنظيف الشعاب'], s: ['Including everyone & doing the right thing', 'إشراك الجميع وعمل الصح'], comp: ['SO', 'DM'], color: '#2BB3C0',
    scenes: [
      { mood: 'think', txt: ['Salma’s class is cleaning the beach in Aqaba. Shams is new and stands quietly by herself.', 'صف سلمى بنظّف الشط بالعقبة. شمس جديدة وواقفة لحالها ساكتة.'],
        q: ['What could Salma do?', 'شو ممكن تعمل سلمى؟'],
        ch: [{ t: ['Ask Shams: “Want to be my team-mate?”', 'تسأل شمس: "بدك تكوني بفريقي؟"'], ok: 1, r: ['Lovely! Inviting someone makes them feel they belong.', 'حلو! لما تدعي حدا بتحسّسيه إنه منّا وفينا.'] },
             { t: ['Ignore her — she didn’t say anything', 'تتجاهلها، ما حكت شي'], ok: 0, r: ['Quiet doesn’t mean “not interested”. New kids often wait to be invited.', 'السكوت مش يعني "مش مهتمّة". الجدد بستنّوا حدا يدعوهم.'] }] },
      { mood: 'surprised', txt: ['Yazan says: “Let’s just throw the rubbish behind the rocks. It’s faster!”', 'قال يزن: "خلّينا نرمي الزبالة ورا الصخور، أسرع!"'],
        ch: [{ t: ['“No — the fish and corals live here. Let’s carry it to the bin together.”', '"لا — السمك والمرجان عايشين هون. يلا نحملها سوا للحاوية."'], ok: 1, r: ['Responsible AND good teamwork. The reef says thank you!', 'قرار مسؤول وعمل جماعي. الشعاب بتقلّك شكرًا!'] },
             { t: ['“Okay, nobody will see.”', '"ماشي، ما حدا رح يشوف."'], ok: 0, r: ['Even if nobody sees, the sea animals would be hurt.', 'حتى لو ما حدا شاف، حيوانات البحر رح تتأذى.'] }] },
    ],
    end: ['The class filled 12 bags, and Shams found a baby sea turtle’s favourite spot!', 'الصف عبّى 12 كيس، وشمس لقت مكان السلحفاة الصغيرة المفضّل!'],
  },
];
