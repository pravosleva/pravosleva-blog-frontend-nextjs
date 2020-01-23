export const makeCounter = () => {
  let counter = 0;

  const inc = cb => {
    counter = counter + 1;
    if (cb) cb(counter);
  };

  const dec = cb => {
    counter = counter - 1;
    if (cb) cb(counter);
  };

  const get = cb => {
    if (cb) cb(counter);
    return counter;
  };

  return { inc, dec, get };
};

// EXAMPLE:
// const counter = makeCounter();
// counter.inc();
