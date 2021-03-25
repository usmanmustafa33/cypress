import moment = require("moment")

interface BookingData {
    firstName: string;
    lastName: string;
}

export class Reservation {

    public createReservationWithPayment(unitGroup: string, ratePlan: string, bookingData: BookingData) {
        cy.login()

        cy.navigateToModule('Reservations')

        cy
        .get('.mat-button')
        .contains('New booking')
        .click()

        cy.setDateRangePicker(
            moment(new Date()),
            moment(new Date()).add(10, 'days')
        )

        cy
        .get('.mat-raised-button')
        .contains('Search offers')
        .click()

        // select the given unit group
        cy.get('mat-row')
        .contains(unitGroup)
        .click()

        // find the given unit group row
        cy.get('mat-row')
        .contains(unitGroup)
        .parent()
        .parent('mat-row')
        .within(() => {

            // select rate plan container
            cy.get('.rate-plans-offers')
            .within(() => {
                
                // find the given rate plan row
                cy.get('.offer-info')
                .get('.rate-plan-name')
                .contains(ratePlan)
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
        })

        cy
        .get('.mat-raised-button')
        .contains('Continue')
        .click()

        //Booker Form
        cy.get('input[formcontrolname="firstName"]')
        .type(bookingData.firstName)
        cy.get('input[formcontrolname="lastName"]')
        .type(bookingData.lastName)

        cy
        .get('.mat-raised-button')
        .contains('Continue')
        .click()

        //Payment Form
        cy.fillPaymentForm('Verify');

        cy.wait(3000)
        cy
        .get('.mat-raised-button')
        .contains('Create booking')
        .click()

        cy.snackBarMessage(`The booking for ${bookingData.lastName} has been created successfully.`)
        
        //cy.url().should('include', '/reservations?status=Confirmed&status=InHouse')
        // cy.get('.main-info').contains('First Name Last Name');
    }

    public goToReservation(guestName: string) {
        cy.login()

        cy.navigateToModule('Reservations')
        cy.wait(1000);

        cy.get('input[formcontrolname="textSearch"]')
        .type(guestName)

        cy.wait(1000);
        
        cy.get('mat-row')
        .contains(guestName)
        .click();

        // cy.url().should('include', `/actions`)
        // cy.get('.main-info').contains(guestName);
    }    

    public addReservationExtras(serviceName: string) {
        cy
        .get('.mat-button')
        .contains("Add service")
        .click()

        cy.wait(1000)

        cy
        .get(`apa-select-filter[formcontrolname="serviceOffer"]`)
        .click()
        .get('mat-option')
        .contains(serviceName)
        .click()

        cy
        .get('.mat-raised-button')
        .contains("Add")
        .click()

        cy.snackBarMessage('has been updated successfully.')
    }

    public deleteExtraFromReservation(serviceName: string) {
        cy
        .get('mat-row')
        .contains(serviceName)
        .parent()
        .within(() => {
            cy
            .get('.cdk-column-actions')
            .within(() => {
                cy
                .get('.mat-button-base')
                .click()    
            })
        })

        cy
        .get('.mat-menu-item')
        .contains('Delete')
        .click()

        cy
        .get('.mat-raised-button')
        .contains('Yes')
        .click()
    }

    public updateFolioBillingAddress() {
        const billingAddress = {
            addressLine1: 'addressLine1',
            addressLine2: 'addressLine2',
            postalCode: '123456',
            city: 'Berlin',
            countryCode: 'DE'
        }

        cy.selectTab('Folios')

        cy.wait(1000)

        cy
        .get('.folio-billing-address')
        .click()

        cy
        .get('input[formcontrolname="addressLine1"]')
        .clear()
        .type(billingAddress.addressLine1)

        cy
        .get('input[formcontrolname="addressLine2"]')
        .clear()
        .type(billingAddress.addressLine2)

        cy
        .get('input[formcontrolname="postalCode"]')
        .clear()
        .type(billingAddress.postalCode)

        cy
        .get('input[formcontrolname="city"]')
        .clear()
        .type(billingAddress.city)

        cy
        .get('input[formcontrolname="countryCode"]')
        .clear()
        .type(billingAddress.countryCode)

        cy
        .get('.mat-raised-button')
        .contains("Save")
        .click()
    }

    public addChargesToFolio(service: string) {
        cy
        .get('.mat-button')
        .contains("Add charge")
        .click()

        cy
        .get('.mat-menu-item')
        .contains("Charge")
        .click()

        cy
        .get('apa-select-filter[searchplaceholder="Find or define a charge"]')
        .click()
        .get('mat-option')
        .contains(service)
        .click()

        cy
        .get('.mat-raised-button')
        .contains("Add")
        .click()

        cy.wait(1000)
    }

    public addPaymentToFolio() {
        const paymentDetail = {
            primaryMethod:   'Other Payment Method',
            amount: 15
        };

        cy
        .get('.mat-button')
        .contains("Add payment")
        .click()
        
        cy.matSelectInput('primaryMethod', paymentDetail.primaryMethod)

        cy.get('input[formcontrolname="amount"]')
        .clear()
        .type(paymentDetail.amount.toString())

        cy
        .get('.mat-raised-button')
        .contains("Add")
        .click()

        cy.wait(1000)
    }
}

