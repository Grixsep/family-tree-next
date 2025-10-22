'use client';

import { useState } from 'react';
import { familyData, Person } from '@/lib/familyData';
import ZoomableTree from '@/components/ZoomableTree';
import PersonModal from '@/components/PersonModal';
import { TreePine, Heart, Info } from 'lucide-react';

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TreePine className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">The LeDewhurst Family</h1>
                <p className="text-blue-100 text-sm">Interactive Family Tree</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
            >
              <Info className="w-5 h-5" />
              <span className="hidden sm:inline">About</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to the LeDewhurst Family Tree</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-700">How to Navigate</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>🖱️ <strong>Pan:</strong> Click and drag to move around</li>
                  <li>🔍 <strong>Zoom:</strong> Use mouse wheel or zoom buttons</li>
                  <li>👆 <strong>Details:</strong> Click any person to see their info</li>
                  <li>🔄 <strong>Reset:</strong> Use the reset button to center view</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-700">Color Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-400"></div>
                    <span className="text-sm text-gray-600">Current Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-400"></div>
                    <span className="text-sm text-gray-600">Married Couples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400"></div>
                    <span className="text-sm text-gray-600">Parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-400"></div>
                    <span className="text-sm text-gray-600">Other Generations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoomable Family Tree */}
      <div className="container mx-auto px-4 py-6">
        <ZoomableTree
          people={familyData.people}
          onPersonClick={setSelectedPerson}
          selectedPersonId={selectedPerson?.id}
        />
      </div>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <PersonModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          allPeople={familyData.people}
        />
      )}
    </main>
  );
}
