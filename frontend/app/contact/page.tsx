export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact SSB ENTERPRISES</h1>
      <p className="text-gray-600 mb-4">
        We'd love to hear from you! For any inquiries, support, or feedback, please use the contact details below:
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Office Address</h2>
        <p className="text-gray-700">
          SSB ENTERPRISES,<br />
          near konai cheruvu, purushottapatnam road,<br />
          gannavaram, Krishna district,<br />
          Andhra Pradesh, 521101.
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Email</h2>
        <p className="text-gray-700">
          <a href="mailto:sbenterprises170@gmail.com" className="text-blue-600 hover:underline">sbenterprises170@gmail.com</a>
        </p>
      </div>
    </div>
  );
} 