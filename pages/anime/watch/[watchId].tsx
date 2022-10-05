import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { urls } from "service/urls";
import axios from "axios";
import dynamic from "next/dynamic";
import Spinner from "@atoms/Spinner";
import { useRouter } from "next/router";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Player: NextPage = () => {
  const router = useRouter();
  const [streamData, setStreamData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BASE_URL +
            urls.watch +
            router.query?.watchId || ""
        );
        console.log("got data", res.data);
        setStreamData(res.data);
        setError(null);
      } catch (e) {
        console.log("error");
        setError("Some error");
        setStreamData(null);
      }
    };
    getStream();
  }, [router.query]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="font-bold text-4xl">
          Sorry couldn&apos;t get the episode, please try again later!
        </h1>
      </div>
    );
  }

  if (!streamData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return streamData ? (
    <div className="h-screen w-screen">
      <ReactPlayer
        url={
          (
            streamData.sources.find((st: any) => st.quality === "default") ||
            streamData.sources[0]
          ).url
        }
        className="react-player"
        playing
        width="100%"
        height="100%"
        volume={0.8}
        onEnded={() => console.log("Video Ended")}
        controls
        // onProgress={HandleTransition}
      />
    </div>
  ) : null;
};

export default Player;
