describe('Check Single NodeMovement', () => {
  it('Check Initial State', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[data-test="node"]').should('not.exist')
  })
  it('Create a Single Node', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[data-test="nodeCount"]').contains('0')
    cy.get('[data-test="node"]').should('not.exist')
    cy.get('div[data-test="canvas"]').click()
    cy.get('[data-test="node"]').should('exist')
    cy.get('[data-test="nodeCount"]').contains('1')
  })
  function moveNode (x, y) {
    cy.get('div[data-test="canvas"]')
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: x, clientY: y })
    .trigger('mouseup', { force: true })
  }

  // Made this for fun lol, really satisfying
  it('Create Lots of Nodes and fill up the canvas', () => {
    cy.visit('http://localhost:5173/')
    for(let i = 0;i < 8;i++){
      for(let j = 0;j < 5;j++){
        cy.get('div[data-test="canvas"]').click()
        moveNode(250 + i*100, 150 + j * 100);
      }
    }
    cy.get('[data-test="nodeCount"]').contains('40')
  })
})