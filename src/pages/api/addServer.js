import nextConnect from "next-connect"

import commonMiddleware from "../../commonMiddleware"

const handler = nextConnect()

handler.use(commonMiddleware)

handler.post(addServer)


function addServer(req, res) {
  if (!req.body.address || !req.body.port) {
    res.status(400).json({ errorMessage: "Missing address or port" })
    return
  }

  let server = { address: req.body.address, port: req.body.port, domain: req.body.domain }
  req.db.collection("servers").insertOne(server, function(error, _) {
    if (error) {
      console.error(error)
      res.status(500).json({ error: error })
      return
    }

    res.json({ message: "Success!" })
  })

  /*
    req.db.collection("servers").find().toArray(async (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: error })
        return
      }
    })
  */
}


export default handler