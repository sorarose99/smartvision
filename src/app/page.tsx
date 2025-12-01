import Image from 'next/image';
import {
  ArrowRight,
  Camera,
  Car,
  TrafficCone,
  BrainCircuit,
  ScreenShare,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-animation');
  const trafficDemoImage = PlaceHolderImages.find((img) => img.id === 'traffic-demo');
  const trainDemoImage = PlaceHolderImages.find((img) => img.id === 'train-demo');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    SmartVision IoT
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AI-Powered Vision Analysis API. Turn any camera feed into actionable, structured data for your platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/dashboard">
                      View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10">
                    <Link href="/docs/api">
                      Read API Docs
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                 {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={600}
                    className="rounded-xl object-contain shadow-2xl"
                    data-ai-hint={heroImage.imageHint}
                  />
                 )}
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  What We Do
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Transform Video into Actionable Intelligence
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SmartVision provides a powerful API that analyzes video feeds in real-time. Our generative AI models interpret visual data, providing you with dynamic, structured JSON outputs to optimize operations, trigger events, or gather intelligence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrafficCone className="text-primary"/>Traffic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Identify vehicle count, density, and flow to generate data for smart traffic signals, digital signage, and traffic management systems.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Car className="text-primary"/>Parking Lot Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Receive real-time counts of available and occupied parking spots to guide drivers, manage lots, and feed data into your own applications.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileCode className="text-primary"/>Real-time API Outputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Integrate seamlessly with your existing systems using our robust, real-time API that returns structured JSON for traffic, signage, and parking status.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Integration Section */}
        <section id="api" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Seamless API Integration
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is built API-first. Send a video frame or stream URL to our endpoint and receive a structured JSON response. It's that simple. Integrate our visual intelligence into any application, service, or workflow.
              </p>
            </div>
            <div className="flex justify-center">
              <pre className="mt-4 w-full max-w-2xl rounded-lg bg-muted p-4 text-left font-mono text-sm">
                <code className="text-muted-foreground">
                  <span className="text-primary">POST</span> /api/flows/analyzeParking
                  <br />
                  {`{`}
                  <br />
                  &nbsp;&nbsp;<span className="text-accent">"totalSpots"</span>: 60,
                  <br />
                  &nbsp;&nbsp;<span className="text-accent">"videoFrame"</span>: "data:image/jpeg;base64,..."
                  <br />
                  {`}`}
                </code>
              </pre>
            </div>
             <Button asChild className="mt-6" size="lg">
                <Link href="/docs/api">Read the Full API Documentation</Link>
              </Button>
          </div>
        </section>

        {/* Demo Sections */}
        <section id="demos" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Live Dashboard Demo</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how our API powers a real-time dashboard. This interface is built entirely on the same public API we provide to you. Analyze a video frame and see the results populate live monitoring screens.
              </p>
              <Button asChild>
                <Link href="/dashboard/camera">Try the Demo</Link>
              </Button>
            </div>
            {trafficDemoImage && (
                <Image
                src={trafficDemoImage.imageUrl}
                alt={trafficDemoImage.description}
                width={700}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                data-ai-hint={trafficDemoImage.imageHint}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
