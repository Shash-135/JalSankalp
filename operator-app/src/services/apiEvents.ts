type Listener = () => void;

let unauthorizedListeners: Listener[] = [];

export const onUnauthorized = (listener: Listener) => {
  unauthorizedListeners.push(listener);
  return () => {
    unauthorizedListeners = unauthorizedListeners.filter(l => l !== listener);
  };
};

export const emitUnauthorized = () => {
  unauthorizedListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error('Unauthorized listener failed', err);
    }
  });
};
