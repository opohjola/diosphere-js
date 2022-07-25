import { v4 as uuid } from 'uuid'
import { Diory } from './diory'
import { allKeysExist, allMatchToQuery } from './utils'

import { IDiory, IDioryObject, IDiograph, IDiographObject, IDioryProps } from './types'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diographObject: IDiographObject) {
    this.addDiograph(diographObject)
  }

  addDioryWithId = (dioryObject: IDioryObject): IDiory | undefined => {
    if (!!this.getDiory(dioryObject)) {
      console.error('createDiory: Diory already exist', dioryObject)
      return
    }

    return this.diograph[dioryObject.id] = new Diory(dioryObject)
  }

  addDiograph = (diographObject: IDiographObject = {}): IDiograph => {
    Object.entries(diographObject).forEach(([id, dioryObject]) => {
      this.addDioryWithId({ ...dioryObject, id })
    })

    return this
  }

  reduceToDiographObject = (diograph: IDiographObject, diory: IDiory): IDiographObject => ({
    ...diograph,
    [diory.id]: diory.toObject()
  })

  queryDiograph = (queryDiory: IDioryProps): IDiograph  => {
    const diographObject: IDiographObject = Object.values(this.diograph)
      .filter(allKeysExist(queryDiory))
      .filter(allMatchToQuery(queryDiory))
      .reduce(this.reduceToDiographObject, {})

    return new Diograph(diographObject)
  }

  resetDiograph = (): IDiograph => {
    this.diograph = {}

    return this
  }

  createDiory = (dioryProps: IDioryProps): IDiory | undefined => {
    const id = uuid()
    return this.addDioryWithId({ ...dioryProps, id })
  }

  getDiory = (dioryObject: IDioryObject): IDiory | undefined => {
    if (!dioryObject.id) {
      console.error('getDiory: Diory id not found', dioryObject)
      return
    }

    return this.diograph[dioryObject.id]
  }

  updateDiory = (dioryObject: IDioryObject): IDiory | undefined => {
    if (!this.getDiory(dioryObject)) {
      console.error('updateDiory: Diory not found', dioryObject)
      return
    }

    return this.diograph[dioryObject.id].update(dioryObject)
  }

  deleteDiory = (dioryObject: IDioryObject): boolean | undefined => {
    if (!this.getDiory(dioryObject)) {
      console.error('deleteDiory: Diory not found', dioryObject)
      return
    }

    return delete this.diograph[dioryObject.id]
  }

  toObject = (): IDiographObject => {
    const diographObject: IDiographObject = {}
    Object.entries(this.diograph).forEach(([id, diory]) => {
      diographObject[id] = diory.toObject()
    })
    return diographObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diograph }
