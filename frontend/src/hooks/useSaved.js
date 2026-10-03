import { useEffect, useState } from "react";
import { savedApi } from "../services/api";

// The student's saved opportunities, plus a function to save / unsave one.
export default function useSaved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedApi
      .list()
      .then((data) => setSaved(data.opportunities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isSaved = (id) => saved.some((o) => o._id === id);

  const toggleSave = async (item) => {
    try {
      if (isSaved(item._id)) {
        await savedApi.unsave(item._id);
        setSaved(saved.filter((o) => o._id !== item._id));
      } else {
        await savedApi.save(item._id);
        setSaved([item, ...saved]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return { saved, loading, isSaved, toggleSave };
}
