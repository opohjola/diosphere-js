import { ConnectionObject } from '../types'
// import { makeRelative } from '../utils/makeRelative'
import { Diograph } from './diograph'
import { join } from 'path'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class Connection {
  address: string
  contentClientType: string
  contentUrls: ContentUrlObject
  diograph: Diograph

  constructor({ address, contentClientType, contentUrls = {}, diograph = {} }: ConnectionObject) {
    if (!address || !contentClientType) {
      throw new Error(
        `Invalid connectionData: address: ${address}, contentClientType: ${contentClientType}`,
      )
    }
    this.address = address // full connection address
    this.contentClientType = contentClientType
    this.contentUrls = contentUrls || {}
    this.diograph = new Diograph()
    if (diograph && Object.keys(diograph).length) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  addContentUrl = (CID: string, internalPath: string) => {
    this.contentUrls[CID] = internalPath
  }

  getContent = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return join(this.address, this.contentUrls[contentUrl])
    }
  }

  readContent = async (contentUrl: string, contentClient: any) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return contentClient.readItem(filePath)
  }

  addContent = async (fileContent: Buffer | string, contentId: string, contentClient: any) => {
    await contentClient.writeItem(contentId, fileContent)

    this.addContentUrl(contentId, this.address)

    return contentId
  }

  deleteContent = async (contentUrl: string, contentClient: any) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return contentClient.deleteItem(filePath)
  }

  toObject = (roomAddress?: string): ConnectionObject => ({
    // TODO: Make some kind of exception for relative paths (for demo-content-room which can't have absolute paths...)
    // address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
    // - but connection shouldn't know anything about the room...
    address: this.address,
    contentClientType: this.contentClientType,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toObject(),
  })
}

export { Connection }
