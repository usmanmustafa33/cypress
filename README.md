# Apaleo Cypress e2e tests

### Quickstart

1. Run `npm install`
2. Create a `cypress.json` file based on `cypress.example.json`
3. In development run `npx cypress open`
4. see if you have to change the reservation unit group, rate plan and service in `reservation.spec.ts`


### for jenkins 
  - create a free account at cypress(https://dashboard.cypress.io/signup)
  - create project in cypress and put projectId in `cypress.json`
  - run `npx cypress run --record --key GET_RECORD_KEY_FROM_CYPRESS_DASHBOARD`
