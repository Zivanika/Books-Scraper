"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Github, Linkedin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='13' cy='43' r='1'/%3E%3Ccircle cx='47' cy='17' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="text-5xl font-bold text-amber-900 mb-4"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              Get in Touch
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-amber-700 leading-relaxed max-w-2xl mx-auto">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "#ffff99",
                    border: "3px solid #d4af37",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <Mail className="h-8 w-8 text-amber-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Email Us</h3>
              <a
                href="mailto:harshitabarnwal2003@gmail.com"
                className="text-amber-700 hover:text-amber-900 transition-colors"
              >
                harshitabarnwal2003@gmail.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "#ffff99",
                    border: "3px solid #d4af37",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <Clock className="h-8 w-8 text-amber-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Response Time</h3>
              <p className="text-amber-700">
                We typically respond within 24-48 hours
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "#ffff99",
                    border: "3px solid #d4af37",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <MessageSquare className="h-8 w-8 text-amber-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Support</h3>
              <p className="text-amber-700">
                Available Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
                <Send className="h-8 w-8 mr-3 text-amber-700" />
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/90 text-amber-900 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8">
                <h2 className="text-3xl font-bold text-amber-900 mb-6">Connect With Us</h2>
                <p className="text-amber-700 text-lg mb-6 leading-relaxed">
                  Follow us on social media to stay updated with the latest book additions, 
                  special offers, and literary discussions.
                </p>
                <div className="space-y-4">
                  <a
                    href="https://www.linkedin.com/in/harshita-barnwal-17a732234/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white/60 rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all duration-300"
                  >
                    <Linkedin className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <div className="font-semibold text-amber-900">LinkedIn</div>
                      <div className="text-sm text-amber-700">Connect professionally</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/Zivanika"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white/60 rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all duration-300"
                  >
                    <Github className="h-6 w-6 text-gray-800 mr-4" />
                    <div>
                      <div className="font-semibold text-amber-900">GitHub</div>
                      <div className="text-sm text-amber-700">Check out our code</div>
                    </div>
                  </a>

                  <a
                    href="mailto:harshitabarnwal2003@gmail.com"
                    className="flex items-center p-4 bg-white/60 rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all duration-300"
                  >
                    <Mail className="h-6 w-6 text-green-600 mr-4" />
                    <div>
                      <div className="font-semibold text-amber-900">Email</div>
                      <div className="text-sm text-amber-700">Direct communication</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-100/80 to-yellow-100/80 rounded-xl shadow-lg border-2 border-amber-200 p-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">How do I report an issue?</h4>
                    <p className="text-amber-700 text-sm">
                      Use the contact form above or email us directly with details about the issue.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Can I suggest a book?</h4>
                    <p className="text-amber-700 text-sm">
                      Absolutely! We love hearing from our community. Send us your suggestions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Partnership inquiries?</h4>
                    <p className="text-amber-700 text-sm">
                      For business partnerships, please email us with "Partnership" in the subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
