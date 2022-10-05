/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GoUnmute, GoMute } from "react-icons/go";
import cn from "classnames";
import { OnProgressProps } from "react-player/base";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const HomePage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaying(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const HandleTransition = (state: OnProgressProps) => {
    const { playedSeconds } = state;
    console.log(playedSeconds);
    if (playedSeconds > 30) {
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-[80vh] relative w-full flex">
        <ReactPlayer
          url={props.youtube_url}
          className="react-player"
          playing={playing}
          muted={muted}
          width="100%"
          height="100%"
          volume={0.1}
          onEnded={() => console.log("Video Ended")}
          onProgress={HandleTransition}
        />
        <div className="absolute w-full h-full">
          <img
            className={cn(
              "h-full w-full transition-opacity ease-in duration-500 object-cover",
              { "opacity-0": playing }
            )}
            src={props.cover_url}
            alt="cover"
          />
          <div className="main | absolute pl-20 bottom-0 h-full w-full bg-gradient-to-tr from-black  flex flex-col-reverse">
            <div className="">
              <img
                className={cn(
                  "h-20 w-fit scale-150 duration-1000 -translate-y-10 origin-bottom-left transition-transform",
                  { "scale-100 translate-y-0": playing }
                )}
                src={props.logo_url}
                alt="Title"
              />
              <div className="flex gap-4 mt-10">
                <Button type="primary" onClick={() => console.log("Click")}>
                  <FaPlay className="w-5 h-5" /> Play
                </Button>

                <Button type="secondary" onClick={() => console.log("Click")}>
                  <BsPlusLg className="w-5 h-5" /> My List
                </Button>
              </div>
              <p
                className={cn(
                  "py-8 w-1/2 text-sm text-slate-300 transition-opacity duration-500",
                  { "opacity-0": playing }
                )}
              >
                {props.description}
              </p>
            </div>
          </div>
          <div className="controls absolute bottom-4 right-4">
            <button onClick={() => setMuted((prev) => !prev)}>
              {muted ? (
                <GoMute className="w-10 h-10" color="#fff" />
              ) : (
                <GoUnmute className="w-10 h-10" color="#fff" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const HOME_TILES = [
    {
      name: "Edge runners",
      description:
        "CYBERPUNK: EDGERUNNERS tells a standalone, 10-episode story about a street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw also known as a cyberpunk.",
      youtube_url: "https://www.youtube.com/watch?v=JtqIas3bYhg",
      cover_url: "/covers/EdgeRunner_cover.jpg",
      logo_url: "/logos/Cyberpunk_Edgerunners_logo.png",
    },
    {
      name: "Yofukashi no Uta",
      description:
        "Wracked by insomnia and wanderlust, Kou Yamori is driven onto the moonlit streets every night in an aimless search for something he can’t seem to name. His nightly ritual is marked by purposeless introspection — until he meets Nazuna, who might just be a vampire! Kou’s new companion could offer him dark gifts and a vampire’s immortality. But there are conditions that must be met before Kou can sink his teeth into vampirism, and he’ll have to discover just how far he’s willing to go to satisfy his desires before he can heed the Call of the Night!",
      youtube_url: "https://www.youtube.com/watch?v=ukO-ZdWS3j8",
      cover_url: "/covers/call-of-the-night-cover.jpg",
      logo_url: "/logos/Call_of_the_night_logo.png",
    },
    {
      name: "Summer Time Render",
      description:
        "A sci-fi, summer story filled with suspense set on a small island with Shinpei Aijiro, whose childhood friend Ushio Kofune died. He returns to his hometown for the first time in two years for the funeral. Sou Hishigata, his best friend, suspects something's off with Ushio's death, and that someone can die next.A sinister omen is heard as an entire family next door suddenly disappears the following day. Furthermore, Mio implicates a \"shadow\" three days before Ushio's death.",
      youtube_url: "https://www.youtube.com/watch?v=_JgOMtS2FkE",
      cover_url: "https://images6.alphacoders.com/118/1182991.jpg",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/6/69/Summer_Time_Rendering_logo.png",
    },
  ];
  return {
    props: HOME_TILES[Math.floor(Math.random() * HOME_TILES.length)], // will be passed to the page component as props
  };
};

export default HomePage;
