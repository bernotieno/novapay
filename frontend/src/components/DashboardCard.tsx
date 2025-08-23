import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default DashboardCard;