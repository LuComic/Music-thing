import Layout from "@/components/layouts/AccountLayout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
