export const errorCodes = {
  Error600: {
    code: 'Error-600',
    desc: 'Something went wrong',
  },
  Error610: {
    code: 'Error-610',
    desc: 'Connection to api couldn`t be established',
  },
  Error611: {
    code: 'Error-611',
    desc: 'Connection to api timed-out',
  },
  Error620: {
    code: 'Error-620',
    desc: 'No internet connection',
  },
  Error621: {
    code: 'Error-621',
    desc: 'Connection timed-out',
  },
};

export default class ErrorTracker extends Error {
  static isInstanceOf(err) {
    return err && err instanceof Error && err._instance === 'ErrorTracker';
  }

  constructor(initialError, newError = errorCodes.Error600) {
    super(initialError);
    this.error = newError;
    this._instance = 'ErrorTracker';

    return {
      code: this.error.code,
      message: this.error.desc,
      stack: this.stack,
      timestamp: new Date(new Date().getTime()),
    };
  }
}
