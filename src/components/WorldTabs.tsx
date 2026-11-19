import React from 'react';
import { Pressable } from 'react-native';
import { C, Icon, Row, Txt } from './ui';
import { play } from '../lib/sound';
import { useStore } from '../lib/store';
import { T2 } from '../lib/content';

// Segmented tabs at the top of each world: the game first, then the other activities.
export default function WorldTabs({ tabs, tab, setTab, color = C.purple }: { tabs: { k: string; t: T2; icon: string }[]; tab: string; setTab: (k: string) => void; color?: string }) {
  const { tr } = useStore();
  return (
    <Row gap={8}>
      {tabs.map(x => (
        <Pressable key={x.k} onPress={() => { play('pop', 0.4); setTab(x.k); }}
          style={{ flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 16, backgroundColor: tab === x.k ? color : C.white }}>
          <Icon name={x.icon} size={20} color={tab === x.k ? C.white : color} />
          <Txt w={7} size={12} center color={tab === x.k ? C.white : color}>{tr(x.t)}</Txt>
        </Pressable>
      ))}
    </Row>
  );
}
