-- Step 1: Create the GCPS_Bus Database
CREATE DATABASE GCPS_Bus_Data;
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
);
GO
-- Step 5: Create the table for invalid or irregular
CREATE TABLE InvalidData (
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    BusID INT,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence NVARCHAR(255),
    GPSTime DATETIME,
    InsertionTime DATETIME DEFAULT GETDATE(),
);
GO
-- Step 6: Insert Initial Data into CurrentBusLocations to satisfy the foreign key constraint
INSERT INTO CurrentBusLocations (BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime)
VALUES
   (1, -84.3880, 33.7490, 40.50, 180.00, 'Downtown', '2024-09-23 10:15:30'),
(2, -84.3890, 33.7485, 35.20, 90.00, 'Midtown', '2024-09-23 10:16:00'),
(3, -84.3920, 33.7480, 50.00, 270.00, 'Buckhead', '2024-09-23 10:16:30'),
(4, -84.3930, 33.7475, 45.10, 180.00, 'Downtown', '2024-09-23 10:17:00'),
(5, -84.3940, 33.7470, 30.50, 90.00, 'Midtown', '2024-09-23 10:17:30'),
(6, -84.3950, 33.7465, 60.00, 270.00, 'Buckhead', '2024-09-23 10:18:00'),
(7, -84.3960, 33.7460, 40.50, 180.00, 'Downtown', '2024-09-23 10:18:30'),
(8, -84.3970, 33.7455, 35.20, 90.00, 'Midtown', '2024-09-23 10:19:00'),
(9, -84.3980, 33.7450, 50.00, 270.00, 'Buckhead', '2024-09-23 10:19:30'),
(10, -84.3990, 33.7445, 45.10, 180.00, 'Downtown', '2024-09-23 10:20:00'),
(11, -84.4000, 33.7440, 30.50, 90.00, 'Midtown', '2024-09-23 10:20:30'),
(12, -84.4010, 33.7435, 60.00, 270.00, 'Buckhead', '2024-09-23 10:21:00'),
(13, -84.4020, 33.7430, 40.50, 180.00, 'Downtown', '2024-09-23 10:21:30'),
(14, -84.4030, 33.7425, 35.20, 90.00, 'Midtown', '2024-09-23 10:22:00'),
(15, -84.4040, 33.7420, 50.00, 270.00, 'Buckhead', '2024-09-23 10:22:30'),
(16, -84.4050, 33.7415, 45.10, 180.00, 'Downtown', '2024-09-23 10:23:00'),
(17, -84.4060, 33.7410, 30.50, 90.00, 'Midtown', '2024-09-23 10:23:30'),
(18, -84.4070, 33.7405, 60.00, 270.00, 'Buckhead', '2024-09-23 10:24:00'),
(19, -84.4080, 33.7400, 40.50, 180.00, 'Downtown', '2024-09-23 10:24:30'),
(20, -84.4090, 33.7395, 35.20, 90.00, 'Midtown', '2024-09-23 10:25:00'),
(21, -84.4100, 33.7390, 50.00, 270.00, 'Buckhead', '2024-09-23 10:25:30'),
(22, -84.4110, 33.7385, 45.10, 180.00, 'Downtown', '2024-09-23 10:26:00'),
(23, -84.4120, 33.7380, 30.50, 90.00, 'Midtown', '2024-09-23 10:26:30'),
(24, -84.4130, 33.7375, 60.00, 270.00, 'Buckhead', '2024-09-23 10:27:00'),
(25, -84.4140, 33.7370, 40.50, 180.00, 'Downtown', '2024-09-23 10:27:30'),
(26, -84.4150, 33.7365, 35.20, 90.00, 'Midtown', '2024-09-23 10:28:00'),
(27, -84.4160, 33.7360, 50.00, 270.00, 'Buckhead', '2024-09-23 10:28:30'),
(28, -84.4170, 33.7355, 45.10, 180.00, 'Downtown', '2024-09-23 10:29:00'),
(29, -84.4180, 33.7350, 30.50, 90.00, 'Midtown', '2024-09-23 10:29:30'),
(30, -84.4190, 33.7345, 60.00, 270.00, 'Buckhead', '2024-09-23 10:30:00'),
(31, -84.4200, 33.7340, 40.50, 180.00, 'Downtown', '2024-09-23 10:30:30'),
(32, -84.4210, 33.7335, 35.20, 90.00, 'Midtown', '2024-09-23 10:31:00'),
(33, -84.4220, 33.7330, 50.00, 270.00, 'Buckhead', '2024-09-23 10:31:30'),
(34, -84.4230, 33.7325, 45.10, 180.00, 'Downtown', '2024-09-23 10:32:00'),
(35, -84.4240, 33.7320, 30.50, 90.00, 'Midtown', '2024-09-23 10:32:30'),
(36, -84.4250, 33.7315, 60.00, 270.00, 'Buckhead', '2024-09-23 10:33:00'),
(37, -84.4260, 33.7310, 40.50, 180.00, 'Downtown', '2024-09-23 10:33:30'),
(38, -84.4270, 33.7305, 35.20, 90.00, 'Midtown', '2024-09-23 10:34:00'),
(39, -84.4280, 33.7300, 50.00, 270.00, 'Buckhead', '2024-09-23 10:34:30'),
(40, -84.4290, 33.7295, 45.10, 180.00, 'Downtown', '2024-09-23 10:35:00'),
(41, -84.4300, 33.7290, 30.50, 90.00, 'Midtown', '2024-09-23 10:35:30'),
(42, -84.4310, 33.7285, 60.00, 270.00, 'Buckhead', '2024-09-23 10:36:00'),
(43, -84.4320, 33.7280, 40.50, 180.00, 'Downtown', '2024-09-23 10:36:30'),
(44, -84.4330, 33.7275, 35.20, 90.00, 'Midtown', '2024-09-23 10:37:00'),
(45, -84.4340, 33.7270, 50.00, 270.00, 'Buckhead', '2024-09-23 10:37:30'),
(46, -84.4350, 33.7265, 45.10, 180.00, 'Downtown', '2024-09-23 10:38:00'),
(47, -84.4360, 33.7260, 30.50, 90.00, 'Midtown', '2024-09-23 10:38:30'),
(48, -84.4370, 33.7255, 60.00, 270.00, 'Buckhead', '2024-09-23 10:39:00'),
(49, -84.4380, 33.7250, 40.50, 180.00, 'Downtown', '2024-09-23 10:39:30'),
(50, -84.4390, 33.7245, 35.20, 90.00, 'Midtown', '2024-09-23 10:40:00');
GO

