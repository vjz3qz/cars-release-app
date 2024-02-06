# ems-training-copilot

This repository contains the code for the EMS Training Copilot, a web application that helps EMS providers to train and improve their skills.

## Getting Started

After downloading the code, set up the repository locally:

```console
$ npm install --prefix client
$ pipenv install && pipenv shell
$ honcho start -f Procfile.dev
```

Create a `.env` file in the root of the project and add the following:

```txt

```

## React Production Build

When working in the **development** environment, a typical workflow for adding
new features to a React application is something like this:

- Run `npm start` to run a development server.
- Make changes to the app by editing the files.
- View those changes in the browser.

### Building a Static React App

**1.** Build the production version of our React app:

```console
$ npm run build --prefix client
$ gunicorn --chdir server app:app
```

Visit [http://localhost:8000](http://localhost:8000) in the browser. You should
see the production version of the React application!

## Render Build Process

Navigate to [your Render dashboard][https://dashboard.render.com] and create
a new web service. Find your forked repository through "Connect a repository"
or search by the copied URL under "Public Git repository."

Change your "Build Command" to the following:

```console
$ npm install --prefix client && npm run build --prefix client && pipenv install
```

Change your "Start Command" to the following:

```console
$ gunicorn --chdir server app:app
```

These commands will:

- Install any Python dependencies with `pipenv`.
- Install any Node dependencies with `npm`.
- Build your static site with `npm`.
- Run your Flask server.

Once you have saved these changes, navigate to the "Environment" tab and make
sure the following values are set:

```txt
FLASK_ENV=production
```

## TODO

decide if we wanna use vecs, sqlachemy, another vector database
