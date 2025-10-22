'use client';

import { useState } from 'react';
import { Person } from '@/lib/familyData';
import PersonCard from './PersonCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FamilyTreeProps {
  people: Person[];
  onPersonClick: (person: Person) => void;
  selectedPersonId?: string;
}

export default function FamilyTree({ people, onPersonClick, selectedPersonId }: FamilyTreeProps) {
  const [showGrandparents, setShowGrandparents] = useState(false);
  const [showGreatGrandparents, setShowGreatGrandparents] = useState(false);

  const getPersonById = (id: string) => people.find(p => p.id === id);

  // Core couple
  const you = people.find(p => p.id === 'you');
  const an = people.find(p => p.id === 'an');

  // Parents
  const yourParents = [
    getPersonById('your-dad'),
    getPersonById('your-mom')
  ].filter(Boolean) as Person[];

  const anParents = [
    getPersonById('an-dad'),
    getPersonById('an-mom')
  ].filter(Boolean) as Person[];

  // Siblings
  const anBrother = getPersonById('an-brother');

  // Grandparents
  const yourPaternalGrandparents = [
    getPersonById('your-paternal-grandpa'),
    getPersonById('your-paternal-grandma')
  ].filter(Boolean) as Person[];

  const yourMaternalGrandparents = [
    getPersonById('your-maternal-grandpa'),
    getPersonById('your-maternal-grandma')
  ].filter(Boolean) as Person[];

  const anPaternalGrandparents = [
    getPersonById('an-paternal-grandpa'),
    getPersonById('an-paternal-grandma')
  ].filter(Boolean) as Person[];

  const anMaternalGrandparents = [
    getPersonById('an-maternal-grandpa'),
    getPersonById('an-maternal-grandma')
  ].filter(Boolean) as Person[];

  return (
    <div className="space-y-8 py-8">
      {/* Grandparents Section */}
      {showGrandparents && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Grandparents</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Your Grandparents */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center text-gray-700">Dewhurst Side</h3>
              
              {/* Paternal */}
              <div>
                <p className="text-sm text-center text-gray-500 mb-3">Paternal</p>
                <div className="flex justify-center gap-4">
                  {yourPaternalGrandparents.map(gp => (
                    <PersonCard
                      key={gp.id}
                      person={gp}
                      onClick={() => onPersonClick(gp)}
                      isSelected={gp.id === selectedPersonId}
                    />
                  ))}
                </div>
                {/* Marriage line */}
                {yourPaternalGrandparents.length === 2 && (
                  <div className="flex justify-center my-2">
                    <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Maternal */}
              <div>
                <p className="text-sm text-center text-gray-500 mb-3">Maternal</p>
                <div className="flex justify-center gap-4">
                  {yourMaternalGrandparents.map(gp => (
                    <PersonCard
                      key={gp.id}
                      person={gp}
                      onClick={() => onPersonClick(gp)}
                      isSelected={gp.id === selectedPersonId}
                    />
                  ))}
                </div>
                {/* Marriage line */}
                {yourMaternalGrandparents.length === 2 && (
                  <div className="flex justify-center my-2">
                    <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* An's Grandparents */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center text-gray-700">Le Side</h3>
              
              {/* Paternal */}
              <div>
                <p className="text-sm text-center text-gray-500 mb-3">Paternal</p>
                <div className="flex justify-center gap-4">
                  {anPaternalGrandparents.map(gp => (
                    <PersonCard
                      key={gp.id}
                      person={gp}
                      onClick={() => onPersonClick(gp)}
                      isSelected={gp.id === selectedPersonId}
                    />
                  ))}
                </div>
                {/* Marriage line */}
                {anPaternalGrandparents.length === 2 && (
                  <div className="flex justify-center my-2">
                    <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Maternal */}
              <div>
                <p className="text-sm text-center text-gray-500 mb-3">Maternal</p>
                <div className="flex justify-center gap-4">
                  {anMaternalGrandparents.map(gp => (
                    <PersonCard
                      key={gp.id}
                      person={gp}
                      onClick={() => onPersonClick(gp)}
                      isSelected={gp.id === selectedPersonId}
                    />
                  ))}
                </div>
                {/* Marriage line */}
                {anMaternalGrandparents.length === 2 && (
                  <div className="flex justify-center my-2">
                    <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Connection lines down to parents */}
          <div className="flex justify-center">
            <div className="h-12 w-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Parents Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Parents</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Your Parents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-700">Dewhurst Side</h3>
            <div className="flex justify-center gap-4">
              {yourParents.map(parent => (
                <PersonCard
                  key={parent.id}
                  person={parent}
                  onClick={() => onPersonClick(parent)}
                  isSelected={parent.id === selectedPersonId}
                />
              ))}
            </div>
            {/* Marriage line */}
            {yourParents.length === 2 && (
              <div className="flex justify-center">
                <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
              </div>
            )}
          </div>

          {/* An's Parents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-700">Le Side</h3>
            <div className="flex justify-center gap-4">
              {anParents.map(parent => (
                <PersonCard
                  key={parent.id}
                  person={parent}
                  onClick={() => onPersonClick(parent)}
                  isSelected={parent.id === selectedPersonId}
                />
              ))}
            </div>
            {/* Marriage line */}
            {anParents.length === 2 && (
              <div className="flex justify-center">
                <div className="h-1 w-32 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Connection line to couple */}
        <div className="flex justify-center">
          <div className="h-12 w-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Current Generation - You & An */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">The LeDewhurst Family</h2>
        </div>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* An's Brother */}
          {anBrother && (
            <PersonCard
              person={anBrother}
              onClick={() => onPersonClick(anBrother)}
              isSelected={anBrother.id === selectedPersonId}
            />
          )}

          {/* An */}
          {an && (
            <PersonCard
              person={an}
              onClick={() => onPersonClick(an)}
              isSpouse
              isSelected={an.id === selectedPersonId}
            />
          )}

          {/* Marriage indicator */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 rounded-full"></div>
            <span className="text-xs text-pink-600 font-semibold mt-1">Married</span>
          </div>

          {/* You */}
          {you && (
            <PersonCard
              person={you}
              onClick={() => onPersonClick(you)}
              isSpouse
              isSelected={you.id === selectedPersonId}
            />
          )}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <button
          onClick={() => setShowGrandparents(!showGrandparents)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
        >
          {showGrandparents ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Hide Grandparents
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              Show Grandparents
            </>
          )}
        </button>
      </div>
    </div>
  );
}
