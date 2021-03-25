
declare namespace Cypress {
    interface Chainable {
      login(email?: string, pw?: string): Cypress.Chainable<Element>

      navigateToModule(moduleName: string): Cypress.Chainable<Element>

      selectTab(selectTab: string): Chainable<Element>

      getIframeBody(getIframeBody: string): Chainable<Element>

      snackBarMessage(message: string): Chainable<Element>

      matSelectInput(formControlName: string, value: string): Chainable<Element>

      fillPaymentForm(buttonText?: string, fillPaymentFormInput?: FillPaymentFormInput)

      setDateRangePicker(startDate: moment.Moment, endDate: moment.Moment, position?:  number)

      setDateRange(dateDate: moment.Moment, position?:  number)
    }
}

interface FillPaymentFormInput {
  bookerName: string;
  bookerEmail: string;
  expiryMonth: string;
  expiryYear: string;
  cardNumber: string;
  cardCvv: string;
}
