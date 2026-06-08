const RTR = require('react-test-renderer');
const React = require('react');

// Retrieve ReactTestInstance prototype dynamically and patch it
try {
  let dummy;
  // Use RTR.act to ensure the component is mounted in React 19 before accessing .root
  RTR.act(() => {
    dummy = RTR.create(React.createElement('View'));
  });
  const ReactTestInstanceProto = Object.getPrototypeOf(dummy.root);
  if (ReactTestInstanceProto) {
    if (!ReactTestInstanceProto.queryAll) {
      ReactTestInstanceProto.queryAll = function (predicate) {
        return this.findAll(predicate);
      };
    }
    if (!ReactTestInstanceProto.query) {
      ReactTestInstanceProto.query = function (predicate) {
        try {
          return this.find(predicate);
        } catch (e) {
          return null;
        }
      };
    }
  }
  RTR.act(() => {
    dummy.unmount();
  });
} catch (e) {
  // Ignore
}

// Implement createRoot
function createRoot(options) {
  let instance = null;
  return {
    render(element) {
      if (!instance) {
        instance = RTR.create(element, options);
      } else {
        instance.update(element);
      }
    },
    unmount() {
      if (instance) {
        try {
          RTR.act(() => {
            instance.unmount();
          });
        } catch (e) {
          instance.unmount();
        }
      }
    },
    get container() {
      // In the new test-renderer, container acts as the root node
      return instance ? instance.root : null;
    }
  };
}

module.exports = {
  createRoot,
  act: RTR.act,
  create: RTR.create,
  unstable_batchedUpdates: RTR.unstable_batchedUpdates
};
