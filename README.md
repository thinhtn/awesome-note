# awesome-note
Note app

## Deploy to Heroku
https://dev.to/smithmanny/deploy-your-react-app-to-heroku-2b6f
Before deploying the app go to:
Heroku dashboard > settings > buildpacks > add buildpacks and then add https://github.com/mars/create-react-app-buildpack
Or, in command line you can do
heroku buildpacks:set https://github.com/mars/create-react-app-buildpack
If you don't do this step, heroku will deploy the development build (which is slow) of your react app instead of the optimized production build.

## Set environment variables for Heroku
heroku config:set API_KEY=<your-api-key>
heroku config