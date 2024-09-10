import { Loading } from "@/assets/loading";
import Container from "@/components/Layout/Container";
import ProjectList from "@/components/Pages/CatiarenaPage/ProjectList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useArenaList, useMe } from "@/lib/swr";

export default function CatiarenaPage() {
  const { data: me } = useMe();
  const { data: arenas, isLoading } = useArenaList(!me);

  if (isLoading) {
    return (
      <main className="flex h-full w-full items-center justify-center">
        <Loading className="h-16 w-16" />
      </main>
    );
  }

  return (
    <main className="h-full">
      <ScrollArea className="h-full">
        <Container>
          <div className="w-full py-3">
            <h2 className="text-5xl font-semibold">Catiarena</h2>
            <ProjectList arenas={arenas} />
          </div>
        </Container>
      </ScrollArea>
    </main>
  );
}
