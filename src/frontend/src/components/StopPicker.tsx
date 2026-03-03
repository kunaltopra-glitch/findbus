import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, MapPin, Search } from "lucide-react";

interface StopPickerProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  search: string;
  setSearch: (s: string) => void;
  disabled?: boolean;
}

export function StopPicker({
  value,
  onChange,
  options,
  placeholder,
  search,
  setSearch,
  disabled,
}: StopPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`font-body h-11 flex items-center justify-between gap-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-left">
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-2">
        <div className="p-1">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search stops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-input rounded px-2 py-1 text-sm"
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>

          <div className="max-h-48 overflow-auto">
            {options.length ? (
              options.map((stop) => (
                <button
                  key={stop}
                  type="button"
                  onClick={() => {
                    onChange(stop);
                    setOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-accent"
                >
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm">{stop}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-2">No stops</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
