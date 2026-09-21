import { hash } from "bcrypt";
import { createAccount } from "../models/registerModel.js";

const register = async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      const error = new Error(
        "Käyttäjänimi, sähköposti ja salasana ovat pakollisia"
      );
      error.status = 400;
      return next(error);
    }

    if (password.length < 8) {
      const error = new Error(
        "Salasanan pitää olla vähintään 8 merkkiä pitkä"
      );
      error.status = 400;
      return next(error);
    }

    if (!/[A-Z]/.test(password)) {
      const error = new Error(
        "Salasanassa pitää olla vähintään yksi iso kirjain"
      );
      error.status = 400;
      return next(error);
    }

    if (!/[0-9]/.test(password)) {
      const error = new Error(
        "Salasanassa pitää olla vähintään yksi numero"
      );
      error.status = 400;
      return next(error);
    }

    const hashedPassword = await hash(password, 10);

    const account = await createAccount(
      username,
      email,
      hashedPassword
    );

    return res.status(201).json(account);
  } catch (error) {
    return next(error);
  }
};

export { register };
