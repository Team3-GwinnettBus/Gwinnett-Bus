import { LargeCard } from "@/components/large-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function About() {
  return (
    <div>
      <LargeCard>
        <h1 className="flex m-3 text-xl justify-center"> Meet the Team </h1>
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img
                src={"assets/sam-profile.png"}
                alt="Sam"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Sam Bostian
                </h3>
                <p>
                  <strong>Role:</strong> Team Leader, RHEL9 Install
                </p>

                <p>
                  <strong>Major:</strong> Computer Science, B.S.
                </p>

                <p>
                  <strong>Graduation:</strong> December 2024
                </p>

                <p>
                  <strong>Experience:</strong>
                </p>
                <ul>
                  <li>
                    Research Project on the benefits of Parallel Processing
                  </li>
                </ul>

                <p>
                  <a href="mailto:sbostian@students.kennesaw.edu">
                    sbostian@students.kennesaw.edu
                  </a>
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"assets/michael-profile.png"}
                alt="Michael"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Michael Rizig
                </h3>
                <p>
                  <strong>Role:</strong> Primary Developer
                </p>

                <p>
                  <strong>Technologies:</strong> Kafka, Backend, MSSQL
                </p>

                <p>
                  <strong>Major:</strong> BS&MS Computer Science
                </p>

                <p>
                  <strong>Graduation:</strong> Spring 2025
                </p>

                <p>
                  <strong>Experience:</strong>
                </p>
                <ul>
                  <li>IT Intern at DCCU</li>
                </ul>

                <p>
                  <a href="mailto:mrizig@students.kennesaw.edu">
                    mrizig@students.kennesaw.edu
                  </a>
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"assets/brian-profile.png"}
                alt="Brian"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Brian Pruitt
                </h3>
                <p>
                  <strong>Role:</strong> Documentation
                </p>

                <p>
                  <strong>Major:</strong> Computer Science, B.S.
                </p>

                <p>
                  <strong>Graduation:</strong> Fall 2024
                </p>

                <p>
                  <strong>Experience:</strong>
                </p>
                <ul>
                  <li>Interned as a Software Engineer for The Home Depot</li>
                </ul>

                <p>
                  <a href="mailto:bpruitt9@students.kennesaw.edu">
                    bpruitt9@students.kennesaw.edu
                  </a>
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"assets/charlie-profile.png"}
                alt="Charlie"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Charlie McLarty
                </h3>
                <p>
                  <strong>Role:</strong> Developer
                </p>

                <p>
                  <strong>Focus Areas:</strong> Data Generation & Simulation, QA
                  Testing, Confluent Dashboard
                </p>

                <p>
                  <strong>Major:</strong> Computer Science
                </p>

                <p>
                  <strong>Graduation:</strong> December 2024
                </p>

                <p>
                  <strong>Experience:</strong>
                </p>
                <ul>
                  <li>Research on edge computing energy efficiency</li>
                </ul>

                <p>
                  <a href="mailto:cmclart4@students.kennesaw.edu">
                    cmclart4@students.kennesaw.edu
                  </a>
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src={"assets/allen-profile.png"}
                alt="Allen"
                className="mx-auto rounded-xl"
              />
              <div className="flex flex-col mx-auto justify-center text-center m-2">
                <h3 className="text-lg font-semibold text-dark-text">
                  Allen Roman
                </h3>
                <p>
                  <strong>Role:</strong> Developer
                </p>

                <p>
                  <strong>Focus Areas:</strong> Containerization, Deployment,
                  Confluent Dashboard
                </p>

                <p>
                  <strong>Major:</strong> Computer Science, B.S.
                </p>

                <p>
                  <strong>Graduation:</strong> May 2025
                </p>

                <p>
                  <strong>Experience:</strong>
                </p>
                <ul>
                  <li>Software Developer Intern at ADP</li>
                </ul>

                <p>
                  <a href="mailto:aroman14@students.kennesaw.edu">
                    aroman14@students.kennesaw.edu
                  </a>
                </p>
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
