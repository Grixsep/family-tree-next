'use client';

import { Person } from '@/lib/familyData';
import { User, Heart, Info } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onClick: () => void;
  isSpouse?: boolean;
  isSelected?: boolean;
}

export default function PersonCard({ person, onClick, isSpouse, isSelected }: PersonCardProps) {
  const getCardColor = () => {
    if (isSpouse) return 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-300';
    if (person.generation === 0) return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300';
    if (person.generation < 0) return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300';
    return 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-300';
  };

  const displayName = person.maidenName 
    ? `${person.firstName} ${person.lastName} (née ${person.maidenName})`
    : `${person.firstName} ${person.lastName}`;

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl border-2 p-4 shadow-lg
        transition-all duration-300 hover:shadow-2xl hover:scale-105
        ${getCardColor()}
        ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}
        min-w-[180px] max-w-[220px]
      `}
    >
      {/* Photo or Avatar */}
      <div className="flex justify-center mb-3">
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-md">
            <User className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <h3 className="font-bold text-lg text-gray-800 leading-tight">
          {person.firstName}
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          {person.lastName}
        </p>
        {person.maidenName && (
          <p className="text-xs text-gray-500 italic">
            née {person.maidenName}
          </p>
        )}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {isSpouse && (
          <div className="flex items-center gap-1 text-xs text-pink-600">
            <Heart className="w-3 h-3 fill-current" />
            <span className="font-medium">Married</span>
          </div>
        )}
        {person.bio && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Info className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Birth info */}
      {person.birthDate && (
        <div className="text-center mt-2 text-xs text-gray-500">
          Born: {person.birthDate}
        </div>
      )}
    </div>
  );
}
