import { ParsedFeature } from '../lib/api';

interface Props {
  feature: ParsedFeature;
}

export default function FeatureBadge({ feature }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-sm text-stone-700">
      <span className="text-stone-400 text-xs">#{feature.feature_id}</span>
      {feature.value}
    </span>
  );
}
