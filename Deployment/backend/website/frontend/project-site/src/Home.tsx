import { LargeCard } from "@/components/large-card";
import { YoutubePlayer } from "./components/youtube-player";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Home() {
  return (
    <div>
      <h1 className="flex justify-center m-3 text-4xl">GCPS Bus Project</h1>
      <br />

      <LargeCard>
        <br />
        <YoutubePlayer videoId="6ksd_NNYk3Y" />
      </LargeCard>

      <LargeCard>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text on the left side */}
          <div className="text-left md:w-1/2 w-full">
            <h1 className="text-2xl mb-4">More About The Project</h1>
            <p className="max-h-48 overflow-y-scroll">
              Our project aims to transition from the current method of polling
              Samsara’s API every 5 seconds to a more efficient, real-time
              system using Apache Kafka. Instead of continuously querying and
              storing data in the database, we’re implementing a Kafka connector
              to act as the data producer. This connector will publish bus
              telemetry data directly to a Kafka topic, which will then be
              consumed by a service that only stores the data in the Microsoft
              SQL database when changes are detected. This approach reduces
              unnecessary database writes, improves performance, and enables
              real-time data processing for bus tracking.
            </p>
          </div>

          {/* Image on the right side */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <img
              src={"src/assets/bus-back.jpeg"}
              alt="bus"
              className="rounded-xl w-3/4 m-3"
            />
          </div>
        </div>
      </LargeCard>

      <LargeCard>
        <h1 className="flex m-3 text-xl justify-center"> Meet the Team </h1>
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img
                src={"src/assets/sam-profile.png"}
                alt="Sam"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Sam Bostian
                </h3>
                <p>Team Leader</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"src/assets/michael-profile.png"}
                alt="Michael"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Michael Rizig
                </h3>
                <p>Lead Developer</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"src/assets/brian-profile.png"}
                alt="Brian"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Brian Pruitt
                </h3>
                <p>Documentation</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"src/assets/charlie-profile.png"}
                alt="Charlie"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Charlie McLarty
                </h3>
                <p>Developer</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"src/assets/allen-profile.png"}
                alt="Allen"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Allen Roman
                </h3>
                <p>Developer</p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </LargeCard>
    </div>
  );
}

export default Home;
