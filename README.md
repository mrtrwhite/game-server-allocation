# A thought experiment on the algorithms behind game server networks (in Javascript)

## Algorithms
- Cartesian Product to determine all the permutations of servers.
- Hash tables for storing players and servers.

## Limitations
- How can I ensure we're not wasting resource on a small number of players?
- We say that players can't leave a server until it's full (`canLeave`) but with ordering, an older server could move to the front of the queue by having more players leave, which would mean the newer server would take longer to fill up.
    - Older servers are rarely ever full because of this.
- We're updating the entire server object when all we really need is to update the `playerCount`.

## Next steps
- I'd like cleanup processes for players that have to wait longer than a fixed limit.
    - If player has to wait longer than max threshhold.
    - If enough players are waiting in one mode/region, new server spins up.

## Local setup
```
npm install
npm run hot
```
Navigate to http://localhost:8080/.
