import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-blob -left-24 top-0 h-72 w-72 bg-primary/20" />
        <div className="auth-blob -right-24 bottom-0 h-80 w-80 bg-lavender/25" />
        <div className="auth-blob left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 bg-peach/15" />
      </div>
      <Sidebar />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="relative flex-1 overflow-x-clip p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
