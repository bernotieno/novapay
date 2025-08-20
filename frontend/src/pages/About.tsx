import React from 'react';
import { Users, Target, Zap, Globe, TrendingUp, Heart } from 'lucide-react';
import Card from '../components/Card';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'People First',
      description: 'Every decision we make is centered around improving lives and strengthening communities.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge blockchain technology to solve real-world problems.',
    },
    {
      icon: Globe,
      title: 'Inclusion',
      description: 'Financial services should be accessible to everyone, regardless of their location or background.',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'We\'re committed to the economic growth and prosperity of East African communities.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-6">
              Empowering East Africa Through
              <span className="block text-primary">Financial Innovation</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              NovaPay was born from a simple belief: sending money to your loved ones 
              shouldn't be expensive, slow, or complicated. We're on a mission to democratize 
              cross-border payments and bring financial inclusion to every corner of East Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">The Problem</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Traditional remittance services charge excessive fees (often 8-15% of the transfer amount) 
                  and take days to complete transactions. For families depending on these transfers, 
                  this means less money and longer waits when they need it most.
                </p>
                <p>
                  In East Africa, over 60% of the population remains unbanked, excluded from basic 
                  financial services. Existing solutions are often too expensive, too slow, or 
                  simply unavailable in rural areas.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">Our Solution</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By leveraging the Stellar blockchain, we've built a platform that processes 
                  transfers in seconds, not days, while charging a fraction of traditional fees. 
                  Our technology enables instant cross-border payments at costs as low as $0.50 per transaction.
                </p>
                <p>
                  Through partnerships with mobile money providers and local agents, we're bringing 
                  financial services directly to underserved communities, making it easier than ever 
                  to send and receive money across borders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Stellar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Why We Chose Stellar
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Stellar isn't just another blockchain—it's specifically designed for fast, 
              low-cost cross-border payments, making it the perfect foundation for our mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Lightning Fast',
                description: 'Transactions settle in 3-5 seconds, compared to days with traditional banking systems.',
                stat: '3-5 seconds'
              },
              {
                title: 'Ultra Low Cost',
                description: 'Transaction fees are measured in fractions of cents, not dollars.',
                stat: '$0.00001 avg'
              },
              {
                title: 'Built for Payments',
                description: 'Stellar was specifically designed for moving money, not just storing value.',
                stat: '99.99% uptime'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl font-bold text-primary mb-2">{item.stat}</div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Future */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">Our Impact</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Financial Inclusion</h3>
                    <p className="text-gray-700">
                      We've onboarded over 50,000 users, many of whom are accessing formal 
                      financial services for the first time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Cost Savings</h3>
                    <p className="text-gray-700">
                      Our users save an average of $200 annually on remittance fees, 
                      money that stays with families instead of going to intermediaries.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Community Growth</h3>
                    <p className="text-gray-700">
                      Faster, cheaper transfers mean more money flowing into local economies, 
                      supporting small businesses and community development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">The Future</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We're just getting started. Our roadmap includes API integrations with major 
                  financial institutions, expansion to additional African countries, and the 
                  introduction of additional financial services like savings and micro-loans.
                </p>
                <p>
                  By 2026, we aim to serve over 1 million users across 10 African countries, 
                  becoming the leading blockchain-powered financial platform for the continent.
                </p>
                <p>
                  Our ultimate vision is a world where anyone, anywhere, can send money to their 
                  loved ones instantly, securely, and affordably—no matter which country they're in 
                  or which bank they use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Built by Africans, for Africa
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our team combines deep local knowledge with global fintech expertise
            </p>
          </div>
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <div className="bg-primary/10 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                We're Hiring!
              </h3>
              <p className="text-gray-700 mb-6">
                Join our mission to revolutionize financial services in Africa. We're looking for 
                passionate developers, designers, and business leaders who want to make a real impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-secondary font-medium rounded-lg transition-colors duration-200"
                >
                  View Open Positions
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-secondary font-medium rounded-lg transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;