import Spinner from "@atoms/Spinner";
import AnimeTile from "@molecules/AnimeTile";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { urls } from "service/urls";
import { Debounce } from "utils/debounce";

const SearchPage = () => {
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: implement infinite scrolling

  const searchAnime = async (query: string) => {
    if (!query) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL + urls.advancedSearch}`,
        {
          params: {
            query,
            sort: ["POPULARITY_DESC"],
          },
        }
      );
      setResults(res.data.results);
    } catch {
      setError("Error getting anime data");
    } finally {
      if (router.query.query) {
        router.replace("/search", undefined, { shallow: true });
      }
      setLoading(false);
    }
  };

  const debouncedSearch = Debounce(searchAnime, 500);

  useEffect(() => {
    searchAnime(router.query.query as string);
  }, []);

  return (
    <div className="flex flex-col px-10 md:px-20 pt-20 h-screen w-full">
      <section className="my-10 flex flex-col">
        <h1 className="font-bold text-4xl py-10">Search Anime</h1>
        <input
          defaultValue={router.query.query}
          className="bg-slate-800 w-full text-lg p-5 px-10 rounded-full font-bold text-slate-300 outline-slate-600"
          type="text"
          placeholder="Search"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </section>

      <section>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex h-screen items-center justify-center">
            <p className="text-2xl font-bold">An unexpected error occurred!</p>
          </div>
        ) : (
          <div className="flex mb-10 flex-wrap gap-2">
            {results.map((anime: any) => (
              <AnimeTile key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
