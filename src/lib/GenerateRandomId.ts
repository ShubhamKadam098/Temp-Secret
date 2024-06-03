const generateRandomId = () => {
  const randomId = String(
    Date.now().toString(32) + Math.random().toString(16)
  ).replace(/\./g, "");
  return randomId;
};
export default generateRandomId;
