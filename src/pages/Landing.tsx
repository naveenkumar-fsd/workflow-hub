import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Workflow,
  CheckCircle2,
  Clock,
  Shield,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Play,
  Building2,
  Globe,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Design complex approval workflows with our intuitive drag-and-drop builder. No coding required.',
  },
  {
    icon: Clock,
    title: 'SLA Management',
    description: 'Set time-based escalations and never miss a deadline. Automatic notifications keep everyone on track.',
  },
  {
    icon: Shield,
    title: 'Audit Trail',
    description: 'Complete visibility into every action taken. Maintain compliance with detailed activity logs.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Gain insights into approval times, bottlenecks, and team performance with real-time dashboards.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Granular permissions ensure the right people see the right requests at the right time.',
  },
  {
    icon: Zap,
    title: 'Instant Approvals',
    description: 'Mobile-ready interface lets managers approve requests on the go. One tap is all it takes.',
  },
];

const stats = [
  { value: '50%', label: 'Faster Approvals' },
  { value: '10k+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '500+', label: 'Enterprise Clients' },
];

const testimonials = [
  {
    quote: "WorkflowPro transformed how we handle internal requests. What used to take days now takes hours.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "TechCorp Inc.",
  },
  {
    quote: "The audit trail feature alone saved us during our last compliance audit. Invaluable tool.",
    author: "Michael Rodriguez",
    role: "Head of HR",
    company: "Global Finance Ltd.",
  },
  {
    quote: "Finally, a system our employees actually enjoy using. Adoption was seamless.",
    author: "Emily Watson",
    role: "IT Director",
    company: "Innovation Labs",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Workflow className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">WorkflowPro</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Star className="w-3 h-3 mr-1.5 fill-warning text-warning" />
              Trusted by 500+ enterprises worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Automate Your Enterprise
              <br />
              <span className="text-gradient">Workflows & Approvals</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Replace scattered emails and spreadsheets with a centralized platform. 
              From leave requests to expense approvals, streamline every process.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">
            TRUSTED BY LEADING ENTERPRISES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold">Company {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to
              <br />
              manage approvals at scale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for enterprise teams who need reliability, compliance, and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl border border-border p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How it Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple. Fast. Efficient.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes, not weeks. Our intuitive platform requires no training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Configure Workflows',
                description: 'Set up approval chains for different request types. Define who approves what.',
              },
              {
                step: '02',
                title: 'Submit Requests',
                description: 'Employees submit requests through the intuitive interface. Attachments included.',
              },
              {
                step: '03',
                title: 'Track & Approve',
                description: 'Managers get notified instantly. Approve, reject, or delegate with one click.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-muted/20 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by teams everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to streamline your workflows?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of companies already using WorkflowPro. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Workflow className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">WorkflowPro</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>© 2025 WorkflowPro. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
