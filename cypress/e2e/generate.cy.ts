describe('QR Generator', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('qr_token', 'mock-token')
    })
    cy.visit('/generate')
  })

  it('should load QR generator page', () => {
    cy.contains('Generate QR Code')
    cy.get('mat-select[ng-reflect-name="type"]').should('be.visible')
    cy.get('qrcode').should('be.visible')
  })

  it('should generate URL QR code', () => {
    cy.intercept('POST', '/api/qr/generate', {
      statusCode: 200,
      body: {
        image: 'data:image/png;base64,mock-image-data',
        imageUrl: 'https://example.com/qr.png'
      }
    }).as('generateQR')

    // Select URL type (should be default)
    cy.get('input[formControlName="url"]').type('https://example.com')
    cy.get('button').contains('Generate QR Code').click()

    cy.wait('@generateQR')
    cy.get('.generated-qr img').should('be.visible')
  })

  it('should switch between QR types', () => {
    // Switch to email type
    cy.get('mat-select').click()
    cy.get('mat-option[value="email"]').click()

    cy.get('input[formControlName="to"]').should('be.visible')
    cy.get('input[formControlName="subject"]').should('be.visible')
    cy.get('textarea[formControlName="body"]').should('be.visible')
  })

  it('should customize QR appearance', () => {
    cy.get('app-style-editor').should('be.visible')

    // Change color
    cy.get('input[type="color"]').first().invoke('val', '#ff0000').trigger('input')

    // Preview should update
    cy.get('qrcode').should('be.visible')
  })

  it('should enable dynamic QR option', () => {
    cy.get('mat-checkbox').contains('Dynamic').click()
    cy.get('input[formControlName="title"]').should('be.visible')
  })
})