import Tokens from "csrf";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";

const tokens = new Tokens();

// CSRF token handler middleware
export const csrfTokenHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = req.session;
  if (!session) {
    return next(new Error("Session is not initialized."));
  }
  if (!session.secret) {
    session.secret = tokens.secretSync(); // Store the CSRF secret in the session
  }
  const token = tokens.create(session.secret); // Create CSRF token using session secret
  res.cookie("xsrf-token", token); // Set the token in a cookie
  res.locals.csrfToken = token;
  next();
};

// CSRF protection middleware
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["xsrf-token"];
  const session = req.session;

  if (!token || !tokens.verify(session?.secret, token)) {
    // Verify CSRF token using session secret
    const error = new CustomError(
      "Something went wrong, please refresh the page or contact us",
      403
    );
    return next(error);
  }
  next();
};

export default csrfProtection;
