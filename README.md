# rubber-duck-code-challenge

![rubber duck](https://github.com/andrewevans0102/rubber-duck-code-challenge/blob/master/src/assets/rubber_duck.png)

This project attempts to make learning fun.  

The application is hosted with Firebase and can be reached at [https://rubber-duck-code-challenge.firebaseapp.com](https://rubber-duck-code-challenge.firebaseapp.com).

The idea is that you record anytime you learn something.  This is considered an `activity`.  Each `activity` has points.  At the end of the week, the points are tallied and winners are determined for `First`, `Second`, and `Third` place.  Winners are encouraged to post information about what they did on the different slack channels.

Project was originally developec as a clone of my earlier project [overwatch-challenge](https://github.com/andrewevans0102/overwatch-challenge).

If you hae any other questions, please contact [Andrew here](https://www.andrewevans.dev/contact)

Rubber Duck image is [from here](https://www.iconfinder.com/icons/416395/bath_bathroom_clean_duck_kids_rubber_water_icon).

## npm scripts
- `prod-deploy` deploys frontend and functions to Firebase
- `staged-commit` sets environment values beofre making project commit
- `deploy-commit` pulls in production values for development work
- `functions-install` does the standard `npm install` for functions
- `docs-build` builds the project docs
- `docs-deploy` deploys the project docs to repo's GitHub Pages site
- `docs-serve` serves the project docs locally on `http://127.0.0.1:8000/`

## documentation
- docs are available on this repo's [GitHub Pages](https://andrewevans0102.github.io/rubber-duck-code-challenge/)

## project folders
- `functions` contains the Firebase functions
- `scripts` contains build scripts for development

## Firebase
The project uses the Firebase SDK and AngularFire2 for authentication and database services.

The project also has Firebase Functions that occur when writes are done to:
- `users` collection
- `teamActivities` collection

## Slack Integration
The project includes `Slack` integrations for messages when:
- new users are created
- new activities are created
- high scores are tallied

The team channels available on slack are:
- `create-activity` where any newly created activities are automatically posted via slack webhook
- `registered-users` where any newly registered users (name only, no other info) are posted
- `learning` team channel for general discussion about learning activities
- `high-scores` where high scores are tallied and posted

There are links to join the slack org available inside the application once you register.

## Outstanding Tasks
- add e2e testing with [Cypress](https://www.cypress.io/)
- add unit testing with [Jest](https://jestjs.io/)
- create docs with [MkDocs](https://www.mkdocs.org/)
