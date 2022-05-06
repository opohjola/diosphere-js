import { Diograph } from '../diograph'
import { DioryObject } from '../types'

interface GetOptions {
  linkedDiories: boolean
  reverseLinkedDiories: boolean
}

const DEFAULT_OPTIONS: GetOptions = {
  linkedDiories: false,
  reverseLinkedDiories: false,
}

function getDiory(this: Diograph, id: string): DioryObject {
  return this.diories.filter((diory) => diory.id === id)[0].toDioryObject()
}

function getDioryWithLinks(
  this: Diograph,
  id: string,
  opts: object = {},
): DioryObject | Array<DioryObject> {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory = this.getDiory(id)
  const storyDioryWithLinkedDiories = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.diograph[link.id]
      storyDioryWithLinkedDiories.push(linkedDiory)
    })
  }

  if (optsWithDefaults.reverseLinkedDiories && storyDiory.links) {
    Object.values(this.diograph).forEach((reverseLinkedDiory) => {
      if (reverseLinkedDiory.links) {
        Object.values(reverseLinkedDiory.links).forEach((link) => {
          const maybeStoryDiory = this.diograph[link.id]
          if (storyDiory === maybeStoryDiory) {
            storyDioryWithLinkedDiories.push(reverseLinkedDiory)
          }
        })
      }
    })
  }

  return storyDioryWithLinkedDiories
}

export { getDiory, getDioryWithLinks }
