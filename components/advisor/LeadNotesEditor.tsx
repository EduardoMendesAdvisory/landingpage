"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateLeadNotes } from "@/features/leads/actions";

interface LeadNotesEditorProps {
  leadId: string;
  initialNotes: string;
}

export function LeadNotesEditor({ leadId, initialNotes }: LeadNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      const result = await updateLeadNotes({ leadId, notes });
      if (!("error" in result)) setSaved(true);
    });
  }

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        placeholder="Internal notes about this lead..."
        className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none"
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1.5" />
              Saving...
            </>
          ) : (
            "Save notes"
          )}
        </Button>
        {saved && (
          <span className="text-xs text-emerald-700 font-medium">Saved</span>
        )}
      </div>
    </div>
  );
}
