export const metadata = {
  title: "NOC Pharma QMS v1.0",
  description: "GxP Compliant | 21 CFR Part 11 | EU Annex 11",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
