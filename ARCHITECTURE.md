# Architecture Overview

## Component Hierarchy

```
page.tsx (Main Page)
│
├── FamilyTree Component
│   │
│   ├── Show Grandparents Button (toggle)
│   │
│   ├── Grandparents Section (conditional)
│   │   ├── Dewhurst Side
│   │   │   ├── Paternal Grandparents
│   │   │   │   ├── PersonCard (Grandpa)
│   │   │   │   └── PersonCard (Grandma)
│   │   │   └── Maternal Grandparents
│   │   │       ├── PersonCard (Grandpa)
│   │   │       └── PersonCard (Grandma)
│   │   │
│   │   └── Le Side
│   │       ├── Paternal Grandparents
│   │       │   ├── PersonCard (Grandpa)
│   │       │   └── PersonCard (Grandma)
│   │       └── Maternal Grandparents
│   │           ├── PersonCard (Grandpa)
│   │           └── PersonCard (Grandma)
│   │
│   ├── Parents Section
│   │   ├── Dewhurst Side
│   │   │   ├── PersonCard (Dad)
│   │   │   └── PersonCard (Mom)
│   │   │
│   │   └── Le Side
│   │       ├── PersonCard (Dad)
│   │       └── PersonCard (Mom)
│   │
│   └── Current Generation Section
│       ├── PersonCard (An's Brother)
│       ├── PersonCard (An) - marked as spouse
│       ├── Marriage Indicator
│       └── PersonCard (You) - marked as spouse
│
└── PersonModal (popup on click)
    ├── Header with photo
    ├── Basic info (birth date, place)
    ├── Biography section
    └── Relationship badges
        ├── Parents
        ├── Spouses
        ├── Siblings
        └── Children
```

## Data Flow

```
familyData.ts (Source of Truth)
    │
    ├── people: Person[]
    │   └── All family members with their info
    │
    └── relationships: Relationship[]
        └── All marriages/connections
        
    ↓
    
page.tsx (Main Component)
    │
    ├── State: selectedPerson
    │   └── Currently viewed person in modal
    │
    └── Handlers:
        ├── onPersonClick(person)
        └── onModalClose()
        
    ↓
    
FamilyTree Component
    │
    ├── Props:
    │   ├── people[] (all family members)
    │   ├── onPersonClick (handler)
    │   └── selectedPersonId (for highlighting)
    │
    └── State:
        ├── showGrandparents (toggle)
        └── showGreatGrandparents (toggle)
        
    ↓
    
PersonCard Component (repeated for each person)
    │
    ├── Props:
    │   ├── person (Person object)
    │   ├── onClick (handler)
    │   ├── isSpouse (boolean)
    │   └── isSelected (boolean)
    │
    └── Renders:
        ├── Photo or avatar
        ├── Name and surname
        ├── Maiden name (if applicable)
        ├── Marriage indicator
        └── Birth info
        
    ↓ (on click)
    
PersonModal Component
    │
    ├── Props:
    │   ├── person (selected person)
    │   ├── onClose (handler)
    │   └── allPeople (for looking up relationships)
    │
    └── Renders:
        ├── Full-size photo
        ├── Complete name
        ├── Birth details
        ├── Biography
        └── Related people:
            ├── Parents (name badges)
            ├── Spouses (name badges)
            ├── Siblings (name badges)
            └── Children (name badges)
```

## File Organization

```
ledewhurst-family-tree/
│
├── Configuration Files
│   ├── package.json          # Dependencies & scripts
│   ├── tsconfig.json         # TypeScript config
│   ├── tailwind.config.js    # Styling config
│   ├── postcss.config.js     # CSS processing
│   ├── next.config.js        # Next.js config (static export)
│   └── .gitignore           # Git ignore rules
│
├── app/ (Next.js App Router)
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Main page (family tree)
│   └── globals.css          # Global Tailwind styles
│
├── components/ (React Components)
│   ├── FamilyTree.tsx       # Main tree with expand/collapse
│   ├── PersonCard.tsx       # Individual person display
│   └── PersonModal.tsx      # Detailed person popup
│
├── lib/ (Data & Types)
│   └── familyData.ts        # Family data structure & sample data
│
├── public/ (Static Assets)
│   └── photos/              # Family member photos
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
│
└── Documentation
    ├── README.md            # Full documentation
    ├── QUICKSTART.md        # Quick start guide
    ├── PROJECT_SUMMARY.md   # Project overview
    └── ARCHITECTURE.md      # This file
```

## State Management

### Local Component State
```typescript
// In page.tsx
const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

// In FamilyTree.tsx
const [showGrandparents, setShowGrandparents] = useState(false);
```

### Props Drilling Pattern
```
page.tsx
  └─> FamilyTree
        └─> PersonCard (receives person data)
              └─> onClick triggers PersonModal
```

### No External State Management Needed
- React useState is sufficient
- All data is static (from familyData.ts)
- No API calls or async operations

