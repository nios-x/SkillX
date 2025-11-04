"use client";

interface FilterChip {
  id: string;
  label: string;
  selected?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onSelect?: (chipId: string) => void;
  variant?: "category" | "skill";
}

const categoryIcons: Record<string, string> = {
  "all-skills": "🎓",
  coding: "💻",
  design: "🎨",
  music: "🎵",
  business: "💼",
  photography: "📸",
  writing: "✍️",
  languages: "🌍",
};
export function FilterChips({ chips, onSelect, variant = "category" }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {chips.map((chip) => {
        const isSelected = chip.selected ?? false;
        const icon = categoryIcons[chip.id] || "•";
        return (
          <button
            key={chip.id}
            onClick={() => onSelect?.(chip.id)}
            className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all border ${
              isSelected
                ? "skillxlogo2 text-white border-transparent scale-105"
                : "border-purple-500/30 skillxlogo text-purple-400 hover:bg-purple-500/10"
            }`}
          >
            {variant === "category" && <span className="mr-1">{icon}</span>}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
