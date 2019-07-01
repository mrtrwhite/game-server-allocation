## Thinking about the algorithms behind game server networks
- I decided to write an implementation in Javascript for better visualisation further down the line.
- So far, this includes Cartesian product to determine the total number of permutations of servers in O(1).

## Limitations
- Our script is only capable of allocating a player to a server when they're added to the queue, but we don't search for players when a space becomes available on the server.
- We only ever have a fixed number of servers, but I'd like to create/destroy servers with greater/less load.
- Our simulation only creates a new player at a fixed interval but this is unrealistic. Likewise our server only deletes a player at a fixed interval.

## Next steps
- I'd like to calculate an average wait time to connect to a game mode and region.
- I'd like cleanup processes for players that have to wait longer than a fixed limit.
    - If player has to wait longer than max threshhold.
    - If enough players are waiting in one mode/region, new server spins up.

## Local setup
```
npm install
npm run hot
```
Navigate to http://localhost:8080/.
