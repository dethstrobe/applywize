import { Icon } from "./Icon"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export const ApplicationsTable = () => (
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Status</TableHead>
        <TableHead>Date Applied</TableHead>
        <TableHead>Job Title</TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Salary Range</TableHead>
        <TableHead>x</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <Badge variant="new">New</Badge>
        </TableCell>
        <TableCell>April 15, 2025</TableCell>
        <TableCell>Software Engineer</TableCell>
        <TableCell>RedwoodJS</TableCell>
        <TableCell className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          John Doe
        </TableCell>
        <TableCell>$150,000-$250,000</TableCell>
        <TableCell>
          <Icon id="view" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
)
