export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="aurora-dashboard min-h-screen">
      {children}
    </div>
  );
}
