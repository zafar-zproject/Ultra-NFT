export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface NFT {
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  price: number;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  rarity: Rarity;
  items?: string[];
}

export interface LiveDrop {
  id: string;
  user: string;
  itemIcon: string;
  rarity: Rarity;
  caseName: string;
}

export type TabType = 'backpack' | 'invite' | 'home' | 'leaderboard' | 'earn';
