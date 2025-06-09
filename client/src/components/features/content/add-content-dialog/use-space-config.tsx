import { useState } from 'react';

export interface SpaceConfig {
  name: string;
  slug: string;
  isPrivate: boolean;
  hide_from_search: boolean;
  isInviteOnly: boolean;
  anyoneCanInvite: boolean;
  whoCanPost: string;
  whoCanReply: string;
  whoCanReact: string;
}

export function useSpaceConfig() {
  const [spaceConfig, setSpaceConfig] = useState<SpaceConfig>({
    name: '',
    slug: '',
    isPrivate: false,
    hide_from_search: false,
    isInviteOnly: false,
    anyoneCanInvite: false,
    whoCanPost: 'all',
    whoCanReply: 'all',
    whoCanReact: 'all'
  });

  return { spaceConfig, setSpaceConfig };
} 