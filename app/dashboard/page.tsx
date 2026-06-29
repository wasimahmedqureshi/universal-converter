"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useHistory } from "@/hooks/useHistory";
import { formatFileSize, FORMAT_MAP } from "@/utils/formats";
import { formatDate, downloadFile } from "@/utils/helpers";
import { Download, Star, Trash2, Clock, Heart, FileUp, LayoutDashboard } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { history, favourites, recent, loading: histLoading, toggleFav, deleteEntry } = useHistory();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || histLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground animate-pulse">Loading dashboard…</div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Total Conversions", value: history.length, icon: FileUp },
    { label: "Favourites",        value: favourites.length, icon: Heart },
    { label: "Recent (last 10)",  value: recent.length, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard size={28} className="text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Welcome back, <strong>{user.displayName ?? user.email}</strong>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <s.icon size={18} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick action */}
        <Link
          href="/convert"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold mb-10 hover:bg-primary/90 transition-colors"
        >
          <FileUp size={18} /> New Conversion
        </Link>

        {/* History Table */}
        <h2 className="text-xl font-bold mb-4">Conversion History</h2>
        {history.length === 0 ? (
          <div className="bg-muted/40 rounded-2xl p-12 text-center text-muted-foreground">
            <Clock size={40} className="mx-auto mb-3 opacity-40" />
            <p>No conversions yet. Start your first one!</p>
          </div>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">File</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Conversion</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Size</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium truncate max-w-[180px]">{entry.inputFile.split("/").pop()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {FORMAT_MAP[entry.inputFormat]?.label ?? entry.inputFormat.toUpperCase()}
                      {" → "}
                      {FORMAT_MAP[entry.outputFormat]?.label ?? entry.outputFormat.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatFileSize(entry.fileSize)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {typeof entry.completedAt === "number" ? formatDate(entry.completedAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => toggleFav(entry.id!, entry.favourite)}
                          className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", entry.favourite ? "text-yellow-500" : "text-muted-foreground")}
                          title={entry.favourite ? "Remove favourite" : "Add to favourites"}
                        >
                          <Star size={16} fill={entry.favourite ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => downloadFile(entry.outputUrl, `converted.${entry.outputFormat}`)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id!)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
