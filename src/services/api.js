import axios from "axios"

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL

export const subscribeToNewsletter = async (email) => {
  try {
    console.log("Attempting to subscribe with email:", email)
    console.log("Using API URL:", API_URL)

    const response = await axios.post(
      API_URL,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    console.log("Subscription response:", response.data)
    return response.data
  } catch (error) {
    console.error("Subscription error details:", error)

    // Extract the error message from the response if available
    if (error.response && error.response.data) {
      console.error("Response data:", error.response.data)

      // Handle specific error cases from the backend
      if (error.response.data.details && error.response.data.details.includes("Email already subscribed")) {
        throw new Error("This email is already subscribed to our newsletter")
      }

      if (error.response.data.error === "Invalid email address") {
        throw new Error("Please enter a valid email address")
      }

      if (error.response.data.error === "Server configuration error") {
        throw new Error("We're experiencing technical difficulties. Please try again later.")
      }

      if (error.response.data.error === "Database error occurred") {
        throw new Error("We're experiencing technical difficulties. Please try again later.")
      }

      // Throw the error message from the backend
      throw new Error(error.response.data.error || error.response.data.message || "Failed to subscribe to newsletter")
    }

    console.error("Status code:", error.response?.status)
    throw new Error("Failed to connect to the server. Please check your internet connection and try again.")
  }
}

