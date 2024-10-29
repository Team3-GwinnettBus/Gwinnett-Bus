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
    Accuracy DECIMAL(5, 2),  -- Added Accuracy column here
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
    Accuracy DECIMAL(5, 2),  -- Added Accuracy column here
    InsertionTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (BusID) REFERENCES CurrentBusLocations(BusID)
);
GO

-- Step 5: Create the table for invalid or irregular data
CREATE TABLE InvalidData (
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    BusID INT,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence NVARCHAR(255),
    GPSTime DATETIME,
    Accuracy DECIMAL(5, 2),  -- Added Accuracy column here
    InsertionTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (BusID) REFERENCES CurrentBusLocations(BusID)
);
GO