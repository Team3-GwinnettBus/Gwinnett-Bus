# New docker file

# Use Red Hat UBI 9 OS as the base image for this container
# This is for compatibility with the server holding the container
FROM registry.access.redhat.com/ubi9/ubi:9.0

# Set env varibales for Microsoft SQL install
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=BusDatabase2024
ENV PATH=/opt/mssql-tools/bin:$PATH

# Install Micrsoft SQL and drivers
RUN curl https://packages.microsoft.com/config/rhel/9/prod.repo > /etc/yum.repos.d/mssql-release.repo && \
    dnf install -y msodbcsql17 mssql-tools unixODBC-devel && \
    dnf clean all

# Install Python and dependanies
RUN dnf -y update && \
    dnf -y install python3.10 python3.10-devel gcc-c++ unixODBC unixODBC-devel && \
    dnf clean all
RUN alternatives --set python /usr/bin/python3.10

# Install Python libaries
RUN pip3 install --upgrade pip && \
    pip3 install pyodbc kafka-python sim

# Add all code and files
COPY . /app
WORKDIR /app

# Expose acces for ports for Flask (5000), Kafka (9092), and SQL Server (1433)
# Ports still need to be published to use when running the container
EXPOSE 5000    # Flask
EXPOSE 9092    # Kafka
EXPOSE 1433    # SQL Server

# Run any scripts on boot using CMD (for Flask server, SQL server, Kafka, or anything you want running off the bat)
# Example - CMD ["name of program ex. python3", "name of script ex. any_script.py"]
