'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');
const Brick = require('cta-brick');

/**
 * AfterHandler class
 * @class
 */
class AfterHandler extends Brick {
  /**
   * Create a new AfterHandler instance
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {Object} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    super(cementHelper, config);
    const that = this;
    this.providers = new Map();
    try {
      const providersDirectory = path.join(__dirname, 'providers');
      const providersList = fs.readdirSync(providersDirectory);
      providersList.forEach((providerName) => {
        const providerPath = path.join(__dirname, 'providers', providerName);
        const ProviderConstructor = require(providerPath);
        const providerInstance = new ProviderConstructor(that.cementHelper, that.logger);
        this.providers.set(providerName, providerInstance);
      });
    } catch (error) {
      throw new Error(`loading providers failed: ${error.message}`);
    }
  }

  /**
   * Validates Job properties
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  validate(context) {
    const job = context.data;
    const that = this;
    const superValidate = super.validate.bind(this);

    return co(function* validateCoroutine() {
      yield superValidate(context);

      const type = job.nature.type.trim().toLowerCase();
      if (type !== 'afterhandler') {
        throw (new Error(`type ${job.nature.type} not supported`));
      }

      const quality = job.nature.quality.trim().toLowerCase();
      if (!that.providers.has(quality)) {
        throw (new Error(`quality ${job.nature.quality} not supported`));
      }

      yield that.providers.get(quality).validate(job);

      return { ok: 1 };
    });
  }

  /**
   * Process the context, emit events, create new context and define listeners
   * @param {Context} context - a Context
   */
  process(context) {
    const job = context.data;
    const that = this;
    const quality = job.nature.quality.trim().toLowerCase();
    that.providers.get(quality).process(job)
      .then(function processSuccessCallback(response) {
        const finalResponse = {
          ok: 1,
          job: job,
          response: response,
        };
        context.emit('done', that.name, finalResponse);
        that.ack(context);
      })
      .catch(function processFailCallback(error) {
        const finalResponse = {
          ok: 0,
          job: job,
          error: error,
        };
        context.emit('error', that.name, finalResponse);
        that.ack(context);
      });
  }

  /**
   * Acknowledge a Context
   * @param {Context} context - the Context to acknowledge
   */
  ack(context) {
    const ackJob = {
      nature: {
        type: 'messages',
        quality: 'acknowledge',
      },
      payload: {
        id: context.data.id,
      },
    };
    const output = this.cementHelper.createContext(ackJob);
    output.publish();
  }
}

exports = module.exports = AfterHandler;
