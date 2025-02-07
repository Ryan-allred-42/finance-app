'use client'

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from 'next/image'

interface Feature {
  step: string;
  title: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  title: string;
  autoPlayInterval?: number;
  imageHeight?: string;
}

export function FeatureSteps({
  features,
  title,
  autoPlayInterval = 4000,
  imageHeight = "h-[500px]",
}: FeatureStepsProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [features.length, autoPlayInterval]);

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr,1fr] lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`space-y-2 transition-opacity duration-200 ${
                      activeFeature === index ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => setActiveFeature(index)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {feature.step}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {feature.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 ${imageHeight} w-full`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeFeature === index ? 1 : 0,
                  zIndex: activeFeature === index ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Image 
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full rounded-xl"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 