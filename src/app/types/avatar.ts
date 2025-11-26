// types/avatar.ts
export type FaceShape = 'round' | 'oval' | 'square';
export type HairStyle = 'short' | 'medium' | 'long' | 'bun' | 'buzz';
export type Accessory = 'glasses' | 'earrings' | 'hat';

export interface AvatarData {
  skinTone: string;            // hex color like '#C88F6B'
  eyeColor: string;            // '#3B3B3B'
  hairColor: string;           // '#2B1A10'
  hairStyle: HairStyle;
  faceShape: FaceShape;
  hasBeard: boolean;
  accessories: Accessory[];
}
