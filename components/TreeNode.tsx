'use client';

import { Person } from '@/lib/familyData';
import { User, Heart } from 'lucide-react';

interface TreeNodeProps {
  person: Person;
  onClick: () => void;
  isSpouse?: boolean;
  isSelected?: boolean;
}

export default function TreeNode({ person, onClick, isSpouse, isSelected }: TreeNodeProps) {
  const getNodeColor = () => {
    if (isSpouse) return 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-400';
    if (person.generation === 0) return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400';
    if (person.generation < 0) return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-400';
    return 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-400';
  };

  const displayName = person.maidenName 
    ? `${person.firstName} ${person.lastName} (née ${person.maidenName})`
    : `${person.firstName} ${person.lastName}`;

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl border-2 p-3 shadow-lg
        transition-all duration-200 hover:shadow-2xl hover:scale-110
        ${getNodeColor()}
        ${isSelected ? 'ring-4 ring-blue-500 scale-110' : ''}
        w-[140px]
      `}
    >
      {/* Photo or Avatar */}
      <div className="flex justify-center mb-2">
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-3 border-white shadow-md">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <h3 className="font-bold text-sm text-gray-800 leading-tight">
          {person.firstName}
        </h3>
        <p className="text-xs text-gray-600 font-medium">
          {person.lastName}
        </p>
        {person.maidenName && (
          <p className="text-[10px] text-gray-500 italic">
            née {person.maidenName}
          </p>
        )}
      </div>

      {/* Indicators */}
      {isSpouse && (
        <div className="flex justify-center mt-1">
          <div className="flex items-center gap-1 text-[10px] text-pink-600">
            <Heart className="w-2.5 h-2.5 fill-current" />
          </div>
        </div>
      )}
    </div>
  );
}
