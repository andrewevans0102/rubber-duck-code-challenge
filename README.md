# rubber-duck-code-challenge

This project attempts to make learning fun.  

The hosted application can be reached here.

The idea is that you record anytime you learn something.  This is considered an `activity`.  Each `activity` has points.  At the end of the week, the points are tallied and winners are determined for `First`, `Second`, and `Third` place.  Winners are encouraged to post information about what they did on the different slack channels.

Project was originally developec as a clone of my earlier project [overwatch-challenge](https://github.com/andrewevans0102/overwatch-challenge).

If you hae any other questions, please contact [Andrew here](https://www.andrewevans.dev/contact)

## npm scripts
- `prod-deploy` deploys frontend and functions to Firebase
- `staged-commit` sets environment values beofre making project commit
- `deploy-commit` pulls in production values for development work
- `functions-install` does the standard `npm install` for functions

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
