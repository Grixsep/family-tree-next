import { Person } from "./familyData";

// Layout constants
export const LAYOUT = {
  NODE_WIDTH: 140,
  NODE_HEIGHT: 120,
  MIN_HORIZONTAL_GAP: 60,
  VERTICAL_GAP: 100,
  COUPLE_GAP: 50,
  MIN_CONNECTOR_WIDTH: 50,
} as const;

export interface Position {
  x: number;
  y: number;
}

export interface BranchLayout {
  person: Person;
  position: Position;
  width: number;
  complexity: number;
  spouse?: Person;
  children?: BranchLayout[];
}

export interface TreeLayout {
  center: Position;
  an: Position;
  paul: Position;
  ansSide: {
    parents: BranchLayout | null;
    grandparents: BranchLayout[];
    width: number;
  };
  paulsSide: {
    parents: BranchLayout | null;
    grandparents: BranchLayout[];
    width: number;
  };
  connectorWidth: number;
}

// Calculate complexity of a branch (number of people + relationships)
export function calculateBranchComplexity(
  people: Person[],
  rootId: string,
  depth: number = 0
): number {
  if (depth > 2) return 0; // Limit depth

  const root = people.find((p) => p.id === rootId);
  if (!root) return 0;

  let complexity = 1; // The person themselves

  // Add spouse
  if (root.spouses && root.spouses.length > 0) {
    complexity += root.spouses.length;
  }

  // Add former spouses (if expanded)
  if (root.formerSpouses && root.formerSpouses.length > 0) {
    complexity += root.formerSpouses.length;
  }

  // Add parents (recursively)
  if (root.parents && depth < 2) {
    root.parents.forEach((parentId) => {
      complexity += calculateBranchComplexity(people, parentId, depth + 1);
    });
  }

  return complexity;
}

// Calculate width needed for a couple node
function getCoupleWidth(hasBoth: boolean): number {
  if (hasBoth) {
    return LAYOUT.NODE_WIDTH * 2 + LAYOUT.COUPLE_GAP;
  }
  return LAYOUT.NODE_WIDTH;
}

// Calculate width needed for grandparent branches
export function calculateGrandparentBranchWidth(
  grandparentPairs: Array<{ person1: Person; person2?: Person }>
): number {
  if (grandparentPairs.length === 0) return 0;

  const branchWidths = grandparentPairs.map((pair) =>
    getCoupleWidth(!!pair.person2)
  );

  const totalWidth = branchWidths.reduce((sum, width) => sum + width, 0);
  const gaps = (grandparentPairs.length - 1) * LAYOUT.MIN_HORIZONTAL_GAP;

  return totalWidth + gaps;
}

// Calculate width needed for parent with their grandparents
export function calculateParentBranchWidth(
  parent: Person,
  spouse: Person | undefined,
  grandparentBranches: number
): number {
  const parentCoupleWidth = getCoupleWidth(!!spouse);

  if (grandparentBranches === 0) {
    return parentCoupleWidth;
  }

  // Width is the maximum of parent couple width and grandparents width
  return Math.max(parentCoupleWidth, grandparentBranches);
}

// Calculate total side width
export function calculateSideWidth(
  parentBranches: Array<{ width: number }>
): number {
  if (parentBranches.length === 0) return LAYOUT.NODE_WIDTH;

  const totalBranchWidth = parentBranches.reduce(
    (sum, branch) => sum + branch.width,
    0
  );
  const gaps = (parentBranches.length - 1) * LAYOUT.MIN_HORIZONTAL_GAP;

  return totalBranchWidth + gaps;
}

// Sort branches: complex ones on outside, simple toward center
export function sortBranchesForSide(
  branches: Array<{ complexity: number; [key: string]: any }>,
  isLeftSide: boolean
): typeof branches {
  const sorted = [...branches].sort((a, b) => b.complexity - a.complexity);

  // For left side: complex on far left (descending)
  // For right side: complex on far right (ascending)
  return isLeftSide ? sorted : sorted.reverse();
}

// Calculate positions for grandparents under a parent
export function calculateGrandparentPositions(
  parentX: number,
  parentY: number,
  grandparentPairs: Array<{
    person1: Person;
    person2?: Person;
    complexity: number;
  }>,
  isLeftSide: boolean
): Array<{ person1: Position; person2?: Position; width: number }> {
  if (grandparentPairs.length === 0) return [];

  // Sort branches
  const sorted = sortBranchesForSide(grandparentPairs, isLeftSide);

  // Calculate total width
  const branchWidths = sorted.map((pair) => getCoupleWidth(!!pair.person2));
  const totalWidth =
    branchWidths.reduce((sum, w) => sum + w, 0) +
    (branchWidths.length - 1) * LAYOUT.MIN_HORIZONTAL_GAP;

  // Start position (leftmost)
  let currentX = parentX - totalWidth / 2;
  const y = parentY - LAYOUT.VERTICAL_GAP;

  return sorted.map((pair, idx) => {
    const branchWidth = branchWidths[idx];
    const person1X = currentX;
    const person2X = pair.person2
      ? currentX + LAYOUT.NODE_WIDTH + LAYOUT.COUPLE_GAP
      : undefined;

    currentX += branchWidth + LAYOUT.MIN_HORIZONTAL_GAP;

    return {
      person1: { x: person1X, y },
      person2: person2X ? { x: person2X, y } : undefined,
      width: branchWidth,
    };
  });
}