## Styling Approach

### Tailwind Utility Classes
```tsx
// Responsive design
className="grid grid-cols-1 lg:grid-cols-2 gap-12"

// Gradients
className="bg-gradient-to-br from-blue-50 to-indigo-100"

// Animations
className="transition-all duration-300 hover:scale-105"
```

### Custom Classes (in globals.css)
```css
/* Minimal custom CSS */
/* Most styling done with Tailwind utilities */
```

### Color System
```javascript
// tailwind.config.js
colors: {
  'family-blue': '#3B82F6',
  'family-pink': '#EC4899',
  'family-green': '#10B981',
  'family-purple': '#8B5CF6',
}
```

## Build & Deployment Pipeline

```
Developer Workflow:
1. Edit lib/familyData.ts
2. Add photos to public/photos/
3. Test locally (npm run dev)
4. Commit changes
5. Push to GitHub

    ↓

GitHub Actions (.github/workflows/deploy.yml):
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (npm ci)
4. Build Next.js (npm run build)
5. Upload artifact
6. Deploy to GitHub Pages

    ↓

GitHub Pages:
1. Receives built files from /out
2. Serves static site
3. Available at: username.github.io/repo-name
```

## TypeScript Types

```typescript
// Core Types (lib/familyData.ts)

type RelationType = 'blood' | 'marriage' | 'partner';

interface Person {
  id: string;              // Unique identifier
  firstName: string;       // First name
  lastName: string;        // Last name
  maidenName?: string;     // For married names
  birthDate?: string;      // ISO date string
  birthPlace?: string;     // Location
  bio?: string;           // Biography
  photoUrl?: string;       // Path to photo
  generation: number;      // 0=current, -1=parents, etc.
  parents?: string[];      // Parent IDs
  spouses?: string[];      // Spouse IDs
  children?: string[];     // Children IDs
  siblings?: string[];     // Sibling IDs
}

interface Relationship {
  id: string;
  person1: string;         // First person ID
  person2: string;         // Second person ID
  type: RelationType;
  marriageDate?: string;
  divorceDate?: string;
}

interface FamilyData {
  people: Person[];
  relationships: Relationship[];
}
```

## Extension Points

### Adding New Features

1. **New Person Fields**
   - Edit Person type in `lib/familyData.ts`
   - Update PersonCard to display new field
   - Update PersonModal to show details

2. **New Generation Levels**
   - Add state in FamilyTree: `const [showX, setShowX] = useState(false)`
   - Add section in render
   - Add toggle button

3. **New Relationship Types**
   - Update RelationType union
   - Add visual indicators in PersonCard
   - Update modal display logic

4. **Search/Filter**
   - Add search input in page.tsx
   - Filter people array before passing to FamilyTree
   - Highlight matching cards

5. **Print View**
   - Create new route: `app/print/page.tsx`
   - Flatten tree structure
   - Add print-specific styles

## Performance Considerations

### Why This Scales Well

1. **Static Generation**
   - No runtime database queries
   - Pre-rendered HTML
   - Instant page loads

2. **Lazy Rendering**
   - Grandparents only render when expanded
   - Modal only renders when opened
   - No unnecessary DOM nodes

3. **Efficient Updates**
   - React handles minimal re-renders
   - Only changed components update
   - Virtual DOM diffing

4. **Image Optimization**
   - Recommend 400x400px photos
   - Can add next/image for optimization
   - Lazy loading for off-screen images

### Estimated Capacity
- 100 people: Instant
- 500 people: < 1s load
- 1000+ people: Still < 2s load

## Security & Privacy

### Data Location
- All data in `lib/familyData.ts`
- No external API calls
- No backend database
- Fully contained in repository

### Access Control
- GitHub repository can be private
- Limit who can push changes
- Review all pull requests
- Version control for auditing

### Photo Privacy
- Photos stored in repository
- Public if repo is public
- Can use placeholder images
- Consider GDPR if applicable

## Future Enhancements (Ideas)

1. **Interactive Timeline**
   - Horizontal timeline view
   - Filter by date range
   - Show life events

2. **Family Statistics**
   - Total people count
   - Generation breakdown
   - Surname distribution

3. **Search & Filter**
   - Search by name
   - Filter by generation
   - Filter by surname

4. **Photo Gallery**
   - All family photos
   - Grid view
   - Lightbox display

5. **Stories Section**
   - Extended biographies
   - Markdown support
   - Rich text formatting

6. **DNA Connections**
   - Show genetic relationships
   - Visualize shared ancestry
   - Percentage calculations

7. **Export Options**
   - PDF generation
   - GEDCOM format
   - Print-friendly view

8. **Collaborative Editing**
   - Comment system
   - Photo upload form
   - Bio submission form

---

This architecture is designed to be:
- ✅ Simple to understand
- ✅ Easy to maintain
- ✅ Scalable
- ✅ Performant
- ✅ Extensible

You can start using it immediately or customize it extensively!
