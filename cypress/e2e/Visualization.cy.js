describe('Visualization', () => {
  function moveNode (x, y) {
    cy.get('div[data-test="canvas"]')
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: x, clientY: y })
    .trigger('mouseup', { force: true })
  }

  it('Check 3 nodes with same strategy 1', () => {
    cy.visit('http://localhost:5173/')
    

    cy.get('div[data-test="canvas"]').click()
    moveNode(300, 350);

    cy.get('div[data-test="canvas"]').click()
    moveNode(675, 350);

    cy.wait(100)

    cy.get('[data-test="node"]').click({multiple: true})

    cy.get('[data-test="player1Of0"]').select('Player 2')
    cy.get('[data-test="player2Of0"]').select('Player 1')
    cy.get('[data-test="nodeStrategy1Selector0"]').select('Strategy 1')
    cy.get('[data-test="nodeStrategy2Selector0"]').select('Strategy 1')
    cy.get('[data-test="saveChanges0"]').click()

    cy.get('[data-test="player1Of1"]').select('Player 2')
    cy.get('[data-test="player2Of1"]').select('Player 1')
    cy.get('[data-test="nodeStrategy1Selector1"]').select('Strategy 2')
    cy.get('[data-test="nodeStrategy2Selector1"]').select('Strategy 2')
    cy.get('[data-test="saveChanges1"]').click()


    cy.get('[data-test="visualizeButton"]').click()
  })
})