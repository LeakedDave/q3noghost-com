import nextConnect from "next-connect"
const expressMongoDb = require("express-mongo-db")

require("./config.js")

const middleware = nextConnect()

middleware.use(expressMongoDb(global.MONGODB_CONNECTION))

export default middleware