# Live Search for Reddit

A full-stack web application for users who want to [perform live searches on Reddit](https://live-search-for-reddit.herokuapp.com/) and receive real-time updates on submission posts.

![searching](https://i.imgur.com/IB0PwXj.gif)
![comment](https://i.imgur.com/Dk4Vc1X.gif)

Motive
-------
The idea for this app came about because I'm into some hobbies which have thriving marketplace communities in the form of subreddits and it was getting to be a real pain to manually check for items of interest every other day or even every few hours. So, in accordance to one of the 3 great virtues of a programmer, laziness, I thought it would be reasonable to try to automate this process. Couple that with some newly acquired knowledge in setting up Node.js servers and databases, it seemed prudent to build this idea out to a full-stack web application.

Technologies
------------
- Entire front-end built using **React** and **Material UI**
- Client communicates with the server via **fetch** requests and websocket connections using **Socket.io**
- Server is setup using **Node.js** and **Express** along with **Socket.io**
- Authentication and authorization performed via **OAuth** and data stored in cookies using **JSON Web Tokens**
- **PostgresQL** database to store users' data and search terms

Features 
--------
#### Current Features
1) User can authenticate with their Reddit account
2) User can view a list of search results from Reddit
3) User can view the details of a submission
4) User can comment on a submission
5) User can send a private message to the author of a submission
6) User can subscribe to a search stream
7) User can have search stream results sent to their inbox
8) User can receive subscription updates while disconnected from the application
9) User can cancel search subscription
10) User can remove all listings from the page
11) User can refresh the page without losing the previous search
12) User can be notified via sound of a new search result
13) User can mute/adjust notification volume
14) User can sign-in using a demo account

#### Pending Stretch Features
1) User can view their subscribed search(es) upon revisiting the app
2) User can view their Reddit inbox
3) User can compose private messages directly from the app

System Requirements
-------------------
- Node.js
- PostgresQL

Get Started
-----------
1) After cloning the repo, run `npm install` while in the repository
2) Set up a `.env` file and fill in its values. Please use the `.env.example` file as reference. Note: An API key from Reddit is required
3) `npm run db:import` to create and initialize the database
4) `npm run build` 
5) Once it is finished compiling, view the app in the browser at `localhost:3000`

FAQ
---
- **Why is the search not displaying any results?**

This app is designed to perform a live search given the user's search criteria so only newly-posted, matching submissions will be displayed. Also, please be mindful of typos when searching for keywords and/or subreddits

- **How do I cancel a search subscription?**

Unfortunately, the app currently does not display any previously subscribed searches for users when they revisit the app. This is an oversight by me and it results in an unintuitive and confusing user flow and I will definitely be looking into improving this area in the near future. For now, if you would like to unsubscribe to a search, please revisit the app and start a new search to replace it, making sure the inbox option is toggled on. Alternatively, you could just press and confirm cancel, which should cancel all subscriptions tied to you.

- **Why can't the demo account send messages?**

Reddit places a restriction on newly-created accounts and limits certain actions such as sending private messages. I will periodically check to see if the demo account is capable of composing messages and enable the option if so.
