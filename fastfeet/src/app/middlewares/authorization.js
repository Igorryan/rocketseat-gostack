export default async (req, res, next) => {
  if (!req.provider) {
    return res.status(401).json({ error: 'User does not have permission' });
  }
  return next();
};
