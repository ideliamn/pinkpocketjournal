export default function FullWidthPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="bg-pink-100">{children}</div>;
}