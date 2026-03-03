export const metadata = {
  title: "Movie Insight Builder",
  description: "AI-powered movie sentiment and audience analysis tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}