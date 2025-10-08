describe('Tasks app - messy tests', () => {

  let data;

  before(() => {
    cy.fixture('testInputs').then((testData) => {
      data = testData;
    });
  });
  beforeEach(() => {
    cy.visit('/');
    cy.get('#taskForm').should('exist');
  });

    it('validation shows error if title missing', () => {
    cy.get('#save').click();
    cy.get('#titleError').should('be.visible');
  });

  it('add task and check priority badge', () => {
    const task = data.tasks.highPriority;

    cy.get('#title').type(task.title);
    cy.get('#description').type(task.description);
    cy.get('input[type="date"]').type(task.date);
    cy.get('#priority').select(task.priority);
    cy.get('#save').click();

    cy.wait(300);

    cy.contains('#taskList li', task.title).should('exist');
    cy.contains('#taskList li', task.title).find(`.badge.${task.priority}`).should('exist');
  });

  it('complete and filter', () => {
    const { firstTask, secondTask } = data.tasks.completion;

    cy.get('#title').type(firstTask);
    cy.get('#save').click();

    cy.get('#title').type(secondTask);
    cy.get('#save').click();

    cy.contains('#taskList li', firstTask)
      .find('input[type="checkbox"]')
      .check();

    cy.get('#filterStatus').select('completed');
    cy.contains('#taskList li', firstTask).should('exist');
    cy.contains('#taskList li', secondTask).should('not.exist');
  });

  it('edit flow', () => {
    const { original, edited } = data.tasks.editFlow;

    cy.get('#title').type(original);
    cy.get('#save').click();

    cy.contains('#taskList li', original)
      .find('button')
      .contains('Edit')
      .click();

    cy.get('#title').clear().type(edited);
    cy.get('#save').click();

    cy.contains('#taskList li', edited).should('exist');
  });

  it('delete task', () => {
    const task = data.tasks.deleteFlow;

    cy.get('#title').type(task.title);
    cy.get('#save').click();

    cy.contains('#taskList li', task.title)
      .find('button')
      .contains('Delete')
      .click();

    cy.contains('#taskList li', task.title).should('not.exist');
  });

  // Reset form functionality check
  it('checks resetForm functionality', () => {
    const task = data.tasks.resetCheck;

    cy.get('#title').type(task.title);
    cy.get('#description').type(task.description);
    cy.get('input[type="date"]').type(task.date);
    cy.get('#priority').select(task.priority);

    cy.get('#reset').click();

    cy.get('#title').should('have.value', '');
    cy.get('#description').should('have.value', '');
    cy.get('input[type="date"]').should('have.value', '');
    cy.get('#priority').should('have.value', 'medium'); // default value check
  });
});
