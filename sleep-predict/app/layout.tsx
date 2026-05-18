import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SleepScan — AI Sleep Disorder Predictor",
  description: "Prediksi gangguan tidur berbasis machine learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ position: 'relative', zIndex: 1 }}>{children}</body>
    </html>
  );
}
