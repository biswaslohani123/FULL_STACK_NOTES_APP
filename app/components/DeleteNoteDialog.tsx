"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface Props {

    noteId: string;
    fetchNotes: () => void
}

export default function DeleteNoteDialog({noteId, fetchNotes}: Props) {

    const [loading , setLoading] = useState(false)

    const handleDelete = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`/api/notes/${noteId}`, {
                method: "DELETE",
                headers: {

                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {

                toast.error(data.message)
                return
                
            }

            toast.success(data.message)
            fetchNotes()
            
        } catch (error) {
            
            console.error(error)
            toast.error("Something went wrong")

        } finally {

            setLoading(false)
        }
    }

  return (

    <AlertDialog>
        <AlertDialogTrigger render={<Button/>}>

            <Trash2Icon className="h-4 w-4"/>
            Delete

        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete Note?
                </AlertDialogTitle>

                <AlertDialogDescription>
                    This action cannot be undone
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>

                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting...": "Delete"}
                </AlertDialogAction>
            </AlertDialogFooter>

        </AlertDialogContent>
        
    </AlertDialog>
  )
}
