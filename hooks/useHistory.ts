"use client";

import { useEffect, useState } from "react";
import {
  listenToHistory,
  toggleFavourite,
  deleteHistoryEntry,
  HistoryEntry,
} from "@/firebase/rtdb";
import { useAuth } from "./useAuth";

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenToHistory(user.uid, (entries) => {
      setHistory(entries);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const toggleFav = async (entryId: string, current: boolean) => {
    if (!user) return;
    await toggleFavourite(user.uid, entryId, !current);
  };

  const deleteEntry = async (entryId: string) => {
    if (!user) return;
    await deleteHistoryEntry(user.uid, entryId);
  };

  const favourites = history.filter((e) => e.favourite);
  const recent = history.slice(0, 10);

  return { history, favourites, recent, loading, toggleFav, deleteEntry };
}
