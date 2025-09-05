"use client"

import { toast } from "sonner"
import { Icon } from "./Icon"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { deleteApplication } from "@/app/pages/applications/functions"
import { useState } from "react"

interface Props {
  applicationId: string
}

export const DeleteApplicationButton = ({ applicationId }: Props) => {
  const handleDelete = async () => {
    const result = await deleteApplication(applicationId)
    if (result.success) {
      toast.success("Application deleted successfully.")
      window.location.href = "/applications"
    } else {
      console.error(result.error)
      toast.error("Failed to delete application.")
    }
  }
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-destructive fill-current">
          <Icon id="trash" size={16} /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="py-12 px-14">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-destructive text-3xl font-bold mb-2">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This will permanently delete the application and any related
            companies and contacts. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Nevermind
          </Button>
          <Button
            variant="destructive"
            className="fill-current"
            type="button"
            onClick={handleDelete}
          >
            <Icon id="check" /> Yes, Delete It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
