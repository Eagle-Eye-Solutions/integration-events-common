jest.mock('newrelic', () => ({
  addCustomAttribute: jest.fn(),
  startWebTransaction: jest.fn(),
  getTransaction: jest.fn(),
  endTransaction: jest.fn(),
  addCustomAttributes: jest.fn(),
  noticeError: jest.fn(),
  getBrowserTimingHeader: jest.fn(),
  shutdown: jest.fn(),
}));
