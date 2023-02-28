describe('Mercadolibre lista de productos', () => {
  it('el ordenamiento por menor precio funciona segun lo esperado', () => {
    //visit mercadolibre argentina page
    cy.visit('https://www.mercadolibre.com.ar/')
    cy.get("button[data-js='onboarding-cp-close']").click()
    cy.get("button[data-testid='action:understood-button']").click()
    cy.get("li.nav-menu-item").then(menu => {
      cy.wrap(menu).find("a.nav-menu-categories-link").invoke("show").click()
      cy.wrap(menu).find("a").contains("Tecnología").click({force: true})
      cy.wrap(menu).find("a").contains("Celulares y Teléfonos").click({force: true})
    })
    cy.get("h3").contains("SAMSUNG").click()
    cy.wait(3000)
    cy.get(".ui-search-view-options__container").should("be.visible").then(optionsMenu => {
      cy.wrap(optionsMenu).find("button[aria-haspopup='listbox']").trigger('mouseover').click()
      cy.wrap(optionsMenu).find("span").contains('Menor precio').click()
    })
    cy.get(".price-tag-fraction").then(prices => {
      expect(Number(prices[0].innerText)).to.be.lessThan(Number(prices[1].innerText))
      expect(Number(prices[prices.length - 1].innerText)).to.be.greaterThan(Number(prices[prices.length - 2].innerText))
    })
  })
})