# Hapi18 - TS-Scaffold

## Structure

```
/dist/  -> compiled app
/src/   -> TS code
    /components/    -> interfaces and common components
    /plugins/       -> your custom plugins which can be injected through config.ts
    /utils/         -> global utils acting as wrappers
```

## Docker

Dockerfile + docker-compose. Use through npm.

## NPM Commands

```
app:build-ts        -> ts compile
app:start           -> start built app
app:build           -> build app
docker:start        -> docker compose up
docker:stop         -> docker stop
dev:start           -> run dev
```
