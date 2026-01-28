import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface StatisticsSectionProps {
    isSidebarOpen: boolean;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ isSidebarOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('statistics-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const stats = [
    {
      number: 20,
      label: "Projects Delivered",
      description: "Successfully completed projects across various domains",
      icon: "🚀"
    },
    {
      number: 15,
      label: "Satisfied Clients",
      description: "Building long-term relationships with our clients",
      icon: "🤝"
    },
    {
      number: 1000,
      label: "Hours of Development",
      description: "Dedicated to creating exceptional digital experiences",
      icon: "💻"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      id="statistics-section"
      className="w-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="w-full">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {isVisible && (
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    suffix="+"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {stat.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection; 