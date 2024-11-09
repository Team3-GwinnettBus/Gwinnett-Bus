import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "dependencies", title: "Installed Dependencies" },
    { id: "kafka-setup", title: "Kafka Setup" },
    { id: "sql-server", title: "Microsoft SQL Server Setup" },
    { id: "cli-tools", title: "SQL Command Line Tools" },
    { id: "final-steps", title: "Final Running and Deployment" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r bg-background">
        <h2 className="text-xl font-bold mb-4 text-text">Documentation</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Button
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full text-left text-text"
                >
                  {section.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-card text-text">
        <h1 className="text-3xl font-bold mb-6">
          {sections.find((s) => s.id === activeSection)?.title}
        </h1>
        <div className="prose">
          {activeSection === "introduction" && (
            <>
              <p>
                Welcome to the documentation. This guide provides step-by-step
                instructions for setting up and running the project environment.
              </p>
            </>
          )}
          {activeSection === "dependencies" && (
            <>
              <h2>Installed Dependencies</h2>
              <p>To start, update your server:</p>
              <pre>
                <code>sudo dnf update</code>
              </pre>
              <p>If you encounter issues, import the key:</p>
              <pre>
                <code>
                  sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-AlmaLinux
                </code>
              </pre>
            </>
          )}
          {activeSection === "kafka-setup" && (
            <>
              <h2>Kafka Installation</h2>
              <p>Download and extract Kafka:</p>
              <pre>
                <code>
                  cd /opt/kafka
                  <br />
                  sudo wget
                  https://dlcdn.apache.org/kafka/3.8.0/kafka_2.13-3.8.0.tgz
                  <br />
                  sudo tar -xzf kafka_2.13-3.8.0.tgz
                  <br />
                  cd kafka_2.13-3.8.0
                </code>
              </pre>
            </>
          )}
          {activeSection === "sql-server" && (
            <>
              <h2>Microsoft SQL Server Setup</h2>
              <p>Install Microsoft SQL Server:</p>
              <pre>
                <code>
                  sudo curl -o /etc/yum.repos.d/mssql-server.repo
                  https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo
                  <br />
                  sudo dnf install -y mssql-server
                  <br />
                  sudo /opt/mssql/bin/mssql-conf setup
                </code>
              </pre>
              <p>
                Accept the license terms and configure the server with the SA
                account:
              </p>
              <pre>
                <code>UID: SA | Password: HootyHoo!</code>
              </pre>
              <p>Start, stop, or check the status of the server:</p>
              <pre>
                <code>
                  sudo systemctl start mssql-server
                  <br />
                  sudo systemctl status mssql-server
                </code>
              </pre>
            </>
          )}
          {activeSection === "cli-tools" && (
            <>
              <h2>SQL Command Line Tools</h2>
              <p>Install additional tools for interacting with the database:</p>
              <pre>
                <code>
                  sudo curl -o /etc/yum.repos.d/msprod.repo
                  https://packages.microsoft.com/config/rhel/8/prod.repo
                  <br />
                  sudo dnf install -y mssql-tools unixODBC-devel
                </code>
              </pre>
              <p>Update the system path:</p>
              <pre>
                <code>
                  {
                    "echo 'export PATH=\"$PATH:/opt/mssql-tools/bin\"' >> ~/.bash_profile"
                  }
                  <br />
                  {"source ~/.bash_profile"}
                </code>
              </pre>
              <p>Connect to the server:</p>
              <pre>
                <code>sqlcmd -S localhost -U SA -P 'HootyHoo!'</code>
              </pre>
            </>
          )}
          {activeSection === "final-steps" && (
            <>
              <h2>Final Running and Deployment</h2>
              <h3>Running Kafka</h3>
              <pre>
                <code>
                  cd /kafka_2.13-3.8.0
                  <br />
                  sudo bin/zookeeper-server-start.sh config/zookeeper.properties
                  <br />
                  sudo bin/kafka-server-start.sh config/server.properties
                </code>
              </pre>
              <h3>Database Operations</h3>
              <pre>
                <code>
                  sudo systemctl start mssql-server
                  <br />
                  sqlcmd -S localhost -U SA -P 'HootyHoo!’ -i dbsetup.sql
                </code>
              </pre>
              <h3>Deployment Scripts</h3>
              <p>Use the following scripts for container management:</p>
              <pre>
                <code>
                  chmod +x ./run_pod.sh ./stop_pod.sh
                  <br />
                  ./run_pod.sh (to build and run containers)
                  <br />
                  ./stop_pod.sh (to stop and clean up)
                </code>
              </pre>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
