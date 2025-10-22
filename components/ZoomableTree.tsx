"use client";

import { useState, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Person, getPersonById as getPersonByIdHelper } from "@/lib/familyData";
import TreeNode from "./TreeNode";
import { ZoomIn, ZoomOut, Maximize2, Eye } from "lucide-react";

interface ZoomableTreeProps {
  people: Person[];
  onPersonClick: (person: Person) => void;
  selectedPersonId?: string;
}

type ViewLevel = "minimal" | "parents" | "grandparents" | "all";

// Layout constants
const LAYOUT = {
  SLOT_WIDTH: 160, // Width of each grid slot
  NODE_WIDTH: 140,
  NODE_HEIGHT: 120,
  VERTICAL_GAP: 240, // Increased for better readability
  HOUSEHOLD_GAP_SLOTS: 2, // 2 empty slots between households for readability
} as const;

interface GridSlot {
  person?: Person;
  household: string; // Identifier for which household this belongs to
  isGap: boolean; // Is this a gap slot between households?
}

interface GridRow {
  y: number;
  slots: GridSlot[];
  generation: number;
}

export default function ZoomableTree({
  people,
  onPersonClick,
  selectedPersonId,
}: ZoomableTreeProps) {
  const [viewLevel, setViewLevel] = useState<ViewLevel>("grandparents");
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set()
  );

  const getPersonById = (id: string) => getPersonByIdHelper(id, people);

  const toggleBranch = (personId: string) => {
    setExpandedBranches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  };

  // Build grid system
  const grid = useMemo(() => {
    const showParents = viewLevel !== "minimal";
    const showGrandparents =
      viewLevel === "grandparents" || viewLevel === "all";

    const paul = getPersonById("paul");
    const an = getPersonById("an");
    const phan = getPersonById("phan");

    if (!paul || !an) return null;

    const rows: GridRow[] = [];
    const centerY = 900;

    // === GENERATION 0: Current (An, Paul, siblings) ===
    const gen0Slots: GridSlot[] = [];

    // Household 1: An's siblings (Phan, An)
    if (phan) {
      gen0Slots.push({ person: phan, household: "an-household", isGap: false });
      // Single slot gap between siblings
      gen0Slots.push({ household: "an-household", isGap: true });
    }
    gen0Slots.push({ person: an, household: "an-household", isGap: false });

    // Gap between households
    for (let i = 0; i < LAYOUT.HOUSEHOLD_GAP_SLOTS; i++) {
      gen0Slots.push({ household: "gap", isGap: true });
    }

    // Household 2: Paul
    gen0Slots.push({ person: paul, household: "paul-household", isGap: false });

    rows.push({
      y: centerY,
      slots: gen0Slots,
      generation: 0,
    });

    if (!showParents) return { rows, centerY };

    // === GENERATION -1: Parents ===
    const gen1Slots: GridSlot[] = [];

    const sang = getPersonById("sang");
    const thuan = getPersonById("thuan");
    const john = getPersonById("john");
    const donna = getPersonById("donna");
    const carolyn = getPersonById("carolyn");

    // Household 1: An's parents (Sang, Thuan)
    if (sang)
      gen1Slots.push({ person: sang, household: "an-parents", isGap: false });
    if (thuan)
      gen1Slots.push({ person: thuan, household: "an-parents", isGap: false });

    // Gap between households
    for (let i = 0; i < LAYOUT.HOUSEHOLD_GAP_SLOTS; i++) {
      gen1Slots.push({ household: "gap", isGap: true });
    }

    // Household 2: Paul's parents (John, Donna) and John's siblings
    // CRITICAL: Married couples MUST be adjacent for marriage line
    // Order: Siblings first, then married couple

    // John's siblings first (like Carolyn)
    if (carolyn) {
      gen1Slots.push({
        person: carolyn,
        household: "paul-parents",
        isGap: false,
      });
      gen1Slots.push({ household: "paul-parents", isGap: true }); // Gap after sibling
    }

    // Then the married couple (adjacent, no gap between them)
    if (john)
      gen1Slots.push({ person: john, household: "paul-parents", isGap: false });
    if (donna)
      gen1Slots.push({
        person: donna,
        household: "paul-parents",
        isGap: false,
      });

    rows.push({
      y: centerY - LAYOUT.VERTICAL_GAP,
      slots: gen1Slots,
      generation: -1,
    });

    if (!showGrandparents) return { rows, centerY };

    // === GENERATION -2: Grandparents ===
    const gen2Slots: GridSlot[] = [];

    // An's paternal grandparents
    const anPaternalGP1 = sang?.parents?.[0]
      ? getPersonById(sang.parents[0])
      : null;
    const anPaternalGP2 = sang?.parents?.[1]
      ? getPersonById(sang.parents[1])
      : null;

    if (anPaternalGP1)
      gen2Slots.push({
        person: anPaternalGP1,
        household: "an-paternal-gp",
        isGap: false,
      });
    if (anPaternalGP2)
      gen2Slots.push({
        person: anPaternalGP2,
        household: "an-paternal-gp",
        isGap: false,
      });

    // Gap
    for (let i = 0; i < LAYOUT.HOUSEHOLD_GAP_SLOTS; i++) {
      gen2Slots.push({ household: "gap", isGap: true });
    }

    // An's maternal grandparents
    const anMaternalGP1 = thuan?.parents?.[0]
      ? getPersonById(thuan.parents[0])
      : null;
    const anMaternalGP2 = thuan?.parents?.[1]
      ? getPersonById(thuan.parents[1])
      : null;

    if (anMaternalGP1)
      gen2Slots.push({
        person: anMaternalGP1,
        household: "an-maternal-gp",
        isGap: false,
      });
    if (anMaternalGP2)
      gen2Slots.push({
        person: anMaternalGP2,
        household: "an-maternal-gp",
        isGap: false,
      });

    // Gap
    for (let i = 0; i < LAYOUT.HOUSEHOLD_GAP_SLOTS; i++) {
      gen2Slots.push({ household: "gap", isGap: true });
    }

    // Paul's paternal grandparents (John's parents)
    const paulPaternalGP1 = john?.parents?.[0]
      ? getPersonById(john.parents[0])
      : null;
    const paulPaternalGP2 = john?.parents?.[1]
      ? getPersonById(john.parents[1])
      : null;

    if (paulPaternalGP1)
      gen2Slots.push({
        person: paulPaternalGP1,
        household: "paul-paternal-gp",
        isGap: false,
      });
    if (paulPaternalGP2)
      gen2Slots.push({
        person: paulPaternalGP2,
        household: "paul-paternal-gp",
        isGap: false,
      });

    // Gap
    for (let i = 0; i < LAYOUT.HOUSEHOLD_GAP_SLOTS; i++) {
      gen2Slots.push({ household: "gap", isGap: true });
    }

    // Paul's maternal grandparents (Donna's parents)
    const paulMaternalGP1 = donna?.parents?.[0]
      ? getPersonById(donna.parents[0])
      : null;
    const paulMaternalGP2 = donna?.parents?.[1]
      ? getPersonById(donna.parents[1])
      : null;

    // Check for ex-spouses (like Martha's first husband)
    const martha = paulMaternalGP2;
    const showMarthaEx =
      martha && expandedBranches.has(martha.id) && martha.formerSpouses;

    if (showMarthaEx && martha.formerSpouses) {
      // Add ex-spouse first
      const ex = getPersonById(martha.formerSpouses[0]);
      if (ex)
        gen2Slots.push({
          person: ex,
          household: "paul-maternal-gp-ex",
          isGap: false,
        });
    }

    if (paulMaternalGP1)
      gen2Slots.push({
        person: paulMaternalGP1,
        household: "paul-maternal-gp",
        isGap: false,
      });
    if (paulMaternalGP2)
      gen2Slots.push({
        person: paulMaternalGP2,
        household: "paul-maternal-gp",
        isGap: false,
      });

    rows.push({
      y: centerY - LAYOUT.VERTICAL_GAP * 2,
      slots: gen2Slots,
      generation: -2,
    });

    return { rows, centerY };
  }, [people, viewLevel, expandedBranches]);

  if (!grid) return null;

  // Convert grid slots to positioned nodes
  // Each row is centered independently
  const allNodes: Array<{
    person: Person;
    x: number;
    y: number;
    slotIndex: number;
    rowIndex: number;
    household: string;
  }> = [];

  const canvasCenterX = 2000; // Center point of canvas

  grid.rows.forEach((row, rowIndex) => {
    // Calculate this row's width
    const rowWidth = row.slots.length * LAYOUT.SLOT_WIDTH;
    const rowStartX = canvasCenterX - rowWidth / 2; // Center this row

    row.slots.forEach((slot, slotIndex) => {
      if (!slot.isGap && slot.person) {
        allNodes.push({
          person: slot.person,
          x:
            rowStartX +
            slotIndex * LAYOUT.SLOT_WIDTH +
            (LAYOUT.SLOT_WIDTH - LAYOUT.NODE_WIDTH) / 2,
          y: row.y,
          slotIndex,
          rowIndex,
          household: slot.household,
        });
      }
    });
  });

  // Generate connection lines
  const lines: any[] = [];

  // Helper to find nodes
  const findNode = (personId: string) =>
    allNodes.find((n) => n.person.id === personId);
  const findNodesInHousehold = (household: string, rowIndex: number) =>
    allNodes.filter(
      (n) => n.household === household && n.rowIndex === rowIndex
    );

  // Marriage lines (horizontal between spouses in same household)
  grid.rows.forEach((row, rowIndex) => {
    const householdNodes = new Map<string, typeof allNodes>();

    allNodes
      .filter((n) => n.rowIndex === rowIndex)
      .forEach((node) => {
        if (!householdNodes.has(node.household)) {
          householdNodes.set(node.household, []);
        }
        householdNodes.get(node.household)?.push(node);
      });

    householdNodes.forEach((nodes, household) => {
      if (nodes.length === 2) {
        // Draw marriage line between the two people in household
        const [person1, person2] = nodes.sort(
          (a, b) => a.slotIndex - b.slotIndex
        );

        // Check if this is an ex-spouse relationship
        const isEx =
          person1.person.formerSpouses?.includes(person2.person.id) ||
          person2.person.formerSpouses?.includes(person1.person.id);

        lines.push({
          type: "marriage",
          x1: person1.x + LAYOUT.NODE_WIDTH,
          y1: person1.y + LAYOUT.NODE_HEIGHT / 2,
          x2: person2.x,
          y2: person2.y + LAYOUT.NODE_HEIGHT / 2,
          style: isEx ? "dashed" : "solid",
        });
      }
    });
  });

  // Parent-child lines
  // From Generation 0 to -1
  const an = findNode("an");
  const phan = findNode("phan");
  const paul = findNode("paul");
  const sang = findNode("sang");
  const thuan = findNode("thuan");
  const john = findNode("john");
  const donna = findNode("donna");

  if (an && sang && thuan) {
    // Find marriage line midpoint between Sang & Thuan
    const parentMidX = (sang.x + thuan.x + LAYOUT.NODE_WIDTH) / 2;
    const parentMidY = sang.y + LAYOUT.NODE_HEIGHT / 2;

    // If Phan exists, connect to sibling line
    if (phan) {
      const siblingMidX = (phan.x + an.x + LAYOUT.NODE_WIDTH) / 2;
      const siblingY = an.y - 60; // Sibling line height

      // Sibling line
      lines.push({
        type: "sibling",
        x1: phan.x + LAYOUT.NODE_WIDTH / 2,
        y1: phan.y,
        x2: phan.x + LAYOUT.NODE_WIDTH / 2,
        y2: siblingY,
      });

      lines.push({
        type: "sibling",
        x1: phan.x + LAYOUT.NODE_WIDTH / 2,
        y1: siblingY,
        x2: an.x + LAYOUT.NODE_WIDTH / 2,
        y2: siblingY,
      });

      lines.push({
        type: "sibling",
        x1: an.x + LAYOUT.NODE_WIDTH / 2,
        y1: siblingY,
        x2: an.x + LAYOUT.NODE_WIDTH / 2,
        y2: an.y,
      });

      // From parents to sibling line
      lines.push({
        type: "parent-child",
        x1: parentMidX,
        y1: parentMidY,
        x2: parentMidX,
        y2: parentMidY + LAYOUT.VERTICAL_GAP / 2,
      });

      lines.push({
        type: "parent-child",
        x1: parentMidX,
        y1: parentMidY + LAYOUT.VERTICAL_GAP / 2,
        x2: siblingMidX,
        y2: siblingY,
      });
    } else {
      // Direct line to An
      lines.push({
        type: "parent-child",
        x1: parentMidX,
        y1: parentMidY,
        x2: parentMidX,
        y2: parentMidY + LAYOUT.VERTICAL_GAP / 2,
      });

      lines.push({
        type: "parent-child",
        x1: parentMidX,
        y1: parentMidY + LAYOUT.VERTICAL_GAP / 2,
        x2: an.x + LAYOUT.NODE_WIDTH / 2,
        y2: an.y,
      });
    }
  }

  if (paul && john && donna) {
    // Find marriage line midpoint between John & Donna
    const parentMidX = (john.x + donna.x + LAYOUT.NODE_WIDTH) / 2;
    const parentMidY = john.y + LAYOUT.NODE_HEIGHT / 2;

    // Single child: Add vertical stub up (same height as sibling line would be)
    const stubHeight = 60; // Same as SIBLING_LINE_HEIGHT

    // Vertical stub from Paul
    lines.push({
      type: "child-stub",
      x1: paul.x + LAYOUT.NODE_WIDTH / 2,
      y1: paul.y,
      x2: paul.x + LAYOUT.NODE_WIDTH / 2,
      y2: paul.y - stubHeight,
    });

    // Line from parents down to stub level
    lines.push({
      type: "parent-child",
      x1: parentMidX,
      y1: parentMidY,
      x2: parentMidX,
      y2: parentMidY + LAYOUT.VERTICAL_GAP / 2,
    });

    // Horizontal/diagonal to child's stub
    lines.push({
      type: "parent-child",
      x1: parentMidX,
      y1: parentMidY + LAYOUT.VERTICAL_GAP / 2,
      x2: paul.x + LAYOUT.NODE_WIDTH / 2,
      y2: paul.y - stubHeight,
    });
  }

  // Grandparent to parent lines (similar logic)
  // TODO: Add grandparent connections

  // Red highlight box around An & Paul
  const highlightBox =
    an && paul
      ? {
          x: an.x - 20,
          y: an.y - 20,
          width: paul.x - an.x + LAYOUT.NODE_WIDTH + 40,
          height: LAYOUT.NODE_HEIGHT + 40,
        }
      : null;

  return (
    <div className="w-full h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-inner relative overflow-hidden">
      <TransformWrapper
        initialScale={0.5}
        minScale={0.2}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.08 }}
        doubleClick={{ mode: "reset" }}
        panning={{ disabled: false }}
        centerZoomedOut={false}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* View Controls */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  View:
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {(
                  ["minimal", "parents", "grandparents", "all"] as ViewLevel[]
                ).map((level) => (
                  <button
                    key={level}
                    onClick={() => setViewLevel(level)}
                    className={`px-3 py-1.5 text-xs rounded transition-all ${
                      viewLevel === level
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level === "minimal" && "Just Us"}
                    {level === "parents" && "+ Parents"}
                    {level === "grandparents" && "+ Grandparents"}
                    {level === "all" && "Show All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => zoomIn()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
              >
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              <div
                className="relative"
                style={{ width: "4000px", height: "2000px" }}
              >
                {/* SVG for lines */}
                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  width="4000"
                  height="2000"
                  style={{ zIndex: 1 }}
                >
                  {/* Red highlight box */}
                  {highlightBox && (
                    <rect
                      x={highlightBox.x}
                      y={highlightBox.y}
                      width={highlightBox.width}
                      height={highlightBox.height}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3"
                      rx="16"
                      className="transition-all duration-500"
                    />
                  )}

                  {lines.map((line, idx) => (
                    <line
                      key={idx}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={
                        line.type === "marriage"
                          ? line.style === "solid"
                            ? "#F472B6"
                            : "#9CA3AF"
                          : "#9CA3AF"
                      }
                      strokeWidth={line.type === "marriage" ? "3" : "2"}
                      strokeDasharray={line.style === "dashed" ? "5,5" : "0"}
                      className="transition-all duration-500"
                    />
                  ))}
                </svg>

                {/* Render nodes */}
                <div className="absolute top-0 left-0" style={{ zIndex: 2 }}>
                  {allNodes.map((node, idx) => (
                    <div
                      key={idx}
                      className="absolute transition-all duration-500"
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      <TreeNode
                        person={node.person}
                        onClick={() => onPersonClick(node.person)}
                        isSpouse={
                          node.person.spouses && node.person.spouses.length > 0
                        }
                        isSelected={node.person.id === selectedPersonId}
                        showExpand={
                          node.person.formerSpouses &&
                          node.person.formerSpouses.length > 0 &&
                          !expandedBranches.has(node.person.id)
                        }
                        onExpand={() => toggleBranch(node.person.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
