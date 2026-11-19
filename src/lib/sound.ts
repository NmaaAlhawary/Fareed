// Tiny sound board on top of expo-audio. Players are created lazily and reused.
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const FILES = {
  pad0: require('../../assets/sounds/pad0.wav'), pad1: require('../../assets/sounds/pad1.wav'),
  pad2: require('../../assets/sounds/pad2.wav'), pad3: require('../../assets/sounds/pad3.wav'),
  mel_happy: require('../../assets/sounds/mel_happy.wav'), mel_sad: require('../../assets/sounds/mel_sad.wav'),
  mel_angry: require('../../assets/sounds/mel_angry.wav'), mel_calm: require('../../assets/sounds/mel_calm.wav'),
  mel_scared: require('../../assets/sounds/mel_scared.wav'), mel_surprised: require('../../assets/sounds/mel_surprised.wav'),
  ok: require('../../assets/sounds/ok.wav'), oops: require('../../assets/sounds/oops.wav'), jump: require('../../assets/sounds/jump.wav'),
  pop: require('../../assets/sounds/pop.wav'), whoosh: require('../../assets/sounds/whoosh.wav'), celebrate: require('../../assets/sounds/celebrate.wav'),
  breathe_in: require('../../assets/sounds/breathe_in.wav'), breathe_out: require('../../assets/sounds/breathe_out.wav'),
};
export type SoundName = keyof typeof FILES;
const players: Partial<Record<SoundName, AudioPlayer>> = {};
let moded = false;

export function play(name: SoundName | string, volume = 1, loop = false) {
  try {
    if (!moded) { moded = true; setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}); }
    let p = players[name];
    if (!p) { p = createAudioPlayer(FILES[name]); players[name] = p; }
    p.volume = volume; p.loop = loop;
    p.seekTo(0).catch?.(() => {});
    p.play();
  } catch (e) {}
}
export function stop(name: SoundName | string) { try { players[name]?.pause(); } catch (e) {} }
export function stopAll() { Object.values(players).forEach(p => { try { p.pause(); } catch (e) {} }); }

export function buzz(kind: 'tap' | 'ok' | 'bad' = 'tap') {
  if (Platform.OS === 'web') return;
  if (kind === 'ok') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  else if (kind === 'bad') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
