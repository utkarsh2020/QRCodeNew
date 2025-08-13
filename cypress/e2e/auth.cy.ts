describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth')
  })

  it('should display login form by default', () => {
    cy.contains('Welcome Back')
    cy.get('input[formControlName="email"]').should('be.visible')
    cy.get('input[formControlName="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
  })

  it('should switch to registration form', () => {
    cy.contains('Sign up').click()
    cy.contains('Create Account')
    cy.get('input[formControlName="confirmPassword"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign Up')
  })

  it('should show validation errors for invalid input', () => {
    cy.get('button[type="submit"]').click()
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName="password"]').should('have.class', 'ng-invalid')
  })

  it('should attempt login with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' }
      }
    }).as('loginRequest')

    cy.get('input[formControlName="email"]').type('test@example.com')
    cy.get('input[formControlName="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')
  })
})