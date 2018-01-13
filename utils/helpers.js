export const validEmail = email => {
  return /^[^@\s]+@[^@\s]+$/.test(email);
};
