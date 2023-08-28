import { useState, useEffect } from "react";

const useFetch = (url, shouldFetch) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);

      const fetchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const jsonData = await response.json();
          setData(jsonData);
          setLoading(false);
          console.log(jsonData);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [url, shouldFetch]);

  return { data, loading, error };
};

export default useFetch;
