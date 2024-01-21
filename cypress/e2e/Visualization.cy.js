describe('Visualization', () => {
  function moveNode (x, y) {
    cy.get('div[data-test="canvas"]')
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: x, clientY: y })
    .trigger('mouseup', { force: true })
  }

  it('Check 3 nodes with same strategy', () => {
    cy.visit('http://localhost:5173/')
    

    cy.get('div[data-test="canvas"]').click()
    moveNode(300, 350);

    cy.get('div[data-test="canvas"]').click()
    moveNode(675, 350);

    cy.wait(100)

    cy.get('[data-test="node"]').click({multiple: true})

    cy.get('[data-test="player1Of0"]').select('Player 2')
    cy.get('[data-test="player2Of0"]').select('Player 1')
    cy.get('[data-test="nodeStrategy1Selector0"]').select('Always Cooperate')
    cy.get('[data-test="nodeStrategy2Selector0"]').select('Always Cooperate')
    cy.get('[data-test="saveChanges0"]').click()

    cy.get('[data-test="player1Of1"]').select('Player 2')
    cy.get('[data-test="player2Of1"]').select('Player 1')
    cy.get('[data-test="nodeStrategy1Selector1"]').select('Always Defect')
    cy.get('[data-test="nodeStrategy2Selector1"]').select('Always Defect')
    cy.get('[data-test="saveChanges1"]').click()


    cy.get('[data-test="visualizeButton"]').click()

    cy.wait(2000);

    cy.get('[data-test="playerPoints0"]').contains('1');
    cy.get('[data-test="playerPoints1"]').contains('1');

    cy.wait(2000);

    cy.get('[data-test="playerPoints0"]').contains('3');
    cy.get('[data-test="playerPoints1"]').contains('3');
  })
})