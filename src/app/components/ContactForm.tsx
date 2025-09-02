import { toast } from "sonner"
import { createContact } from "../pages/applications/functions"
import { Icon } from "./Icon"
import { Button } from "./ui/button"

interface ContactFormProps {
  closeSheet: () => void
}

export const ContactForm = ({ closeSheet }: ContactFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    const result = await createContact(formData)
    if (result.success) {
      toast.success("Contact created successfully")
      closeSheet()
    } else {
      toast.error("Error creating contact")
    }
  }

  return (
    <form action={handleSubmit} aria-labelledby="add-contact-title">
      <fieldset className="field">
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" required />
      </fieldset>
      <fieldset className="field">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" required />
      </fieldset>
      <fieldset className="field">
        <label htmlFor="role">Role</label>
        <input type="text" id="role" name="role" required />
      </fieldset>
      <fieldset className="field">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </fieldset>
      <fieldset className="field">
        <Button type="submit">
          <Icon id="check" size={24} /> Create a Contact
        </Button>
      </fieldset>
    </form>
  )
}
