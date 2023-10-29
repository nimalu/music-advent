/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ejkr47ka",
    "name": "day",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 31,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lw1kpwhfeadl0ik")

  // remove
  collection.schema.removeField("ejkr47ka")

  return dao.saveCollection(collection)
})
