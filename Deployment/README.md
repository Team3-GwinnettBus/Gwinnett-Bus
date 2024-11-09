Deployment details

Give permission to scripts:
chmod +x ./run_pod.sh ./stop_pod.sh

To build out containers and start pod for deployment:
./run_pod.sh

To stop, remove, and cleanup pod and its containers:
./stop_pod.sh

Tip: Modify what containers are running inside pod.yml under containers by commenting out unneeded containers
