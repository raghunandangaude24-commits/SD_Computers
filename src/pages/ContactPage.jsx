import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { contactService } from "../services/contactService.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact page — submits to POST /api/contact (stored in the database).
 */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.message.trim().length < 5) {
      setError("Please write a short message.");
      return;
    }

    setSending(true);
    try {
      const data = await contactService.send({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSuccess(data.message || "Message sent! We will get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="listing-page content-page">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
      />

      <div className="page-heading">
        <h1>Contact Us</h1>
        <p>
          Questions about a product, an order or a custom build? Drop us a
          message and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="contact-layout">
        <section className="contact-info">
          <div className="contact-card">
            <Mail size={18} className="inline-icon" />
            <div>
              <strong>Email</strong>
              <span>support@sdcomputers.in</span>
            </div>
          </div>
          <div className="contact-card">
            <Phone size={18} className="inline-icon" />
            <div>
              <strong>Phone</strong>
              <span>+91 98765 43210 (10am – 7pm IST)</span>
            </div>
          </div>
          <div className="contact-card">
            <MapPin size={18} className="inline-icon" />
            <div>
              <strong>Store Location</strong>
              <span>2nd Floor, Computer Market, Bengaluru, Karnataka</span>
            </div>
          </div>
        </section>

        <form className="contact-form" onSubmit={submit}>
          <label className="field">
            <span>Your Name *</span>
            <input value={form.name} onChange={setField("name")} required placeholder="Full name" />
          </label>

          <div className="contact-grid">
            <label className="field">
              <span>Email *</span>
              <input
                type="email"
                value={form.email}
                onChange={setField("email")}
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={setField("phone")}
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="field">
            <span>Subject</span>
            <input
              value={form.subject}
              onChange={setField("subject")}
              placeholder="How can we help?"
            />
          </label>

          <label className="field">
            <span>Message *</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={setField("message")}
              required
              placeholder="Tell us more about your query..."
              maxLength={5000}
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="btn btn-primary" type="submit" disabled={sending}>
            <Send size={15} /> {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}