"use client"
import { useState, useEffect } from "react"

export const AnimatedText = ({ text = "Ouz", className = "" }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className="relative inline-block">
      {/* First layer - outline */}
      <span className="absolute text-transparent" style={{ WebkitTextStroke: "2px #9c2d40" }}>
        {text}
      </span>

      {/* Second layer - filled with animation */}
      <span
        className="relative inline-block text-[#9c2d40] animate-wave-text"
        style={{
          WebkitTextStroke: "2px #9c2d40",
        }}
      >
        {text}
      </span>
    </span>
  )
}

