/*
'Escriba el código, aplicando las mejoras prácticas de programación que conozca, para probar de forma automática las siguientes funcionalidades de MercadoLibre:
- Acceder a Mercado Libre Argentina
- Acceder a la categoría Tecnología → Celulares y Teléfonos → SAMSUNG
- Ordenar la lista de resultados por menor precio 
- Validar que: 
  - El precio del primer ítem sea menor que el del segundo de la lista
  - El precio del segundo ítem sea menor que el del último de la lista
Nota: Podrá ser realizado en cualquier herramienta / lenguaje, el archivo a subir podrá ser un ZIP o RAR. 
Debe existir un archivo readme.txt con el siguiente detalle:
  - Herramienta y/o lenguaje utilizado (nombre, versión, etc) 
  - Sistema operativo donde se diseño la prueba
  - Navegador web utilizado para el diseño (modelo y versión)
  - Consideraciones extras (todas las que sean necesarias para su funcionamiento)'
 */

describe('Lista de productos', () => {
  it('El ordenamiento por menor precio funciona segun lo esperado', () => {
    cy.visit('https://www.mercadolibre.com.ar/', {onLoad: () => {
      //cerrar cookies y data de envio
      cy.get("button[data-js='onboarding-cp-close']").click()
      cy.get("button[data-testid='action:understood-button']").click()
      //fue necesario agregar 'force: true' ya que los elementos necesarios para hacer click o sus parents tiene atributo de hidden
      // y es necesario hacer hover sobre los elementos y seguir un path que no tiene sentido replicar en cypress.
      cy.get(".nav-menu").then(menu => {
        cy.wrap(menu).contains("Categorías").click()
        cy.wrap(menu).contains("Tecnología").click({force: true})
        cy.wrap(menu).contains("Celulares y Teléfonos").click({force: true})
      })
      cy.get(".andes-card").contains("SAMSUNG").click()
      //encontre necesario agregar un wait de 1000ms ya que el evento que desplega las opciones de ordenamiento tarda en cargarse.
      cy.get(".andes-floating-menu").wait(1000).then(optionsMenu => {
        cy.wrap(optionsMenu).contains("Más relevantes").click()
        cy.wrap(optionsMenu).contains('Menor precio').click()
      })
      //obtuve los elementos que contienen los precios pero tuve que filtrar los algunos elementos que tienen precio anterior / descuento
      //luego utilizar una funcion para convertir el texto que contiene el precio en un numero ya que venia con un punto para denotar los miles.
      // ya que causaba que los numeros mayores a 1000 sean representados como 1.00
      // realizar un assert que sean 50 ya que es el numero de productos mostrados por pagina por defecto.
      cy.get(".price-tag-text-sr-only").not(':contains("Antes")').should("have.length", 50).then(prices => {
          expect(convertToPrice(prices[0])).to.be.lessThan(convertToPrice(prices[1]))
          expect(convertToPrice(prices[prices.length - 1])).to.be.greaterThan(convertToPrice(prices[prices.length - 2]))
      })
    }})
  })
})

const convertToPrice = element => {
  const regex = /[0-9]+/g;
  const found = element.innerText.match(regex);
  if (found.length === 1) return Number(found[0])
  return Number(`${found[0]}.${found[1]}`)
}