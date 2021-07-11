const getSize = win => {
  const [width, height] = win.getSize();

  return { width, height };
};

const getPosition = win => {
  const [x, y] = win.getPosition();

  return { x, y };
};

const getSizeAndPosition = win => {
  return { ...getSize(win), ...getPosition(win) };
};

module.exports = { getSize, getPosition, getSizeAndPosition };