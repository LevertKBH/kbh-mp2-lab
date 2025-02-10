export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-wrapper flex-1">
      <div className="container py-6">
        <div className="scroll-mt-24">{children}</div>
      </div>
    </div>
  );
}
