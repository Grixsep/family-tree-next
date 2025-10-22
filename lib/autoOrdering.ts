// Auto-ordering algorithm for family tree layout
// Prevents line overlaps by intelligently ordering people based on their connections

import { Person } from "./familyData";

export interface OrderingConstraint {
  mustBeNextTo?: string[]; // Must be adjacent to these people (siblings)
  shouldBeNear?: string[]; // Should be near these people (parent-child)
  avoidCrossing?: string[]; // Avoid crossing lines with these people
}

export interface PersonWithConstraints {
  person: Person;
  constraints: OrderingConstraint;
}

/**
 * Calculate ordering constraints for a person based on their relationships
 */
export function calculateConstraints(
  person: Person,
  allPeople: Person[]
): OrderingConstraint {
  const constraints: OrderingConstraint = {
    mustBeNextTo: [],
    shouldBeNear: [],
    avoidCrossing: [],
  };

  // Siblings MUST be next to each other
  if (person.siblings && person.siblings.length > 0) {
    constraints.mustBeNextTo = person.siblings;
  }

  // Should be near parents
  if (person.parents && person.parents.length > 0) {
    constraints.shouldBeNear = person.parents;
  }

  // Should be near children
  if (person.children && person.children.length > 0) {
    constraints.shouldBeNear = [
      ...(constraints.shouldBeNear || []),
      ...person.children,
    ];
  }

  return constraints;
}

/**
 * Order siblings in a logical sequence
 * Rule: Siblings should be grouped together, with married ones placing their spouse after
 */
export function orderSiblings(siblings: Person[]): Person[] {
  // Sort siblings by whether they have children (those with kids tend to be older)
  return siblings.sort((a, b) => {
    const aHasChildren = (a.children?.length || 0) > 0;
    const bHasChildren = (b.children?.length || 0) > 0;

    if (aHasChildren && !bHasChildren) return -1;
    if (!aHasChildren && bHasChildren) return 1;

    // If both or neither have children, sort by birth date if available
    if (a.birthDate && b.birthDate) {
      return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
    }

    return 0;
  });
}

/**
 * Build a household group with optimal ordering
 * A household is a set of siblings + their spouses
 *
 * CRITICAL RULE: Married couples MUST be adjacent (no one between them)
 * Order: [Single siblings] [GAP] [Married couple]
 */
export function buildHouseholdGroup(
  rootPeople: Person[],
  allPeople: Person[],
  getPersonById: (id: string) => Person | undefined
): Person[] {
  const ordered: Person[] = [];

  // Get all siblings in order
  const orderedSiblings = orderSiblings(rootPeople);

  // Separate into married and single
  const married: Array<{ person: Person; spouse: Person }> = [];
  const single: Person[] = [];

  orderedSiblings.forEach((sibling) => {
    if (sibling.spouses && sibling.spouses.length > 0) {
      const spouse = getPersonById(sibling.spouses[0]);
      if (spouse) {
        married.push({ person: sibling, spouse });
      } else {
        single.push(sibling);
      }
    } else {
      single.push(sibling);
    }
  });

  // Add single siblings first
  ordered.push(...single);

  // Then add married couples (they must be adjacent)
  married.forEach(({ person, spouse }) => {
    ordered.push(person);
    ordered.push(spouse);
  });

  return ordered;
}

/**
 * Calculate optimal X position for a person based on their parent's position
 * This minimizes diagonal line crossing
 */
export function calculateOptimalChildPosition(
  childId: string,
  parentIds: string[],
  parentPositions: Map<string, number>, // personId -> x position
  siblingIds: string[],
  allPeople: Person[]
): number {
  // If child has siblings, they should be grouped
  // Return the average position of parents
  if (parentIds.length === 0) return 0;

  const parentXPositions = parentIds
    .map((id) => parentPositions.get(id))
    .filter((x): x is number => x !== undefined);

  if (parentXPositions.length === 0) return 0;

  // Average of parent positions
  const avgParentX =
    parentXPositions.reduce((sum, x) => sum + x, 0) / parentXPositions.length;

  return avgParentX;
}

/**
 * Detect if two parent-child lines would cross
 */
export function wouldLinesCross(
  parent1X: number,
  child1X: number,
  parent2X: number,
  child2X: number
): boolean {
  // Lines cross if their relative positions flip
  // Parent1 is left of Parent2, but Child1 is right of Child2
  return (
    (parent1X < parent2X && child1X > child2X) ||
    (parent1X > parent2X && child1X < child2X)
  );
}

