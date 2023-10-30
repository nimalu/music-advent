/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  collection.listRule = "@request.auth.id != \"\" && user.id = @request.auth.id"
  collection.viewRule = "@request.auth.id != \"\" && user.id = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\" && user.id = @request.auth.id"
  collection.deleteRule = "@request.auth.id != \"\" && user.id = @request.auth.id"

  // remove
  collection.schema.removeField("hjaeqxxj")

  // remove
  collection.schema.removeField("5w3oconl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fwfogj8j",
    "name": "user",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  collection.listRule = "@request.auth.id != \"\" && (creator.id = @request.auth.id || recipients.id ?= @request.auth.id)"
  collection.viewRule = "@request.auth.id != \"\" && (creator.id = @request.auth.id || recipients.id ?= @request.auth.id)"
  collection.updateRule = "@request.auth.id != \"\" && (creator.id = @request.auth.id || recipients.id ?= @request.auth.id)"
  collection.deleteRule = "@request.auth.id != \"\" && (creator.id = @request.auth.id || recipients.id ?= @request.auth.id)"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hjaeqxxj",
    "name": "recipients",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5w3oconl",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fwfogj8j",
    "name": "creator",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
