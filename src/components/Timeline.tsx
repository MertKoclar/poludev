import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';

export interface TimelineItem {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  endDate?: string | null;
  location?: string;
  icon?: React.ReactNode;
  current?: boolean;
  type?: 'education' | 'experience' | 'certification' | 'other';
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, title }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.endDate || a.date).getTime();
    const dateB = new Date(b.endDate || b.date).getTime();
    return dateB - dateA; // Most recent first
  });

  return (
    <div className="py-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {title}
        </h3>
      )}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-orange-600 to-amber-500 dark:from-orange-400 dark:via-orange-500 dark:to-amber-400" />

        <div className="space-y-8">
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-1.5">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  item.current 
                    ? 'bg-orange-600 dark:bg-orange-400 border-orange-600 dark:border-orange-400' 
                    : 'bg-white dark:bg-gray-800 border-orange-500 dark:border-orange-400'
                }`} />
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  {item.current && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Current
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      {item.endDate 
                        ? ` - ${new Date(item.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}`
                        : item.current 
                        ? ' - Present' 
                        : ''
                      }
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

