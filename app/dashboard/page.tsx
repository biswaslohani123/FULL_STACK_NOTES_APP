"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Delete, Edit2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddNoteDialogBox from "../components/AddNoteDialogBox";
import DeleteNoteDialog from "../components/DeleteNoteDialog";
import EditNoteDialog from "../components/EditNoteDialog";
import NotesChart from "../components/NotesChart";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function page() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setNotes(data.notes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // for charts

  const totalNotes = notes.length;

  const todayNotes = notes.filter(
    (note) =>
      new Date(note.createdAt).toDateString() === new Date().toDateString(),
  ).length;

  const longestNote =
    notes.length > 0
      ? Math.max(...notes.map((note) => note.content.length))
      : 0;

  const chartData = notes.reduce(
    (acc, note) => {
      const date = new Date(note.createdAt).toLocaleDateString();

      const existing = acc.find((item) => item.date === date);

      if (existing) {
        existing.count++;
      } else {
        acc.push({
          date,
          count: 1,
        });
      }

      return acc;
    },
    [] as { date: string; count: number }[],
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogOut = () => {
    toast.success("Logged Out");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Navbar Component */}
      <div className="border border-b bg-white p-5">
        <h1 className="text-2xl font-bold">🗒️ Notes Dashboard</h1>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-sm text-gray-500">Total Notes</h3>

            <p className="mt-2 text-3xl font-bold">{totalNotes}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm text-gray-500">Today's Notes</h3>

            <p className="mt-2 text-3xl font-bold">{todayNotes}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm text-gray-500">Longest Note</h3>

            <p className="mt-2 text-3xl font-bold">{longestNote} Characters</p>
          </Card>
        </div>

        <NotesChart data={chartData} />
        <div className="mb-6 flex items-center justify-between ">
          <h2 className="text-3xl font-bold">My Notes</h2>

          {/* Add Note Dialog */}

          <div className="gap-5 flex">
            <AddNoteDialogBox fetchNotes={fetchNotes} />

            <Button
              onClick={handleLogOut}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              LogOut
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading....</p>
        ) : notes.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">No Notes Found</h3>

            <p className="mt-2 text-gray-500">
              Create your first note by clicking the "Add Note" button.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="rounded-lg border bg-white p-5 shadow"
              >
                <h3 className="text-lg font-semibold">{note.title}</h3>

                <p className="mt-3 text-gray-600">{note.content}</p>

                <p className="mt-3 text-sm text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-3">
                  <EditNoteDialog
                    noteId={note._id}
                    initialContent={note.content}
                    initialTitle={note.title}
                    fetchNotes={fetchNotes}
                  />

                  <DeleteNoteDialog noteId={note._id} fetchNotes={fetchNotes} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
