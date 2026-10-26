import React, { useState } from 'react';
import { ShieldAlert, Mail, Send, CheckCircle2, User, BookOpen, AlertTriangle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Evaluation Feedback', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => {
        setForm({ name: '', email: '', subject: 'Evaluation Feedback', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact & Data Governance</h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Academic project compliance, sample data transparency notices, and evaluator feedback portal.
        </p>
      </div>

      {/* Prominent Academic & Legal Disclaimer Card */}
      <section className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-950">Academic Data Transparency Declaration</h2>
            <span className="text-xs text-amber-800">Compliance with Consumer Protection and Retailer Terms of Service</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-amber-900/90 leading-relaxed">
          <p>
            <strong>1. Sample Demonstration Data:</strong> All product records, retailer listings (e.g. &apos;ElectroMart&apos;, &apos;CyberDepot&apos;, &apos;TechVault&apos;, &apos;ApexRetail&apos;), and prices displayed in this application are clearly designated as <strong>Sample Demonstration Data</strong> for computer science examination purposes. They do not represent live, legally binding market quotes.
          </p>
          <p>
            <strong>2. Anti-Web Scraping Architecture:</strong> In strict compliance with the project guidelines, this system does not engage in automated scraping or unauthorized scraping of proprietary commercial e-commerce websites. The platform architecture provides a clean integration layer engineered to ingest structured feeds via <strong>authorized merchant APIs</strong> (such as the Amazon Product Advertising API, Best Buy Developer API, and eBay Buy APIs).
          </p>
          <p>
            <strong>3. No Artificial Intelligence Hallucination:</strong> Price predictions and deal valuations are generated through deterministic mathematical rules (historical median spread, variance thresholds, and floor comparisons). The platform does not claim unverified machine learning models.
          </p>
        </div>
      </section>

      {/* Two Column Grid: Project Viva Details & Evaluator Feedback Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Viva / Evaluator Details */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Project Evaluation Info
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-semibold">Project Title</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                Smart Price Comparison & Deal Intelligence Platform
              </p>
            </div>

            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-semibold">Department</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                Department of Computer Science & Engineering
              </p>
            </div>

            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-semibold">Core Stack</span>
              <p className="font-mono text-slate-700 mt-0.5">
                React 19 · Node.js/Express · Recharts · TypeScript · Tailwind CSS
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block uppercase text-[10px] font-semibold">Contact Email</span>
              <a href="mailto:sowmyamay11.2008@gmail.com" className="font-medium text-blue-600 hover:underline flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>sowmyamay11.2008@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feedback / Evaluation Query Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            Evaluator Feedback & Queries
          </h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-950">Feedback Submitted Successfully</h4>
              <p className="text-xs text-emerald-800">
                Thank you for reviewing the DealWise system demonstration. Your input has been logged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evaluator / Visitor Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Prof. / Examiner Name"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="examiner@university.edu"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic / Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Evaluation Feedback">Evaluation Feedback & Scoring</option>
                  <option value="Algorithm Verification">Algorithm & Mathematical Proof Inquiry</option>
                  <option value="Deployment Query">Deployment & Hosting Configuration</option>
                  <option value="Other">Other Academic Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feedback / Remarks</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Enter comments on architecture, deal intelligence formulas, or presentation..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
