const NodeEnv = require('jest-environment-node').TestEnvironment;

try {
  const { ModuleMocker } = require('jest-mock');
  if (ModuleMocker && !ModuleMocker.prototype.clearMocksOnScope) {
    ModuleMocker.prototype.clearMocksOnScope = function (scope) {
      if (!scope) return;
      for (const key of Object.keys(scope)) {
        const value = scope[key];
        if (value != null && (typeof value === 'object' || typeof value === 'function') && '_isMockFunction' in value && this.isMockFunction(value) && typeof value.mockClear === 'function') {
          value.mockClear();
        }
      }
    };
  }
} catch (e) {
  // Ignore
}

module.exports = NodeEnv;
