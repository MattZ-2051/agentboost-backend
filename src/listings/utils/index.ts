export const fetchWithTimeout = (callback, input, init, timeout = 3000) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, timeout);

  return callback();
};

// export const wait = (timeout) =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(), timeout);
//   });
