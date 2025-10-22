'use client';

import { useParams } from 'next/navigation';
import { familyData, getPersonBySlug } from '@/lib/familyData';
import PersonDetailPage from '@/components/PersonDetailPage';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const person = getPersonBySlug(slug, familyData.people);

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Person Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find this person in the family tree.</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tree
          </button>
        </div>
      </div>
    );
  }

  return <PersonDetailPage person={person} allPeople={familyData.people} />;
}
