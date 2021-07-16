import moment = require("moment");
import { Reservation } from "./reservation.po";

const reservation = new Reservation();
const serviceName = 'TEST';
const reservationUnitGroup = 'Double';
const reservationRatePlan = 'TESTADD';

context('Apaleo create Reservation', () => {
    const firstName = 'First Name';
    const lastName = (Math.random() + 1).toString(36).substr(2, 9);

    it('Select Reservation', () => {
        reservation.createReservationWithPayment(
            reservationUnitGroup,
            reservationRatePlan,
            { firstName, lastName }
        );
    });

    it('Change prices', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Travel dates')

        cy.clickMatButton("Change prices")

        cy.clickMatButton("Edit multiple prices")

        cy.formControlName('price', "100")
        
        cy.clickMatRaisedButton("Edit")

        cy.wait(1000)

        cy
        .get('.editable')
        .eq(1)
        .click()

        cy
        .get('apa-time-slice-price')
        .get('input')
        .clear()
        .type("200")
        .type('{enter}')

        cy.wait(1000)

        cy.clickMatRaisedButton('Apply changes')

        cy.contains('has been amended successfully.')
    })

    it('Shorten stay', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Travel dates')

        cy.clickMatButton("Shorten stay")

        cy
        .get('apa-period-of-stay-time-slice.time-slice')
        .eq(0)
        .click()

        cy
        .get('apa-period-of-stay-time-slice.time-slice')
        .eq(3)
        .click()

        cy.clickMatRaisedButton('Shorten stay')

        cy.contains('has been amended successfully.')
    })

    it('Amend stay', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        cy.selectTab('Travel dates')

        cy.clickMatButton("Amend stay")

        cy.setDateRange(moment(new Date()).add(1, 'days'), 1)

        cy.clickMatRaisedButton('Search rates')

        // select the given unit group
        cy
        .get('mat-row')
        .contains(reservationUnitGroup)
        .click()

        // find the given unit group row
        cy
        .get('mat-row')
        .contains(reservationUnitGroup)
        .parent()
        .parent()
        .parent()
        .within(() => {
                
            // find the given rate plan row
            cy
            .get('.offer-info')
            .get('.rate-plan-name')
            .contains(reservationRatePlan)
            .parent()
            .parent('tr')
            .within(() => {
                // click on 
                cy
                .get('.mat-column-actions')
                .contains('Select offer')
                .click()
            })
        })

        cy.clickMatRaisedButton("Apply changes")

        cy.snackBarMessage('has been amended successfully.')
    })

    it('Extras', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Extras')

        cy.wait(1000)

        reservation.addReservationExtras(serviceName);

        cy.wait(1000)

        reservation.deleteExtraFromReservation(serviceName);
    })

    it('Update billing address', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        reservation.updateFolioBillingAddress();
    })

    it('Prepayment notice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(1000)

        cy.matMenuTriggerClick("Invoices")
        
        cy.matMenuItemClick("Prepayment notice")
    
        cy
        .get('mat-header-row')
        .within(() => {
            cy
            .get('mat-checkbox')
            .click()
        })

        cy.clickMatButton("Create prepayment notice")

        cy.matMenuTriggerClick("Download notice")

        cy.wait(3000)
        cy.matMenuTriggerClick("Download notice")

        cy.matMenuItemClick("in English")
    })

    it('Create invoice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(1000)

        cy.matMenuTriggerClick("Invoices")

        cy.matMenuItemClick("Create invoice")

        cy.wait(1000)
        cy.matMenuTriggerClick("Download preview")

        cy.matMenuItemClick("in English")
    })

    it('Add Charges', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(4000)

        reservation.addChargesToFolio(serviceName);
    })

    it('Add payment, create invoice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        cy.selectTab('Folios')
        cy.wait(4000)

        reservation.addPaymentToFolio();

        cy.wait(4000)
        cy.matMenuTriggerClick("Invoices")

        cy.matMenuItemClick("Create invoice")

        cy
        .get('.mat-focus-indicator')
        .contains("Download preview")
        .click()


        cy.matMenuItemClick("in English")
    })

    it('Assign unit, Check in, Check out', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        
        cy.wait(1000)

        cy.clickMatButton('Assign unit')

        cy
        .get('input[data-placeholder="Choose unit"]')
        .click()
        .get('mat-option')
        .eq(0)
        .click()
    
        cy.clickMatRaisedButton("Assign")

        cy.clickMatButton("Check in")

        cy.clickMatRaisedButton("Check in")
    })
})

