## Local Development

```console
$ npm install --prefix client
$ pipenv install && pipenv shell
$ honcho start -f Procfile.dev
```

Create a `.env` file in the root of the project with the following contents:

```txt

```

## React/Flask Production Build

```console
$ npm run build --prefix client
$ pipenv install && pipenv shell
$ gunicorn --chdir server app:app
```

Visit [http://localhost:8000](http://localhost:8000) in the browser.

## Render Build Process

"Build Command" should be set to the following:

```console
$ npm install --prefix client && npm run build --prefix client && pipenv install
```

"Start Command" should be set to the following:

```console
$ gunicorn --chdir server app:app
```

"Environment Variables" should be set to the following:

```txt

```

## TODO

decide if we wanna use vecs, sqlachemy, another vector database,

set these:

[![Build Status](https://travis-ci.com/ems-copilot/ems-copilot.svg?branch=master)](https://travis-ci.com/ems-copilot/ems-copilot)
[![Coverage Status](https://coveralls.io/repos/github/ems-copilot/ems-copilot/badge.svg?branch=master)](https://coveralls.io/github/ems-copilot/ems-copilot?branch=master)
