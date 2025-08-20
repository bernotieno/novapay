import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Card from '../components/Card';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@novapay.africa',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+254 700 123 456',
      description: 'Mon-Fri 8AM-6PM EAT',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Nairobi, Kenya',
      description: 'iHub, Ngong Road',
    },
  ];

  const faqs = [
    {
      question: 'How long does a transfer take?',
      answer: 'Most transfers are completed within 30 seconds using our Stellar blockchain technology.',
    },
    {
      question: 'What are your fees?',
      answer: 'Our fees start at just $0.50 per transfer, significantly lower than traditional remittance services.',
    },
    {
      question: 'Which countries do you support?',
      answer: 'Currently, we support Kenya, Uganda, Tanzania, and Rwanda, with more countries coming soon.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes, we use bank-level security, blockchain technology, and are fully licensed and regulated.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Have questions about our service? Need help with a transfer? 
              Our team is here to help you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">
                  We're Here to Help
                </h2>
                <p className="text-gray-700 mb-8">
                  Whether you have questions about sending money, need technical support, 
                  or want to learn more about our services, we're always happy to chat.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary mb-1">{info.title}</h3>
                      <p className="text-lg text-primary font-medium mb-1">{info.details}</p>
                      <p className="text-gray-600 text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <h3 className="font-semibold text-secondary mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="h-fit">
              <div className="flex items-center space-x-2 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-secondary">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
                
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
                
                <FormInput
                  label="Subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="How can we help?"
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your question or issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700">
              Quick answers to common questions about NovaPay
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-secondary mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline">
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Need Urgent Help?
          </h2>
          <p className="text-red-700 mb-6">
            If you have an urgent issue with a transfer or suspect fraudulent activity, 
            please contact us immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254700123456"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Emergency Line
            </a>
            <a
              href="mailto:emergency@novapay.africa"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Mail className="mr-2 h-4 w-4" />
              Emergency Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;