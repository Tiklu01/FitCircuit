import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-[200px]" />

          <div className="grid gap-4 md:grid-cols-4">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-[100px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-[60px]" />
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="space-y-4">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="grid md:grid-cols-[1fr_2fr_1fr] gap-4 p-6">
                    <Skeleton className="aspect-square" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[80px] ml-auto" />
                      <Skeleton className="h-4 w-[60px] ml-auto" />
                      <Skeleton className="h-4 w-[70px] ml-auto" />
                      <Skeleton className="h-4 w-[65px] ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

