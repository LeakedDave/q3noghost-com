import {
  Row,
  Col,
  MDBInput,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBContainer
} from "mdbreact"

import fetch from 'isomorphic-unfetch'

// https://image.gametracker.com/images/maps/160x120/q3/q3dm6remix.jpg

/**
 * Removes all non-digit characters from a string
 * @param {string} input - The string to remove non-digit characters from
 * @returns {string} The string with all non-digit characters removed
 */
function numericString(input) {
  return input.replace(/\D/g, "")
}


/**
 * Removes all non-digit characters from a string (excluding dashes and parenthesis)
 * @param {string} input - The string to remove non-digit characters from (excluding dashes and parenthesis)
 * @returns {string} The string with all non-digit characters removed (excluding dashes and parenthesis)
 */
function ipString(input) {
  return input.replace(/[^\d-.]/g, "")
}

function GameType(gameType) {
  switch (gameType) {
    case "0":
      return "FFA"
    case "1":
      return "1vs1"
    case "2":
      return "FFA"
    case "3":
      return "TDM"
    case "4":
      return "CTF"
    default:
      return "Q3A"
  }
}

function removeColorsFromName(name) {
  let newName = name

  for (let i = 0; i < 10; i++) {
    newName = newName.replace(new RegExp(("^" + i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), "")
  }

  return newName
}


const downloadTxtFile = (serverStatuses) => {
  let cfgContents = ""

  for (let i = 0; i < serverStatuses.length; i++) {
    cfgContents += 'seta server' + (i + 1) + ' "' + serverStatuses[i].server.address + ':' + serverStatuses[i].server.port + '"\n'
  }

  const element = document.createElement("a");
  const file = new Blob([cfgContents], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "autoexec.cfg";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}


class Index extends React.Component {
  state = {
    modal: false,
    port: "27960"
  }

  constructor({ serverStatuses }) {
    super()

    this.serverStatuses = serverStatuses
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  render() {

    return (
      <MDBContainer>
      <Row className="m-0">
        <Col size="12" lg="3" className="p-3">
          <div className="font-weight-bold text-center border border-dark p-1 elegant-color-dark">Shoutbox</div>
          <iframe
            className="pb-4"
            style={{maxHeight: "400px"}}
            width="100%"
            height="100%"
            title="Shoutbox"
            src="https://shoutbox.widget.me/start.html?uid=lgiim3jo7o"
            frameBorder="0"
            scrolling="auto"
          />
        </Col>

        <Col className="pr-0 pl-0">
          <MDBBtn color="primary" className="mt-3 ml-3" onClick={() => downloadTxtFile(this.serverStatuses)}>
            Download Favorites autoexec.cfg
          </MDBBtn>

          <MDBBtn color="secondary" className="float-right mr-3 mt-3" onClick={this.toggle}>
            Add Server
          </MDBBtn>

          <Row className="m-0">
            { this.serverStatuses.map((serverStatus) => {
              return (
                <Col className="p-3" xs="12" lg="6" key={serverStatus.state.name}>
                  <Row className="border border-dark m-0">
                    <Col className="p-0" xs="5" size="4" md="3" lg="5" xl="5">
                      <div className="elegant-color small text-center p-1">
                        <b>
                          { serverStatus.state.name }
                        </b>

                        <br />

                        <span className="text-muted">
                          { serverStatus.server.address + ":" + serverStatus.server.port}
                        </span>
                      </div>
                      <div className="elegant-color-dark text-center p-2" style={{ maxHeight: '120px' }}>
                        <img src={"https://image.gametracker.com/images/maps/160x120/q3/" + serverStatus.state.map + ".jpg"} width="100%" style={{maxWidth: '140px'}} />
                      </div>
                      <div className="elegant-color small text-center p-1">
                        {
                          serverStatus.location.location.country_flag_emoji + " " +
                          serverStatus.location.region_name
                        }
                      </div>
                    </Col>

                    <Col className="p-0">
                      <div className="elegant-color-dark small p-1 pl-2">
                        <b>
                          {
                            GameType(serverStatus.state.raw.g_gametype)
                          }
                        </b>

                        <span className="text-light float-right">
                          { "Players: ( " + serverStatus.state.players.length + " / " + serverStatus.state.maxplayers + " )" }
                        </span>

                        <br />
                        <input
                          className="form-control form-control-sm mt-1 small text-light"
                          onChange={() => {}}
                          value={ "/connect " + (serverStatus.server.domain || serverStatus.server.address) + ":" + serverStatus.server.port}
                          style={{ height: '15px', fontSize: '9px', borderColor: '#666666' }}
                        />
                      </div>
                      <div className="p-2 small" style={{ maxHeight: '140px', overflow: 'scroll' }}>
                        {
                          serverStatus.state.players.sort((element1, element2) => element2.frags - element1.frags).map((player) => {
                            return (
                              <div key={player.name}>
                                { removeColorsFromName(player.name) }
                                <span className="float-right">{player.frags}</span>
                              </div>
                            )
                          })
                        }
                        {
                          serverStatus.state.bots.sort((element1, element2) => element2.frags - element1.frags).map((bot) => {
                            return (
                              <div key={bot.name}>
                                { removeColorsFromName(bot.name) }
                                <span className="text-muted"> (bot)</span>
                                <span className="float-right">{bot.frags}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Col>
                  </Row>
                </Col>
              )
            }) }
          </Row>
        </Col>

      </Row>

      <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
        <MDBModalHeader className="bg-dark">Add Server</MDBModalHeader>
        <MDBModalBody className="bg-dark">
          <MDBInput label="IP Address" value={this.state.address} onChange={(event) => this.setState({address: ipString(event.target.value)})} />
          <MDBInput label="Port" value={this.state.port} onChange={(event) => this.setState({port: numericString(event.target.value)})} />
          <MDBInput label="Domain (optional)" value={this.state.domain} onChange={(event) => this.setState({domain: event.target.value})} />
        </MDBModalBody>
        <MDBModalFooter className="bg-dark">
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
          <MDBBtn color="primary" onClick={this.submitServer}>Submit</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
    )
  }

  submitServer = async () => {
    let postBody = {
      address: this.state.address,
      port: this.state.port,
      domain: this.state.domain
    }

    let response = await global.fetch("/api/addServer", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(postBody)
    })

    response.json().then((result) => {
      // Check for Server Error
      if (result.error) {
        alert(result.error.message)
        return
      }

      if (result.errorMessage) {
        alert(result.errorMessage)
        return
      }

      window.location.reload()
    }, (error) => {
      alert(error)
    })
  }
}

Index.getInitialProps = async ({ req }) => {
  let protocol = 'http://'
  if (req.headers.host.includes('localhost')) {
    protocol = 'http://'
  }

  const baseUrl = protocol + req.headers.host
  const res = await fetch(baseUrl + "/api/serverStatuses")
  const json = await res.json()

  return { serverStatuses: json.sort((serverStatus1, serverStatus2) => serverStatus2.state.players.length - serverStatus1.state.players.length) }
}

export default Index