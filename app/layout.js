import "./globals.css";

export const metadata = {
  title: "스마트 자리배치 시스템",
  description: "학급 맞춤형 랜덤 자리배치 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
