import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HamroPay",
  description: "HamroPay Next.js App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
