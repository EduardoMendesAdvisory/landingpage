"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Phone, User, Loader2, X, Check } from "lucide-react";
import { updateUserProfile } from "@/features/buildiq/actions";

export type ProfileFormValues = {
  first_name: string;
  last_name: string;
  phone: string;
  suburb: string;
  state: string;
};

interface ProfileEditorProps {
  email: string;
  joinedAt: string;
  isClient: boolean;
  displayName: string;
  initials: string;
  initial: ProfileFormValues;
}

function Field({
  label,
  id,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[#111A24] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/30 focus:border-[#b67c2c] disabled:bg-gray-50"
      />
    </div>
  );
}

export function ProfileEditor({
  email,
  joinedAt,
  isClient,
  displayName,
  initials,
  initial,
}: ProfileEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setForm(initial);
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setForm(initial);
    setError(null);
    setEditing(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateUserProfile({
        firstName: form.first_name,
        lastName: form.last_name,
        phone: form.phone,
        suburb: form.suburb,
        state: form.state,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setEditing(false);
      router.refresh();
    });
  }

  const viewLocation =
    [initial.suburb, initial.state].filter(Boolean).join(", ") || "--";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account and profile information.
          </p>
        </div>
        {editing ? (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={pending}
            className="inline-flex items-center gap-2 border border-gray-200 text-muted-foreground hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={15} />
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-2 border border-[#111A24] text-[#111A24] hover:bg-[#111A24] hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="px-8 py-6 max-w-3xl space-y-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-[#b67c2c] flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>

            {editing ? (
              <div className="flex-1 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    id="first_name"
                    value={form.first_name}
                    onChange={(v) => setForm((f) => ({ ...f, first_name: v }))}
                    disabled={pending}
                    placeholder="Helio"
                  />
                  <Field
                    label="Last name"
                    id="last_name"
                    value={form.last_name}
                    onChange={(v) => setForm((f) => ({ ...f, last_name: v }))}
                    disabled={pending}
                    placeholder="Silva"
                  />
                  <Field
                    label="Phone"
                    id="phone"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    disabled={pending}
                    placeholder="04xx xxx xxx"
                  />
                  <Field
                    label="Suburb"
                    id="suburb"
                    value={form.suburb}
                    onChange={(v) => setForm((f) => ({ ...f, suburb: v }))}
                    disabled={pending}
                  />
                  <Field
                    label="State"
                    id="state"
                    value={form.state}
                    onChange={(v) => setForm((f) => ({ ...f, state: v }))}
                    disabled={pending}
                    placeholder="QLD"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                  <Mail size={14} className="shrink-0" />
                  <span>{email}</span>
                  <span className="text-xs">(email cannot be changed here)</span>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  {pending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}
                  Save changes
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-[#111A24]">{displayName}</h2>
                  {isClient && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      Active Client
                    </span>
                  )}
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} className="shrink-0" />
                    <span>{email}</span>
                  </div>
                  {initial.phone ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={14} className="shrink-0" />
                      <span>{initial.phone}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} className="shrink-0" />
                    <span>{viewLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={14} className="shrink-0" />
                    <span>
                      Joined{" "}
                      {new Date(joinedAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-bold text-[#111A24] mb-4">Account Security</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">OK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#111A24]">Account Secure</p>
                <p className="text-xs text-muted-foreground">Email verified</p>
              </div>
            </div>
            <a
              href="/reset-password"
              className="text-xs font-semibold text-[#b67c2c] hover:underline"
            >
              Change Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
