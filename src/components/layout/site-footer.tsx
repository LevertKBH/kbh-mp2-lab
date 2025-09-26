const APP_VERSION = "1.0.0";

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-2 md:py-0">
      <div className="container-wrapper">
        <div className="container py-2">
          <div className="flex flex-col md:flex-row items-center justify-between text-muted-foreground text-balance text-center text-sm leading-loose">
            <span>Built by KBH IT</span>
            <span className="mt-1 md:mt-0 font-mono">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
