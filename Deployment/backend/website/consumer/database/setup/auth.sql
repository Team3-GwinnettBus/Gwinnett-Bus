USE GCPS_Bus;
GO

CREATE TABLE Auth (
    UserID INT PRIMARY KEY,
    PasswordHash VARCHAR(255),
    Email VARCHAR(320),
    BusID INT,
    FOREIGN KEY (BusID) REFERENCES CurrentBusLocations(BusID)
);
GO


-- for frontend, but have /map and /dash wrapped with login page
-- one logged in, store db info like email and busid in cache
-- use the busid value in cache for map