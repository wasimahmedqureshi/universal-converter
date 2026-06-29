"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { listenToAnalytics, listenToServerStatus, AnalyticsCounter, ServerStatus } from "@/firebase/rtdb";
import { Activity, Users, Zap, Server, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsCounter | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubA = listenToAnalytics(setAnalytics);
    const unsubS = listenToServerStatus(setServerStatus);
    return () => { unsubA(); unsubS(); };
  }, [isAdmin]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-muted-foreground">Loading…</div></div>;
  if (!isAdmin) return null;

  const stats = [
    { label: "Total Conversions", value: analytics?.totalConversions ?? 0, icon: Zap, color: "text-blue-500" },
    { label: "Total Users",        value: analytics?.totalUsers ?? 0,        icon: Users, color: "text-green-500" },
    { label: "Conversions Today",  value: analytics?.conversionsToday ?? 0,  icon: Activity, color: "text-purple-500" },
    { label: "Queue Length",       value: serverStatus?.queueLength ?? 0,    icon: Server, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle size={28} className="text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <span className="ml-auto text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full font-medium">
            {serverStatus?.online ? "🟢 Server Online" : "🔴 Server Offline"}
          </span>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <s.icon size={18} className={s.color} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-3xl font-bold">{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Server Info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Server size={18} className="text-primary" /> Server Status
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Active Jobs</span>
              <span className="font-medium">{serverStatus?.activeJobs ?? 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Queue Length</span>
              <span className="font-medium">{serverStatus?.queueLength ?? 0}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Firebase Project</span>
              <span className="font-medium font-mono text-xs">universal-converter-89139</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">RTDB</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
