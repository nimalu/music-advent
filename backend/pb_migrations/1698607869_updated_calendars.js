/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  collection.listRule = "@request.auth.id != \"\" && recipients.id ?= @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  collection.listRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
