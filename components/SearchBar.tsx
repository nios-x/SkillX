"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export function SearchBar({ query, setQuery, placeholder = "Search skills or tutors..." }: any) {
  
  const [isFocused, setIsFocused] = useState(false);


  return (
    <div className="w-full">
      <div
        className={`glass rounded-lg flex items-center gap-2 px-3 py-2 transition-all ${
          isFocused ? "border-purple-500 border-1  ring-purple-500/30" : "border-purple-600/30 border-1"
        }`}
      >
        <Search className={`w-6 h-6 ${isFocused ? "text-purple-400" : "text-purple-400"}`} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1  outline-none text-white placeholder-muted-foreground text-sm"
        />

        {query && (
          <button onClick={()=> setQuery("")} className="p-1 hover:bg-red-500/20 rounded transition">
            <X className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}
