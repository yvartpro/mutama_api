import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { User, sequelize } from "./model/index.mjs";

const DEFAULT_ADMIN_PHONE = process.env.DEFAULT_ADMIN_PHONE || "00000000";
const DEFAULT_ADMIN_PASS = process.env.DEFAULT_ADMIN_PASS || "admin123";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected for seeding");

    const existingAdmin = await User.findOne({ where: { phone: DEFAULT_ADMIN_PHONE } });
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASS, 10);

    if (existingAdmin) {
      console.log("Admin already exists, updating password...");
      await existingAdmin.update({ password: hashedPassword });
      console.log("Admin password updated!");
    } else {
      await User.create({
        full_name: "System Admin",
        phone: DEFAULT_ADMIN_PHONE,
        password: hashedPassword,
        is_admin: true
      });
      console.log("Admin user created successfully!");
    }

    console.log("Phone: ", DEFAULT_ADMIN_PHONE);
    console.log("Pass: ", DEFAULT_ADMIN_PASS);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
