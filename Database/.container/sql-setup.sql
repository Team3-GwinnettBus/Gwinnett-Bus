-- Any setup tables can be added here into the db
-- This is just a simple setup

-- Create and move into db
CREATE DATABASE GCPS_BusData;
USE GCPS_BusData;

-- Create a table for bus telemetry data
CREATE TABLE BusTelemetryData (
    BusID INT PRIMARY KEY,
    LatestTimestamp DATETIME,
    Location NVARCHAR(50),
    Speed FLOAT,
    Status NVARCHAR(50)
);
