
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Trade with Confidence on OwnMali
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A secure and user-friendly platform for trading cryptocurrencies. Start your journey today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/markets">View Markets</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose OwnMali?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Trading",
                description: "Your security is our top priority with industry-leading protection measures.",
                icon: "🔒",
              },
              {
                title: "Low Fees",
                description: "Competitive trading fees that help you maximize your returns.",
                icon: "💸",
              },
              {
                title: "24/7 Support",
                description: "Our support team is always here to help you with any questions.",
                icon: "🛟",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-background p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of traders who trust OwnMali for their cryptocurrency needs.
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard">Start Trading Now</Link>
        </Button>
      </section>
    </div>
  );
}
