"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react"
import { toast } from "sonner";


interface Props {

    fetchNotes: () => void
}

export default function AddNoteDialogBox({fetchNotes}: Props) {

    const [open, setOpen] = useState(false)

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);

    const handleAddNote = async () => {

        try {

            setLoading(true)

            const token = localStorage.getItem("token")

            const response = await fetch('/api/notes', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token} `
                },
                body: JSON.stringify({

                    title,
                    content
                })

            })

            const data = await response.json();

            if (!response.ok) {

                toast.error(data.message)
                return
                
            }

            // reset form

            setTitle("")
            setContent("")

            // close dialog
            setOpen(false)
            
            // refresh notes
            fetchNotes()
            
        } catch (error) {

            console.error(error)
            
        } finally {

            setLoading(false)
        }

    }

  return (

    <div>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button/>} >

                
                    Add Note
                

            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add New Note
                    </DialogTitle>
                </DialogHeader>

                <div className="">

                    <div className="mb-4">
                    <Label className="font-semibold">Title</Label>

                    <Input className="mt-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>

                    </div>

                    <div className="">
                    <Label className="font-semibold">Content</Label>

                    <Textarea className="mt-3" placeholder="Write your note" value={content} onChange={(e) => setContent(e.target.value)}/>

                    </div>


                <Button onClick={handleAddNote} className='cursor-pointer w-full mt-5' disabled={loading}>
                    {loading ? "Creating ....." : "Create Note"}
                </Button>

                </div>

            </DialogContent>
        </Dialog>
      
    </div>
  )
}
