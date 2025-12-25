import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { Compass } from 'lucide-react';

const sectorLabels = {
  'tarbiya-idad': 'Tarbiya & Idad',
  literature: 'Literature',
  'comparative-religion': 'Comparative Religion',
  ziyara: 'Ziyara',
  'qirat-ilm': 'Qirat & Ilm'
};

export default function MentorSectorPage({ params }) {
  const sectorLabel = sectorLabels[params.sector] || params.sector;

  return (
    <MentorPageTemplate
      title={sectorLabel}
      description="Sector details"
      icon={Compass}
    >
      <div className="bg-white rounded-2xl p-6 border border-green-200">
        <p className="text-slate-600">
          This sector page is ready. Add sector-specific content and tools here.
        </p>
      </div>
    </MentorPageTemplate>
  );
}
