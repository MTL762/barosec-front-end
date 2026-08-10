"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
  value?: string[];
  onChange: (values: string[]) => void;
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagInput({
  value = [],
  onChange,
  name,
  placeholder = "Type and press enter...",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const safeValue = Array.isArray(value) ? value : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!safeValue.includes(inputValue.trim())) {
        onChange([...safeValue, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleRemove = (tag: string) => {
    onChange(safeValue.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-xl border border-input bg-background">
        {safeValue.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 px-2 py-0.5 text-xs">
            {tag}
            {!disabled && (
              <button type="button" onClick={() => handleRemove(tag)} className="hover:text-red-500">
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}
        <Input
          type="text"
          name={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={safeValue.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="border-0 focus-visible:ring-0 h-6 p-0 text-sm flex-1 min-w-[100px]"
        />
      </div>
    </div>
  );
}
