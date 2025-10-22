# LeDewhurst Family Tree

A modern, interactive family tree website celebrating the union of the Le and Dewhurst families.

## Features

- 🌳 **Interactive Family Tree** - Click on any family member to view detailed information
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- 👥 **Expandable Generations** - Show/hide grandparents and other generations
- 💑 **Relationship Tracking** - Visual indicators for marriages, parents, siblings, and children
- 📸 **Photo Support** - Add photos for each family member
- 📝 **Rich Bios** - Include biographical information for each person
- 🎯 **Static Site** - Hosted on GitHub Pages, no server required

## Getting Started

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To build the static site for GitHub Pages:

```bash
npm run build
```

This creates an `out` folder with your static site ready to deploy.

## Adding Family Members

Edit the `lib/familyData.ts` file to add or modify family members:

```typescript
{
  id: 'unique-id',
  firstName: 'John',
  lastName: 'Doe',
  maidenName: 'Smith', // Optional, for married names
  birthDate: '1990-01-01', // Optional
  birthPlace: 'London, UK', // Optional
  bio: 'A brief biography...', // Optional
  photoUrl: '/photos/john-doe.jpg', // Optional
  generation: 0, // 0 = current, -1 = parents, -2 = grandparents, etc.
  parents: ['parent-id-1', 'parent-id-2'], // Optional
  spouses: ['spouse-id'], // Optional
  children: ['child-id-1', 'child-id-2'], // Optional
  siblings: ['sibling-id-1'], // Optional
}
```

### Adding Photos

1. Place photos in the `public/photos/` directory
2. Reference them in the `photoUrl` field: `/photos/filename.jpg`
3. Recommended size: 400x400 pixels (square)

## Deploying to GitHub Pages

### Option 1: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

3. Push to main branch - the site will automatically deploy!

### Option 2: Manual Deployment

1. Build the site:
```bash
npm run build
```

2. Push the `out` folder to the `gh-pages` branch
3. Enable GitHub Pages from the `gh-pages` branch

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      'family-blue': '#3B82F6',
      'family-pink': '#EC4899',
      // Add your custom colors
    },
  },
}
```

### Generations Displayed

In `components/FamilyTree.tsx`, you can add more expandable sections for:
- Great-grandparents
- Aunts and uncles
- Cousins
- Children
- Grandchildren

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **GitHub Pages** - Free static hosting

## Project Structure

```
ledewhurst-family-tree/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── FamilyTree.tsx    # Main tree component
│   ├── PersonCard.tsx    # Individual person card
│   └── PersonModal.tsx   # Detail modal
├── lib/
│   └── familyData.ts     # Family data and types
├── public/
│   └── photos/           # Family photos
└── package.json
```

## Contributing

To add or update family members:

1. Fork this repository
2. Edit `lib/familyData.ts`
3. Add any photos to `public/photos/`
4. Commit and push your changes
5. The site will automatically rebuild

## License

Private - For LeDewhurst Family Use Only

---

Built with ❤️ for the LeDewhurst Family
