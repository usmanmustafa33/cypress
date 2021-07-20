import moment = require("moment")

interface BookingData {
    firstName: string;
    lastName: string;
}

export class Reservation {

    public createReservationWithPayment(unitGroup: string, ratePlan: string, bookingData: BookingData) {
        cy.login()

        cy.intercept('/booking/v0-nsfw/reservations?*').as('loadReservationsListPage')
        cy.navigateToModule('Reservations')

        cy.wait('@loadReservationsListPage').then(() => {

            cy.url().should('include', '/reservations?status=Confirmed,InHouse&pageNumber=1&pageSize=50')
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
            cy.fillPaymentForm('Verify').then(() => {
                cy.intercept('POST', '/booking/v0-nsfw/bookings').as('createReservationsRequest')
    
                cy.clickMatRaisedButton('Create booking')
    
                cy.wait('@createReservationsRequest').then(() => {
                    cy.snackBarMessage(`The booking for ${bookingData.lastName} has been created successfully.`)
                });
            });
           
        });
    }

    public goToReservation(guestName: string) {
        cy.login()
        cy.intercept('/booking/v0-nsfw/reservations?*').as('loadReservationsListPage')
        cy.intercept({
            method: 'GET',
            pathname: '/booking/v0-nsfw/reservations',
            query: {
                'propertyIds': 'BER',
                'status':'Confirmed,InHouse',
                'textSearch': guestName,
                'pageNumber': '1',
                'pageSize': '50',
                'expand':'actions,company,assignedUnits'
            }
        }).as('searchReservationsListPage')

        cy.navigateToModule('Reservations')

        cy.wait('@loadReservationsListPage').then(() => {

            cy.formControlName('textSearch', guestName)

            cy.wait('@searchReservationsListPage').then(() => {

                cy.intercept('GET' ,'/booking/v0-nsfw/reservations/*').as('loadReservationsDetailPage')

                cy
                .get('mat-row')
                .contains(guestName)
                .click(); 
                
                cy.wait('@loadReservationsDetailPage').then(() => {
                    cy.url().should('include', '/actions')
                });
            });            
        });
    }    

    public addReservationExtras(serviceName: string) {
        cy.clickMatButton('Add service')

        cy.intercept('PUT', '/booking/v0-nsfw/reservation-actions/*/book-service').as('loadBookService')

        cy.apaSelectFilterSelect('serviceOffer', serviceName);

        cy.clickMatRaisedButton('Add')

        cy.wait('@loadBookService').then(() => {
            cy.snackBarMessage('has been updated successfully.')
        });
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
        cy.intercept('DELETE', '/booking/v0-nsfw/reservations/*/services?*').as('deleteBookService')

        cy.matMenuItemClick('Delete')

        cy.clickMatRaisedButton('Yes')

        cy.wait('@deleteBookService').then(() => {
            cy.snackBarMessage('has been updated successfully.')
        });
    }

    public updateFolioBillingAddress() {
        const billingAddress = {
            addressLine1: 'addressLine1',
            addressLine2: 'addressLine2',
            postalCode: '123456',
            city: 'Berlin',
            countryCode: 'DE'
        }

        cy
        .get('.folio-billing-address')
        .click()

        cy.formControlName('addressLine1', billingAddress.addressLine1)
        cy.formControlName('addressLine2', billingAddress.addressLine2)
        cy.formControlName('postalCode', billingAddress.postalCode)
        cy.formControlName('city', billingAddress.city)
        cy.formControlName('countryCode', billingAddress.countryCode)

        cy.intercept('PATCH', '/finance/v0-nsfw/folios/*').as('patchFolio')

        cy.clickMatRaisedButton('Save')

        cy.wait('@patchFolio').then(() => {
            cy.snackBarMessage('has been saved successfully.')
        });
    }

    public addChargesToFolio(service: string) {
        cy.clickMatButton('Add charge')
        cy.matMenuItemClick('Charge')
    
        cy.apaSelectFilterSelect("Find or define a charge", service, 'searchplaceholder')

        cy.intercept('POST', '/finance/v0-nsfw/folio-actions/*/charges').as('addCharges')

        cy.clickMatRaisedButton('Add')

        cy.wait('@addCharges').then(() => {
            cy.snackBarMessage(`The charge "${service}" has been added to the folio`)
        });
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

        cy.intercept('POST', '/finance/v0-nsfw/folios/*/payments').as('addPayments')

        cy.clickMatRaisedButton('Add payment')

        cy.wait('@addPayments').then(() => {
            cy.snackBarMessage(`The payment has been added to the folio`)
        });
    }
}

