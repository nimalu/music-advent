/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.listRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"
  collection.viewRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"
  collection.createRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"
  collection.deleteRule = "@request.auth.id != \"\" && calendar.user.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  collection.listRule = "@request.auth.id != \"\" && (calendar.creator.id = @request.auth.id || calendar.recipients.id ?= @request.auth.id)"
  collection.viewRule = "@request.auth.id != \"\" && (calendar.creator.id = @request.auth.id || calendar.recipients.id ?= @request.auth.id)"
  collection.createRule = "@request.auth.id != \"\" && calendar.creator.id = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\" && (calendar.creator.id = @request.auth.id || calendar.recipients.id ?= @request.auth.id)"
  collection.deleteRule = "@request.auth.id != \"\" && (calendar.creator.id = @request.auth.id || calendar.recipients.id ?= @request.auth.id)"

  return dao.saveCollection(collection)
})
