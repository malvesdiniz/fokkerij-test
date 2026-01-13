describe('Add Horse Form', () => {
  beforeEach(() => {
    cy.visit('/horses/add');
  });

  it('should display the add horse form', () => {
    cy.contains('h1', 'Nieuw paard').should('be.visible');
    cy.get('form.horse-form').should('exist');
  });

  it('should have all form fields', () => {
    cy.get('#name').should('exist');
    cy.get('#sex').should('exist');
    cy.get('#birthYear').should('exist');
    cy.get('#height').should('exist');
    cy.get('#healthCertificate').should('exist');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();

    cy.get('#name').should('have.class', 'form-input--error');
    cy.contains('Dit veld is verplicht').should('be.visible');
  });

  it('should fill out form correctly', () => {
    cy.get('#name').type('Spirit');
    cy.get('#name').should('have.value', 'Spirit');

    cy.get('#sex').select('Male');
    cy.get('#sex').should('have.value', 'Male');

    cy.get('#birthYear').should('not.have.value', '');

    cy.get('#height').type('165');
    cy.get('#height').should('have.value', '165');
  });

  it('should navigate back when clicking back button', () => {
    cy.visit('/dashboard');
    cy.visit('/horses/add');

    cy.get('.header__back-btn').click();

    cy.url().should('include', '/dashboard');
  });

  it('should have the submit button', () => {
    cy.contains('button', 'Paard opslaan').should('be.visible');
  });

  describe('Form Validation', () => {
    it('should validate name minimum length', () => {
      cy.get('#name').type('A');
      cy.get('#name').blur();

      cy.contains('Minimaal 2 karakters').should('be.visible');
    });

    it('should validate height minimum', () => {
      cy.get('#height').type('10');
      cy.get('#height').blur();

      cy.contains('Minimale waarde is 50').should('be.visible');
    });

    it('should validate height maximum', () => {
      cy.get('#height').type('300');
      cy.get('#height').blur();

      cy.contains('Maximale waarde is 250').should('be.visible');
    });
  });

  describe('Form Submission', () => {
    it('should submit form when all fields are valid', () => {
      cy.intercept('POST', '/api/Horse', {
        statusCode: 200,
        body: {
          id: 'test-id-123',
          name: 'Spirit',
          birthYear: 2020,
          height: 165,
          sex: 'Male',
          healthCertificate: '',
        },
      }).as('createHorse');

      cy.get('#name').type('Spirit');
      cy.get('#sex').select('Male');
      cy.get('#height').type('165');
      cy.get('button[type="submit"]').click();
      cy.wait('@createHorse');

      cy.contains('Paard succesvol opgeslagen').should('be.visible');
    });

    it('should show error toast on API failure', () => {
      cy.intercept('POST', '/api/Horse', {
        statusCode: 500,
        body: { error: 'Server error' },
      }).as('createHorseError');

      cy.get('#name').type('Spirit');
      cy.get('#sex').select('Male');
      cy.get('#height').type('165');
      cy.get('button[type="submit"]').click();

      cy.wait('@createHorseError');

      cy.contains('Er is een fout opgetreden').should('be.visible');
    });
  });
});
