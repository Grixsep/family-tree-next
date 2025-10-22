export type RelationType = "blood" | "marriage" | "partner";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  bio?: string;
  photoUrl?: string;
  photos?: string[];
  stories?: string[];
  generation: number;
  parents?: string[];
  spouses?: string[];
  children?: string[];
  siblings?: string[];
  formerSpouses?: string[];
}

export interface Relationship {
  id: string;
  person1: string;
  person2: string;
  type: RelationType;
  marriageDate?: string;
  divorceDate?: string;
  current?: boolean;
}

export interface FamilyData {
  people: Person[];
  relationships: Relationship[];
}

// The LeDewhurst Family Tree Data
export const familyData: FamilyData = {
  people: [
    // Generation 0 - Paul and An
    {
      id: "paul",
      firstName: "Paul",
      lastName: "LeDewhurst",
      generation: 0,
      bio: "Creator of the LeDewhurst family name.",
      spouses: ["an"],
      parents: ["john", "donna"],
      photos: [],
      stories: [],
    },
    {
      id: "an",
      firstName: "An",
      lastName: "LeDewhurst",
      maidenName: "Le",
      generation: 0,
      bio: "Co-creator of the LeDewhurst family name.",
      spouses: ["paul"],
      parents: ["sang", "thuan"],
      siblings: ["phan"],
      photos: [],
      stories: [],
    },

    // An's brother
    {
      id: "phan",
      firstName: "Phan",
      lastName: "Le",
      generation: 0,
      bio: "An's brother.",
      parents: ["sang", "thuan"],
      siblings: ["an"],
      photos: [],
    },

    // Generation -1 - Parents
    // An's parents
    {
      id: "sang",
      firstName: "Sang",
      lastName: "Le",
      generation: -1,
      bio: "An's father.",
      spouses: ["thuan"],
      children: ["an", "phan"],
      parents: ["an-paternal-grandpa", "an-paternal-grandma"],
      photos: [],
    },
    {
      id: "thuan",
      firstName: "Thuan",
      lastName: "Phan",
      generation: -1,
      bio: "An's mother (kept maiden name).",
      spouses: ["sang"],
      children: ["an", "phan"],
      parents: ["an-maternal-grandpa", "an-maternal-grandma"],
      photos: [],
    },

    // Paul's parents
    {
      id: "john",
      firstName: "Andrew John",
      lastName: "Dewhurst",
      generation: -1,
      bio: "Paul's father.",
      spouses: ["donna"],
      children: ["paul"],
      siblings: ["carolyn"],
      parents: ["george", "margaret-dewhurst"],
      photos: [],
    },
    {
      id: "donna",
      firstName: "Donna",
      lastName: "Dewhurst",
      maidenName: "Douglas",
      generation: -1,
      bio: "Paul's mother.",
      spouses: ["john"],
      children: ["paul"],
      parents: ["donna-dad", "martha"],
      photos: [],
    },

    // John's sister
    {
      id: "carolyn",
      firstName: "Carolyn",
      lastName: "Dewhurst",
      generation: -1,
      bio: "John's sister, Paul's aunt.",
      parents: ["george", "margaret-dewhurst"],
      siblings: ["john"],
      photos: [],
    },

    // Generation -2 - Grandparents
    // An's paternal grandparents
    {
      id: "an-paternal-grandpa",
      firstName: "Grandfather",
      lastName: "Le",
      generation: -2,
      bio: "An's paternal grandfather.",
      spouses: ["an-paternal-grandma"],
      children: ["sang"],
      photos: [],
    },
    {
      id: "an-paternal-grandma",
      firstName: "Grandmother",
      lastName: "Le",
      generation: -2,
      bio: "An's paternal grandmother.",
      spouses: ["an-paternal-grandpa"],
      children: ["sang"],
      photos: [],
    },

    // An's maternal grandparents
    {
      id: "an-maternal-grandpa",
      firstName: "Grandfather",
      lastName: "Phan",
      generation: -2,
      bio: "An's maternal grandfather.",
      spouses: ["an-maternal-grandma"],
      children: ["thuan"],
      photos: [],
    },
    {
      id: "an-maternal-grandma",
      firstName: "Grandmother",
      lastName: "Phan",
      generation: -2,
      bio: "An's maternal grandmother.",
      spouses: ["an-maternal-grandma"],
      children: ["thuan"],
      photos: [],
    },

    // Paul's paternal grandparents (John's parents)
    {
      id: "george",
      firstName: "George",
      lastName: "Dewhurst",
      generation: -2,
      bio: "Paul's paternal grandfather, John's father.",
      spouses: ["margaret-dewhurst"],
      children: ["john", "carolyn"],
      photos: [],
    },
    {
      id: "margaret-dewhurst",
      firstName: "Margaret",
      lastName: "Dewhurst",
      generation: -2,
      bio: "Paul's paternal grandmother, John's mother.",
      spouses: ["george"],
      children: ["john", "carolyn"],
      photos: [],
    },

    // Paul's maternal grandparents (Donna's parents)
    {
      id: "donna-dad",
      firstName: "Blank",
      lastName: "Douglas",
      generation: -2,
      bio: "Donna's father (name unknown).",
      spouses: ["martha"],
      children: ["donna"],
      photos: [],
    },
    {
      id: "martha",
      firstName: "Martha",
      lastName: "Croucher",
      maidenName: "Douglas",
      generation: -2,
      bio: "Donna's mother. Married to Len Croucher (second marriage, no kids with Len).",
      spouses: ["len"],
      formerSpouses: ["donna-dad"],
      children: ["donna"],
      photos: [],
    },

    // Len Croucher (Martha's second husband, no kids together)
    {
      id: "len",
      firstName: "Len",
      lastName: "Croucher",
      generation: -2,
      bio: "Martha's second husband. No children with Martha.",
      spouses: ["martha"],
      photos: [],
    },
  ],
  relationships: [
    // Current marriages
    {
      id: "rel-paul-an",
      person1: "paul",
      person2: "an",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-sang-thuan",
      person1: "sang",
      person2: "thuan",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-john-donna",
      person1: "john",
      person2: "donna",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-george-margaret",
      person1: "george",
      person2: "margaret-dewhurst",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-martha-len",
      person1: "martha",
      person2: "len",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-an-gp-paternal",
      person1: "an-paternal-grandpa",
      person2: "an-paternal-grandma",
      type: "marriage",
      current: true,
    },
    {
      id: "rel-an-gp-maternal",
      person1: "an-maternal-grandpa",
      person2: "an-maternal-grandma",
      type: "marriage",
      current: true,
    },

    // Former marriages
    {
      id: "rel-martha-ex",
      person1: "martha",
      person2: "donna-dad",
      type: "marriage",
      current: false,
    },
  ],
};

// Helper function to get person by ID
export function getPersonById(
  id: string,
  people: Person[] = familyData.people
): Person | undefined {
  return people.find((p) => p.id === id);
}

// Helper function to get person's slug for URL
export function getPersonSlug(person: Person): string {
  return `${person.firstName.toLowerCase()}-${person.lastName.toLowerCase()}`.replace(
    /\s+/g,
    "-"
  );
}

// Helper function to find person by slug
export function getPersonBySlug(
  slug: string,
  people: Person[] = familyData.people
): Person | undefined {
  return people.find((p) => getPersonSlug(p) === slug);
}

// Helper to check if person is deceased
export function isDeceased(person: Person): boolean {
  return !!person.deathDate;
}
