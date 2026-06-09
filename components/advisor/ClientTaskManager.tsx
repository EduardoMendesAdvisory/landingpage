"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import {
  createClientTask,
  deleteClientTask,
  updateClientTask,
} from "@/features/tasks/actions";
import { formatTaskDueDate, isTaskOverdue } from "@/lib/buildiq/get-client-tasks";

export type AdvisorTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
};

interface ClientTaskManagerProps {
  clientId: string;
  clientLabel: string;
  initialTasks: AdvisorTask[];
}

export function ClientTaskManager({
  clientId,
  clientLabel,
  initialTasks,
}: ClientTaskManagerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createClientTask({
        clientId,
        title,
        description,
        dueDate: dueDate || undefined,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      refresh();
    });
  }

  function handleDelete(taskId: string) {
    if (!window.confirm("Delete this task?")) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteClientTask(taskId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  function handleToggleComplete(task: AdvisorTask) {
    setError(null);
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    startTransition(async () => {
      const result = await updateClientTask({
        taskId: task.id,
        title: task.title,
        description: task.description ?? undefined,
        dueDate: task.due_date,
        status: nextStatus,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      refresh();
    });
  }

  const tasks = initialTasks;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Tasks for {clientLabel}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Assign action items the client will see on their dashboard.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border border-border p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        <p className="text-sm font-semibold text-navy">Add new task</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="task-title" className="block text-xs font-semibold text-navy mb-1.5">
              Title
            </label>
            <input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upload builder quote"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
              disabled={pending}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="task-desc" className="block text-xs font-semibold text-navy mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Extra details for the client..."
              rows={2}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm resize-none"
              disabled={pending}
            />
          </div>
          <div>
            <label htmlFor="task-due" className="block text-xs font-semibold text-navy mb-1.5">
              Due date (optional)
            </label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
              disabled={pending}
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          {pending ? <Loader2 size={15} className="animate-spin" /> : null}
          Add task
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-navy">
            Client tasks ({tasks.length})
          </p>
        </div>
        {tasks.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">
            No tasks yet. Add one above and it will appear on the client dashboard.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task)}
                  disabled={pending}
                  title={task.status === "completed" ? "Mark pending" : "Mark completed"}
                  className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-navy"
                  }`}
                >
                  {task.status === "completed" ? <Check size={12} /> : null}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.status === "completed"
                        ? "text-muted-foreground line-through"
                        : "text-navy"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  )}
                  {task.due_date && (
                    <p
                      className={`text-[10px] mt-1 font-medium ${
                        isTaskOverdue(task.due_date) && task.status !== "completed"
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      Due {formatTaskDueDate(task.due_date)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  disabled={pending}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Delete task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
