# Run Backend
# Connect to mongo database-----------//
1. to restart brew and mongo -> brew services restart mongodb/brew/mongodb-community
2. To Start Backend -> sudo mongod --dbpath /System/Volumes/data/data/db  or 
3. create an alias -> alias mongod='sudo mongod --dbpath /System/Volumes/Data/data/db'
4. run -> mongod
5. Run Postman to make calls to database
6. run the -> npm start -or-> nodemon -to start the app
7. Open Compass Mongodb


# CRM Client side API

This api is a part of create CRM Ticket system with MERN stack from scratch tutorial series.
Link for the series is https://youtu.be/XWbEzWSKBfs

## How to use

- run `git clone ...`
- run `npm install`
- run `npm start`

Note: Make sure you have nodemon is installed in your system

## API Resources

### User API Resources

All the user API router follows `/v1/user/`

| #   | Routers                   | Verbs  | Progress | Is Private | Description                                      |
| --- | ------------------------- | ------ | -------- | ---------- | ------------------------------------------------ |
| 1   | `/v1/user`                | GET    | Done     | Yes        | Get user Info                                    |
| 2   | `/v1/user`                | POST   | Done     | No         | Create a user                                    |
| 3   | `/v1/user/login`          | POST   | Done     | No         | Verify user Authentication and return JWT        |
| 4   | `/v1/user/reset-password` | POST   | Done     | No         | Verify email and email pin to reset the password |
| 5   | `/v1/user/reset-password` | PATCH  | Done     | No         | Replace with new password                        |
| 6   | `/v1/user/logout`         | DELETE | Done     | Yes        | Delete user accessJWT                            |

### Ticket API Resources

CRUD

1. C = Create Ticket
2. R = Read Ticket
3. U = Update Ticket
4. D = Delete Ticket

All the user API router follows `/v1/ticket/`

| #   | Routers                        | Verbs | Progress | Is Private | Description                             |
| --- | ------------------------------ | ----- | -------- | ---------- | --------------------------------------- |
| 1   | `/v1/ticket`                   | GET   | Done     | Yes        | Get all ticket for the logined in user  |
| 2   | `/v1/ticket/{id}`              | GET   | Done     | Yes        | Get a ticket details                    |
| 3   | `/v1/ticket`                   | POST  | Done     | Yes        | Create a new ticket                     |
| 4   | `/v1/ticket/{id}`              | PUT   | Done     | Yes        | Update ticket details ie. reply message |
| 5   | `/v1/ticket/close-ticket/{id}` | PATCH | Done     | Yes        | Update ticket status to close           |
| 6   | `/v1/ticket/{id}`              | DELET | Done     | Yes        | Delete a ticket                         |

### Tokens API Resources

All the user API router follows `/v1/tokens`

| #   | Routers      | Verbs | Progress | Is Private | Description            |
| --- | ------------ | ----- | -------- | ---------- | ---------------------- |
| 1   | `/v1/tokens` | GET   | Done     | No         | Get a fresh access JWT |
