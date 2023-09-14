export function handleCustomError(statusCode) {
    switch (statusCode) {
      case 404:
        // Handle 404 Not Found error
        return {
          status: "404",
          message: "Resource not found.",
          imageUrl: "/images/not-found.png", // Replace with your image URL
        };
      case 500:
        // Handle 500 Internal Server Error
        return {
          status: "500",
          message: "Internal server error.",
          imageUrl: "/images/server-error.png", // Replace with your image URL
        };
      default:
        // Handle other errors
        return {
          status: "Error",
          message: "An error occurred.",
          imageUrl: "/images/error.png", // Replace with your image URL
        };
    }
   }