# Capstone Project Back-End Readme

- Deployed Back-end: https://safe-bayou-26348.herokuapp.com
- Deployed Front-end: https://treep78.github.io/jmwwvt-front-end/
- Back-end Repo: https://github.com/treep78/jmwwvt-back-end
- Front-end Repo: https://github.com/treep78/jmwwvt-front-end

# Back-end Summary

This back end, consisting of a Node.js app and a mongo database, receives calls from and sends data to a front end store. Most data requires a user to sign-in to add or modifiy.

# Technologies Utilized:

- Node.js
- Express
- MongoDB
- Mongoose
- Javascript
- Json
- Curl
- Heroku
- Git
- mLab
- Ember

# Database Collections:

- /portfolio_images

# Routes

// standards RESTful routes
.resources('portfolio_images')
.resources('categories')

// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })

# User Stories

- A user can sign-up
- A user can sign-in
- A user can change-password
- A user can sign-out
- Anyone can view products
- A user can add a database entry called a portfolio_image with a category, title, description, image link
- A user can view portfolio_images
- A user can change portfolio_images
- A user can remove portfolio_image

# Future Improvements

Given more time I'd like to fix my category filtering as well as cleaning up my visuals.
