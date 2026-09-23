import { RootShell, VIEWPORT } from "@/components/RootShell";
import { rootMetadata } from "@/lib/seo";

export const metadata = rootMetadata("nl");
export const viewport = VIEWPORT;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="nl">{children}</RootShell>;
}
