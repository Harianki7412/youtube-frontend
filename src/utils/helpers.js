export const getFirstLetter = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    return str.charAt(0).toUpperCase();
  }
  return '';
};
