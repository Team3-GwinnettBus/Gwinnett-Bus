
FROM 52blaze/docker-whale

RUN pull apache/kafka:3.8.0
RUN docker run -p 9092:9092 apache/kafka:3.8.0

