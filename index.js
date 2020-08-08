'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    let target = findTargetHost(this, app);
    let optInAutotrackingShim = this._optInAutotracking(this._config(target))
      ? `vendor/${this.name}/with-autotracking.js`
      : `vendor/${this.name}/without-autotracking.js`;

    target.import(optInAutotrackingShim, {
      using: [{ transformation: 'amd', as: `${this.name}/-feature-flags` }]
    });
  },

  _optInAutotracking(options) {
    let optInAutotracking = options.autotracking;
    return (optInAutotracking !== undefined) ? optInAutotracking : true;
  },

  _config(app) {
    return app.options[this.name] || {};
  }

};

function findTargetHost(addon, app) {
  let target = app

  // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
  // use that.
  if (typeof addon._findHost === 'function') {
    target = addon._findHost()
  }

  // Otherwise, we'll use this implementation borrowed from the _findHost()
  // method in ember-cli.
  // Keep iterating upward until we don't have a grandparent.
  // Has to do this grandparent check because at some point we hit the project.
  let current = addon
  do {
    target = current.app || app
  } while (current.parent.parent && (current = current.parent))

  return target
}
