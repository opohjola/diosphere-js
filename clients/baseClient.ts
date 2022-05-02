import { Diograph } from '../types'

class Client {
  diograph: Diograph = {}
  baseUrl: string
  imageFolderPath: string

  constructor() {
    this.baseUrl = ''
    this.imageFolderPath = 'images'
  }

  getDataobject = (contentUrl: string) => {
    return this.readItem(contentUrl)
  }

  writeDataobject = async (sourceFileContent: Buffer, diory: string) => {
    return this.writeItem(sourceFileContent, diory)
  }

  deleteDataobject = async (contentUrl: string) => {
    return this.deleteItem(contentUrl)
  }

  list = async (path?: string) => {
    // throw new Error('Not implemented.')
    return this.diograph
  }

  import = async () => {
    // throw new Error('Not implemented.')
    return 'Not implemented'
  }

  toJson = () => {
    // throw new Error('Not implemented.')
    return {}
  }

  // -----------------

  readItem = async (contentUrl: string): Promise<Buffer> => {
    // throw new Error('Not implemented.')
    return Buffer.from('string')
  }

  readTextItem = async (contentUrl: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  writeItem = async (fileContent: Buffer | string, diory?: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  deleteItem = async (contentUrl: string) => {
    // throw new Error('Not implemented.')
  }
}

export { Client }
