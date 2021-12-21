# rainwire

https://www.mongodb.com/languages/mern-stack-tutorial

dependencies:
nodejs version 14 or higher

in server folder
$ npm install -g nodemon

in client folder
$npm install bootstrap
$npm install react-router-dom
$npm install axios

// https://stackoverflow.com/questions/34662574/node-js-getting-error-nodemon-internal-watch-failed-watch-enospc
$echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

// router problem
$npm install react-router-dom@5.2.0
$npm install react-router@5.2.0

Go into the server folder and run the command nodemon server.js.
Go back to the client folder and run the command npm start.