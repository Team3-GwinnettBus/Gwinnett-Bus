"'use client'"

import { Card } from "@/components/ui/card"

interface YouTubePlayerProps {
  videoId: string
  title?: string
}

export function YoutubePlayer({ videoId, title = "YouTube video player" }: YouTubePlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1`

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
    </Card>
  )
}