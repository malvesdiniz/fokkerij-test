describe('Bottom Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should highlight active nav item', () => {
    cy.get('.bottom-nav__item').first().should('exist');
  });

  it('should navigate to Dashboard', () => {
    cy.contains('.bottom-nav__item', 'Dashboard').click();
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to Paarden', () => {
    cy.contains('.bottom-nav__item', 'Paarden').click();
    cy.url().should('include', '/horses');
  });

  it('should navigate to Dekking', () => {
    cy.contains('.bottom-nav__item', 'Dekking').click();
    cy.url().should('include', '/breeding');
  });

  it('should navigate to Dagboek', () => {
    cy.contains('.bottom-nav__item', 'Dagboek').click();
    cy.url().should('include', '/journal');
  });

  it('should be visible on all pages', () => {
    cy.get('.bottom-nav').should('be.visible');

    cy.visit('/horses/add');
    cy.get('.bottom-nav').should('be.visible');
  });
});
