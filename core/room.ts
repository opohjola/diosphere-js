import { RoomClient } from '../clients/roomClient'
import { Diograph } from './diograph'
import { ConnectionObject } from '../types'
import { Connection } from './connection'

class Room {
  connections: Connection[] = []
  roomClient: RoomClient
  diograph: Diograph
  address: string

  constructor(roomClient: RoomClient) {
    this.address = roomClient.address
    this.roomClient = roomClient
    this.diograph = new Diograph()
  }

  loadRoom = async () => {
    // Room
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const roomJsonContents = await this.roomClient.readRoomJson()
    const { connections } = JSON.parse(roomJsonContents)

    // Connections
    this.connections = []
    connections.forEach((connectionData: ConnectionObject) => {
      const connection = new Connection(connectionData)
      this.addConnection(connection)
    })

    // Diograph
    this.diograph = new Diograph()
    await this.diograph.loadDiograph(this.roomClient)
  }

  initiateRoom = async () => {
    const defaultDiographJson = {
      '/': {
        id: '/',
        image:
          'data:image/jpeg;base64,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',
        text: 'Root',
      },
    }

    this.diograph = new Diograph()
    this.diograph.mergeDiograph(defaultDiographJson, '/')

    await this.saveRoom()
  }

  addConnection = (connection: Connection) => {
    const existingConnection = this.connections.find(
      (existingConnection) => existingConnection.address === connection.address,
    )
    if (!existingConnection) {
      this.connections.push(connection)
      return connection
    }
    return existingConnection
  }

  getContent = (contentUrl: string) => {
    for (let i = 0; i < this.connections.length; i++) {
      const found = this.connections[i].getContent(contentUrl)
      if (found) {
        return found
      }
    }
  }

  addContent = async (fileContent: Buffer | string, contentId: string) => {
    return this.connections[0].addContent(fileContent, contentId)
  }

  toObject = () => {
    return {
      connections: this.connections.map((connection) => connection.toObject(this.address)),
    }
  }

  toJson = () => {
    return JSON.stringify(this.toObject(), null, 2)
  }

  saveRoom = async () => {
    await this.roomClient.saveRoomJson(this.toJson())
    await this.roomClient.saveDiograph(this.diograph.toJson())
  }

  deleteRoom = async () => {
    await this.roomClient.deleteRoomJson()
    await this.roomClient.deleteDiographJson()
  }
}

export { Room }
