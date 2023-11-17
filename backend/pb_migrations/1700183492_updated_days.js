/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.listRule = "@request.auth.id != \"\" && (calendar.user.id = @request.auth.id || calendar.password = @request.headers.pwd)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.listRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"

  return dao.saveCollection(collection)
})
