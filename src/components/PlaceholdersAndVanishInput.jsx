"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export const PlaceholdersAndVanishInput = ({ placeholders = ["Enter your email"], onChange, onSubmit }) => {
  const [value, setValue] = useState("")
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        setAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [placeholders.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit && onSubmit(e)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  return (
    <div className="relative">
      <form
        className={`w-full relative max-w-2xl mx-auto bg-white/10 backdrop-blur-sm h-12 sm:h-14 md:h-16 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 ${
          value ? "bg-white/20" : ""
        }`}
        onSubmit={handleSubmit}
      >
        <input
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value)
              onChange && onChange(e)
            }
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          type="email"
          name="email"
          autoComplete="email"
          className={`w-full relative text-sm sm:text-base z-50 border-none text-white bg-transparent h-full rounded-full focus:outline-none focus:ring-0 pl-10 sm:pl-12 md:pl-16 pr-14 sm:pr-16 md:pr-20 font-sans ${
            animating ? "text-transparent" : ""
          }`}
          style={{
            WebkitTextFillColor: "white",
            caretColor: "white",
          }}
        />
        <button
          disabled={!value}
          type="submit"
          className="absolute right-1.5 sm:right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full disabled:bg-[#9c2d40]/70 bg-[#9c2d40] transition duration-200 flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white sm:w-5 sm:h-5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </motion.svg>
        </button>
        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholderIndex}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear",
                }}
                className="text-white/70 text-sm sm:text-base font-normal pl-10 sm:pl-12 md:pl-16 text-left w-[calc(100%-2rem)] truncate font-sans"
              >
                {placeholders[currentPlaceholderIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 text-[#9c2d40] sm:w-5 sm:h-5"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 6-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 6" />
        </svg>
      </form>
    </div>
  )
}

