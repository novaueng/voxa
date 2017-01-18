'use strict';

// Include the state machine module, the state machine,
// the responses and variables to be used in this skill
const skill = require('./MainStateMachine');

exports.handler = function handler(event, context) {
  skill.execute(event)
    .then(context.succeed)
    .catch(context.fail);
};