/**
 * Sort children based on parent positions to minimize line crossing
 */
export function sortChildrenByParentPosition(
  children: Person[],
  parentPositions: Map<string, number>
): Person[] {
  return children.sort((a, b) => {
    const aParentX = a.parents?.[0]
      ? parentPositions.get(a.parents[0]) || 0
      : 0;
    const bParentX = b.parents?.[0]
      ? parentPositions.get(b.parents[0]) || 0
      : 0;

    return aParentX - bParentX;
  });
}

/**
 * Main ordering algorithm for a generation
 * Returns people ordered to minimize line crossings
 */
export function autoOrderGeneration(
  people: Person[],
  parentGeneration: Person[] | null,
  parentPositions: Map<string, number> | null
): Person[] {
  if (!parentGeneration || !parentPositions) {
    // No parents, use simple ordering (siblings together, oldest first)
    return orderSiblings(people);
  }

  // Group people by their parent households
  const householdGroups = new Map<string, Person[]>();

  people.forEach((person) => {
    if (!person.parents || person.parents.length === 0) {
      // No parents, create individual group
      if (!householdGroups.has("orphan")) {
        householdGroups.set("orphan", []);
      }
      householdGroups.get("orphan")?.push(person);
      return;
    }

    // Create household key from parent IDs (sorted for consistency)
    const householdKey = person.parents.slice().sort().join("-");

    if (!householdGroups.has(householdKey)) {
      householdGroups.set(householdKey, []);
    }
    householdGroups.get(householdKey)?.push(person);
  });

  // Order households by parent position (left to right)
  const orderedHouseholds = Array.from(householdGroups.entries()).sort(
    (a, b) => {
      const [keyA, peopleA] = a;
      const [keyB, peopleB] = b;

      if (keyA === "orphan") return 1;
      if (keyB === "orphan") return -1;

      const parentsA = peopleA[0].parents || [];
      const parentsB = peopleB[0].parents || [];

      const avgXA =
        parentsA
          .map((id) => parentPositions.get(id) || 0)
          .reduce((sum, x) => sum + x, 0) / parentsA.length;

      const avgXB =
        parentsB
          .map((id) => parentPositions.get(id) || 0)
          .reduce((sum, x) => sum + x, 0) / parentsB.length;

      return avgXA - avgXB;
    }
  );

  // Flatten households into ordered array
  const ordered: Person[] = [];

  orderedHouseholds.forEach(([_, householdPeople]) => {
    // Order siblings within each household
    const orderedSiblings = orderSiblings(householdPeople);
    ordered.push(...orderedSiblings);
  });

  return ordered;
}

/**
 * Complete auto-ordering algorithm for entire tree
 * Returns ordered people for each generation
 */
export function autoOrderTree(
  people: Person[],
  getPersonById: (id: string) => Person | undefined
): Map<number, Person[]> {
  // Group by generation
  const generations = new Map<number, Person[]>();

  people.forEach((person) => {
    if (!generations.has(person.generation)) {
      generations.set(person.generation, []);
    }
    generations.get(person.generation)?.push(person);
  });

  // Sort generation keys (oldest first)
  const sortedGenerations = Array.from(generations.keys()).sort(
    (a, b) => a - b
  );

  const orderedGenerations = new Map<number, Person[]>();
  const positionsByGeneration = new Map<number, Map<string, number>>();

  // Process each generation from oldest to youngest
  sortedGenerations.forEach((gen) => {
    const genPeople = generations.get(gen) || [];

    // Get parent generation
    const parentGen = gen - 1;
    const parentGenPeople = orderedGenerations.get(parentGen) || null;
    const parentPositions = positionsByGeneration.get(parentGen) || null;

    // Auto-order this generation
    const ordered = autoOrderGeneration(
      genPeople,
      parentGenPeople,
      parentPositions
    );
    orderedGenerations.set(gen, ordered);

    // Calculate positions for this generation (for next generation to use)
    const positions = new Map<string, number>();
    ordered.forEach((person, idx) => {
      positions.set(person.id, idx * 160); // SLOT_WIDTH
    });
    positionsByGeneration.set(gen, positions);
  });

  return orderedGenerations;
}

/**
 * Example usage:
 *
 * const orderedTree = autoOrderTree(familyData.people, getPersonById);
 * const orderedCurrentGen = orderedTree.get(0); // Generation 0
 * const orderedParents = orderedTree.get(-1);  // Generation -1
 * const orderedGrandparents = orderedTree.get(-2); // Generation -2
 *
 * // Use orderedCurrentGen to build grid slots
 */
