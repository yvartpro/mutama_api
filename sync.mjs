import { sequelize } from "./model/index.mjs"

  ; (async () => {
    try {
      await sequelize.authenticate()
      await sequelize.sync({ alter: true })
      console.log("Database synchronized")
      process.exit(0)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })()

