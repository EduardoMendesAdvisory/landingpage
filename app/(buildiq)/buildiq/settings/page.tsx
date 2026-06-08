import { Metadata } from "next";
import { Settings } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#111A24]">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Account preferences and configuration.</p>
      </div>
      <div className="px-8 py-12 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
          <Settings size={28} className="text-[#b67c2c]" />
        </div>
        <h2 className="text-lg font-bold text-[#111A24] mb-2">Coming soon</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Notification preferences and account settings will be available here.</p>
      </div>
    </div>
  );
}
