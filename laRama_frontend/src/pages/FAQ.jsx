import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How long does it take to receive my order?",
      answer: "Most ready-made items ship within 3-5 business days. Custom orders typically take 2-3 weeks for completion before shipping. You'll receive a tracking number once your order ships."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide! International shipping rates and delivery times vary by location. Please allow additional time for customs processing."
    },
    {
      question: "What is your return policy?",
      answer: "Due to the handmade nature of our products, we accept returns only for damaged or defective items. Please contact us within 7 days of receipt with photos of the issue."
    },
    {
      question: "How do I care for my beaded products?",
      answer: "Gently spot clean with a damp cloth. Avoid submerging in water, excessive heat, and harsh chemicals. Store flat or rolled to maintain shape."
    },
    {
      question: "Can I request custom colors for my order?",
      answer: "Absolutely! We offer extensive customization options. Use our custom design tool or contact us directly with your color preferences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Currently, we accept payments upon delivery (Cash on Delivery) or through OMT and Wish Money. More secure and convenient payment options will be added in future updates."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information."
    },
    {
      question: "Do you offer wholesale or bulk pricing?",
      answer: "Yes, we offer wholesale pricing for retailers and bulk orders. Please contact our business team at larama.handmade@gmail.com for more information."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-[#8C8A87]">Find answers to common questions about our products and services</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-[#F0E4D3] last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left hover:bg-[#FAF7F3] transition-colors duration-200 flex justify-between items-center"
              >
                <span className="font-serif font-semibold text-[#5C4B3D] text-lg">
                  {item.question}
                </span>
                <span className="text-[#D9A299] text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-[#5C4B3D] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#F0E4D3] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-4">Still have questions?</h2>
          <p className="text-[#5C4B3D] mb-6">We're here to help! Contact our support team for assistance.</p>
          <Link 
            to="/contact" 
            className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;