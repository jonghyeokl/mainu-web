import { Menu } from '../lib/api';

interface Props {
  menu: Menu;
  selected: boolean;
  confirmed: boolean;
  onSelect: (menu: Menu) => void;
}

export default function MenuCard({ menu, selected, confirmed, onSelect }: Props) {
  return (
    <button
      onClick={() => !confirmed && onSelect(menu)}
      disabled={confirmed}
      className={`
        w-full text-left px-5 py-4 rounded-2xl border transition-all duration-150
        ${selected
          ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
        }
        ${confirmed && !selected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-stone-800">{menu.name}</span>
        {selected && (
          <span className="text-xs font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
            선택됨
          </span>
        )}
      </div>
    </button>
  );
}
