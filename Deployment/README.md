Deployment details

Give permission to scripts:
chmod +x ./run_pod.sh ./stop_pod.sh

To build out containers and start pod for deployment:
./run_pod.sh

To stop, remove, and cleanup pod and its containers:
./stop_pod.sh

Note:
Modify what containers are running inside pod.yml under containers by commenting out unneeded containers
Hosted at http://10.96.32.157:8000/
Use port 3000 for database dashboard
Use port 9000 for Kafka dashboard
