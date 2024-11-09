#!/bin/bash
# Shell script to remove all containers and cleanup


echo "Stopping and removing all containers..."
podman rm -f -a
if [ $? -eq 0 ]; then
    echo "All containers have been stopped and removed."
else
    echo "Failed to remove containers. Please check for errors."
    exit 1
fi

echo "Stopping and removing all pods..."
podman pod rm -f -a
if [ $? -eq 0 ]; then
    echo "All pods have been stopped and removed."
else
    echo "Failed to remove pods. Please check for errors."
    exit 1
fi

echo "Cleaning up unused resources..."
podman system prune -f
if [ $? -eq 0 ]; then
    echo "System cleaned up successfully!"
else
    echo "Failed to clean up the system. Please check for errors."
    exit 1
fi

echo "Cleanup complete!"
