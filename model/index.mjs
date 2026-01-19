import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });
import AppartmentModel from "./Appartment.mjs"
import RoomModel from "./Room.mjs"
import PostModel from "./Post.mjs"
import FileModel from "./File.mjs"
import PostFileModel from "./PostFile.mjs"
import applyAssociations from "./associations.mjs"

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: process.env.DATABASE_DIALECT || "mysql",
    logging: false,
  }
);

const Appartment = AppartmentModel(sequelize);
const Room = RoomModel(sequelize);
const Post = PostModel(sequelize);
const File = FileModel(sequelize);
const PostFile = PostFileModel(sequelize);

applyAssociations({ Appartment, Room, Post, File, PostFile });

const db = { sequelize, Sequelize, Appartment, Room, Post, File, PostFile };
export { sequelize, Sequelize, Appartment, Room, Post, File, PostFile };
export default db;