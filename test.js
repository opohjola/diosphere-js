const DiographJson = require('./dist').default

const test = async () => {
  // Construct
  const diographJson = new DiographJson({ path: 'diograph.json' })

  // Load
  await diographJson.load()

  // RootId
  const rootId = diographJson.rootId
  console.log(rootId)

  // Get
  const rootDiory = diographJson.get(rootId)
  console.log(rootDiory)

  // Search
  const maries = diographJson.search('Ma')
  console.log(maries.map((diory) => diory.text))

  // Update
  try {
    const wronglyUpdatedDiory = diographJson.update(rootId, { wrongAttribute: 'some' })
    console.log(`This SHOULDNT be printed... ${wronglyUpdatedDiory.wrongAttribute}`)
  } catch (e) {
    console.log('Yes, we got an error!', e.message)
  }

  const originalText = rootDiory.text
  const updatedDiory = diographJson.update(rootId, { text: `${originalText} was updated!` })
  console.log(updatedDiory.text)
  diographJson.update(rootId, { text: originalText }) // ...and revert it...

  // Save
  diographJson.save()
}

test()
