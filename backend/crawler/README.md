# Elastic Open Web Crawler

See: https://github.com/elastic/crawler

## Running
The crawler runs inside a docker container named `crawler`. Start the container using Docker Compose from [this compose file](../../docker-compose.yml).

## Crawling
Crawling requires a configuration file. There are examples in the config/examples directory. To run the crawler, execute `bin/crawler` command in the `crawler` container.
eg:`docker exec -it crawler bin/crawler crawl config/examples/simple.yml`
