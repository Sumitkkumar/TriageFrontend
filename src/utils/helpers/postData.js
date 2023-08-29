import axios from "axios";
export const postData = async (url, jobName, conversationId) => {
    try {
      const response = await axios.post(url, {
        jobName: jobName,
        conversationId: conversationId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
