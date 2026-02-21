import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <Sidebar type="admin" />
            <div className="flex-1 overflow-auto">
                <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
            </div>
        </div>
    );
}
