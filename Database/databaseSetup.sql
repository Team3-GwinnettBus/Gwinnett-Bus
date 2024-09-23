--Create Database
CREATE DATABASE BusTrackingDB;
USE BusTrackingDB;

-- Create Tracking table holding only the most updated values for each bus
CREATE TABLE CurrentBusLocations (
    BusID INT PRIMARY KEY,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence VARCHAR(255),
    GPSTime TIMESTAMP,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--Create a History Table holding all updates about each bus
CREATE TABLE LiveData (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    BusID INT,
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    Speed DECIMAL(5, 2),
    Heading DECIMAL(5, 2),
    GeoFence VARCHAR(255),
    GPSTime TIMESTAMP,
    InsertionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BusID) REFERENCES CurrentBusLocations(BusID)
);

--Create an event that triggers each time the BusHistory Table is updated and updates CurrentBusLocations
DELIMITER //

CREATE EVENT UpdateEachBusLocationEvent
ON SCHEDULE EVERY 3 SECOND
DO
BEGIN
    -- Loop through each bus in CurrentBusLocations and update it with the most recent data from LiveData
    UPDATE CurrentBusLocations cb
    JOIN (
        SELECT BusID, Longitude, Latitude, Speed, Heading, GeoFence, GPSTime, InsertionTime
        FROM LiveData ld
        WHERE (ld.BusID, ld.InsertionTime) IN (
            SELECT BusID, MAX(InsertionTime)
            FROM LiveData
            GROUP BY BusID
        )
    ) latestData
    ON cb.BusID = latestData.BusID
    SET
        cb.Longitude = latestData.Longitude,
        cb.Latitude = latestData.Latitude,
        cb.Speed = latestData.Speed,
        cb.Heading = latestData.Heading,
        cb.GeoFence = latestData.GeoFence,
        cb.GPSTime = latestData.GPSTime,
        cb.LastUpdated = NOW();
END;
//
DELIMITER ;


--event scheduler needs to be on for trigger to work
SET GLOBAL event_scheduler = ON;

