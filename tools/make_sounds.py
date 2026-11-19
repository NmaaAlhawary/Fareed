"""Generate Fareed's sound effects and feeling melodies as small WAV files (no dependencies)."""
import math, random, struct, wave, os
SR = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds')
NOTE = {n: 440 * 2 ** ((i - 9) / 12 + o - 4) for o in range(1, 8) for i, n in enumerate(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']) for n in [f'{n}{o}']}

def buf(sec): return [0.0] * int(sec * SR)
def add(b, start, tone):
    i0 = int(start * SR)
    for i, v in enumerate(tone):
        if i0 + i < len(b): b[i0 + i] += v
def env(n, a=0.01, d=0.3, s=0.0):
    na = max(1, int(a * SR))
    return [(i / na) if i < na else math.exp(-(i - na) / (d * SR)) * (1 - s) + s for i in range(n)]
def osc(f, sec, kind='sine', vol=0.4, a=0.005, d=0.25, s=0.0, sweep=0.0, vib=0.0):
    n = int(sec * SR); e = env(n, a, d, s); out = []; ph = 0
    for i in range(n):
        fr = f * (1 + sweep * i / n) * (1 + vib * math.sin(2 * math.pi * 5.5 * i / SR))
        ph += 2 * math.pi * fr / SR
        if kind == 'sine': v = math.sin(ph)
        elif kind == 'tri': v = 2 / math.pi * math.asin(math.sin(ph))
        elif kind == 'square': v = 0.55 if math.sin(ph) > 0 else -0.55
        elif kind == 'marimba': v = math.sin(ph) + 0.3 * math.sin(4 * ph) * math.exp(-i / (0.03 * SR))
        elif kind == 'pluck': v = math.sin(ph) + 0.4 * math.sin(2 * ph) + 0.2 * math.sin(3 * ph)
        else: v = random.uniform(-1, 1)
        out.append(v * e[i] * vol)
    if sec > 0.05:  # tiny release to avoid clicks
        r = int(0.02 * SR)
        for i in range(r): out[-1 - i] *= i / r
    return out
def kick(vol=0.6):
    return osc(110, 0.25, 'sine', vol, 0.001, 0.08, sweep=-0.6)
def hat(vol=0.12):
    return osc(0, 0.05, 'noise', vol, 0.001, 0.015)
def write(name, b):
    peak = max(1e-6, max(abs(v) for v in b)); g = 0.85 / peak if peak > 0.85 else 1
    with wave.open(os.path.join(OUT, name + '.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * g)) * 32000)) for v in b))

# --- music challenge pads (Echo the Beat): 4 friendly marimba notes
for i, n in enumerate(['C5', 'E5', 'G5', 'C6']):
    b = buf(0.6); add(b, 0, osc(NOTE[n], 0.6, 'marimba', 0.5, 0.002, 0.18)); write(f'pad{i}', b)

# --- feeling melodies (Feel the Music)
def seq(notes, step, kind, vol=0.35, d=0.25, s=0.0, total=None, a=0.005):
    total = total or len(notes) * step + 0.6; b = buf(total)
    for k, n in enumerate(notes):
        if n: add(b, k * step, osc(NOTE[n], step * 2.2, kind, vol, a, d, s))
    return b
# happy: bouncy C major with a beat
b = seq(['C5','E5','G5','E5','C5','E5','G5','C6','A4','C5','F5','C5','G4','B4','D5','G5'], 0.18, 'pluck', 0.3, 0.15)
for k in range(16): add(b, k * 0.18, kick(0.35) if k % 4 == 0 else hat())
write('mel_happy', b)
# sad: slow A minor falling
write('mel_sad', seq(['A4','G4','E4','C4','D4','C4','B3','A3'], 0.55, 'sine', 0.35, 0.6, 0.2, a=0.08))
# angry: low stomping square, fast and loud
b = seq(['E2','E2','F2','E2','E2','F2','A#2','E2','E2','E2','F2','E2','G2','F#2','F2','E2'], 0.14, 'square', 0.28, 0.08)
for k in range(16): add(b, k * 0.14, kick(0.5) if k % 2 == 0 else [])
write('mel_angry', b)
# calm: soft slow chords
b = buf(5.0)
for k, ch in enumerate([['C4','E4','G4'], ['F3','A3','C4'], ['A3','C4','E4'], ['G3','C4','E4']]):
    for n in ch: add(b, k * 1.2, osc(NOTE[n], 1.8, 'sine', 0.15, 0.4, 0.9, 0.3))
write('mel_calm', b)
# scared: tremolo minor seconds + low drone
b = buf(4.0); add(b, 0, osc(NOTE['C2'], 4.0, 'tri', 0.25, 0.5, 3, 0.6, vib=0.02))
for k in range(26): add(b, k * 0.15, osc(NOTE['B5' if k % 2 else 'C6'], 0.14, 'sine', 0.12, 0.01, 0.05))
for k, n in enumerate(['E4','F4','E4','D#4']): add(b, 0.8 + k * 0.7, osc(NOTE[n], 0.6, 'tri', 0.2, 0.05, 0.3))
write('mel_scared', b)
# surprised: quick rising run then pop
b = seq(['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'], 0.07, 'pluck', 0.28, 0.08, total=1.6)
add(b, 0.9, osc(NOTE['C6'], 0.5, 'sine', 0.4, 0.002, 0.2, sweep=0.5)); add(b, 0.9, kick(0.5)); write('mel_surprised', b)

# --- effects
b = buf(0.5); add(b, 0, osc(NOTE['E5'], 0.25, 'sine', 0.4, 0.002, 0.12)); add(b, 0.1, osc(NOTE['B5'], 0.35, 'sine', 0.4, 0.002, 0.2)); write('ok', b)
b = buf(0.5); add(b, 0, osc(NOTE['A3'], 0.4, 'tri', 0.4, 0.005, 0.2, sweep=-0.25)); write('oops', b)
b = buf(0.45); add(b, 0, osc(260, 0.45, 'sine', 0.45, 0.003, 0.25, sweep=1.4, vib=0.05)); write('jump', b)
b = buf(0.15); add(b, 0, osc(900, 0.12, 'sine', 0.4, 0.001, 0.03, sweep=-0.5)); write('pop', b)
b = buf(0.5); add(b, 0, osc(0, 0.5, 'noise', 0.25, 0.15, 0.15)); write('whoosh', b)
b = buf(2.0)
for k, n in enumerate(['C5','E5','G5']): add(b, k * 0.12, osc(NOTE[n], 0.2, 'square', 0.18, 0.005, 0.12))
for n in ['C5','E5','G5','C6']: add(b, 0.4, osc(NOTE[n], 1.4, 'square', 0.1, 0.01, 0.6, 0.1, vib=0.01))
for k in range(4): add(b, 0.4 + k * 0.1, hat(0.2))
write('celebrate', b)
b = buf(4.2); add(b, 0, osc(NOTE['C4'], 4.2, 'sine', 0.2, 3.6, 2.0, 0.8)); add(b, 0, osc(NOTE['G4'], 4.2, 'sine', 0.1, 3.8, 2.0, 0.8, sweep=0.02)); write('breathe_in', b)
b = buf(4.2); add(b, 0, osc(NOTE['G4'], 4.2, 'sine', 0.2, 0.2, 1.6, 0.0, sweep=-0.1)); add(b, 0, osc(NOTE['C4'], 4.2, 'sine', 0.1, 0.2, 1.6, 0.0)); write('breathe_out', b)
print('done', sorted(os.listdir(OUT)))
