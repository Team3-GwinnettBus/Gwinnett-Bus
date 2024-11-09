#!/bin/bash
# Shell script to build containers and run pod


echo "Building Podman containers..."

podman build -t localhost/bus-project-producer ./backend/producer
if [ $? -ne 0 ]; then
  echo "Error building bus-project-producer"
  exit 1
fi

podman build -t localhost/bus-project-web ./backend/website
if [ $? -ne 0 ]; then
  echo "Error building bus-project-web"
  exit 1
fi

echo "Running the pod..."
podman play kube pod.yml
if [ $? -ne 0 ]; then
  echo "Error running the pod"
  exit 1
fi

echo "All containers are up and running!"
