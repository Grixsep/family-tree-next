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
  NODE_WIDTH: 140,
  NODE_HEIGHT: 120,
  HORIZONTAL_GAP: 80,
  VERTICAL_GAP: 120,
  MARRIAGE_LINE_WIDTH: 60,
  SIBLING_LINE_HEIGHT: 40,
} as const;

interface NodePosition {
  person: Person;
  x: number;
  y: number;
  spouse?: Person;
}

export default function ZoomableTree({
  people,
  onPersonClick,
  selectedPersonId,
}: ZoomableTreeProps) {
  const [viewLevel, setViewLevel] = useState<ViewLevel>("parents");
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

  // Calculate positions for all nodes
  const positions = useMemo(() => {
    const showParents = viewLevel !== "minimal";
    const showGrandparents =
      viewLevel === "grandparents" || viewLevel === "all";

    // Get key people
    const you = getPersonById("you");
    const an = getPersonById("an");
    const anBrother = getPersonById("an-brother");

    if (!you || !an) return null;

    // Base positions (center of canvas)
    const centerX = 1000;
    const centerY = 600;

    // Calculate complexity for each side
    const calculateSideComplexity = (parentIds?: string[]) => {
      if (!parentIds || !showGrandparents) return 1;
      let complexity = 2; // Parents themselves
      parentIds.forEach((parentId) => {
        const parent = getPersonById(parentId);
        if (parent?.parents) {
          complexity += parent.parents.length;
          // Check for expanded branches
          if (expandedBranches.has(parentId)) {
            complexity += (parent.formerSpouses?.length || 0) * 2;
          }
        }
      });
      return complexity;
    };

    const ansComplexity = calculateSideComplexity(an.parents);
    const yoursComplexity = calculateSideComplexity(you.parents);

    // Calculate widths for each side
    const calculateGrandparentWidth = (parentIds?: string[]) => {
      if (!parentIds || !showGrandparents) return 0;

      let totalWidth = 0;
      let count = 0;

      parentIds.forEach((parentId) => {
        const parent = getPersonById(parentId);
        if (parent?.parents) {
          // Standard grandparent couples
          const gpCount = Math.ceil(parent.parents.length / 2);
          totalWidth +=
            gpCount * (LAYOUT.NODE_WIDTH * 2 + LAYOUT.MARRIAGE_LINE_WIDTH);
          count += gpCount;

          // Add expanded branches
          if (expandedBranches.has(parentId) && parent.formerSpouses) {
            totalWidth +=
              parent.formerSpouses.length *
              (LAYOUT.NODE_WIDTH * 2 + LAYOUT.MARRIAGE_LINE_WIDTH);
            count += parent.formerSpouses.length;
          }
        }
      });

      // Add gaps between groups
      if (count > 0) {
        totalWidth += (count - 1) * LAYOUT.HORIZONTAL_GAP;
      }

      return totalWidth;
    };

    const anGpWidth = calculateGrandparentWidth(an.parents);
    const youGpWidth = calculateGrandparentWidth(you.parents);

    // Calculate parent width (just the couple)
    const parentWidth = LAYOUT.NODE_WIDTH * 2 + LAYOUT.MARRIAGE_LINE_WIDTH;

    // Total side widths (max of parent width and grandparent width)
    const ansSideWidth = Math.max(parentWidth, anGpWidth) || LAYOUT.NODE_WIDTH;
    const yoursSideWidth =
      Math.max(parentWidth, youGpWidth) || LAYOUT.NODE_WIDTH;

    // Position An and Paul based on their side widths
    const anX =
      centerX -
      ansSideWidth / 2 -
      LAYOUT.NODE_WIDTH / 2 -
      LAYOUT.MARRIAGE_LINE_WIDTH / 2;
    const paulX =
      centerX +
      yoursSideWidth / 2 +
      LAYOUT.NODE_WIDTH / 2 +
      LAYOUT.MARRIAGE_LINE_WIDTH / 2;

    const result: {
      current: NodePosition[];
      parents: NodePosition[];
      grandparents: NodePosition[];
      lines: any[];
    } = {
      current: [],
      parents: [],
      grandparents: [],
      lines: [],
    };

    // BOTTOM: Current generation (An & Paul)
    result.current.push({
      person: an,
      x: anX,
      y: centerY,
      spouse: you,
    });

    result.current.push({
      person: you,
      x: paulX,
      y: centerY,
    });

    // An's brother (sibling line)
    if (anBrother) {
      const brotherX = anX - LAYOUT.NODE_WIDTH - LAYOUT.HORIZONTAL_GAP;
      result.current.push({
        person: anBrother,
        x: brotherX,
        y: centerY,
      });

      // Sibling line
      result.lines.push({
        type: "sibling",
        x1: brotherX + LAYOUT.NODE_WIDTH / 2,
        y1: centerY - LAYOUT.SIBLING_LINE_HEIGHT,
        x2: anX + LAYOUT.NODE_WIDTH / 2,
        y2: centerY - LAYOUT.SIBLING_LINE_HEIGHT,
        style: "solid",
      });

      // Vertical connectors to sibling line
      result.lines.push({
        type: "vertical",
        x1: brotherX + LAYOUT.NODE_WIDTH / 2,
        y1: centerY,
        x2: brotherX + LAYOUT.NODE_WIDTH / 2,
        y2: centerY - LAYOUT.SIBLING_LINE_HEIGHT,
        style: "solid",
      });

      result.lines.push({
        type: "vertical",
        x1: anX + LAYOUT.NODE_WIDTH / 2,
        y1: centerY,
        x2: anX + LAYOUT.NODE_WIDTH / 2,
        y2: centerY - LAYOUT.SIBLING_LINE_HEIGHT,
        style: "solid",
      });
    }

    // Marriage line between An and Paul
    result.lines.push({
      type: "marriage",
      x1: anX + LAYOUT.NODE_WIDTH,
      y1: centerY + LAYOUT.NODE_HEIGHT / 2,
      x2: paulX,
      y2: centerY + LAYOUT.NODE_HEIGHT / 2,
      style: "solid",
    });

    if (!showParents) return result;

    // MIDDLE: Parents
    const parentsY = centerY - LAYOUT.VERTICAL_GAP;

    // An's parents
    if (an.parents && an.parents.length >= 2) {
      const anDad = getPersonById(an.parents[0]);
      const anMom = getPersonById(an.parents[1]);

      if (anDad && anMom) {
        const anParentsCenterX = anX + LAYOUT.NODE_WIDTH / 2;
        const anDadX =
          anParentsCenterX -
          LAYOUT.NODE_WIDTH / 2 -
          LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        const anMomX = anParentsCenterX + LAYOUT.MARRIAGE_LINE_WIDTH / 2;

        result.parents.push({
          person: anDad,
          x: anDadX,
          y: parentsY,
          spouse: anMom,
        });

        result.parents.push({
          person: anMom,
          x: anMomX,
          y: parentsY,
        });

        // Marriage line between An's parents
        result.lines.push({
          type: "marriage",
          x1: anDadX + LAYOUT.NODE_WIDTH,
          y1: parentsY + LAYOUT.NODE_HEIGHT / 2,
          x2: anMomX,
          y2: parentsY + LAYOUT.NODE_HEIGHT / 2,
          style: "solid",
        });

        // Line from parents to An (from middle of marriage line)
        const marriageLineMidX =
          anDadX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        const marriageLineMidY = parentsY + LAYOUT.NODE_HEIGHT / 2;

        // Vertical down to midpoint
        result.lines.push({
          type: "parent-child-vertical",
          x1: marriageLineMidX,
          y1: marriageLineMidY,
          x2: marriageLineMidX,
          y2: marriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
          style: "solid",
        });

        // Diagonal to An
        result.lines.push({
          type: "parent-child-diagonal",
          x1: marriageLineMidX,
          y1: marriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
          x2: anX + LAYOUT.NODE_WIDTH / 2,
          y2: centerY,
          style: "solid",
        });
      }
    }

    // Paul's parents
    if (you.parents && you.parents.length >= 2) {
      const paulDad = getPersonById(you.parents[0]);
      const paulMom = getPersonById(you.parents[1]);

      if (paulDad && paulMom) {
        const paulParentsCenterX = paulX + LAYOUT.NODE_WIDTH / 2;
        const paulDadX =
          paulParentsCenterX -
          LAYOUT.NODE_WIDTH / 2 -
          LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        const paulMomX = paulParentsCenterX + LAYOUT.MARRIAGE_LINE_WIDTH / 2;

        result.parents.push({
          person: paulDad,
          x: paulDadX,
          y: parentsY,
          spouse: paulMom,
        });

        result.parents.push({
          person: paulMom,
          x: paulMomX,
          y: parentsY,
        });

        // Marriage line between Paul's parents
        result.lines.push({
          type: "marriage",
          x1: paulDadX + LAYOUT.NODE_WIDTH,
          y1: parentsY + LAYOUT.NODE_HEIGHT / 2,
          x2: paulMomX,
          y2: parentsY + LAYOUT.NODE_HEIGHT / 2,
          style: "solid",
        });

        // Line from parents to Paul
        const marriageLineMidX =
          paulDadX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        const marriageLineMidY = parentsY + LAYOUT.NODE_HEIGHT / 2;

        result.lines.push({
          type: "parent-child-vertical",
          x1: marriageLineMidX,
          y1: marriageLineMidY,
          x2: marriageLineMidX,
          y2: marriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
          style: "solid",
        });

        result.lines.push({
          type: "parent-child-diagonal",
          x1: marriageLineMidX,
          y1: marriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
          x2: paulX + LAYOUT.NODE_WIDTH / 2,
          y2: centerY,
          style: "solid",
        });
      }
    }

    if (!showGrandparents) return result;

    // TOP: Grandparents
    const grandparentsY = parentsY - LAYOUT.VERTICAL_GAP;

    // Helper function to add grandparents for a parent
    const addGrandparents = (
      parentPerson: Person,
      parentX: number,
      isLeftSide: boolean
    ) => {
      if (!parentPerson.parents || parentPerson.parents.length === 0) return;

      // Get grandparent pairs
      const gpPairs: Array<{
        gp1: Person;
        gp2?: Person;
        type: string;
        isEx?: boolean;
      }> = [];

      // Main grandparents
      const gp1 = getPersonById(parentPerson.parents[0]);
      const gp2 = parentPerson.parents[1]
        ? getPersonById(parentPerson.parents[1])
        : undefined;

      if (gp1) {
        gpPairs.push({ gp1, gp2, type: "main" });

        // Check for expanded ex-spouse branch (like Len and Margaret)
        if (expandedBranches.has(gp1.id) && gp1.formerSpouses) {
          gp1.formerSpouses.forEach((exId) => {
            const ex = getPersonById(exId);
            if (ex) {
              gpPairs.push({ gp1, gp2: ex, type: "ex", isEx: true });
            }
          });
        }
      }

      // Calculate total width needed
      const pairWidths = gpPairs.map((pair) =>
        pair.gp2
          ? LAYOUT.NODE_WIDTH * 2 + LAYOUT.MARRIAGE_LINE_WIDTH
          : LAYOUT.NODE_WIDTH
      );
      const totalWidth =
        pairWidths.reduce((sum, w) => sum + w, 0) +
        (pairWidths.length - 1) * LAYOUT.HORIZONTAL_GAP;

      // Sort: complex branches go on outside
      // For left side: complex on left, simple on right (toward center)
      // For right side: complex on right, simple on left (toward center)
      const sorted = [...gpPairs].sort((a, b) => {
        const aComplexity = (a.isEx ? 10 : 0) + (a.gp2 ? 2 : 1);
        const bComplexity = (b.isEx ? 10 : 0) + (b.gp2 ? 2 : 1);
        return isLeftSide
          ? bComplexity - aComplexity
          : aComplexity - bComplexity;
      });

      // Position grandparents
      let currentX = parentX + LAYOUT.NODE_WIDTH / 2 - totalWidth / 2;

      sorted.forEach((pair, idx) => {
        const pairWidth = pairWidths[gpPairs.indexOf(pair)];

        result.grandparents.push({
          person: pair.gp1,
          x: currentX,
          y: grandparentsY,
          spouse: pair.gp2,
        });

        if (pair.gp2) {
          result.grandparents.push({
            person: pair.gp2,
            x: currentX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH,
            y: grandparentsY,
          });

          // Marriage line (solid for current, dotted for ex)
          result.lines.push({
            type: "marriage",
            x1: currentX + LAYOUT.NODE_WIDTH,
            y1: grandparentsY + LAYOUT.NODE_HEIGHT / 2,
            x2: currentX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH,
            y2: grandparentsY + LAYOUT.NODE_HEIGHT / 2,
            style: pair.isEx ? "dashed" : "solid",
          });
        }

        // Line from grandparents to parent (from middle of couple)
        const gpMarriageLineMidX = pair.gp2
          ? currentX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH / 2
          : currentX + LAYOUT.NODE_WIDTH / 2;
        const gpMarriageLineMidY = grandparentsY + LAYOUT.NODE_HEIGHT / 2;

        // Only draw connection line for main grandparents (not ex-spouses)
        if (!pair.isEx) {
          const parentMarriageMidX =
            parentX + LAYOUT.NODE_WIDTH + LAYOUT.MARRIAGE_LINE_WIDTH / 2;
          const parentMarriageMidY = parentsY + LAYOUT.NODE_HEIGHT / 2;

          // Vertical down from grandparents
          result.lines.push({
            type: "grandparent-vertical",
            x1: gpMarriageLineMidX,
            y1: gpMarriageLineMidY,
            x2: gpMarriageLineMidX,
            y2: gpMarriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
            style: "solid",
          });

          // Diagonal to parent
          result.lines.push({
            type: "grandparent-diagonal",
            x1: gpMarriageLineMidX,
            y1: gpMarriageLineMidY + LAYOUT.VERTICAL_GAP / 2,
            x2: parentMarriageMidX,
            y2: parentMarriageMidY - 10,
            style: "solid",
          });
        }

        currentX += pairWidth + LAYOUT.HORIZONTAL_GAP;
      });
    };

    // Add grandparents for An's parents
    if (an.parents && an.parents.length >= 2) {
      const anDad = getPersonById(an.parents[0]);
      if (anDad) {
        const anParentsCenterX = anX + LAYOUT.NODE_WIDTH / 2;
        const anDadX =
          anParentsCenterX -
          LAYOUT.NODE_WIDTH / 2 -
          LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        addGrandparents(anDad, anDadX, true);
      }
    }

    // Add grandparents for Paul's parents
    if (you.parents && you.parents.length >= 2) {
      const paulDad = getPersonById(you.parents[0]);
      if (paulDad) {
        const paulParentsCenterX = paulX + LAYOUT.NODE_WIDTH / 2;
        const paulDadX =
          paulParentsCenterX -
          LAYOUT.NODE_WIDTH / 2 -
          LAYOUT.MARRIAGE_LINE_WIDTH / 2;
        addGrandparents(paulDad, paulDadX, false);
      }
    }

    return result;
  }, [people, viewLevel, expandedBranches]);

  if (!positions) return null;

  return (
    <div className="w-full h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-inner relative overflow-hidden">
      <TransformWrapper
        initialScale={0.7}
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
                style={{ width: "2500px", height: "1500px" }}
              >
                {/* SVG for all connection lines */}
                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  width="2500"
                  height="1500"
                  style={{ zIndex: 1 }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                    </marker>
                  </defs>

                  {positions.lines.map((line, idx) => {
                    if (line.type === "marriage") {
                      // Marriage lines (horizontal, pink gradient or dotted)
                      return (
                        <line
                          key={idx}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke={
                            line.style === "solid" ? "#F472B6" : "#9CA3AF"
                          }
                          strokeWidth={line.style === "solid" ? "3" : "2"}
                          strokeDasharray={
                            line.style === "dashed" ? "5,5" : "0"
                          }
                          className="transition-all duration-500"
                        />
                      );
                    } else if (line.type === "sibling") {
                      // Sibling connector line (horizontal)
                      return (
                        <line
                          key={idx}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          className="transition-all duration-500"
                        />
                      );
                    } else {
                      // All other lines (parent-child connections)
                      return (
                        <line
                          key={idx}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeDasharray={
                            line.style === "dashed" ? "5,5" : "0"
                          }
                          className="transition-all duration-500"
                        />
                      );
                    }
                  })}
                </svg>

                {/* Render all nodes */}
                <div className="absolute top-0 left-0" style={{ zIndex: 2 }}>
                  {/* Grandparents */}
                  {positions.grandparents.map((node, idx) => (
                    <div
                      key={`gp-${idx}`}
                      className="absolute transition-all duration-500"
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                      }}
                    >
                      <TreeNode
                        person={node.person}
                        onClick={() => onPersonClick(node.person)}
                        isSelected={node.person.id === selectedPersonId}
                        showExpand={
                          node.person.formerSpouses &&
                          node.person.formerSpouses.length > 0
                        }
                        onExpand={() => toggleBranch(node.person.id)}
                      />
                    </div>
                  ))}

                  {/* Parents */}
                  {positions.parents.map((node, idx) => (
                    <div
                      key={`parent-${idx}`}
                      className="absolute transition-all duration-500"
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                      }}
                    >
                      <TreeNode
                        person={node.person}
                        onClick={() => onPersonClick(node.person)}
                        isSpouse={!!node.spouse}
                        isSelected={node.person.id === selectedPersonId}
                      />
                    </div>
                  ))}

                  {/* Current Generation */}
                  {positions.current.map((node, idx) => (
                    <div
                      key={`current-${idx}`}
                      className="absolute transition-all duration-500"
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                      }}
                    >
                      <TreeNode
                        person={node.person}
                        onClick={() => onPersonClick(node.person)}
                        isSpouse={!!node.spouse}
                        isSelected={node.person.id === selectedPersonId}
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
