import { useEffect, useState } from "react";

// Runs an API call and gives back { data, loading, error, reload }.
//   const { data, loading, error } = useFetch(() => opportunityApi.list(), []);
// The second argument is the list of values that should trigger a new request.
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false; // avoids setting state if the page changed meanwhile
    setLoading(true);
    setError("");

    fetcher()
      .then((result) => !ignore && setData(result))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  return { data, loading, error, reload: () => setReloadCount((n) => n + 1) };
}
