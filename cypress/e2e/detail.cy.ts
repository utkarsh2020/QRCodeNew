describe('QR Detail Page', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('qr_token', 'mock-token')
    })
  })

  it('should load QR detail page', () => {
    cy.intercept('GET', '/api/qr/123', {
      statusCode: 200,
      body: {
        id: '123',
        type: 'url',
        data: 'https://example.com',
        title: 'Test QR',
        isDynamic: true,
        createdAt: '2024-01-01T00:00:00Z',
        options: { width: 256, color: '#000000' }
      }
    }).as('getQR')

    cy.visit('/qr/123')
    cy.wait('@getQR')

    cy.contains('Test QR')
    cy.contains('Dynamic QR Code')
    cy.get('qrcode').should('be.visible')
  })

  it('should update QR code', () => {
    cy.intercept('GET', '/api/qr/123', {
      statusCode: 200,
      body: {
        id: '123',
        type: 'url',
        data: 'https://example.com',
        title: 'Test QR',
        isDynamic: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    }).as('getQR')

    cy.intercept('PATCH', '/api/qr/123', {
      statusCode: 200,
      body: {
        id: '123',
        type: 'url',
        data: 'https://updated.com',
        title: 'Updated QR',
        isDynamic: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    }).as('updateQR')

    cy.visit('/qr/123')
    cy.wait('@getQR')

    // Update title
    cy.get('input[formControlName="title"]').clear().type('Updated QR')

    // Update data
    cy.get('textarea[formControlName="data"]').clear().type('"https://updated.com"')

    // Save changes
    cy.get('button').contains('Save Changes').click()
    cy.wait('@updateQR')
  })

  it('should delete QR code', () => {
    cy.intercept('GET', '/api/qr/123', {
      statusCode: 200,
      body: {
        id: '123',
        type: 'url',
        data: 'https://example.com',
        title: 'Test QR',
        isDynamic: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    }).as('getQR')

    cy.intercept('DELETE', '/api/qr/123', {
      statusCode: 204
    }).as('deleteQR')

    cy.visit('/qr/123')
    cy.wait('@getQR')

    // Mock confirmation dialog
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('button').contains('Delete').click()
    cy.wait('@deleteQR')
    cy.url().should('include', '/dashboard')
  })
})