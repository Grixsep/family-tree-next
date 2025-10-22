export type RelationType = 'blood' | 'marriage' | 'partner';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string; // NEW: Track deceased
  birthPlace?: string;
  bio?: string;
  photoUrl?: string;
  photos?: string[]; // NEW: Multiple photos for detail page
  stories?: string[]; // NEW: Life stories
  generation: number;
  parents?: string[]; // IDs of parents
  spouses?: string[]; // IDs of spouses
  children?: string[]; // IDs of children
  siblings?: string[]; // IDs of siblings
  formerSpouses?: string[]; // NEW: Previous marriages
}

export interface Relationship {
  id: string;
  person1: string;
  person2: string;
  type: RelationType;
  marriageDate?: string;
  divorceDate?: string;
  current?: boolean; // Is this relationship still active
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
      photos: [],
      stories: ['Our story of combining two families into one...'],
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
      photos: [],
      stories: [],
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
      parents: ['your-paternal-grandpa', 'your-paternal-grandma'],
      photos: [],
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
      parents: ['your-maternal-grandpa', 'your-maternal-grandma'],
      photos: [],
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
      parents: ['an-paternal-grandpa', 'an-paternal-grandma'],
      photos: [],
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
      parents: ['an-maternal-grandpa', 'an-maternal-grandma'],
      photos: [],
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
      photos: [],
    },
    
    // Generation -2 - Grandparents
    // Your paternal grandparents
    {
      id: 'your-paternal-grandpa',
      firstName: 'Len', // Example: remarried grandad
      lastName: 'Dewhurst',
      generation: -2,
      bio: 'Your paternal grandfather. Remarried.',
      spouses: ['your-paternal-grandma'],
      formerSpouses: ['your-paternal-grandpa-ex'], // Had previous marriage
      children: ['your-dad', 'half-aunt-1', 'half-aunt-2'], // Children from different marriages
      deathDate: '2015-06-20', // Example: deceased
      photos: [],
    },
    {
      id: 'your-paternal-grandma',
      firstName: 'Grandmother',
      lastName: 'Dewhurst',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: 'Your paternal grandmother (Len\'s second wife).',
      spouses: ['your-paternal-grandpa'],
      children: ['your-dad'],
      photos: [],
    },
    // Example: Len's first wife (hidden by default)
    {
      id: 'your-paternal-grandpa-ex',
      firstName: 'First Wife',
      lastName: 'Dewhurst',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: 'Len\'s first wife.',
      formerSpouses: ['your-paternal-grandpa'],
      children: ['half-aunt-1', 'half-aunt-2'],
      deathDate: '1975-03-15',
      photos: [],
    },
    // Half-aunts (hidden by default, shown when expanding)
    {
      id: 'half-aunt-1',
      firstName: 'Half-Aunt',
      lastName: 'Dewhurst',
      generation: -1,
      bio: 'Daughter from Len\'s first marriage.',
      parents: ['your-paternal-grandpa', 'your-paternal-grandpa-ex'],
      siblings: ['half-aunt-2'],
      photos: [],
    },
    {
      id: 'half-aunt-2',
      firstName: 'Half-Aunt 2',
      lastName: 'Dewhurst',
      generation: -1,
      bio: 'Daughter from Len\'s first marriage.',
      parents: ['your-paternal-grandpa', 'your-paternal-grandpa-ex'],
      siblings: ['half-aunt-1'],
      photos: [],
    },
    
    // Your maternal grandparents
    {
      id: 'your-maternal-grandpa',
      firstName: 'Grandfather',
      lastName: '[Maternal Surname]',
      generation: -2,
      bio: 'Your maternal grandfather.',
      spouses: ['your-maternal-grandma'],
      children: ['your-mom'],
      photos: [],
    },
    {
      id: 'your-maternal-grandma',
      firstName: 'Grandmother',
      lastName: '[Maternal Surname]',
      maidenName: '[Maiden Name]',
      generation: -2,
      bio: 'Your maternal grandmother.',
      spouses: ['your-maternal-grandpa'],
      children: ['your-mom'],
      photos: [],
    },
    
    // An's paternal grandparents
    {
      id: 'an-paternal-grandpa',
      firstName: 'Grandfather',
      lastName: 'Le',
      generation: -2,
      bio: "An's paternal grandfather.",
      spouses: ['an-paternal-grandma'],
      children: ['an-dad'],
      photos: [],
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
      photos: [],
    },
    
    // An's maternal grandparents
    {
      id: 'an-maternal-grandpa',
      firstName: 'Grandfather',
      lastName: '[Maternal Surname]',
      generation: -2,
      bio: "An's maternal grandfather.",
      spouses: ['an-maternal-grandma'],
      children: ['an-mom'],
      photos: [],
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
      photos: [],
    },
  ],
  relationships: [
    // Current marriages
    { id: 'rel-you-an', person1: 'you', person2: 'an', type: 'marriage', marriageDate: '2024-01-01', current: true },
    { id: 'rel-your-parents', person1: 'your-dad', person2: 'your-mom', type: 'marriage', current: true },
    { id: 'rel-an-parents', person1: 'an-dad', person2: 'an-mom', type: 'marriage', current: true },
    { id: 'rel-your-paternal-gp', person1: 'your-paternal-grandpa', person2: 'your-paternal-grandma', type: 'marriage', current: true },
    { id: 'rel-your-maternal-gp', person1: 'your-maternal-grandpa', person2: 'your-maternal-grandma', type: 'marriage', current: true },
    { id: 'rel-an-paternal-gp', person1: 'an-paternal-grandpa', person2: 'an-paternal-grandma', type: 'marriage', current: true },
    { id: 'rel-an-maternal-gp', person1: 'an-maternal-grandpa', person2: 'an-maternal-grandma', type: 'marriage', current: true },
    
    // Previous marriages
    { id: 'rel-grandpa-ex', person1: 'your-paternal-grandpa', person2: 'your-paternal-grandpa-ex', type: 'marriage', marriageDate: '1950-05-10', divorceDate: '1970-08-20', current: false },
  ],
};

// Helper function to get person by ID
export function getPersonById(id: string, people: Person[] = familyData.people): Person | undefined {
  return people.find(p => p.id === id);
}

// Helper function to get person's slug for URL
export function getPersonSlug(person: Person): string {
  return `${person.firstName.toLowerCase()}-${person.lastName.toLowerCase()}`.replace(/\s+/g, '-');
}

// Helper function to find person by slug
export function getPersonBySlug(slug: string, people: Person[] = familyData.people): Person | undefined {
  return people.find(p => getPersonSlug(p) === slug);
}

// Helper to check if person is deceased
export function isDeceased(person: Person): boolean {
  return !!person.deathDate;
}
