How to run the redis docker image

container_name exmaple :my-redis

docker run --name <container_name> -p 6379:6379 -d redis
docker ps
docker exec -it <container_id_or_name> sh
redis-cli

commands you can try:

PING: Test if the server is running.
SET key value: Set the value of a key.
GET key: Get the value of a key.
KEYS \*: List all keys in the Redis database.
FLUSHALL: Delete all keys from the current database.
