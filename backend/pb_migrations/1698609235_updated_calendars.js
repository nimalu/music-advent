/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  // remove
  collection.schema.removeField("5w3oconl")

  return dao.saveCollection(collection)
})
