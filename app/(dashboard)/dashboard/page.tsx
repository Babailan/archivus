import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function DashboardPage() {
  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Total Revenue</CardTitle>
          <h1 className="text-3xl font-medium">₱ 10,204,203</h1>
        </CardHeader>
        <CardContent>
          <p>Revenue for the last 6 months</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Enrolled Students</CardTitle>
          <h1 className="text-3xl font-medium">12,023</h1>
        </CardHeader>
        <CardContent>
          <p>Students this year</p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
