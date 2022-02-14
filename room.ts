import { DiographJsonParams } from './types'
import { LocalConnector } from './connectors'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  contentUrls: ContentUrls = {}
  connector: LocalConnector

  constructor({ baseUrl }: DiographJsonParams, connector?: LocalConnector) {
    this.connector = connector || new LocalConnector(baseUrl)
  }

  load = async () => {
    const roomJsonContents = await this.connector.loadRoom()
    const { contentUrls } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
  }

  getDataobject = async function getDataobject(this: Room, contentUrl: string): Promise<Buffer> {
    return this.connector.getDataobject(contentUrl)
  }

  importDataobject = async function importDataobject(
    this: Room,
    sourceFileContent: Buffer,
    contentUrl: string,
  ): Promise<void> {
    return this.connector.writeDataobject(contentUrl, sourceFileContent)
  }

  deleteDataobject = function deleteDataobject(this: Room, contentUrl: string) {
    return this.connector.deleteDataobject(contentUrl)
  }
}

export { Room }
