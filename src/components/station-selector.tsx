"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type Item = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
};

type StationSelectorProps = {
  items: Item[];
  selected: Item | null;
  onSelect: (item: Item) => void;
};

export default function StationSelector({ items = [], selected, onSelect }: StationSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Station</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onSelect(it)}
            className={`p-4 text-left rounded-md border transition-all duration-150
              ${selected?.id === it.id 
                ? "ring-2 ring-primary bg-primary/10 shadow-lg" 
                : "hover:bg-muted/50 hover:shadow-md bg-background"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-muted-foreground">{it.subtitle}</div>
              </div>
              <div className="text-xs font-mono capitalize py-1 px-2 rounded-full bg-muted text-muted-foreground">{it.type}</div>
            </div>
          </button>
        ))}
         {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No stations available.</p>}
      </CardContent>
    </Card>
  );
}
