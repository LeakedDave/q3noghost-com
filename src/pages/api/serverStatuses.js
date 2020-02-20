import fetch from 'isomorphic-unfetch'

import nextConnect from "next-connect"

import commonMiddleware from "../../commonMiddleware"

const handler = nextConnect()

handler.use(commonMiddleware)

handler.get(getServerStatuses)

// TODO validate domains!!

const serversOld = [{
    address: "72.18.132.14",
    port: "27960",
    domain: "denver.q3noghost.com",
  },
  {
    address: "163.172.218.87",
    port: "27963",
    domain: ""
  },
  {
    address: "163.172.218.87",
    port: "27961",
    domain: ""
  }
]


function getServerStatuses(req, res) {
  req.db.collection("servers").find().toArray(async (error, result) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: error })
      return
    }

    console.log(result)

    const servers = result

    const Gamedig = require('gamedig')

    let serverStates = []

    for (let server of servers) {
      try {
        let state = await Gamedig.query({
          type: 'quake3',
          host: server.address,
          port: server.port
        })

        if (!state.raw.version.includes("1.16")) continue

        let location = {}

        try {
          let locationResponse = await fetch("http://api.ipstack.com/" + server.address + "?access_key=88631020efc8988a90a7250055218bc1")
          location = await locationResponse.json()
          console.log(location)
        } catch (exception) {}

        serverStates.push({ server: server, state: state, location: location })
      } catch (error) {
        console.error("Server Offline: " + server.address + ":" + server.port)
      }
    }

    // TODO order by players
    res.json(serverStates)
  })
}


export default handler