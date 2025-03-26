#!/bin/bash

docker cp elasticsearch:/usr/share/elasticsearch/config/certs/es01/es01.crt ./certs/es01.crt
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/ca/ca.crt ./certs/ca.crt
