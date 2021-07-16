import { Moment } from 'moment';
import { FillPaymentFormInput } from './interface';

Cypress.Commands.add('login', (email = Cypress.env('email'), pw = Cypress.env('password')) => {
    cy.visit(Cypress.env('loginURL'))

    cy.url(Cypress.env('loginURL'))

    cy.get("#email")
    .type(email)
    .should('have.value', email)

    cy.get("#password")
    .type(pw)
    .should('have.value', pw)

    return cy.get('.mdl-color--accent').click()
});

Cypress.Commands.add('navigateToModule', (moduleName: string) => {
    cy.get('.sidenav-content').click()

    cy.get('mat-select[aria-label="Context"]')
    .click()
    .get('mat-option')
    .contains(Cypress.env('selectedHotel'))
    .click()

    cy.get('apa-menu-item').contains(moduleName).click()

    return cy.get('mat-sidenav-container').click({ multiple: true })
});

Cypress.Commands.add('selectTab', (tabName: string) => {
    return cy
    .get('.mat-tab-link')
    .contains(tabName)
    .click()
});

Cypress.Commands.add('setDateRangePicker', (startDate: Moment, endDate: Moment, position = 0) => {
    cy.get('.mat-datepicker-toggle').eq(position).click();

    selectDate(startDate)
    selectDate(endDate)
});

Cypress.Commands.add('setDateRange', (dateDate: Moment, position = 0) => {
    cy.get('.mat-datepicker-toggle').eq(position).click()

    selectDate(dateDate)
});

Cypress.Commands.add('getIframeBody', (IframeSelector: string) => {
    return cy
    .get(IframeSelector)
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
  })

Cypress.Commands.add('snackBarMessage', (message: string) => {
    cy.wait(2000);
    
    return cy
    .get('apa-notification-panel')
    .contains(message)
  })

Cypress.Commands.add('matSelectInput', (formControlName: string, value: string) => {
    return cy.get(`mat-select[formcontrolname="${formControlName}"]`)
        .click()
        .get('mat-option')
        .contains(value)
        .click()
  })

Cypress.Commands.add('fillPaymentForm', (buttonText: string, fillPaymentFormInput: FillPaymentFormInput) => {
    const input = {
        bookerName: 'Booker Name',
        bookerEmail: 'bookerMail@gmail.com',
        expiryMonth: '03',
        expiryYear: '2030',
        cardNumber: '4111111111111111',
        cardCvv: '737',
        ...fillPaymentFormInput
    };

    cy.formControlName('holder', input.bookerName)
    cy.formControlName('payerEmail', input.bookerEmail)
    cy.matSelectInput('expiryMonth', input.expiryMonth)
    cy.matSelectInput('expiryYear', input.expiryYear)

    cy.getIframeBody('iframe[id$=--cardNumber]')
    .find('#field')
    .click()
    .type(input.cardNumber)

    cy.getIframeBody('iframe[id$=--cvv]')
    .find('#field')
    .click()
    .type(input.cardCvv)

    return cy.contains(buttonText).click()
})

Cypress.Commands.add('formControlName', (controlName: string, type: string) => {
    

    return cy.get(`input[formcontrolname="${controlName}"]`).clear().type(type)
})

Cypress.Commands.add('apaSelectFilterSelect', (controlName: string, option: string, selector = 'formcontrolname') => {

    return  cy
            .get(`apa-select-filter[${selector}="${controlName}"]`)
            .click()
            .get('mat-option')
            .contains(option)
            .click()
})

Cypress.Commands.add('clickMatButton', (buttonString: string) => {
    

    return cy
            .get('.mat-button')
            .contains(buttonString)
            .click()
})

Cypress.Commands.add('clickMatRaisedButton', (buttonString: string) => {
    

    return cy
            .get('.mat-raised-button')
            .contains(buttonString)
            .click()
})


Cypress.Commands.add('matMenuItemClick', (menuString: string) => {
    

    return cy
            .get('.mat-menu-item')
            .contains(menuString)
            .click()
})

Cypress.Commands.add('matMenuTriggerClick', (menuString: string) => {
    

    return cy
            .get('.mat-menu-trigger')
            .contains(menuString)
            .click()
})

function selectDate(dateToSelect: Moment) {
    const monthEndName = dateToSelect.format('MMM').toUpperCase();
    const dayNumber = dateToSelect.format('D');
    const currentYear = dateToSelect.year().toString();

    return cy
        .get('button.mat-calendar-period-button')
        .click()
        .get('.mat-calendar-body-cell-content')
        .contains(currentYear)
        .click()
        .get('.mat-calendar-body')
        .contains(monthEndName)
        .click()
        .get('.mat-calendar-body')
        .contains(dayNumber)
        .click()
}