'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  title: string
  subtitle: {
    regular: string
    gradient: string
  }
  description: string
  ctaText: string
  ctaHref: string
  bottomImage: {
    light: string
    dark: string
  }
}

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  bottomImage,
}: HeroSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              {title}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
              {subtitle.regular}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {subtitle.gradient}
              </span>
            </p>
          </div>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
            {description}
          </p>
          <Link href={ctaHref}>
            <Button
              className="bg-white text-black hover:bg-gray-200"
              size="lg"
            >
              {ctaText}
            </Button>
          </Link>
        </div>
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-lg overflow-hidden">
            <picture>
              <source media="(prefers-color-scheme: dark)" srcSet={bottomImage.dark} />
              <img
                src={bottomImage.light}
                alt="Hero"
                className="aspect-[2/1] object-cover w-full"
                width={1600}
                height={800}
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  )
} 