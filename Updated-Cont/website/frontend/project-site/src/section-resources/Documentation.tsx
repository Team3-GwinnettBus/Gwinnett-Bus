import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "getting-started", title: "Getting Started" },
    { id: "features", title: "Features" },
    { id: "faq", title: "FAQ" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Documentation</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Button
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full text-left"
                >
                  {section.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">
          {sections.find((s) => s.id === activeSection)?.title}
        </h1>
        <div className="prose">
          {activeSection === "introduction" && (
            <p>
              Welcome to the documentation. This section provides an overview of
              the project.
            </p>
          )}
          {activeSection === "getting-started" && (
            <p>
              Here you will find instructions on how to get started with the
              project.
            </p>
          )}
          {activeSection === "features" && (
            <p>This section outlines the features of the project.</p>
          )}
          {activeSection === "faq" && (
            <p>
              Frequently Asked Questions about the project are answered here.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
