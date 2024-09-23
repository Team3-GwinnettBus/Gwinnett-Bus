-- Step 1: Create the GCPS_Bus Database
CREATE DATABASE GCPS_Bus;
GO

-- Step 2: Use the newly created database
USE GCPS_Bus;
GO

-- Step 3: Create the CurrentBusLocations Table (only the most updated values for each bus)
CREATE TABLE CurrentBusLocations (
    BusID INT PRIMARY KEY,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence NVARCHAR(255),
    GPSTime DATETIME,
    LastUpdated DATETIME DEFAULT GETDATE()
);
GO

-- Step 4: Create the LiveData Table (holding all updates about each bus)
CREATE TABLE LiveData (
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    BusID INT,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence NVARCHAR(255),
    GPSTime DATETIME,
    InsertionTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (BusID) REFERENCES CurrentBusLocations(BusID)
);
GO

-- Step 5: Insert Initial Data into CurrentBusLocations to satisfy the foreign key constraint
INSERT INTO CurrentBusLocations (BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime)
VALUES
    (1, -84.3880, 33.7490, 40.50, 180.00, 'Downtown', '2024-09-23 10:15:30'),
    (2, -84.3890, 33.7485, 35.20, 90.00, 'Midtown', '2024-09-23 10:16:00'),
    (3, -84.3920, 33.7480, 50.00, 270.00, 'Buckhead', '2024-09-23 10:16:30');
GO

-- Step 6: Insert Dummy Data into LiveData
INSERT INTO LiveData (BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime)
VALUES
    (1, -84.3880, 33.7490, 40.50, 180.00, 'Downtown', '2024-09-23 10:15:30'),
    (2, -84.3890, 33.7485, 35.20, 90.00, 'Midtown', '2024-09-23 10:16:00'),
    (3, -84.3920, 33.7480, 50.00, 270.00, 'Buckhead', '2024-09-23 10:16:30'),
    (1, -84.3870, 33.7500, 45.00, 360.00, 'Downtown', '2024-09-23 10:17:00'),
    (2, -84.3860, 33.7510, 42.00, 45.00, 'Midtown', '2024-09-23 10:17:30'),
    (3, -84.3850, 33.7520, 38.00, 135.00, 'Buckhead', '2024-09-23 10:18:00');
GO

-- Step 7: Create a SQL Server Agent Job (which acts as an event running every 3 seconds)
-- SQL Server doesn't have an exact equivalent of MySQL's EVENT scheduler, so we use a SQL Server Agent Job

-- First, create a stored procedure to update bus locations
CREATE OR ALTER PROCEDURE UpdateCurrentBusLocation
AS
BEGIN
    UPDATE cb
    SET 
        cb.Longitude = latestData.Longitude,
        cb.Latitude = latestData.Latitude,
        cb.Speed = latestData.Speed,
        cb.Heading = latestData.Heading,
        cb.GeoFence = latestData.GeoFence,
        cb.GPSTime = latestData.GPSTime,
        cb.LastUpdated = GETDATE()
    FROM CurrentBusLocations cb
    INNER JOIN (
        SELECT BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime
        FROM LiveData
        WHERE (BusID, InsertionTime) IN (
            SELECT BusID, MAX(InsertionTime)
            FROM LiveData
            GROUP BY BusID
        )
    ) latestData
    ON cb.BusID = latestData.BusID
    WHERE 
        cb.Longitude <> latestData.Longitude OR
        cb.Latitude <> latestData.Latitude OR
        cb.Speed <> latestData.Speed OR
        cb.Heading <> latestData.Heading OR
        cb.GeoFence <> latestData.GeoFence OR
        cb.GPSTime <> latestData.GPSTime;
END;

GO

-- Step 2: Create a SQL Server Agent Job
USE msdb;  -- Switch to the msdb database

EXEC sp_add_job
    @job_name = 'UpdateBusLocations';  -- Name of the job

EXEC sp_add_jobstep
    @job_name = 'UpdateBusLocations',
    @step_name = 'Update Bus Locations',
    @subsystem = 'TSQL',
    @command = 'EXEC UpdateCurrentBusLocation;',
    @retry_attempts = 0,
    @retry_interval = 0,
    @output_file_name = NULL,
    @on_success_action = 1,
    @on_fail_action = 2;

-- Step 3: Create a schedule for the job
EXEC sp_add_jobschedule
    @job_name = 'UpdateBusLocations',
    @name = 'Every 3 seconds',
    @freq_type = 4,  -- Recurring
    @freq_interval = 1,  -- Every 1
    @freq_subday_type = 2,  -- Seconds
    @freq_subday_interval = 3,  -- Every 3 seconds
    @active_start_time = '000000';  -- Start time (midnight)

-- Step 4: Enable the job
EXEC sp_add_jobserver
    @job_name = 'UpdateBusLocations',
    @server_name = 'localhost';  -- Use your server name
