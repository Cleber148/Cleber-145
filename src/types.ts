export interface Meditation {
  id: string;
  title: string;
  duration: string;
  category: 'Sono' | 'Foco' | 'Estresse' | 'Ansiedade' | 'Manhã';
  description: string;
  audioUrl: string;
  thumbnail: string;
}

export interface UserMood {
  mood: string;
  intensity: number;
}
