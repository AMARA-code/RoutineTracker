"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button, Select } from "@/components/ui";
import type { ScreenshotType } from "@/types/journal";

type PendingScreenshot = {
  id: string;
  file: File;
  type: ScreenshotType;
  preview: string;
};

const screenshotOptions = [
  { value: "entry", label: "Entry" },
  { value: "exit", label: "Exit" },
  { value: "sl", label: "SL hit" },
  { value: "tp", label: "TP hit" },
];

function FileInput({ file }: { file: File }) {
  return (
    <input
      type="file"
      name="screenshots"
      className="hidden"
      ref={(el) => {
        if (el) {
          const dt = new DataTransfer();
          dt.items.add(file);
          el.files = dt.files;
        }
      }}
      onChange={() => {}}
    />
  );
}

export function ScreenshotUpload() {
  const [screenshots, setScreenshots] = useState<PendingScreenshot[]>([]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: PendingScreenshot[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      type: "entry",
      preview: URL.createObjectURL(file),
    }));
    setScreenshots((prev) => [...prev, ...newItems]);
  };

  const remove = (id: string) => {
    setScreenshots((prev) => {
      const item = prev.find((s) => s.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((s) => s.id !== id);
    });
  };

  const updateType = (id: string, type: ScreenshotType) => {
    setScreenshots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, type } : s)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Screenshots</span>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
          <ImagePlus className="h-4 w-4" />
          Add images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {screenshots.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {screenshots.map((shot, index) => (
            <div
              key={shot.id}
              className="rounded-xl border border-border bg-muted/30 p-3"
            >
              <FileInput file={shot.file} />
              <input type="hidden" name="screenshot_types" value={shot.type} />

              <div className="mb-2 flex items-start gap-2">
                <div className="flex-1">
                  <Select
                    label="Tag"
                    value={shot.type}
                    onChange={(e) =>
                      updateType(shot.id, e.target.value as ScreenshotType)
                    }
                    options={screenshotOptions}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(shot.id)}
                  className="mt-6 shrink-0"
                  aria-label="Remove screenshot"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <img
                src={shot.preview}
                alt={`Screenshot ${index + 1}`}
                className="h-28 w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
