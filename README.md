## Running this app

Backend is Docker, frontend is just vite.
Go to root directory of project.
To run backend and frontend in one go you can just goto terminal and type ```./start-app.sh```
Alternatively you can use two terminal commands:
1) ```docker compose up``` to start up the backend containers
2) goto frontend dir and run ```npm run dev``` to start up the frontend.

## Generate db migration file from Prisma schema:
```npm run db:generate```

## Run the migrations inside dev docker postgres container 
```docker-compose exec backend npm run db:migrate```

| Action | Command |
|--------|---------|
| Stop & remove containers | `docker-compose down` |
| Remove volumes (optional) | `docker-compose down -v` |
| Rebuild backend (if needed) | `docker-compose build` |
| Clean up 'dangling volumes' | `docker volume prune`|
| Clean build of new containers |`docker-compose build --no-cache`|
| Start containers | `docker-compose up -d` |
| Check logs | `docker-compose logs backend` |
| Inspect DB | `docker-compose exec db psql -U user -d mydatabase` |
| Drop db| `npm run db:drop`|
| Generate new migration file(s) | `npm run db:generate`|
| Run migrations | `docker-compose exec backend npm run db:migrate`|

# CloudWave Full Stack Code Challenge ~ Wave Chat
CloudWave have provided scaffolding for both the front and back end of the challenge, to save you time.

## Front-end

### Configuration
This application uses Vite, ReactJS, Typescript and vitest for testing. `tsconfig.json` has been pre-configured for the environment and hot reloading has been set up for you.

⚠️ **Some files may throw typescript errors due to empty placeholder files or commented out code.**

&nbsp;
### Linting
There's `stylelint` for linting SCSS files and `eslint` for linting code. You can lint the application with the `lint` and `lint:styles` commands in `package.json`.

⚠️ **Some files may throw linting warnings due to commented out scaffolding code.**

&nbsp;
### UI & Components
We've added `ant design` for you to use, which comes with a selection of UI React components and style classes out of the box.

Read more [here](https://ant.design/).

Not comfortable with Ant design? Feel free to use native HTML elements or another component library, such as `material-ui` or `react-bootstrap`.

&nbsp;
### Routing
This challenge uses `react-router` for routing.

&nbsp;
### Socket IO
Read more [here](https://socket.io/). The examples on the home page should be enough for you to complete the challenge.

&nbsp;
## Back-end

### Configuration
This application uses typescript and jest. `tsconfig.json` has been pre-configured for the environment.

&nbsp;
### Socket IO
The HTTP server with socket.io are already connected. The socket server will automatically run by default on port 3001.

&nbsp;
### Hot Reload
The backend server supports hot reload using `nodemon`. Any changes you make to files will automatically be updated if the server is started with the `start:dev` command.
