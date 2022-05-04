import { Diograph } from '../diograph'
import { DioryAttributes, DioryObject } from '../types'

function update(this: Diograph, id: string, payload: DioryAttributes): DioryObject {
  // Check that only valid keys are given
  Object.keys(payload).forEach((key) => {
    if (!['text', 'image', 'latlng', 'date', 'data', 'style'].includes(key))
      throw new Error('extra key')
  })

  let diory = { ...this.diograph[id], ...payload }
  this.diograph[id] = diory
  return this.getDiory(id)
}

export { update }
