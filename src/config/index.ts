import dotenv from "dotenv";
dotenv.config();

// You can read the following blog to learn more about the code https://dev.to/md_enayeturrahman_2560e3/how-to-set-up-eslint-and-prettier-1nk6

export default {
  port: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  database_url: process.env.database_url,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRE_IN,
  bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
