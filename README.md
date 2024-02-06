# ems-training-copilot

This repository contains the code for the EMS Training Copilot, a web application that helps EMS providers to train and improve their skills.

## Getting Started

After downloading the code, set up the repository locally:

```console
$ npm install --prefix client
$ pipenv install && pipenv shell
```

Create a `.env` file at root and add the following variable:

```txt
DATABASE_URI=postgresql://{retrieve this from from render}
```

We've installed a new package in this repository called `python-dotenv`. It
allows us to set environment variables when we run our application using `.env`
files. This is a nice midway point between setting invisible environment
variables from the command line and writing hidden values into our code.

To generate these environment variables, we just need to run the following
command at the beginning of the module:

```py
# server/app.py

from dotenv import load_dotenv
load_dotenv()
```

After this, we can import any of our `.env` variables with `os.environ.get()`.

Run the following commands to install upgrade and seed our database:

```console
$ cd server
$ flask db upgrade
$ python seed.py
```

This application has a RESTful Flask API, a React
frontend using React Router for client-side routing, and PostgreSQL for the
database.

You can now run the app locally with:

```console
$ honcho start -f Procfile.dev
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
```

This command will generate a bundled and minified version of our React app in
the `client/build` folder.

**2.** Add static routes to Flask:

If you check `app.py`, you will see that the following additions have been made
since you last saw the bird API:

```py
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

...

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

```

These configure our Flask app for where to search for static and template files-
both in our `client/build/` directory.

**NOTE: Often, you may be setting up RESTful client-side routes, allowing people to go to `/birds` or `/birds/:id` to see all of the birds, or one at a time, respectively. These routes wouldn't be accessible on the frontend if they're already set up on the server (like they are in this app). To solve this, it's common to rewrite the backend routes so they all start with `/api/`, like `/api/birds` and `/api/birds/<int:id>` in order to free up the non-api urls to be used for client side routing. Just remember to also update your fetches to match backend urls.**

**3.** Run the Flask server:

```console
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
DATABASE_URI=postgresql://{retrieve this from from render}
```

## TODO

decide if we wanna use vecs, sqlachemy, another vector database
