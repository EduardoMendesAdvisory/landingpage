"use client";

import { useState, useTransition } from "react";
import { Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activateClientAsAdmin } from "@/features/clients/actions";

interface ActivateClientButtonProps {
  userId: string;
  userEmail: string;
  isClient: boolean;
}

export function ActivateClientButton({
  userId,
  userEmail,
  isClient,
}: ActivateClientButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(isClient);

  if (activated) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
        <UserCheck size={13} />
        Client active
      </span>
    );
  }

  function handleActivate() {
    setError(null);
    startTransition(async () => {
      const result = await activateClientAsAdmin({ userId });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setActivated(true);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 text-xs"
        disabled={isPending}
        onClick={handleActivate}
      >
        {isPending ? (
          <>
            <Loader2 size={12} className="animate-spin mr-1" />
            Activating...
          </>
        ) : (
          "Activate client"
        )}
      </Button>
      {error && (
        <span className="text-[10px] text-destructive max-w-[140px] text-right">
          {error}
        </span>
      )}
      <span className="text-[10px] text-muted-foreground">{userEmail}</span>
    </div>
  );
}
