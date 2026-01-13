describe('Horses Overview Page', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/Horse', {
            statusCode: 200,
            body: [
                { id: '1', name: 'Spirit', birthYear: 2020, height: 165, sex: 'Male', healthCertificate: '' },
                { id: '2', name: 'Luna', birthYear: 2019, height: 160, sex: 'Female', healthCertificate: 'cert.pdf' },
                { id: '3', name: 'Thunder', birthYear: 2021, height: 170, sex: 'Male', healthCertificate: '' },
                { id: '4', name: 'Daisy', birthYear: 2018, height: 158, sex: 'Female', healthCertificate: '' },
            ]
        }).as('getHorses');

        cy.visit('/horses');
        cy.wait('@getHorses');
    });

    it('should display the horses page header', () => {
        cy.contains('h1', 'Paarden').should('be.visible');
    });

    it('should show the add horse button', () => {
        cy.get('.header__action-btn').should('be.visible');
    });

    it('should display filter tabs with correct counts', () => {
        cy.contains('Alles (4)').should('be.visible');
        cy.contains('Merries (2)').should('be.visible');
        cy.contains('Hengsten (2)').should('be.visible');
    });

    it('should display all horses by default', () => {
        cy.get('app-horse-card').should('have.length', 4);
    });

    it('should display horse names', () => {
        cy.contains('Spirit').should('be.visible');
        cy.contains('Luna').should('be.visible');
        cy.contains('Thunder').should('be.visible');
        cy.contains('Daisy').should('be.visible');
    });

    it('should show birth year and height for horses', () => {
        cy.contains('2020').should('be.visible');
        cy.contains('165 cm').should('be.visible');
    });

    describe('Filtering', () => {
        it('should filter to show only mares when clicking Merries', () => {
            cy.contains('Merries').click();

            cy.get('app-horse-card').should('have.length', 2);
            cy.contains('Luna').should('be.visible');
            cy.contains('Daisy').should('be.visible');
            cy.contains('Spirit').should('not.exist');
        });

        it('should filter to show only stallions when clicking Hengsten', () => {
            cy.contains('Hengsten').click();

            cy.get('app-horse-card').should('have.length', 2);
            cy.contains('Spirit').should('be.visible');
            cy.contains('Thunder').should('be.visible');
            cy.contains('Luna').should('not.exist');
        });

        it('should show all horses when clicking Alles', () => {
            cy.contains('Merries').click();
            cy.get('app-horse-card').should('have.length', 2);

            cy.contains('Alles').click();
            cy.get('app-horse-card').should('have.length', 4);
        });
    });

    describe('Navigation', () => {
        it('should navigate to add horse page when clicking + button', () => {
            cy.get('.header__action-btn').click();
            cy.url().should('include', '/horses/add');
            cy.contains('h1', 'Nieuw paard').should('be.visible');
        });

        it('should navigate back to dashboard via bottom nav', () => {
            cy.contains('.bottom-nav__item', 'Dashboard').click();
            cy.url().should('include', '/dashboard');
        });
    });

    describe('Empty State', () => {
        it('should show empty state message when no horses', () => {
            cy.intercept('GET', '/api/Horse', {
                statusCode: 200,
                body: []
            }).as('getEmptyHorses');

            cy.visit('/horses');
            cy.wait('@getEmptyHorses');

            cy.contains('Geen paarden gevonden').should('be.visible');
            cy.contains('Voeg je eerste paard toe').should('be.visible');
        });

        it('should show add button in empty state', () => {
            cy.intercept('GET', '/api/Horse', {
                statusCode: 200,
                body: []
            }).as('getEmptyHorses');

            cy.visit('/horses');
            cy.wait('@getEmptyHorses');

            cy.contains('Paard toevoegen').should('be.visible');
        });
    });

    describe('Error State', () => {
        it('should show error message when API fails', () => {
            cy.intercept('GET', '/api/Horse', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('getHorsesError');

            cy.visit('/horses');
            cy.wait('@getHorsesError');

            cy.contains('Kon paarden niet laden').should('be.visible');
        });

        it('should show retry button on error', () => {
            cy.intercept('GET', '/api/Horse', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('getHorsesError');

            cy.visit('/horses');
            cy.wait('@getHorsesError');

            cy.contains('Opnieuw proberen').should('be.visible');
        });
    });

    describe('Horse Card Details', () => {
        it('should show sex badge on horse cards', () => {
            cy.contains('Hengst').should('be.visible');
            cy.contains('Merrie').should('be.visible');
        });

        it('should show certificate icon for horses with certificate', () => {
            cy.get('app-horse-card').contains('Luna')
                .parents('app-horse-card')
                .find('.horse-card__certificate')
                .should('exist');
        });
    });
});
