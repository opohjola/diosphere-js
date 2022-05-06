import { Diory } from '../diory'
import { Diograph } from '../diograph'

const diory = new Diory({
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
})

const diory2 = new Diory({
  id: 'some-other-id',
})

const diory3 = new Diory({
  id: 'some-else-id',
  links: {
    'some-id': {
      id: 'some-id',
    },
  },
})

describe('getDiory2', () => {
  let diograph: Diograph

  beforeEach(() => {
    diograph = new Diograph('some-path/diograph.json')
    diograph.setDiograph({
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    })
  })

  describe('without options', () => {
    it('returns diory', () => {
      const returnedDiory = diograph.getDiory2('some-id')
      expect(returnedDiory.id).toEqual(diory.id)
      expect(returnedDiory.image).toEqual(diory.image)
      expect(returnedDiory.links).toEqual(diory.links)
    })
  })

  describe('with options', () => {
    it('returns array of diories', () => {
      const returnedDioryIds = diograph.getDioryWithLinks2('some-id').map((diory) => diory.id)
      expect(returnedDioryIds[0]).toEqual(diory.id)
    })

    describe('linkedDiories', () => {
      it('returns diory and its linked diories', () => {
        const returnedDioryIds = diograph
          .getDioryWithLinks2('some-id', { linkedDiories: true })
          .map((diory) => diory.id)
        expect(returnedDioryIds).toEqual([diory.id, diory2.id])
      })
    })

    describe('reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        const returnedDioryIds = diograph
          .getDioryWithLinks2('some-id', {
            reverseLinkedDiories: true,
          })
          .map((diory) => diory.id)
        expect(returnedDioryIds).toEqual([diory.id, diory3.id])
      })
    })

    describe('linkedDiories and reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        const returnedDioryIds = diograph
          .getDioryWithLinks2('some-id', {
            linkedDiories: true,
            reverseLinkedDiories: true,
          })
          .map((diory) => diory.id)
        expect(returnedDioryIds).toEqual([diory.id, diory2.id, diory3.id])
      })
    })
  })
})