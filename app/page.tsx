"use client";

import { useState } from "react";
import { familyData, Person, getPersonSlug } from "@/lib/familyData";
import { useRouter } from "next/navigation";
import ZoomableTree from "@/components/ZoomableTree";
import PersonModal from "@/components/PersonModal";
import { TreePine, Info, ExternalLink } from "lucide-react";

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const viewFullProfile = (person: Person) => {
    router.push(`/people/${getPersonSlug(person)}`);
  };

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
              <span className="hidden sm:inline">Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-700">
                  Navigation
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>
                    🖱️ <strong>Pan:</strong> Click and drag to move around
                  </li>
                  <li>
                    🔍 <strong>Zoom:</strong> Mouse wheel or zoom buttons
                  </li>
                  <li>
                    👆 <strong>Quick Info:</strong> Click person for popup
                  </li>
                  <li>
                    📄 <strong>Full Profile:</strong> Click "View Full Profile"
                    in popup
                  </li>
                  <li>
                    👁️ <strong>View Levels:</strong> Use left panel to show/hide
                    generations
                  </li>
                  <li>
                    ➕ <strong>Expand:</strong> Click + button to show hidden
                    relatives
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-700">
                  Color Legend
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-400"></div>
                    <span className="text-gray-600">
                      Current Generation (Living)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-400"></div>
                    <span className="text-gray-600">
                      Married Couples (Living)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400"></div>
                    <span className="text-gray-600">Parents (Living)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-100 to-gray-200 border-[3px] border-gray-800"></div>
                    <span className="text-gray-600">
                      Deceased (Dark border, muted colors)
                    </span>
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
          onPersonClick={handlePersonClick}
          selectedPersonId={selectedPerson?.id}
        />
      </div>

      {/* Person Quick View Modal */}
      {selectedPerson && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PersonModal
              person={selectedPerson}
              onClose={() => setSelectedPerson(null)}
              allPeople={familyData.people}
            />

            {/* View Full Profile Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => viewFullProfile(selectedPerson)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-5 h-5" />
                View Full Profile with Photos & Stories
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
