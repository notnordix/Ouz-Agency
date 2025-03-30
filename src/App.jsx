"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { subscribeToNewsletter } from "./services/api"
import { fadeInUpWithDelay, fadeInWithDelay } from "./utils/animations"
import { PlaceholdersAndVanishInput } from "./components/PlaceholdersAndVanishInput"
import { AnimatedText } from "./components/AnimatedText"
import { Instagram, Linkedin } from "lucide-react"
import logo from "./assets/logo.png"

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
    <div className="min-h-screen hero-background overflow-x-hidden">
      {/* Header */}
      <header className="header w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <img src={logo || "/placeholder.svg"} alt="OUZ Logo" className="h-12 sm:h-14 w-auto" />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative hero-content">
          {/* Message Section */}
          <section className="message-section">
            <motion.div
              className="relative mb-6"
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
                className="message-title relative z-10"
              >
                <AnimatedText text="Ouz" /> is coming soon!
              </motion.h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="message-subtitle max-w-2xl mx-auto"
            >
              Join our newsletter for exclusive updates on the <span className="text-[#9c2d40] font-semibold">Ouz</span>{" "}
              website launch.
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-[#9c2d40] "
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 6-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 6" />
              </svg>
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleEmailChange}
                onSubmit={handleSubmit}
              />
            </div>
          </motion.div>

          {/* Social Links Section */}
          <motion.div {...fadeInWithDelay(0.4)} className="social-links mt-16">
            <div className="text-center mb-4 text-white/80 text-sm">Connect with us</div>
            <div className="flex justify-center gap-6">
              <motion.a
                href="https://www.instagram.com/ouzagency/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link bg-white/10 backdrop-blur-sm p-4 rounded-full"
                aria-label="Instagram"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/ouzagency/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link bg-white/10 backdrop-blur-sm p-4 rounded-full"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </main>

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
                    className="w-5 h-5 mr-2 flex-shrink-0"
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
                    className="w-5 h-5 mr-2 flex-shrink-0"
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
                <span className="text-sm font-medium">{message}</span>
              </div>
              <button
                onClick={handleCloseSnackbar}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

