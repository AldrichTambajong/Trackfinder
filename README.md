# Router example app
React app using react-router to redirect routes, instead of app.route. Flask backend only used to call json responses

## Getting Started
Clone repo into your local directory
```sh
$ git clone https://github.com/AldrichTambajong/react-router-example.git <optional_directory_name>
```

Enter new repo and install npm
```sh
$ cd <directory_name>
$ npm install
```
Then open two terminal tabs both at the same directory and run

```sh
$ npm start
```
in one terminal, and

```sh
$ npm run backend
```

in the other.
* BOTH COMMANDS NEED TO BE RAN IN ORDER FOR APP TO BE FULLY FUNCTIONAL

## Important information on creating react app with flask backend
(This is for anyone creating a react app with a flask backend from sratch)

* Create a proxy server
   - In package.json, add a "proxy" field, like the one in this package.json file, with the value set to "http://localhost:<port_number>" for "npm run backend".

   - This is so that fetch() can communicate from the react app to the flask routes; <port_number> is whatever port number is set in app.run() in app.py

* Create custom scripts in package.json (if needed/ wanted) 
   - "npm run backend" is a custom script I added on to package.json in the "scripts" field. It is the same as going into /Backend and running "python3 app.py"
   - Create custom scripts by adding script changes in the "scripts" field in package.json 

* <Route> characteristic
   - <Route> component acts similar to flask.renderTemplate(), in comparison to a flask app. It will display all components, conditonals, html tags, etc. within its opening and closing tags based on the "path=" or "exact path=" property
   - Refer to https://reactrouter.com/web/api/BrowserRouter for more info on Route,Link,Switch, and other router properties
