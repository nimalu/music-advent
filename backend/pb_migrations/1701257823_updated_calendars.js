/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ngj3nk6aun06jbx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tuzry4k7",
    "name": "name",
    "type": "text",
    "required": false,
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
  collection.schema.removeField("tuzry4k7")

  return dao.saveCollection(collection)
})
