# Microsoft SQL Server 2019 docker image
FROM mcr.microsoft.com/mssql/server:2019-latest

# Setup environment variables for SQL Server
ENV SA_PASSWORD=SomeStringPassword
ENV ACCEPT_EULA=Y

# Open SQL Server port
EXPOSE 1433

# Copy SQL setup script into the container
COPY ./sql-setup.sql /scripts/sql-setup.sql

RUN pip install pyodbc

# Start SQL Server, then run the script using sqlcmd
CMD /bin/bash -c "/opt/mssql/bin/sqlservr & sleep 30 && /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P SomeStringPassword -i /scripts/sql-setup.sql && wait"
