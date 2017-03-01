'use strict';

const _ = require('lodash');

class Model {
  constructor(data) {
    _.assign(this, data);
  }

  static fromEvent(alexaEvent) {
    return new Model(alexaEvent.session.attributes.data);
  }

  serialize() {
    return this;
  }
}

module.exports = Model;