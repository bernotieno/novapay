import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, DollarSign, Shield, Globe, Clock, Users, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Send money across borders in seconds, not days. Powered by Stellar blockchain technology.',
    },
    {
      icon: DollarSign,
      title: 'Ultra Low Fees',
      description: 'Save up to 90% on traditional remittance fees. More money reaches your loved ones.',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Military-grade encryption and blockchain security protect every transaction.',
    },
    {
      icon: Globe,
      title: 'Financial Inclusion',
      description: 'Serving the unbanked and underbanked communities across East Africa.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up in minutes with just your phone number and basic information.',
    },
    {
      step: '2',
      title: 'Add Recipients',
      description: 'Enter your recipient\'s details and preferred payout method.',
    },
    {
      step: '3',
      title: 'Send Money',
      description: 'Choose amount, confirm details, and send instantly via Stellar network.',
    },
    {
      step: '4',
      title: 'Instant Delivery',
      description: 'Recipients receive SMS notification and can collect money immediately.',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Families Served' },
    { number: '$2M+', label: 'Money Transferred' },
    { number: '99.9%', label: 'Success Rate' },
    { number: '< 30s', label: 'Average Transfer Time' },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6">
              Send Money to East Africa
              <span className="block text-primary">Instantly & Securely</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Break free from expensive traditional remittance services. Send money to Kenya, Uganda, 
              Tanzania, and beyond with our blockchain-powered platform. Fast, affordable, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Why Choose NovaPay?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We're revolutionizing cross-border payments with cutting-edge blockchain technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Sending money has never been this simple
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-secondary w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-5 left-10 w-full h-0.5 bg-primary/30 -z-10"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Watch how $10 USD becomes 1,200 KES in under 30 seconds
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-secondary to-gray-800 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">$10 USD</div>
                  <div className="text-primary">Sender (USA)</div>
                </div>
                <div className="text-center">
                  <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-sm">Stellar Network</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">1,200 KES</div>
                  <div className="text-primary">Receiver (Kenya)</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="text-sm text-gray-300 mb-4">
                  Traditional banks: $25 fee + 3-5 days | NovaPay: $0.50 fee + 30 seconds
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-secondary">
                  Try Demo Transfer
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Real stories from real people who trust NovaPay with their money transfers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mary Wanjiku',
                location: 'Nairobi, Kenya',
                quote: 'I can now receive money from my daughter in London instantly. No more waiting days at the bank!',
                avatar: 'MW'
              },
              {
                name: 'John Mukisa',
                location: 'Kampala, Uganda',
                quote: 'The fees are so low compared to Western Union. More money reaches my family now.',
                avatar: 'JM'
              },
              {
                name: 'Amina Hassan',
                location: 'Dar es Salaam, Tanzania',
                quote: 'Simple, fast, and secure. I recommend NovaPay to all my friends working abroad.',
                avatar: 'AH'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-secondary w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-secondary">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Send Money the Smart Way?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've made the switch to faster, 
            cheaper, and more secure money transfers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-secondary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;