-- Step 7: Insert Dummy Data into LiveData
INSERT INTO LiveData (BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime)
VALUES
    (1, -84.3880, 33.7490, 40.50, 180.00, 'Downtown', '2024-09-23 10:15:30'),
    (2, -84.3890, 33.7485, 35.20, 90.00, 'Midtown', '2024-09-23 10:16:00'),
    (3, -84.3920, 33.7480, 50.00, 270.00, 'Buckhead', '2024-09-23 10:16:30'),
    (1, -84.3870, 33.7500, 45.00, 360.00, 'Downtown', '2024-09-23 10:17:00'),
    (2, -84.3860, 33.7510, 42.00, 45.00, 'Midtown', '2024-09-23 10:17:30'),
    (3, -84.3850, 33.7520, 38.00, 135.00, 'Buckhead', '2024-09-23 10:18:00');
GO

-- Step 8: Create a SQL Server Agent Job (which acts as an event running every 3 seconds)
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
        cb.LastUpdated = latestData.InsertionTime,
        cb.Accuracy = latestData.Accuracy
    FROM CurrentBusLocations cb
    INNER JOIN (
        SELECT ld.BusID, ld.Longitude, ld.Latitude, ld.Speed, ld.Heading, ld.GeoFence, ld.GPSTime, ld.Accuracy, ld.InsertionTime
        FROM LiveData ld
        INNER JOIN (
            SELECT BusID, MAX(InsertionTime) AS MaxInsertionTime
            FROM LiveData
            GROUP BY BusID
        ) latest ON ld.BusID = latest.BusID AND ld.InsertionTime = latest.MaxInsertionTime
    ) latestData ON cb.BusID = latestData.BusID
    WHERE 
        cb.Longitude <> latestData.Longitude OR
        cb.Latitude <> latestData.Latitude OR
        cb.Speed <> latestData.Speed OR
        cb.Heading <> latestData.Heading OR
        cb.GeoFence <> latestData.GeoFence OR
        cb.GPSTime <> latestData.GPSTime OR
        cb.Accuracy <> latestData.Accuracy OR
        cb.LastUpdated <> latestData.InsertionTime;
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
    @server_name = 'RHEL9.xVM';  -- Use your server name
