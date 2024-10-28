# Rawky
A simple chat app made for self-hosting, not only is this app light-weight and easy to use, but it has security features made for preventing hackers from leaking data using several security techniques I have learnt.
This app was primarily just a learning project for SvelteKit, but it just became a full blown app.
The tech-stack this app uses is SvelteKit, Prisma + SQLite (you may also use postgres or mysql), and Typescript.

## Installation
You can interchange ```pnpm``` with your package manager and runtime (for example: ```bun```, ```npm```, ```deno```, ```yarn``` etc.)
First install all the packages:
```bash
pnpm i
```
Then migrate the prisma database:
```bash
pnpm prisma migrate dev
```
Then finally, start the server:
```bash
pnpm dev
```
For production you can switch to Postgres or MySQL (if you want) then just host it onto Render or Vercel, (what I showed you before was self-hosting a dev server), to self-host the prod server run the following commands:
```bash
pnpm build
pnpm preview
```