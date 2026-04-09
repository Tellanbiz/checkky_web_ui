"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const entries = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (entries.length === 0) {
      return;
    }

    const next = [...value];
    for (const entry of entries) {
      if (!next.includes(entry)) {
        next.push(entry);
      }
    }

    onChange(next);
    setInputValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(inputValue);
      return;
    }

    if (event.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className="flex min-h-11 flex-wrap gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-neutral-300 focus-within:ring-1 focus-within:ring-neutral-200"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-[#183a1d] px-2.5 py-1 text-xs font-medium text-white"
        >
          {tag}
          <button
            type="button"
            className="rounded-full p-0.5 text-white/70 transition hover:bg-white/15 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onChange(value.filter((item) => item !== tag));
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputValue.trim() && addTag(inputValue)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[160px] flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
