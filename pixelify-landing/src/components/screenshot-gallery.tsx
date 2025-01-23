import * as React from "react"
import { Check } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"


export function ScreenshotGallery({screenshots}) {
  return (
    <Carousel
      orientation="vertical"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-[360px]"
    >
      <CarouselContent className="h-[360px]">
        {screenshots.map(({title, alt, src, attributes}, index) => (
          <CarouselItem key={index} className="md:basis-1/2">
            <div className="p-1 h-full">
              <Card className="flex flex-col h-full justify-between">
                <CardHeader className="text-lg font-semibold flex flex-row items-center gap-1">
                  <Check className="w-5 h-5 mt-1"/>
                  {title}
                </CardHeader>
                <CardContent className="w-full relative">
          <img
            src={src}
            alt={alt}
            className="max-w-full w-auto rounded-sm"
            {...attributes}
          />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
