"use client"

import { Contact } from "@generated/prisma"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Icon } from "./Icon"
import { toast } from "sonner"
import { deleteContact } from "../pages/applications/functions"

interface Props {
  contact: Contact
  isEditable?: boolean
}

export const ContactCard = ({ contact, isEditable }: Props) => {
  const handleDelete = async () => {
    const result = await deleteContact(contact.id)
    if (result.success) {
      toast.success("Contact deleted")
    } else {
      toast.error("Yikes! Couldn't delete.")
    }
  }
  return (
    <div className="relative group/card flex items-center gap-4 mb-6">
      {isEditable && (
        <div className="pr-5 hidden group-hover/card:block absolute top-2 -left-[37px]">
          <button
            aria-label={`Delete contact ${contact.firstName} ${contact.lastName}`}
            onClick={handleDelete}
            type="button"
            className="hover:bg-black cursor-pointer text-white fill-current rounded-full bg-destructive p-1"
          >
            <Icon id="close" size={16} />
          </button>
        </div>
      )}
      <div>
        <Avatar className="size-10">
          <AvatarFallback>
            {contact.firstName.charAt(0)}
            {contact.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium">
          {contact.firstName} {contact.lastName}
        </h3>
        <p className="text-sm text-zinc-500">{contact.email}</p>
      </div>
      <div>
        <a href={`mailto:${contact.email}`}>
          <Icon id="mail" size={24} />
        </a>
      </div>
    </div>
  )
}
