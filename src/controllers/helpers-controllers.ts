import { Request, Response } from "express";

export const helpersController = {
  randomPassword: async (req: Request, res: Response) => {
    try {
      res.status(200).json({ message: Math.random().toString(36).slice(-8) });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
generate.addEventListener("click", () => {
  var result = [];

  var characters = "abcdefghijklmnopqrstuvwxyz";

  if (numbers.checked) {
    characters += "0123456789";
  }
  if (uppercase.checked) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (symbols.checked) {
    characters += "$%^&)><?'\"@";
  }
  if (spaces.checked) {
    characters += " ";
  }
  var charactersLength = characters.length;

  for (var i = 0; i < 12; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }

  // Changing the password
  password.innerText = result.join("");
});