// Main function to calculate complete tree layout
export function calculateTreeLayout(
  people: Person[],
  canvasWidth: number = 2000,
  canvasHeight: number = 1500,
  showGrandparents: boolean = true
): TreeLayout {
  // Get key people
  const an = people.find((p) => p.id === "an");
  const paul = people.find((p) => p.id === "you");

  if (!an || !paul) {
    throw new Error("Could not find An or Paul in people array");
  }

  // Get parents
  const anDad = an.parents?.[0]
    ? people.find((p) => p.id === an.parents[0])
    : null;
  const anMom = an.parents?.[1]
    ? people.find((p) => p.id === an.parents[1])
    : null;
  const paulDad = paul.parents?.[0]
    ? people.find((p) => p.id === paul.parents[0])
    : null;
  const paulMom = paul.parents?.[1]
    ? people.find((p) => p.id === paul.parents[1])
    : null;

  // Calculate An's side width
  let ansSideWidth = LAYOUT.NODE_WIDTH;
  const ansGrandparents: any[] = [];

  if (anDad && showGrandparents) {
    // Get An's grandparents
    const paternal =
      anDad.parents
        ?.map((id) => people.find((p) => p.id === id))
        .filter(Boolean) || [];
    const maternal =
      anMom?.parents
        ?.map((id) => people.find((p) => p.id === id))
        .filter(Boolean) || [];

    if (paternal.length > 0) {
      ansGrandparents.push({
        type: "paternal",
        person1: paternal[0],
        person2: paternal[1],
        complexity: calculateBranchComplexity(people, paternal[0].id),
      });
    }

    if (maternal.length > 0) {
      ansGrandparents.push({
        type: "maternal",
        person1: maternal[0],
        person2: maternal[1],
        complexity: calculateBranchComplexity(people, maternal[0].id),
      });
    }

    const gpWidth = calculateGrandparentBranchWidth(ansGrandparents);
    ansSideWidth = Math.max(getCoupleWidth(!!anMom), gpWidth);
  }

  // Calculate Paul's side width
  let paulsSideWidth = LAYOUT.NODE_WIDTH;
  const paulsGrandparents: any[] = [];

  if (paulDad && showGrandparents) {
    const paternal =
      paulDad.parents
        ?.map((id) => people.find((p) => p.id === id))
        .filter(Boolean) || [];
    const maternal =
      paulMom?.parents
        ?.map((id) => people.find((p) => p.id === id))
        .filter(Boolean) || [];

    if (paternal.length > 0) {
      paulsGrandparents.push({
        type: "paternal",
        person1: paternal[0],
        person2: paternal[1],
        complexity: calculateBranchComplexity(people, paternal[0].id),
      });
    }

    if (maternal.length > 0) {
      paulsGrandparents.push({
        type: "maternal",
        person1: maternal[0],
        person2: maternal[1],
        complexity: calculateBranchComplexity(people, maternal[0].id),
      });
    }

    const gpWidth = calculateGrandparentBranchWidth(paulsGrandparents);
    paulsSideWidth = Math.max(getCoupleWidth(!!paulMom), gpWidth);
  }

  // Calculate center and positions
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Base connector width (can grow if sides are unbalanced)
  const connectorWidth = LAYOUT.MIN_CONNECTOR_WIDTH;

  // Position An and Paul
  const anX =
    centerX - ansSideWidth / 2 - LAYOUT.NODE_WIDTH / 2 - connectorWidth / 2;
  const paulX =
    centerX + paulsSideWidth / 2 + LAYOUT.NODE_WIDTH / 2 + connectorWidth / 2;

  const baseY = centerY;

  // Position parents
  const parentsY = baseY - LAYOUT.VERTICAL_GAP;

  return {
    center: { x: centerX, y: centerY },
    an: { x: anX, y: baseY },
    paul: { x: paulX, y: baseY },
    ansSide: {
      parents: anDad
        ? {
            person: anDad,
            position: { x: anX, y: parentsY },
            width: ansSideWidth,
            complexity: 0,
            spouse: anMom,
          }
        : null,
      grandparents: [],
      width: ansSideWidth,
    },
    paulsSide: {
      parents: paulDad
        ? {
            person: paulDad,
            position: { x: paulX, y: parentsY },
            width: paulsSideWidth,
            complexity: 0,
            spouse: paulMom,
          }
        : null,
      grandparents: [],
      width: paulsSideWidth,
    },
    connectorWidth,
  };
}
