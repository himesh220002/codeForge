import ContactForm from "../../components/contactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-16">
      {/* Hero Section */}
      <div className="max-w-2xl text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Get In Touch 💬
        </h1>
        <p className="text-lg text-gray-600">
          We’re here for you, and we’re wearing our thinking caps. 
          Drop us a line and we’ll respond as quickly as possible.
        </p>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 transition hover:shadow-2xl">
        <ContactForm />
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-sm text-gray-500">
        Questions? Drop us a line anytime — we respect your privacy.
      </div>
    </div>
  );
}
