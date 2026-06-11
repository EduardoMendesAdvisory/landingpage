"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  markMeetingCompleted,
  saveMeetingNotes,
} from "@/features/meetings/actions";

interface MeetingNotesEditorProps {
  meetingId: string;
  initialNotes: string;
  initialOutcome: string;
  initialNextAction: string;
  status: string;
}

export function MeetingNotesEditor({
  meetingId,
  initialNotes,
  initialOutcome,
  initialNextAction,
  status,
}: MeetingNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [outcome, setOutcome] = useState(initialOutcome);
  const [nextAction, setNextAction] = useState(initialNextAction);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(status === "completed");

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      const result = await saveMeetingNotes({
        meetingId,
        notes,
        outcome,
        nextAction,
      });
      if (!("error" in result)) setSaved(true);
    });
  }

  function handleMarkCompleted() {
    startTransition(async () => {
      const result = await markMeetingCompleted(meetingId);
      if (!("error" in result)) setCompleted(true);
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Call notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          rows={5}
          placeholder="What was discussed, key concerns, follow-ups..."
          className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Outcome
          </label>
          <input
            value={outcome}
            onChange={(e) => {
              setOutcome(e.target.value);
              setSaved(false);
            }}
            placeholder="e.g. Qualified, needs quote"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Next action
          </label>
          <input
            value={nextAction}
            onChange={(e) => {
              setNextAction(e.target.value);
              setSaved(false);
            }}
            placeholder="e.g. Send BuildCheck invoice"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
        {!completed && status !== "cancelled" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleMarkCompleted}
            disabled={isPending}
          >
            <CheckCircle2 size={14} className="mr-1.5" />
            Mark call completed
          </Button>
        )}
        {saved && (
          <span className="text-xs text-emerald-700 font-medium">Saved</span>
        )}
        {completed && (
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} />
            Call completed
          </span>
        )}
      </div>
    </div>
  );
}
