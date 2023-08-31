import axios from "axios";
export const postData = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
