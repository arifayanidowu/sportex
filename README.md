# Sportex

Sportex is a Fictional Sports League

## Installation

```bash
  npm install
```

Run `npm install` to Install all the packages used.

To use `Redis`, it's preferred you have `redis-cli` installed on your local machine and `redis-server`,

Run the below command to start your redis server, if you have redis and redis-server on your machine.

```bash
  redis-server
```
or 

Run the below command:
```bash
    npm run redis:server
```

Then run:

```bash
  npm run dev
```

Public Heroku URL can be found on [Sportex API](https://sportex-api.herokuapp.com)

Postman Documentation can be found here: [API docs](https://documenter.getpostman.com/view/3347950/TVRn2S8b),
select `sportex_env` as the Environment (In Postman) for this API documentation.

To Run the test scripts, it's advised to run 

```bash
  yarn test name.test.js 
```
to prevent conflicts.

## License

[MIT](https://choosealicense.com/licenses/mit/)
