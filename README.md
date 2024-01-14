# firefly-cli
A command line interface for interacting with your [FireflyIII](https://www.firefly-iii.org/) server.

## Features
- [x] User authentication
- [x] Fetch summary data
- [x] Fetch account data
- [x] Fetch transactions
- [x] Fetch individual transaction details
- [ ] CRUD transactions

This tool uses [commander]() and [prompts]() to create a simple and easy to use command line interface to interact with a FireflyIII personal finance server.

## Installation

```bash
git clone git@github.com:jfosburgh/firefly-cli.git
cd firefly-cli
npm i
```

## Setup

A `.env` file is required for authentication with the server.

```bash
touch .env
echo TOKEN=<personal token key> >> .env
echo URL=<base url for FireflyIII> >> .env
```

To verify everything is working, run
```bash
npm start verify
```
or
```bash
node src/index.js verify
```

This will send a request to the server for the authenticated user information, and will print out the URL of the attached server and the email of the authenticated user.

## Usage

To start the interactive tool, simply run
```bash
npm start
```
or 
```bash
node src/index.js
```
