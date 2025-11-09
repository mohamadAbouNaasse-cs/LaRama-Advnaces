import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-6">Privacy Policy</h1>
          <p className="text-sm text-[#8C8A87] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg text-[#5C4B3D]">
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you make a purchase, or contact us. This may include your name, email address, shipping address, and payment information.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">2. How We Use Your Information</h2>
              <p>We use your information to process orders, communicate with you about products and services, and improve your shopping experience. We do not sell your personal information to third parties.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">3. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-serif font-semibold mb-4">4. Contact Us</h2>
              <p>For privacy-related questions, please contact us at <span className="text-[#D9A299]">larama.handmade@gmail.com</span></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;