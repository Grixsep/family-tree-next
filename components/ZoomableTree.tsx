'use client';

import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Person } from '@/lib/familyData';
import TreeNode from './TreeNode';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomableTreeProps {
  people: Person[];
  onPersonClick: (person: Person) => void;
  selectedPersonId?: string;
}

export default function ZoomableTree({ people, onPersonClick, selectedPersonId }: ZoomableTreeProps) {
  const getPersonById = (id: string) => people.find(p => p.id === id);

  // Organize people by generation
  const generations = new Map<number, Person[]>();
  people.forEach(person => {
    if (!generations.has(person.generation)) {
      generations.set(person.generation, []);
    }
    generations.get(person.generation)?.push(person);
  });

  const sortedGenerations = Array.from(generations.entries()).sort((a, b) => a[0] - b[0]);

  // Helper to render marriage line
  const MarriageLine = ({ length = 60 }: { length?: number }) => (
    <div className="flex items-center justify-center h-full">
      <div 
        style={{ width: `${length}px` }}
        className="h-1 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 rounded-full"
      />
    </div>
  );

  // Helper to render vertical connection line
  const VerticalLine = ({ height = 40 }: { height?: number }) => (
    <div className="flex justify-center">
      <div 
        style={{ height: `${height}px` }}
        className="w-0.5 bg-gray-400"
      />
    </div>
  );

  // Helper to render horizontal branch line
  const HorizontalBranch = ({ width = 100 }: { width?: number }) => (
    <div className="flex items-center">
      <div 
        style={{ width: `${width}px` }}
        className="h-0.5 bg-gray-400"
      />
    </div>
  );

  // Render a married couple with connection
  const renderCouple = (person1: Person, person2Id?: string) => {
    const person2 = person2Id ? getPersonById(person2Id) : null;
    
    if (!person2) {
      return (
        <div className="flex items-center gap-4">
          <TreeNode
            person={person1}
            onClick={() => onPersonClick(person1)}
            isSelected={person1.id === selectedPersonId}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <TreeNode
          person={person1}
          onClick={() => onPersonClick(person1)}
          isSpouse
          isSelected={person1.id === selectedPersonId}
        />
        <MarriageLine length={40} />
        <TreeNode
          person={person2}
          onClick={() => onPersonClick(person2)}
          isSpouse
          isSelected={person2.id === selectedPersonId}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-inner relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={2}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ mode: 'reset' }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => zoomIn()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg transition-all"
                title="Reset View"
              >
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-700 font-medium mb-1">🖱️ Pan: Click & Drag</p>
              <p className="text-sm text-gray-700 font-medium mb-1">🔍 Zoom: Mouse Wheel</p>
              <p className="text-sm text-gray-700 font-medium">👆 Info: Click Person</p>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div className="p-12 flex items-center justify-center min-h-full">
                <div className="flex flex-col items-center gap-8">
                  
                  {sortedGenerations.map(([generation, genPeople], genIndex) => {
                    const isCurrentGen = generation === 0;
                    const you = genPeople.find(p => p.id === 'you');
                    const an = genPeople.find(p => p.id === 'an');
                    const anBrother = genPeople.find(p => p.id === 'an-brother');

                    // Separate parents by side
                    if (generation === -1) {
                      const yourParents = genPeople.filter(p => p.id === 'your-dad' || p.id === 'your-mom');
                      const anParents = genPeople.filter(p => p.id === 'an-dad' || p.id === 'an-mom');
                      
                      return (
                        <div key={generation} className="flex flex-col items-center gap-6">
                          {/* Parents Generation Label */}
                          <div className="text-xl font-bold text-gray-700 px-6 py-2 bg-white rounded-full shadow-md">
                            Parents Generation
                          </div>

                          {/* Parents Row */}
                          <div className="flex items-center gap-24">
                            {/* Your Parents */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-sm font-semibold text-gray-600 mb-1">Dewhurst Side</div>
                              {yourParents.length === 2 && renderCouple(yourParents[0], yourParents[1].id)}
                              {yourParents.length === 1 && (
                                <TreeNode
                                  person={yourParents[0]}
                                  onClick={() => onPersonClick(yourParents[0])}
                                  isSelected={yourParents[0].id === selectedPersonId}
                                />
                              )}
                            </div>

                            {/* An's Parents */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-sm font-semibold text-gray-600 mb-1">Le Side</div>
                              {anParents.length === 2 && renderCouple(anParents[0], anParents[1].id)}
                              {anParents.length === 1 && (
                                <TreeNode
                                  person={anParents[0]}
                                  onClick={() => onPersonClick(anParents[0])}
                                  isSelected={anParents[0].id === selectedPersonId}
                                />
                              )}
                            </div>
                          </div>

                          {/* Connection lines down */}
                          <div className="flex items-start gap-24">
                            <VerticalLine height={60} />
                            <VerticalLine height={60} />
                          </div>
                        </div>
                      );
                    }

                    // Current generation (You & An)
                    if (isCurrentGen && you && an) {
                      return (
                        <div key={generation} className="flex flex-col items-center gap-6">
                          {/* The LeDewhurst Family Label */}
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-3 bg-white rounded-full shadow-lg">
                            The LeDewhurst Family
                          </div>

                          {/* Main couple with brother */}
                          <div className="flex items-center gap-6">
                            {anBrother && (
                              <>
                                <TreeNode
                                  person={anBrother}
                                  onClick={() => onPersonClick(anBrother)}
                                  isSelected={anBrother.id === selectedPersonId}
                                />
                                <div className="w-12"></div>
                              </>
                            )}
                            
                            {renderCouple(an, you.id)}
                          </div>
                        </div>
                      );
                    }

                    // Grandparents generation
                    if (generation === -2) {
                      const yourPaternalGP = genPeople.filter(p => 
                        p.id === 'your-paternal-grandpa' || p.id === 'your-paternal-grandma'
                      );
                      const yourMaternalGP = genPeople.filter(p => 
                        p.id === 'your-maternal-grandpa' || p.id === 'your-maternal-grandma'
                      );
                      const anPaternalGP = genPeople.filter(p => 
                        p.id === 'an-paternal-grandpa' || p.id === 'an-paternal-grandma'
                      );
                      const anMaternalGP = genPeople.filter(p => 
                        p.id === 'an-maternal-grandpa' || p.id === 'an-maternal-grandma'
                      );

                      return (
                        <div key={generation} className="flex flex-col items-center gap-6">
                          {/* Grandparents Generation Label */}
                          <div className="text-xl font-bold text-gray-700 px-6 py-2 bg-white rounded-full shadow-md">
                            Grandparents Generation
                          </div>

                          {/* Grandparents Grid */}
                          <div className="flex gap-16">
                            {/* Dewhurst Side */}
                            <div className="flex flex-col items-center gap-8">
                              <div className="text-sm font-semibold text-gray-600">Dewhurst Side</div>
                              <div className="flex gap-12">
                                {/* Paternal */}
                                <div className="flex flex-col items-center gap-2">
                                  <div className="text-xs text-gray-500">Paternal</div>
                                  {yourPaternalGP.length === 2 && renderCouple(yourPaternalGP[0], yourPaternalGP[1].id)}
                                </div>
                                {/* Maternal */}
                                <div className="flex flex-col items-center gap-2">
                                  <div className="text-xs text-gray-500">Maternal</div>
                                  {yourMaternalGP.length === 2 && renderCouple(yourMaternalGP[0], yourMaternalGP[1].id)}
                                </div>
                              </div>
                            </div>

                            {/* Le Side */}
                            <div className="flex flex-col items-center gap-8">
                              <div className="text-sm font-semibold text-gray-600">Le Side</div>
                              <div className="flex gap-12">
                                {/* Paternal */}
                                <div className="flex flex-col items-center gap-2">
                                  <div className="text-xs text-gray-500">Paternal</div>
                                  {anPaternalGP.length === 2 && renderCouple(anPaternalGP[0], anPaternalGP[1].id)}
                                </div>
                                {/* Maternal */}
                                <div className="flex flex-col items-center gap-2">
                                  <div className="text-xs text-gray-500">Maternal</div>
                                  {anMaternalGP.length === 2 && renderCouple(anMaternalGP[0], anMaternalGP[1].id)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Connection lines to parents */}
                          <div className="flex gap-16">
                            <div className="flex gap-12">
                              <VerticalLine height={60} />
                              <VerticalLine height={60} />
                            </div>
                            <div className="flex gap-12">
                              <VerticalLine height={60} />
                              <VerticalLine height={60} />
                            </div>
                          </div>

                          {/* Branch lines */}
                          <div className="flex gap-16">
                            {/* Dewhurst branch */}
                            <div className="flex items-center">
                              <HorizontalBranch width={200} />
                            </div>
                            {/* Le branch */}
                            <div className="flex items-center">
                              <HorizontalBranch width={200} />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}

                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
