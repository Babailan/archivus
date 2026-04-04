import { authOption } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
export default async function DashboardPage() {
  console.log(JSON.stringify(await getServerSession(authOption)));
  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Total Revenue
            </CardTitle>
            <h1 className="text-3xl font-medium">₱ 10,204,203</h1>
          </CardHeader>
          <CardContent>
            <p>Revenue for the last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Enrolled Students
            </CardTitle>
            <h1 className="text-3xl font-medium">12,023</h1>
          </CardHeader>
          <CardContent>
            <p>Students this year</p>
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">dawodaowidjoi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
