// src/hooks/useFetchTags.js
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export const useFetchTags = (page, size) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTags, setTotalTags] = useState(0);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosClient.get("/questions/getAllTag");
        const tagsArray = Array.isArray(response.data.result.data)
          ? response.data.result.data.map(tags => tags.name)
          : [];

        setTotalTags(response.data.result.totalElements);
        setTags(tagsArray);
        // console.log("Tags response data:", response.data.tags.name);
        // console.log(tagsArray);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [tags]);

  return { tags, loading, error, totalTags };
};

export default useFetchTags;