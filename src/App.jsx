"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { subscribeToNewsletter } from "./services/api"
import { fadeInUpWithDelay, fadeInWithDelay } from "./utils/animations"
import { PlaceholdersAndVanishInput } from "./components/PlaceholdersAndVanishInput"
import { AnimatedText } from "./components/AnimatedText"
import { SandClock } from "./components/SandClock"
import { Instagram, Linkedin } from "lucide-react"
import logo from "./assets/logo.png"

// Add this after the other imports
import Swiper from "swiper"
import { Autoplay } from "swiper/modules"
import "swiper/css"

function App() {
  // Newsletter form state
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [isTouched, setIsTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Snackbar state
  const [status, setStatus] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState("")

  // Add viewport height fix for mobile browsers
  useEffect(() => {
    // Fix for mobile browser viewport height issues
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    setVh()
    window.addEventListener("resize", setVh)

    return () => {
      window.removeEventListener("resize", setVh)
    }
  }, [])

  // Email validation
  useEffect(() => {
    if (isTouched) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsValid(email === "" || emailRegex.test(email))
    }
  }, [email, isTouched])

  // Auto-hide the snackbar after 6 seconds
  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [openSnackbar])

  // Add this after the other useEffects
  useEffect(() => {
    // Initialize Swiper
    const swiper = new Swiper(".achievement-swiper-container", {
      modules: [Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    })

    return () => {
      if (swiper) {
        swiper.destroy()
      }
    }
  }, [])

  const handleSubscribeSuccess = (successMsg) => {
    setStatus("success")
    setMessage(successMsg || "Thank you for subscribing to our newsletter!")
    setOpenSnackbar(true)
  }

  const handleSubscribeError = (errorMsg) => {
    setStatus("error")
    setMessage(errorMsg || "Error subscribing. Please try again.")
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    console.log("Closing snackbar") // Debug log
    setOpenSnackbar(false)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (!isTouched) {
      setIsTouched(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate email before submission
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setIsValid(false)
      setIsTouched(true)
      handleSubscribeError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await subscribeToNewsletter(email)

      // Handle successful subscription
      if (response.success) {
        setEmail("")
        setIsSubmitted(true)
        handleSubscribeSuccess(response.message || "Thank you for subscribing!")

        // Reset submitted state after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 3000)
      } else {
        // Handle unexpected success response without success flag
        handleSubscribeError("Unexpected response from server. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error.message)

      // Handle specific error messages from the backend
      if (error.message.includes("already subscribed")) {
        handleSubscribeError("This email is already subscribed to our newsletter")
      } else if (error.message.includes("Invalid email")) {
        handleSubscribeError("Please enter a valid email address")
      } else if (error.message.includes("Database")) {
        handleSubscribeError("We're experiencing database issues. Please try again later")
      } else if (error.message.includes("Failed to connect")) {
        handleSubscribeError("Unable to connect to the server. Please check your internet connection")
      } else {
        handleSubscribeError(error.message || "Failed to subscribe. Please try again later")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const placeholders = [
    "Enter your email to subscribe...",
    "Join our newsletter...",
    "Stay updated with our latest news...",
    "Be the first to know when we launch...",
  ]

  return (
    <div className="hero-background overflow-x-hidden">
      {/* Header */}
      <header className="header w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <motion.div
              className="pulse-animation"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src={logo || "/placeholder.svg"} alt="OUZ Logo" className="h-9 sm:h-11 w-auto" />
            </motion.div>

            {/* Sand Clock in Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 1, delay: 0.5 },
              }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 to-primary-700/30 rounded-full blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <SandClock className="text-white w-5 h-7 sm:w-6 sm:h-8" />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 sm:pt-20 pb-0 flex-grow flex flex-col">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative hero-content flex-grow">
          {/* Message Section */}
          <section className="message-section mt-16 sm:mt-20 md:mt-24">
            <motion.div
              className="relative mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-600/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-600/20 rounded-full blur-xl"></div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="message-title relative z-10 font-display"
              >
                <AnimatedText text="Ouz" /> is coming soon!
              </motion.h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="message-subtitle max-w-2xl mx-auto mb-6 sm:mb-8"
            >
              Join our newsletter for exclusive updates on the{" "}
              <span className="text-[#9c2d40] font-semibold font-display">Ouz</span> website launch.
            </motion.p>
          </section>

          {/* Newsletter Form Section */}
          <motion.div
            ref={ref}
            {...fadeInUpWithDelay(0.2)}
            animate={inView ? fadeInUpWithDelay(0.2).animate : {}}
            className="newsletter-form relative"
          >
            <div className="absolute -z-10 w-full h-full top-0 left-0 bg-gradient-to-r from-primary-600/10 to-primary-700/10 blur-3xl rounded-full transform -translate-y-1/2"></div>
            <div className="relative">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleEmailChange}
                onSubmit={handleSubmit}
              />
            </div>
          </motion.div>

          {/* Achievement Cards Section */}
          <motion.section
            {...fadeInWithDelay(0.5)}
            className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 md:mt-20"
          >
            <h2 className="text-center text-white text-xl sm:text-2xl font-display mb-6 sm:mb-8">
              Over the past three years, we have proudly:
            </h2>

            {/* Swiper Component */}
            <div className="achievement-swiper-container">
              <div className="swiper-wrapper">
                {/* Achievement Card 1 */}
                <div className="swiper-slide">
                  <div className="achievement-card bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg h-full">
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div className="text-[#9c2d40] mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">82</h3>
                      <p className="text-white/80">Brand identities created</p>
                    </div>
                  </div>
                </div>

                {/* Achievement Card 2 */}
                <div className="swiper-slide">
                  <div className="achievement-card bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg h-full">
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div className="text-[#9c2d40] mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">67</h3>
                      <p className="text-white/80">Websites developed</p>
                    </div>
                  </div>
                </div>

                {/* Achievement Card 3 */}
                <div className="swiper-slide">
                  <div className="achievement-card bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg h-full">
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div className="text-[#9c2d40] mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2">Higher Turnover</h3>
                      <p className="text-white/80">For all our clients</p>
                    </div>
                  </div>
                </div>

                {/* Achievement Card 4 */}
                <div className="swiper-slide">
                  <div className="achievement-card bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg h-full">
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div className="text-[#9c2d40] mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">95%</h3>
                      <p className="text-white/80">Client satisfaction rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Redesigned Social Links Section */}
          <motion.div {...fadeInWithDelay(0.6)} className="my-12 sm:mt-16 md:mt-20 w-full">
            <div className="text-center mb-4 sm:mb-6 text-white/90 text-sm sm:text-base font-medium">
              Connect with us
            </div>
            <div className="flex justify-center gap-6 sm:gap-8">
              <motion.a
                href="https://www.instagram.com/ouzagency/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#9c2d40] to-[#7a1f2f] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative bg-white/15 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/20 shadow-lg transition-all duration-300 group-hover:border-white/40">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/ouzagency/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#9c2d40] to-[#7a1f2f] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative bg-white/15 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/20 shadow-lg transition-all duration-300 group-hover:border-white/40">
                  <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Section */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="w-full py-3 sm:py-5 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg relative z-10 mt-auto"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 text-xs sm:text-sm">
            © {new Date().getFullYear()} <span className="text-[#9c2d40] font-bold font-display">Ouz</span> Agency. All
            rights reserved.
          </p>
        </div>
      </motion.footer>

      {/* Snackbar/Toast - Moved outside of main content to avoid z-index issues */}
      <AnimatePresence>
        {openSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="snackbar-wrapper"
          >
            <div className={`snackbar ${status === "success" ? "snackbar-success" : "snackbar-error"}`}>
              <div className="flex items-center">
                {status === "success" ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                )}
                <span className="text-xs sm:text-sm font-medium">{message}</span>
              </div>
              <button
                onClick={handleCloseSnackbar}
                className="ml-3 sm:ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200 p-1.5 sm:p-2 rounded-full hover:bg-white/10"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

