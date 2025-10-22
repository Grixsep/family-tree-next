'use client';

import { Person } from '@/lib/familyData';
import { X, User, MapPin, Calendar, Heart, Users } from 'lucide-react';

interface PersonModalProps {
  person: Person | null;
  onClose: () => void;
  allPeople: Person[];
}

export default function PersonModal({ person, onClose, allPeople }: PersonModalProps) {
  if (!person) return null;

  const getPersonById = (id: string) => allPeople.find(p => p.id === id);

  const parents = person.parents?.map(id => getPersonById(id)).filter(Boolean) || [];
  const spouses = person.spouses?.map(id => getPersonById(id)).filter(Boolean) || [];
  const children = person.children?.map(id => getPersonById(id)).filter(Boolean) || [];
  const siblings = person.siblings?.map(id => getPersonById(id)).filter(Boolean) || [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-6">
            {person.photoUrl ? (
              <img
                src={person.photoUrl}
                alt={person.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            
            <div>
              <h2 className="text-3xl font-bold mb-1">
                {person.firstName} {person.lastName}
              </h2>
              {person.maidenName && (
                <p className="text-blue-100 text-lg">
                  née {person.maidenName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            {person.birthDate && (
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Born: {person.birthDate}</span>
              </div>
            )}
            {person.birthPlace && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Birthplace: {person.birthPlace}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {person.bio && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{person.bio}</p>
            </div>
          )}

          {/* Family Relationships */}
          <div className="space-y-4">
            {parents.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Parents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parents.map(parent => parent && (
                    <span key={parent.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {parent.firstName} {parent.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {spouses.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-current" />
                  Spouse{spouses.length > 1 ? 's' : ''}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {spouses.map(spouse => spouse && (
                    <span key={spouse.id} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                      {spouse.firstName} {spouse.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {siblings.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Siblings
                </h3>
                <div className="flex flex-wrap gap-2">
                  {siblings.map(sibling => sibling && (
                    <span key={sibling.id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {sibling.firstName} {sibling.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {children.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Children
                </h3>
                <div className="flex flex-wrap gap-2">
                  {children.map(child => child && (
                    <span key={child.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {child.firstName} {child.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
