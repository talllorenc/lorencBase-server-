import { Request, Response } from "express";

const recaptchaSecret = process.env.RECAPTCHA_SECRET;

export const RecaptchaController = {
  validate: async (req: Request, res: Response) => {
    try {
      const recaptchaToken = req.body.recaptchaToken;

      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          res.json({ success: true });
        } else {
          res
            .status(400)
            .json({ success: false, error: "reCAPTCHA verification failed" });
        }
      } else {
        throw new Error("Failed to verify reCAPTCHA token");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
