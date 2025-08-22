import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, DollarSign, Shield, Globe, Users, TrendingUp, Clock, Award } from 'lucide-react';
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
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-16 sm:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Send Money to East Africa
              <span className="block text-primary drop-shadow-lg">Instantly & Securely</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-white to-primary/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10">
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
              Why Choose NovaPay?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We're revolutionizing cross-border payments with cutting-edge blockchain technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-white to-primary/5 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10 text-center h-full">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Sending money has never been this simple
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-primary to-primary/80 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-14 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full -z-10"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-primary rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Watch how $10 USD becomes 1,200 KES in under 30 seconds
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-secondary via-gray-800 to-secondary p-8 rounded-3xl shadow-2xl border border-primary/20 hover:shadow-3xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl mb-4 mx-auto w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold text-white mb-1">$10</div>
                    <div className="text-green-100 text-sm">USD</div>
                  </div>
                  <div className="text-primary font-semibold text-lg">Sender (USA)</div>
                  <div className="text-gray-400 text-sm mt-1">New York</div>
                </div>
                
                <div className="text-center relative">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-primary font-semibold mb-2">Stellar Network</div>
                  <div className="text-gray-400 text-sm">Lightning Fast</div>
                  {/* Animated connecting lines */}
                  <div className="hidden md:block absolute top-10 -left-20 w-16 h-0.5 bg-gradient-to-r from-primary/60 to-transparent animate-pulse"></div>
                  <div className="hidden md:block absolute top-10 -right-20 w-16 h-0.5 bg-gradient-to-l from-primary/60 to-transparent animate-pulse"></div>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl mb-4 mx-auto w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold text-white mb-1">1,200</div>
                    <div className="text-blue-100 text-sm">KES</div>
                  </div>
                  <div className="text-primary font-semibold text-lg">Receiver (Kenya)</div>
                  <div className="text-gray-400 text-sm mt-1">Nairobi</div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <div className="bg-gray-900/50 p-4 rounded-xl mb-6 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-red-400">
                      <span className="font-semibold">Traditional banks:</span> $25 fee + 3-5 days
                    </div>
                    <div className="text-green-400">
                      <span className="font-semibold">NovaPay:</span> $0.50 fee + 30 seconds
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Try Demo Transfer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
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
                avatar: 'MW',
                color: 'from-pink-500 to-pink-600'
              },
              {
                name: 'John Mukisa',
                location: 'Kampala, Uganda',
                quote: 'The fees are so low compared to Western Union. More money reaches my family now.',
                avatar: 'JM',
                color: 'from-blue-500 to-blue-600'
              },
              {
                name: 'Amina Hassan',
                location: 'Dar es Salaam, Tanzania',
                quote: 'Simple, fast, and secure. I recommend NovaPay to all my friends working abroad.',
                avatar: 'AH',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((testimonial, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-white to-primary/5 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10 h-full relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif">"</div>
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="text-yellow-400 text-lg">★</div>
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className={`bg-gradient-to-br ${testimonial.color} w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-secondary text-lg group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                      <div className="text-gray-600 font-medium">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </div>
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