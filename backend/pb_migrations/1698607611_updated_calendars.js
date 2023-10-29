/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q8fwqqxy",
    "name": "playlist",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  // remove
  collection.schema.removeField("q8fwqqxy")

  return dao.saveCollection(collection)
})
