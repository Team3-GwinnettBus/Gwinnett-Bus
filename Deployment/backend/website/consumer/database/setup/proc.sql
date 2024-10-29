USE GCPS_Bus;
GO

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
        cb.Accuracy = latestData.Accuracy,
        cb.LastUpdated = latestData.InsertionTime
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
