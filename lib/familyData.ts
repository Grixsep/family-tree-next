export type RelationType = 'blood' | 'marriage' | 'partner';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  birthDate?: string;
  birthPlace?: string;
  bio?: string;
  photoUrl?: string;
  generation: number;
  parents?: string[]; // IDs of parents
  spouses?: string[]; // IDs of spouses
  children?: string[]; // IDs of children
  siblings?: string[]; // IDs of siblings
}

export interface Relationship {
  id: string;
  person1: string;
  person2: string;
  type: RelationType;
  marriageDate?: string;
  divorceDate?: string;
}

export interface FamilyData {
  people: Person[];
  relationships: Relationship[];
}

// The LeDewhurst Family Tree Data
export const familyData: FamilyData = {
  people: [
    // Generation 0 - You and your wife
    {
      id: 'you',
      firstName: 'Your Name',
      lastName: 'LeDewhurst',
      generation: 0,
      bio: 'Founder of the LeDewhurst family name.',
      spouses: ['an'],
      parents: ['your-dad', 'your-mom'],
    },
    {
      id: 'an',
      firstName: 'An',
      lastName: 'LeDewhurst',
      maidenName: 'Le',
      generation: 0,
      bio: 'Co-founder of the LeDewhurst family name.',
      spouses: ['you'],
      parents: ['an-dad', 'an-mom'],
      siblings: ['an-brother'],
    },
    
    // Generation -1 - Your parents (Dewhurst side)
    {
      id: 'your-dad',
      firstName: 'Father',
      lastName: 'Dewhurst',
      generation: -1,
      bio: 'Your father.',
      spouses: ['your-mom'],
      children: ['you'],
    },
    {
      id: 'your-mom',
      firstName: 'Mother',
      lastName: 'Dewhurst',
      maidenName: '[Maiden Name]',
      generation: -1,
      bio: 'Your mother.',
      spouses: ['your-dad'],
      children: ['you'],
    },
    
    // Generation -1 - An's parents (Le side)
    {
      id: 'an-dad',
      firstName: 'Father',
      lastName: 'Le',
      generation: -1,
      bio: "An's father.",
      spouses: ['an-mom'],
      children: ['an', 'an-brother'],
    },
    {
      id: 'an-mom',
      firstName: 'Mother',
      lastName: 'Le',
      maidenName: '[Maiden Name]',
      generation: -1,
      bio: "An's mother.",
      spouses: ['an-dad'],
      children: ['an', 'an-brother'],
    },
    
    // An's brother
    {
      id: 'an-brother',
      firstName: 'Brother',
      lastName: 'Le',
      generation: 0,
      bio: "An's brother.",
      parents: ['an-dad', 'an-mom'],
      siblings: ['an'],
    },
    
    // Generation -2 - Grandparents (can be expanded)
    {
      id: 'your-paternal-grandpa',
      firstName: 'Grandfather',
      lastName: 'Dewhurst',
      generation: -2,
      bio: 'Your paternal grandfather.',
      spouses: ['your-paternal-grandma'],
      children: ['your-dad'],
    },
    {
      id: 'your-paternal-grandma',
      firstName: 'Grandmother',
      lastName: 'Dewhurst',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: 'Your paternal grandmother.',
      spouses: ['your-paternal-grandpa'],
      children: ['your-dad'],
    },
    {
      id: 'your-maternal-grandpa',
      firstName: 'Grandfather',
      lastName: '[Maternal Surname]',
      generation: -2,
      bio: 'Your maternal grandfather.',
      spouses: ['your-maternal-grandma'],
      children: ['your-mom'],
    },
    {
      id: 'your-maternal-grandma',
      firstName: 'Grandmother',
      lastName: '[Maternal Surname]',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: 'Your maternal grandmother.',
      spouses: ['your-maternal-grandma'],
      children: ['your-mom'],
    },
    {
      id: 'an-paternal-grandpa',
      firstName: 'Grandfather',
      lastName: 'Le',
      generation: -2,
      bio: "An's paternal grandfather.",
      spouses: ['an-paternal-grandma'],
      children: ['an-dad'],
    },
    {
      id: 'an-paternal-grandma',
      firstName: 'Grandmother',
      lastName: 'Le',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: "An's paternal grandmother.",
      spouses: ['an-paternal-grandpa'],
      children: ['an-dad'],
    },
    {
      id: 'an-maternal-grandpa',
      firstName: 'Grandfather',
      lastName: '[Maternal Surname]',
      generation: -2,
      bio: "An's maternal grandfather.",
      spouses: ['an-maternal-grandma'],
      children: ['an-mom'],
    },
    {
      id: 'an-maternal-grandma',
      firstName: 'Grandmother',
      lastName: '[Maternal Surname]',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: "An's maternal grandmother.",
      spouses: ['an-maternal-grandma'],
      children: ['an-mom'],
    },
  ],
  relationships: [
    // Marriages
    { id: 'rel-you-an', person1: 'you', person2: 'an', type: 'marriage', marriageDate: '2024-01-01' },
    { id: 'rel-your-parents', person1: 'your-dad', person2: 'your-mom', type: 'marriage' },
    { id: 'rel-an-parents', person1: 'an-dad', person2: 'an-mom', type: 'marriage' },
    { id: 'rel-your-paternal-gp', person1: 'your-paternal-grandpa', person2: 'your-paternal-grandma', type: 'marriage' },
    { id: 'rel-your-maternal-gp', person1: 'your-maternal-grandpa', person2: 'your-maternal-grandma', type: 'marriage' },
    { id: 'rel-an-paternal-gp', person1: 'an-paternal-grandpa', person2: 'an-paternal-grandma', type: 'marriage' },
    { id: 'rel-an-maternal-gp', person1: 'an-maternal-grandpa', person2: 'an-maternal-grandma', type: 'marriage' },
  ],
};
