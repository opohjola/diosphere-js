import { RoomClient } from './roomClients'
import { Client, LocalClient } from './clients'
import { DiographJson } from '.'
import { ClientData } from './types'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connected: boolean
  clients: Client[] = []
  clientData: ClientData[] = []
  roomClient: RoomClient
  diograph: DiographJson | undefined
  contentUrls: ContentUrls = {}

  constructor(address: string, roomClient: RoomClient) {
    this.address = address
    this.connected = false
    this.roomClient = roomClient
  }

  loadOrInitiateRoom = async () => {
    try {
      await this.roomClient.verifyAndConnect()
      this.connected = true
      await this.loadRoom()
    } catch (e) {
      await this.initiateRoom()
    }
  }

  loadRoom = async () => {
    this.connected = await this.roomClient.verifyAndConnect()
    if (!this.connected) {
      throw new Error("Can't load room before it's connected!")
    }
    const roomJsonContents = await this.roomClient.loadRoom()
    const { diographUrl, contentUrls, clients } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.clientData = clients
    this.diograph = new DiographJson(diographUrl, this.roomClient)
    await this.diograph.loadDiograph()
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      clients: [],
    })

    const defaultDiographJson = JSON.stringify({
      rootId: 'some-diory-id',
      diograph: {
        'some-diory-id': {
          id: 'some-diory-id',
          text: 'Root diory',
        },
      },
    })

    await this.roomClient.initiateRoom(defaultRoomJson, defaultDiographJson)
    await this.loadRoom()
  }

  addClient = (client: Client) => {
    const existingClient = this.clients.find(
      (existingClient) => existingClient.baseUrl === client.baseUrl,
    )
    if (!existingClient) {
      this.clients.push(client)
      return client
    }
    return existingClient
  }

  saveRoom = async () => {
    // Room.json
    const roomJson = {
      diographUrl: this.address,
      clients: this.clients.map((client) => client.toJson()),
    }
    await this.roomClient.writeTextItem(
      this.roomClient.roomJsonPath,
      JSON.stringify(roomJson, null, 2),
    )

    // Diograph.json
    const diographJson = this.diograph && this.diograph.toJson()
    await this.roomClient.writeTextItem(
      this.roomClient.diographJsonPath,
      JSON.stringify(diographJson, null, 2),
    )
  }

  deleteRoom = async () => {
    await this.roomClient.deleteItem(this.roomClient.roomJsonPath)
    await this.roomClient.deleteItem(this.roomClient.diographJsonPath)
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
