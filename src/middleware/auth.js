import { verifyToken, isTokenBlacklisted, extractToken } from '../utils/jwt';

export const authenticate = async (req, res, next) => {

    const token = await extractToken(req.headers);
    if (!token) {
        return res.status(401).send({ message: 'Access Denied' });
    }

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
        return res.status(401).send({ message: 'you are already logged out' });
    }

    const verified = await verifyToken(token);
    if (!verified) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    req.user = verified;
    next();
};
