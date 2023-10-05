# jp-trainer

Live demo: [jp-trainer.surge.sh/](https://jp-trainer.surge.sh/)

Jp Trainer is a web application where you can memorize details of Kanji and Kana.

# Features

- Search kanji and get details
- Flashcard-like system to learn kanji or kana
- Create an account for custom lists of kanji
- No need for an account to learn by kanji grade or to learn kana

# Built with

- Database: PostgreSQL
- Backend: Node.js, Express.js, pg, bcrypt
- frontend: React, reactstrap, bootstrap
- API : [API to grab kanji details](https://kanjiapi.dev/#!/).

# Setup

#### Installation

1. Navigate to frontend and backend folders and install required packages

```
npm i
```

#### Starting Backend

2. Navigate to the backend folder, and in psql run the build file

```
$ psql
\i jp-trainer.sql
```

3. Exit psql and start the backend

```
exit;
npm start
```

#### Starting Frontend

4. Navigate to the front folder, and start the frontend

```
npm start
```
