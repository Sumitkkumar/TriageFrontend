import axios from "axios";

export const postData = async (url, data) => {
 try {
   const response = await axios.post(url, data);
   return response.data;
 } catch (error) {
    if(error.response) {
      if (error.response.status === 400) {
        const errorResponse = {
          status: error.response.status,
          message: error.response.data, 
        };
        throw errorResponse; 
      } else if (error.response.status === 404) {
        const errorResponse = {
          status: error.response.status,
          message: "Resource not found", 
        };
        throw errorResponse; 
      } else if (error.response.status === 500) {
        const errorResponse = {
          status: error.response.status,
          message: "Internal server error", 
        };
        throw errorResponse; 
      } else {
        console.error("Error fetching data:", error);
        throw error; 
      }
    }else {
      console.error("Network error:", error);
      throw error;
    }  
 }
};