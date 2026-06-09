"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { completeClientTask } from "@/features/tasks/actions";
import {
  formatTaskDueDate,
  isTaskOverdue,
  type ClientTask,
} from "@/lib/buildiq/get-client-tasks";

interface ClientTaskListProps {
  tasks: ClientTask[];
}

export function ClientTaskList({ tasks }: ClientTaskListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleComplete(taskId: string) {
    startTransition(async () => {
      await completeClientTask(taskId);
      router.refresh();
    });
  }

  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
        >
          <button
            type="button"
            onClick={() => handleComplete(task.id)}
            disabled={pending}
            title="Mark as done"
            className="mt-0.5 h-5 w-5 rounded-full border border-gray-300 hover:border-[#b67c2c] flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 size={10} className="animate-spin text-[#b67c2c]" />
            ) : null}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111A24]">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          {task.due_date && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                isTaskOverdue(task.due_date)
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {formatTaskDueDate(task.due_date)}
            </span>
          )}
          <Check size={14} className="text-transparent shrink-0 mt-0.5 w-[14px]" aria-hidden />
        </div>
      ))}
    </div>
  );
}
