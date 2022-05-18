import { Diograph } from '.'
import { ConnectionObject } from './types'
import { Connection } from './connection'
import { Diory } from './diory'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connected: boolean
  connections: Connection[] = []
  connectionData: ConnectionObject[] = []
  roomClient: any
  diograph?: Diograph
  contentUrls: ContentUrls = {}

  constructor(address: string, roomClient: any) {
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
    const { diographUrl, contentUrls, connections } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.connectionData = connections
    this.diograph = new Diograph(diographUrl, this)
    await this.diograph.loadDiograph()
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      connections: [],
    })

    const defaultDiograph = new Diograph()
    defaultDiograph.setDiograph({
      'some-diory-id': {
        id: 'some-diory-id',
        text: 'Root diory',
      },
    })

    await this.roomClient.initiateRoom(defaultRoomJson, defaultDiograph)

    const connection = new Connection({
      address: [this.address, 'Diory Content'].join('/'),
      type: 'local',
    })
    this.addConnection(connection)
    await this.loadRoom()
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
    for (let i = 0; ; i++) {
      const connection = this.connections[i]
      if (connection.contentUrls[contentUrl]) {
        return [connection.address, connection.contentUrls[contentUrl].internalPath].join('/')
      }
    }
  }

  toRoomObject = () => {
    return {
      diographUrl: this.address,
      connections: this.connections.map((connection) => connection.toConnectionObject()),
    }
  }

  saveRoom = async () => {
    // Connection contentUrls
    const diories: Diory[] = []

    this.connections.forEach((connection) => {
      Object.values(connection.contentUrls).forEach((contentUrl) => diories.push(contentUrl.diory))
    })

    const dioriesWithThumbnails = diories.filter((diory: any) => diory.thumbnailBuffer)

    await Promise.all(
      dioriesWithThumbnails.map(async (diory: any) => {
        if (diory.thumbnailBuffer) {
          const thumbnailPath = await this.roomClient.addThumbnail(diory.thumbnailBuffer, diory.id)
          diory.image = thumbnailPath
        }
      }),
    )

    // Room.json
    await this.roomClient.client.writeItem(
      this.roomClient.roomJsonPath,
      JSON.stringify(this.toRoomObject(), null, 2),
    )

    // Diograph.json
    if (!this.diograph) {
      throw new Error("Can't saveRoom: no this.diograph")
    }
    await this.diograph.saveDiograph()
  }

  deleteRoom = async () => {
    await this.roomClient.deleteRoomJson()
    await this.roomClient.deleteDiographJson()
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
