describe('Batch Upload', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('qr_token', 'mock-token')
    })
    cy.visit('/batch')
  })

  it('should load batch upload page', () => {
    cy.contains('Batch Upload')
    cy.get('textarea').should('be.visible')
    cy.get('button').contains('Load Example').should('be.visible')
  })

  it('should load example CSV', () => {
    cy.get('button').contains('Load Example').click()
    cy.get('textarea').should('not.be.empty')
  })

  it('should process batch CSV', () => {
    cy.intercept('POST', '/api/qr/batch', {
      statusCode: 200,
      body: [
        { success: true, id: '1', imageUrl: 'https://example.com/qr1.png' },
        { success: true, id: '2', shortUrl: 'https://short.ly/abc123' },
        { success: false, errors: 'Invalid data format' }
      ]
    }).as('batchProcess')

    const csvData = 'type,data,options,title\nurl,"https://example.com","{}","Test"'
    cy.get('textarea').type(csvData)
    cy.get('button').contains('Process Batch').click()

    cy.wait('@batchProcess')
    cy.contains('Batch Results').should('be.visible')
    cy.contains('2').should('be.visible') // successful count
    cy.contains('1').should('be.visible') // failed count
  })

  it('should download results', () => {
    // First process a batch
    cy.intercept('POST', '/api/qr/batch', {
      statusCode: 200,
      body: [{ success: true, id: '1' }]
    }).as('batchProcess')

    cy.get('textarea').type('type,data\nurl,"https://example.com"')
    cy.get('button').contains('Process Batch').click()
    cy.wait('@batchProcess')

    // Download results
    cy.get('button').contains('Download Results CSV').should('be.visible')
  })
})