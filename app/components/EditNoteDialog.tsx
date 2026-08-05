"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface Props {

    noteId: string;
    initialTitle: string;
    initialContent: string;
    fetchNotes: () => void;
}

export default function EditNoteDialog({noteId, initialTitle, initialContent, fetchNotes}: Props) {

    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent)

    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`/api/notes/${noteId}`, {

                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({

                    title,
                    content
                })
            })

            const data = await response.json()

            if (!response.ok) {

                toast.error(data.message)
                return
                
            }

            toast.success(data.message)

            setOpen(false)

            await fetchNotes();
            
        } catch (error) {

            console.error(error);
            toast.error("Something went wrong")
            
        } finally {
            setLoading(false)
        }

    }

  return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="secondary" className="gap-2"/>}>

                <Edit2 className="h-4 w-4"/>
                Edit

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Edit Note
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="mb-5">
                    <Label >Title</Label>

                    <Input placeholder="Title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)}/>

                    </div>

                    <div>
                    <Label>Content</Label>

                    <Textarea placeholder="Content" className="mt-2" value={content} onChange={(e) => setContent(e.target.value)}/>

                    <Button onClick={handleUpdate} className='cursor-pointer w-full' disabled={loading}>
                        {loading ? "Updating" : "Update Note"}
                    </Button>

                    </div>


                </div>

            </DialogContent>

        </Dialog>

  )
}
