import Link from "next/link";
import { ArrowRight, FileText, Image, Video, Music, Zap, Shield, Clock } from "lucide-react";
import { CONVERSION_OPTIONS } from "@/utils/formats";

const categories = [
  { key: "document", label: "Documents", icon: FileText, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", href: "/convert?category=document" },
  { key: "image",    label: "Images",    icon: Image,    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", href: "/convert?category=image" },
  { key: "video",    label: "Video",     icon: Video,    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", href: "/convert?category=video" },
  { key: "audio",    label: "Audio",     icon: Music,    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", href: "/convert?category=audio" },
];

const features = [
  { icon: Zap,    title: "Lightning Fast",     desc: "Conversions complete in seconds with our optimized pipeline" },
  { icon: Shield, title: "Secure & Private",   desc: "Files are deleted after conversion. No data stored permanently" },
  { icon: Clock,  title: "Real-time Progress", desc: "Live progress tracking powered by Firebase Realtime Database" },
];

export default function HomePage() {
  const totalFormats = new Set(
    CONVERSION_OPTIONS.flatMap((o) => [o.from, ...o.to])
  ).size;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap size={14} />
            <span>{totalFormats}+ formats supported</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Convert Any File
            <br />
            <span className="text-primary">Instantly & Free</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Universal Converter supports Documents, Images, Video, Audio and more.
            No installation required — just upload and convert.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/convert"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Start Converting <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-border px-8 py-3.5 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Choose a Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card"
            >
              <div className={`p-4 rounded-xl ${cat.color} transition-transform group-hover:scale-110`}>
                <cat.icon size={28} />
              </div>
              <span className="font-semibold">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Why Universal Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-2xl p-6 border border-border">
                <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} Universal Converter — Open Source · MIT License</p>
      </footer>
    </main>
  );
}
