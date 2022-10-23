import { join } from 'path-browserify'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  client: any // TODO: Define baseClient

  constructor(client: any) {
    this.client = client
    this.address = this.client.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
  }

  readRoomJson = async () => {
    return this.client.readTextItem(this.roomJsonPath)
  }

  saveRoomJson = async (roomJsonContents: string) => {
    return this.client.writeItem(this.roomJsonPath, roomJsonContents)
  }

  readDiograph = async () => {
    return this.client.readTextItem(this.diographPath)
  }

  saveDiograph = async (diographFileContents: string) => {
    return this.client.writeItem(this.diographPath, diographFileContents)
  }

  deleteRoomJson = async () => {
    return this.client.deleteItem(this.roomJsonPath)
  }

  deleteDiographJson = async () => {
    return this.client.deleteItem(this.diographPath)
  }
}

export { RoomClient }