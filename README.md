# Fetching and setting state with React...

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/react-state-fetch.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

This is an easy, basic and raw (no styles attached) example of **HOW to** `fetch` data from x-endpoint and set it as `local state`.

Feel free to replace the `API` with yours or an external one. In any case (also for `localhost` with other `port`) remember to `enable CORS`

## Installation
```
yarn install
```

## Running the dev server
```
yarn start
```

## Description

### Option 1: `<RegularWay />`
### Option 2: `<HooksWay />`
### Option 3: `<CustomHookWay />`


## Using *Async/Await*

Alternatively, you can use *Async/Await*

Snippet for `react-state-fetch/src/containers/RegularWay.js`

```javascript
  componentDidMount() {
    this.fetchUsers()
  }

  /* Or
  async fetchUsers() {}
*/
  fetchUsers = async () => {
    try {
      const response = await fetch(API + limitQuery + limitUserResults)
      const parsedResponse = await response.json()
      this.setState({ users: parsedResponse })
    }
    catch (error) {
      console.log('RegularWay', error)
    }
  }
```

---

## Avoiding infinite loops

Even when this is *outside* the scope of the project's documentation, remember that you should be particularly careful at the time of using `hooks` like `useEffect()`.

The *difference* between this...

```javascript
// Runs with every render
useEffect(() => {
})
```
... and this ...

```javascript
// Runs once
useEffect(() => {
}, [])
```

... is an **infinite loop**.

![asdksdf](images/infinite-loop.png)

---

## Notes

### CI/CD
**This is unrelated to the project; however, if you want to utilize a similar CI/CD pipeline, you can follow the instructions beneath**

First, be sure that you connect [circleci](https://circleci.com/) with your `GitHub` account setting the proper permissions. Once this is done, go to `Add Projects` and click on `Set Up Project` next to your repository. Then, follow the instructions.

> **What are orbs?**
Orbs are packages of CircleCI configuration that can be shared across projects. Orbs allow you to make a single bundle of jobs, commands, and executors that can reference each other and can be imported into a CircleCI build configuration and invoked in their own namespace. Orbs are registered with CircleCI, with revisions expressed using the semver pattern. *circleci.com*

> **What is a workflow?** A workflow is a set of rules for defining a collection of jobs and their run order. *circleci.com*

