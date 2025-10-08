Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('form.reset is not a function')) {
    return false
  }
})
