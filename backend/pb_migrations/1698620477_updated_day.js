/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.name = "days"
  collection.indexes = [
    "CREATE INDEX `idx_xw39pQF` ON `days` (\n  `calendar`,\n  `day`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.name = "day"
  collection.indexes = [
    "CREATE INDEX `idx_xw39pQF` ON `day` (\n  `calendar`,\n  `day`\n)"
  ]

  return dao.saveCollection(collection)
})
