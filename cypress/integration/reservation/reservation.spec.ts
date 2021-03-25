import moment = require("moment");
import { Reservation } from "./reservation.po";

const reservation = new Reservation();

context('Apaleo create Reservation', () => {
    const firstName = 'First Name';
    const lastName = (Math.random() + 1).toString(36).substr(2, 9);

    it('Select Reservation', () => {
        reservation.createReservationWithPayment(
            "Double",
            "Non Refundable",
            { firstName, lastName }
        );
    });

    it('Change prices', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Travel dates')

        cy
        .get('.mat-button')
        .contains("Change prices")
        .click()

        cy
        .get('.mat-button')
        .contains("Edit multiple prices")
        .click()

        cy
        .get('input[formcontrolname="price"]')
        .type("100")
        
        cy
        .get('.mat-raised-button')
        .contains("Edit")
        .click()

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

        cy
        .get('.mat-raised-button')
        .contains('Apply changes')
        .click()

        cy
        .contains('has been amended successfully.')

    })

    it('Shorten stay', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Travel dates')

        cy
        .get('.mat-button')
        .contains("Shorten stay")
        .click()

        cy
        .get('apa-period-of-stay-time-slice.time-slice')
        .eq(0)
        .click()

        cy
        .get('apa-period-of-stay-time-slice.time-slice')
        .eq(3)
        .click()

        cy
        .get('.mat-raised-button')
        .contains('Shorten stay')
        .click()

        cy.contains('has been amended successfully.')
    })

    it('Amend stay', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        cy.selectTab('Travel dates')

        cy
        .get('.mat-button')
        .contains("Amend stay")
        .click()

        cy
        .setDateRange(moment(new Date()).add(1, 'days'), 1)

        cy
        .get('.mat-raised-button')
        .contains('Search rates')
        .click()

        // select the given unit group
        cy
        .get('mat-row')
        .contains('Double')
        .click()

        // find the given unit group row
        cy
        .get('mat-row')
        .contains('Double')
        .parent()
        .parent()
        .parent()
        .within(() => {
                
            // find the given rate plan row
            cy
            .get('.offer-info')
            .get('.rate-plan-name')
            .contains('Non Refundable')
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

        cy
        .get('.mat-raised-button')
        .contains("Apply changes")
        .click()

        cy.snackBarMessage('has been amended successfully.')
    })

    it('Extras', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Extras')

        cy.wait(1000)

        reservation.addReservationExtras('Breakfast');

        cy.wait(1000)

        reservation.deleteExtraFromReservation('Breakfast');
    })

    it('Update billing address', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        reservation.updateFolioBillingAddress();
    })

    it('Prepayment notice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(1000)

        cy
        .get('.mat-menu-trigger')
        .contains("Invoices")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("Prepayment notice")
        .click()

        cy
        .get('mat-header-row')
        .within(() => {
            cy
            .get('mat-checkbox')
            .click()
        })

        cy
        .get('.mat-button')
        .contains("Create prepayment notice")
        .click()

        cy
        .get('.mat-menu-trigger')
        .contains("Download notice")
        .click()

        cy.wait(3000)
        cy
        .get('.mat-menu-trigger')
        .contains("Download notice")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("in English")
        .click()
    })

    it('Create invoice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(1000)

        cy
        .get('.mat-menu-trigger')
        .contains("Invoices")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("Create invoice")
        .click()

        cy.wait(1000)
        cy
        .get('.mat-menu-trigger')
        .contains("Download preview")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("in English")
        .click()


        cy.wait(3000)
        cy
        .get('.mat-button')
        .contains("Add payment")
        .click()
        
    })

    it('Add payment, Add Charges and advance invoice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.selectTab('Folios')

        cy.wait(3000)

        reservation.addChargesToFolio('Breakfast');

        reservation.addPaymentToFolio();

        cy.wait(3000)

        cy
        .get('.mat-menu-trigger')
        .contains("Invoices")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("Advance invoice")
        .click()

        // cy
        // .get('mat-header-row')
        // .within(() => {
        //     cy
        //     .get('mat-checkbox')
        //     .click()
        // })
    })

    it('Assign unit, Check in, Check out', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        
        cy.wait(1000)

        cy
        .get('.mat-button')
        .contains("Assign unit")
        .click()

        cy
        .get('input[data-placeholder="Choose unit"]')
        .click()
        .get('mat-option')
        .eq(0)
        .click()
    
        cy
        .get('.mat-raised-button')
        .contains("Assign")
        .click()

        cy
        .get('.mat-button')
        .contains("Check in")
        .click()

        cy
        .get('.mat-raised-button')
        .contains("Check in")
        .click()

    })
})

