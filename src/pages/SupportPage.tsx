import { useState } from 'react';
import { HelpCircle, MessageSquare, Book, ChevronDown, ChevronUp, Mail, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGetRandomQuoteQuery } from '@/store/api/quotesApi';
import toast from 'react-hot-toast';

const FAQS = [
  {
    q: 'How do I reset my password?',
    a: 'Go to the login page and click "Forgot password?". Enter your email address and we\'ll send you a reset link within a few minutes.',
  },
  {
    q: 'How do I add a new user?',
    a: 'Navigate to User Management → All Users and click the "Add User" button. Fill in the required fields and assign a role.',
  },
  {
    q: 'Can I export data to Excel?',
    a: 'Yes! Go to Tools → Import/Export, select your dataset and choose XLSX as the export format.',
  },
  {
    q: 'How do I set up automated backups?',
    a: 'Navigate to Tools → Backup. The daily backup schedule is enabled by default. You can configure additional schedules from the Backup Schedule section.',
  },
  {
    q: 'What API endpoints are available?',
    a: 'All API endpoints are documented in Settings → API Keys. You can also generate new API keys and configure webhooks from that page.',
  },
  {
    q: 'How do I change the theme?',
    a: 'Click the theme toggle icon in the top navigation bar to switch between light and dark mode.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="text-sm font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/20 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export function SupportPage() {
  const { data: quote } = useGetRandomQuoteQuery();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message || !form.email) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setForm({ subject: '', message: '', email: '' });
    toast.success('Support ticket submitted! We\'ll respond within 24 hours.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Find answers or get in touch with our team</p>
      </div>

      {/* Motivational quote */}
      {quote && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-sm italic text-muted-foreground">"{quote.quote}"</p>
            <p className="text-xs font-semibold text-primary mt-2">— {quote.author}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Book,          label: 'Documentation',  desc: 'Browse our full docs',     badge: 'Online' },
          { icon: MessageSquare, label: 'Live Chat',       desc: 'Chat with support',         badge: 'Available' },
          { icon: ExternalLink,  label: 'Status Page',    desc: 'Check system status',       badge: '99.9% uptime' },
        ].map(({ icon: Icon, label, desc, badge }) => (
          <Card key={label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] shrink-0">
                {badge}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>

        {/* Contact form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Submit a Ticket</h2>
          </div>
          <Card>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your Email</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Describe your issue in detail…"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>
                    : <><Mail className="mr-2 h-4 w-4" />Submit Ticket</>
                  }
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Mail,  label: 'Email Support', value: 'support@adminportal.com', sub: 'Response within 24h' },
                { icon: Phone, label: 'Phone Support', value: '+1 (800) 123-4567', sub: 'Mon–Fri, 9AM–6PM EST' },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
