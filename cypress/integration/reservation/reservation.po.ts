import moment = require("moment")

interface BookingData {
    firstName: string;
    lastName: string;
}

export class Reservation {

    public createReservationWithPayment(unitGroup: string, ratePlan: string, bookingData: BookingData) {
        cy.login()

        cy.navigateToModule('Reservations')

        cy.clickMatButton('New booking')

        cy.setDateRangePicker(moment(new Date()), moment(new Date()).add(10, 'days'))

        cy.clickMatRaisedButton('Search offers')

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

        cy.clickMatRaisedButton('Continue')

        //Booker Form
        cy.formControlName('firstName', bookingData.firstName)
        cy.formControlName('lastName', bookingData.lastName)

        cy.clickMatRaisedButton('Continue')

        //Payment Form
        cy.fillPaymentForm('Verify');

        cy.wait(3000)
        cy.clickMatRaisedButton('Create booking')

        cy.snackBarMessage(`The booking for ${bookingData.lastName} has been created successfully.`)
    }

    public goToReservation(guestName: string) {
        cy.login()

        cy.navigateToModule('Reservations')
        cy.wait(1000);

        cy.formControlName('textSearch', guestName)

        cy.wait(1000);
        
        cy.get('mat-row')
        .contains(guestName)
        .click();
    }    

    public addReservationExtras(serviceName: string) {
        cy.clickMatButton('Add service')

        cy.wait(1000)

        cy.apaSelectFilterSelect('serviceOffer', serviceName);

        cy.clickMatRaisedButton('Add')

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

        cy.matMenuItemClick('Delete')

        cy.clickMatRaisedButton('Yes')
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

        cy.formControlName('addressLine1', billingAddress.addressLine1)
        cy.formControlName('addressLine2', billingAddress.addressLine2)
        cy.formControlName('postalCode', billingAddress.postalCode)
        cy.formControlName('city', billingAddress.city)
        cy.formControlName('countryCode', billingAddress.countryCode)


        cy.clickMatRaisedButton('Save')
    }

    public addChargesToFolio(service: string) {
        cy.clickMatButton('Add charge')
        cy.matMenuItemClick('Charge')
    
        cy.apaSelectFilterSelect("Find or define a charge", service, 'searchplaceholder')

        cy.clickMatRaisedButton('Add')

        cy.wait(2000)

        cy.snackBarMessage(`The charge "${'TEST'}" has been added to the folio`)
    }

    public addPaymentToFolio() {
        const amount = 15;

        cy.clickMatButton('Add payment')

        cy
        .get('.mat-ripple')
        .contains("Other")
        .click()

        cy.clickMatRaisedButton('Next')

        cy
        .get('mat-header-row')
        .within(() => {
            cy
            .get('mat-checkbox')
            .click()
        })

        cy.clickMatRaisedButton('Next')

        cy.formControlName('amount', amount.toString())

        cy.clickMatRaisedButton('Add payment')

        cy.wait(1000)

        cy.snackBarMessage(`The payment has been added to the folio`)
    }
}

