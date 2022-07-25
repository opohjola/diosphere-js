import { IDiograph, IDiographObject, IDiory, IDioryObject } from './types'
import { v4 as uuid } from 'uuid'

import { Diograph } from './diograph'

// Mocks
jest.mock('./diory', () => ({
  Diory: function(dioryObject: IDioryObject) {
    return {
      ...dioryObject,
      toObject: () => dioryObject,
    }
  }
}))
jest.mock('uuid')

describe('diograph', () => {
  let diograph: IDiograph

  describe('constructor(diographObject)', () => {
    let diographObject: IDiographObject

    describe('given diograph with some diory', () => {
      beforeEach(() => {
        diographObject = {
          'some-id': {
            id: 'some-id'
          }
        }
        diograph = new Diograph(diographObject)
      })

      it('adds diory to diograph', () => {
        expect(diograph.diograph['some-id'].id).toBe('some-id')
      })

      describe('when toObject()', () => {
        it('returns diograph object', () => {
          expect(diograph.toObject()).toStrictEqual(diographObject)
        })
      })

      describe('when addDiograph()', () => {
        describe('given diograph with other diory', () => {
          beforeEach(() => {
            diograph.addDiograph({
              'other-id': {
                id: 'other-id',
              }
            })
          })

          it('adds diory to diograph', () => {
            expect(diograph.diograph['other-id'].id).toBe('other-id')
          })

          describe('when toObject()', () => {
            it('returns diograph object', () => {
              expect(diograph.toObject()).toStrictEqual({
                'some-id': {
                  id: 'some-id'
                },
                'other-id': {
                  id: 'other-id'
                },
              })
            })
          })
        })
      })

      describe('given diograph with query text diory', () => {
        beforeEach(() => {
          diograph.addDiograph({
            'query-id': {
              id: 'query-id',
              text: 'query-text',
            }
          })
        })

        describe('when queryDiograph() with text query', () => {
          let queryDiograph: IDiograph
          beforeEach(() => {
            queryDiograph = diograph.queryDiograph({ text: 'query' })
          })

          it('returns diograph with query diory', () => {
            expect(queryDiograph.diograph['query-id'].id).toBe('query-id')
          })

          describe('when toObject()', () => {
            it('returns diograph object', () => {
              expect(queryDiograph.toObject()).toStrictEqual({
                'query-id': {
                  id: 'query-id',
                  text: 'query-text',
                },
              })
            })
          })
        })
      })

      describe('when getDiory() with id', () => {
        let diory: IDiory | undefined
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'some-id' })
        })

        it('returns diory', () => {
          expect(diory?.id).toBe('some-id')
        })
      })

      describe('when createDiory()', () => {
        let diory: IDiory | undefined
        beforeEach(() => {
          // @ts-ignore
          uuid.mockReturnValue('some-uuid')
          diory = diograph.createDiory({ text: 'created-text' })
        })

        it('creates id to diory', () => {
          expect(uuid).toHaveBeenCalled()
        })

        it('adds diory to diograph', () => {
          expect(diograph.diograph['some-uuid'].id).toBe('some-uuid')
        })

        it('returns created diory', () => {
          expect(diory?.id).toBe('some-uuid')
        })
      })

      describe('when resetDiograph()', () => {
        it('resets diograph to empty object', () => {
          diograph.resetDiograph()

          expect(diograph.diograph).toStrictEqual({})
        })
      })
    })
  })
})

