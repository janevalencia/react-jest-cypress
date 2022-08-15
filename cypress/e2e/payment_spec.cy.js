/**
 * Test Suite: PAYMENT
 * Author: Jane Valencia
 * Created On: 15 August 2022
 */
describe("payment", () => {
  // Test Case 1: User should be able to make payment.
  it("Verify user should be able to make payment.", () => {
    // Visit our site running on local.
    cy.visit("http://localhost:3000/");

    // Login to user test account.
    cy.get("#username").type("johndoe");
    cy.get("#password").type("s3cret");
    cy.get("button")
      .contains(/sign in/i)
      .click();

    // Assertion 1: upon successful login, the url should have notifications.
    cy.get("[data-test=sidenav-user-balance]").should("exist");

    // Click on New button.
    cy.get("[data-test=nav-top-new-transaction]").click();

    // Assertion 2: New payment should open up a search input for payee.
    cy.get("#user-list-search-input").should("exist");

    // Search for payee i.e. Devon Becker.
    cy.get("#user-list-search-input").type("devon becker");
    cy.contains("Devon Becker").click();

    // Assertion 3: Upon successfully click on payee, the payment form should open up.
    cy.get("#amount").should("exist");
    cy.get("#transaction-create-description-input").should("exist");

    // Assertion 4: At the start up of the form, PAY button should be disabled.
    cy.get("[data-test=transaction-create-submit-payment]").should("be.disabled");

    // Add $ amount.
    let amt = "10";
    cy.get("#amount").type(amt);

    // Assertion 5: After entering just an amount, PAY button should still be disabled.
    cy.get("[data-test=transaction-create-submit-payment]").should("be.disabled");

    // Add a transaction note.
    let timestamp = new Date().toUTCString();
    let note = `e2e test make payment of $10 by janev ${timestamp}`;
    cy.get("#transaction-create-description-input").type(note);

    // Assertion 6: After entering both amount and note, PAY button should now be enabled.
    // Execute payment if assertion passes.
    cy.get("[data-test=transaction-create-submit-payment]").should("be.enabled").click();

    // Return to transaction list.
    cy.get("[data-test=new-transaction-return-to-transactions]").should("exist").click();

    // Go to personal payment.
    cy.get("[data-test=nav-personal-tab]").should("exist").click();

    // Assertion 8: Transaction list should contain a transaction note of recent payment made.
    cy.contains(/personal/i);
    cy.get("li").contains(note).click({ force: true });

    // Assertion 9: Transaction item can be accessed and open up Transaction Detail.
    cy.get("[data-test=transaction-detail-header]").should("exist");

    // Assertion 10: Transaction detail should contain the amount paid.
    cy.contains(`-$${amt}`).should("be.visible");

    // Assertion 11: Transaction detail should contain the note.
    cy.get("[data-test=transaction-description]").contains(note).should("be.visible");
  });

  // Test Case 2: Account balance gets deducted correctly upon successful payment.
  it("Verify once payment is made, the account balance gets deducted.", () => {
    // Visit our site running on local.
    cy.visit("http://localhost:3000/");

    // Login to user test account.
    cy.get("#username").type("johndoe");
    cy.get("#password").type("s3cret");
    cy.get("button")
      .contains(/sign in/i)
      .click();

    // Assertion 1: upon successful login, the url should have notifications.
    cy.get("[data-test=sidenav-user-balance]").should("exist");

    // Extract the existing account balance.
    let ogBalance;
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      ogBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
    });

    // Click on New button.
    cy.get("[data-test=nav-top-new-transaction]").click();

    // Search for payee i.e. Devon Becker.
    cy.get("#user-list-search-input").type("devon becker");
    cy.contains("Devon Becker").click();

    // Add $ amount.
    let amt = "10";
    cy.get("#amount").type(amt);

    // Add a transaction note.
    let timestamp = new Date().toUTCString();
    let note = `e2e test make payment of ${amt} by janev ${timestamp}`;
    cy.get("#transaction-create-description-input").type(note);

    // Execute payment.
    cy.get("[data-test=transaction-create-submit-payment]").should("be.enabled").click();

    // Assertion 2: Original balance should be deducted by the amount being paid.
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      const newBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
      expect(ogBalance - newBalance).to.equal(parseFloat(amt));
    });
  });
});
