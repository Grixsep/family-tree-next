'use client';

import { Person, getPersonById, isDeceased } from '@/lib/familyData';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Heart, Users, User as UserIcon, ImageIcon } from 'lucide-react';

interface PersonDetailPageProps {
  person: Person;
  allPeople: Person[];
}

export default function PersonDetailPage({ person, allPeople }: PersonDetailPageProps) {
  const router = useRouter();
  const deceased = isDeceased(person);

  const getPersonByIdLocal = (id: string) => getPersonById(id, allPeople);

  const parents = person.parents?.map(id => getPersonByIdLocal(id)).filter(Boolean) || [];
  const spouses = person.spouses?.map(id => getPersonByIdLocal(id)).filter(Boolean) || [];
  const children = person.children?.map(id => getPersonByIdLocal(id)).filter(Boolean) || [];
  const siblings = person.siblings?.map(id => getPersonByIdLocal(id)).filter(Boolean) || [];
  const formerSpouses = person.formerSpouses?.map(id => getPersonByIdLocal(id)).filter(Boolean) || [];

  const allPhotos = [person.photoUrl, ...(person.photos || [])].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tree
          </button>
          <div className="flex items-center gap-6">
            {person.photoUrl ? (
              <img
                src={person.photoUrl}
                alt={person.firstName}
                className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ${deceased ? 'grayscale' : ''}`}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">{person.firstName} {person.lastName}</h1>
              {person.maidenName && <p className="text-xl text-blue-100">née {person.maidenName}</p>}
              {deceased && person.birthDate && person.deathDate && (
                <p className="text-lg text-blue-200 mt-2">
                  {new Date(person.birthDate).getFullYear()} - {new Date(person.deathDate).getFullYear()}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <div className="space-y-3">
                {person.birthDate && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span><strong>Born:</strong> {person.birthDate}</span>
                  </div>
                )}
                {person.deathDate && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span><strong>Died:</strong> {person.deathDate}</span>
                  </div>
                )}
                {person.birthPlace && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span><strong>Birthplace:</strong> {person.birthPlace}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            {person.bio && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Biography</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{person.bio}</p>
              </div>
            )}

            {/* Stories */}
            {person.stories && person.stories.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Life Stories</h2>
                <div className="space-y-4">
                  {person.stories.map((story, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {allPhotos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allPhotos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`${person.firstName} - Photo ${idx + 1}`}
                      className={`w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer ${deceased ? 'grayscale hover:grayscale-0' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Relationships */}
          <div className="space-y-6">
            
            {/* Family Connections */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Family</h2>
              
              <div className="space-y-4">
                {parents.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      Parents
                    </h3>
                    <div className="space-y-2">
                      {parents.map(parent => parent && (
                        <button
                          key={parent.id}
                          onClick={() => router.push(`/people/${parent.firstName.toLowerCase()}-${parent.lastName.toLowerCase()}`)}
                          className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg text-sm transition-colors"
                        >
                          {parent.firstName} {parent.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {spouses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600 fill-current" />
                      Spouse{spouses.length > 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-2">
                      {spouses.map(spouse => spouse && (
                        <button
                          key={spouse.id}
                          onClick={() => router.push(`/people/${spouse.firstName.toLowerCase()}-${spouse.lastName.toLowerCase()}`)}
                          className="w-full text-left px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg text-sm transition-colors"
                        >
                          {spouse.firstName} {spouse.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formerSpouses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      Former Spouse{formerSpouses.length > 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-2">
                      {formerSpouses.map(spouse => spouse && (
                        <button
                          key={spouse.id}
                          onClick={() => router.push(`/people/${spouse.firstName.toLowerCase()}-${spouse.lastName.toLowerCase()}`)}
                          className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm transition-colors"
                        >
                          {spouse.firstName} {spouse.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {siblings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      Siblings
                    </h3>
                    <div className="space-y-2">
                      {siblings.map(sibling => sibling && (
                        <button
                          key={sibling.id}
                          onClick={() => router.push(`/people/${sibling.firstName.toLowerCase()}-${sibling.lastName.toLowerCase()}`)}
                          className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-sm transition-colors"
                        >
                          {sibling.firstName} {sibling.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {children.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Children
                    </h3>
                    <div className="space-y-2">
                      {children.map(child => child && (
                        <button
                          key={child.id}
                          onClick={() => router.push(`/people/${child.firstName.toLowerCase()}-${child.lastName.toLowerCase()}`)}
                          className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm transition-colors"
                        >
                          {child.firstName} {child.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
