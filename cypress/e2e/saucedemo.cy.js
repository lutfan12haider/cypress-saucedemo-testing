// SauceDemo test suite - 8 test cases (matches the presentation)
const BASE = 'https://www.saucedemo.com';
const ITEM = 'sauce-labs-backpack';

const login = (user = 'standard_user', pass = 'secret_sauce') => {
  cy.visit(BASE);
  cy.get('[data-test="username"]').type(user);
  cy.get('[data-test="password"]').type(pass);
  cy.get('[data-test="login-button"]').click();
};

describe('SauceDemo - Cypress test suite', () => {
  it('TC01 - Valid login opens inventory page', () => {
    login();
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
  });

  it('TC02 - Invalid password shows error', () => {
    login('standard_user', 'wrong_password');
    cy.get('[data-test="error"]').should('contain', 'do not match');
  });

  it('TC03 - Locked-out user shows locked message', () => {
    login('locked_out_user', 'secret_sauce');
    cy.get('[data-test="error"]').should('contain', 'locked out');
  });

  it('TC04 - Sort products by price low to high', () => {
    login();
    cy.get('[data-test="product-sort-container"]').select('lohi');
    cy.get('.inventory_item_price').then(($els) => {
      const prices = [...$els].map((e) => parseFloat(e.innerText.replace('$', '')));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it('TC05 - Add item to cart', () => {
    login();
    cy.get(`[data-test="add-to-cart-${ITEM}"]`).click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('TC06 - Remove item from cart', () => {
    login();
    cy.get(`[data-test="add-to-cart-${ITEM}"]`).click();
    cy.get(`[data-test="remove-${ITEM}"]`).click();
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('TC07 - Checkout with empty form shows validation error', () => {
    login();
    cy.get(`[data-test="add-to-cart-${ITEM}"]`).click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain', 'First Name is required');
  });

  it('TC08 - Complete checkout shows order confirmation', () => {
    login();
    cy.get(`[data-test="add-to-cart-${ITEM}"]`).click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Lutfan');
    cy.get('[data-test="lastName"]').type('Haider');
    cy.get('[data-test="postalCode"]').type('75000');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should('contain', 'Thank you for your order');
  });
});
