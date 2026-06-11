"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  PROJECT_STEPS,
  type ProjectStage,
} from "@/lib/buildiq/project-stages";
import { updateProjectStage, updateProjectNotes } from "@/features/projects/actions";

interface ProjectStageEditorProps {
  projectId: string;
  currentStage: string | null;
  notes: string | null;
}

export function ProjectStageEditor({
  projectId,
  currentStage,
  notes,
}: ProjectStageEditorProps) {
  const router = useRouter();
  const [stage, setStage] = useState<ProjectStage>(
    (PROJECT_STEPS.find((s) => s.key === currentStage)?.key ??
      "project_assessment") as ProjectStage
  );
  const [projectNotes, setProjectNotes] = useState(notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function handleStageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProjectStage;
    setStage(next);
    setError(null);

    startTransition(async () => {
      const result = await updateProjectStage({ projectId, stage: next });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  function handleSaveNotes(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateProjectNotes({ projectId, notes: projectNotes });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  const activeStep = PROJECT_STEPS.find((s) => s.key === stage);

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="text-sm font-semibold text-navy">Project journey stage</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Updates the client dashboard timeline instantly.
        </p>
      </div>

      <div>
        <label htmlFor="project-stage" className="block text-xs font-semibold text-navy mb-1.5">
          Current stage
        </label>
        <select
          id="project-stage"
          value={stage}
          onChange={handleStageChange}
          disabled={pending}
          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-white"
        >
          {PROJECT_STEPS.map((step) => (
            <option key={step.key} value={step.key}>
              {step.label}
            </option>
          ))}
        </select>
        {activeStep && (
          <p className="text-xs text-muted-foreground mt-2">{activeStep.description}</p>
        )}
      </div>

      <form onSubmit={handleSaveNotes} className="space-y-3">
        <div>
          <label htmlFor="project-notes" className="block text-xs font-semibold text-navy mb-1.5">
            Internal project notes
          </label>
          <textarea
            id="project-notes"
            value={projectNotes}
            onChange={(e) => setProjectNotes(e.target.value)}
            rows={3}
            placeholder="Notes visible only to you..."
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm resize-none"
            disabled={pending}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save notes
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );
}
