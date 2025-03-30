"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { subscribeToNewsletter } from "./services/api"
import { fadeInUp, fadeInUpWithDelay, fadeInWithDelay } from "./utils/animations"
import { PlaceholdersAndVanishInput } from "./components/PlaceholdersAndVanishInput"
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
    "Be the first to know when we launch..."
  ]

  return (
    <div className="min-h-screen hero-background">
      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <img 
              src={logo} 
              alt="OUZ Logo" 
              className="h-12 w-auto"
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container mx-auto px-4 max-w-5xl relative hero-content">
          {/* Message Section */}
          <section className="message-section">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="message-title">
              Something big is brewing!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="message-subtitle">
              Our full website is almost ready. Join our newsletter to be the first to know when we launch and get exclusive updates.
            </motion.p>
          </section>

          {/* Newsletter Form Section */}
          <motion.div
            ref={ref}
            {...fadeInUpWithDelay(0.2)}
            animate={inView ? fadeInUpWithDelay(0.2).animate : {}}
            className="newsletter-form"
          >
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
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-[#9c2d40] ">
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
          <motion.div 
            {...fadeInWithDelay(0.4)} 
            className="social-links"
          >
            <motion.a
              href="https://www.instagram.com/ouzagency/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="h-12 w-12" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/company/ouzagency/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="h-12 w-12" />
            </motion.a>
          </motion.div>

          {/* Snackbar/Toast */}
          <AnimatePresence>
            {openSnackbar && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="snackbar-wrapper"
              >
                <div className={`snackbar ${status === "success" ? "snackbar-success" : "snackbar-error"}`}>
                  <div className="flex items-center">
                    {status === "success" ? (
                      <svg
                        className="w-6 h-6 mr-3"
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
                        className="w-6 h-6 mr-3"
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
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
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
      </main>
    </div>
  )
}

export default App

