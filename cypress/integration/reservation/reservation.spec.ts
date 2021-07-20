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
        
        cy.clickMatRaisedButton("Edit").wait(50)

        cy
        .get('.editable')
        .eq(1)
        .click()

        cy
        .get('apa-time-slice-price')
        .get('input')
        .clear()
        .type("200{enter}")

        cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/amend/*').as('amendedReservationsRequest')

        cy.clickMatRaisedButton('Apply changes')


        cy.wait('@amendedReservationsRequest').then(() => {
            cy.snackBarMessage('has been amended successfully.')
        });
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

        cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/amend').as('amendedReservationsRequest')
        cy.intercept('GET', '/booking/v0-nsfw/reservations/*').as('loadReservationsRequest')

        cy.clickMatRaisedButton('Shorten stay')

        cy.wait(['@amendedReservationsRequest', '@loadReservationsRequest']).then(() => {
            cy.get('.mat-button-base').contains('Ok').click().wait(50);
            cy.snackBarMessage('has been amended successfully.')
        });
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
        cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/amend').as('amendedReservationsRequest')
        cy.intercept('GET', '/booking/v0-nsfw/reservations/*').as('loadReservationsRequest')

        cy.clickMatRaisedButton("Apply changes")

        cy.wait(['@amendedReservationsRequest', '@loadReservationsRequest']).then(() => {
            cy.get('.mat-button-base').contains('Ok').click().wait(50);
            cy.snackBarMessage('has been amended successfully.')
        });
    })

    it('Extras', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);
        cy.intercept('GET', '/booking/v0-nsfw/reservations/*/service-offers?*').as('loadServiceOffers')

        cy.selectTab('Extras')

        cy.wait('@loadServiceOffers').then(() => {
            cy.intercept('GET', '/booking/v0-nsfw/reservations/*').as('reloadReservation')

            reservation.addReservationExtras(serviceName); 

            cy.wait('@reloadReservation').then(() => {
                reservation.deleteExtraFromReservation(serviceName);
            });
        });
    })

    it('Update billing address', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.intercept('GET', '/finance/v0-nsfw/folios?reservationIds=*').as('loadReservationFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*').as('loadFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/payments?*').as('loadFolioPayment')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/refunds?*').as('loadFolioRefunds')
        cy.selectTab('Folios')


        cy.wait(['@loadReservationFolio', '@loadFolio', '@loadFolioPayment', '@loadFolioRefunds']).then(() => {
            reservation.updateFolioBillingAddress();
        });
    })

    it('Prepayment notice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.intercept('GET', '/finance/v0-nsfw/folios?reservationIds=*').as('loadReservationFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*').as('loadFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/payments?*').as('loadFolioPayment')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/refunds?*').as('loadFolioRefunds')
        cy.selectTab('Folios')

        cy.wait(['@loadReservationFolio', '@loadFolio', '@loadFolioPayment', '@loadFolioRefunds']).then(() => {
            cy.intercept('GET', '/finance/v0-nsfw/prepayment-notices/preview?*').as('loadPrepaymentNotices');

            cy.matMenuTriggerClick("Invoices")
            cy.matMenuItemClick("Prepayment notice")

            cy.get('mat-header-row')
                .within(() => {
                    cy
                    .get('mat-checkbox')
                    .click()
                })
            
            cy.clickMatButton("Create prepayment notice")

            cy.wait('@loadPrepaymentNotices').then(() => {
                cy.matMenuTriggerClick("Download notice")
                cy.matMenuItemClick("in English")
                
                cy.wait('@loadPrepaymentNotices').then(() => {
                    // check the response  of api
                });
            });
        });
    })

    it('Create invoice', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.intercept('GET', '/finance/v0-nsfw/folios?reservationIds=*').as('loadReservationFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*').as('loadFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/payments?*').as('loadFolioPayment')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/refunds?*').as('loadFolioRefunds')
        cy.selectTab('Folios')

        cy.wait(['@loadReservationFolio', '@loadFolio', '@loadFolioPayment', '@loadFolioRefunds']).then(() => {
            cy.intercept('GET', '/finance/v0-nsfw/invoices/preview-pdf?*').as('loadCreateInvoices');

            cy.matMenuTriggerClick("Invoices")
            cy.matMenuItemClick("Create invoice")
            
            cy.wait('@loadCreateInvoices').then(() => {
                cy.matMenuTriggerClick("Download preview")
                cy.matMenuItemClick("in English")
                
                cy.wait('@loadCreateInvoices').then(() => {
                    // check the response  of api
                });
            });
        });
    })

    it('Add Charges', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.intercept('GET', '/finance/v0-nsfw/folios?reservationIds=*').as('loadReservationFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*').as('loadFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/payments?*').as('loadFolioPayment')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/refunds?*').as('loadFolioRefunds')
        cy.selectTab('Folios')

        cy.wait(['@loadReservationFolio', '@loadFolio', '@loadFolioPayment', '@loadFolioRefunds']).then(() => {
            reservation.addChargesToFolio(serviceName); 
        });
    })

    it('Add payment, create payment', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.intercept('GET', '/finance/v0-nsfw/folios?reservationIds=*').as('loadReservationFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*').as('loadFolio')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/payments?*').as('loadFolioPayment')
        cy.intercept('GET', '/finance/v0-nsfw/folios/*/refunds?*').as('loadFolioRefunds')
        cy.selectTab('Folios')

        cy.wait(['@loadReservationFolio', '@loadFolio', '@loadFolioPayment', '@loadFolioRefunds']).then(() => {
            reservation.addPaymentToFolio();
        });
    })

    it('Assign unit, Check in', () => {
        reservation.goToReservation(`${firstName} ${lastName}`);

        cy.clickMatButton('Assign unit')

        cy
        .get('input[data-placeholder="Choose unit"]')
        .click()
        .get('mat-option')
        .eq(0)
        .click()
        
        cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/assign-unit/*').as('assignUnit')

        cy.clickMatRaisedButton("Assign").wait(50)

        cy.wait('@assignUnit').then(() => {
            cy.snackBarMessage(`has been assigned successfully.`)
            cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/checkin?*').as('checkIn')

            cy.clickMatButton("Check in")
            cy.clickMatRaisedButton("Check in")

            cy.wait('@checkIn').then(() => {
                cy.snackBarMessage(`has been checked in successfully.`)
            });
        });
    })
})
