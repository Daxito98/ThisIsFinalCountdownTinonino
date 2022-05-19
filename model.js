const Realm = require('realm')

let UserSchema = {
   name: 'User',
   primaryKey: 'identifier',
   properties: {
     identifier: 'string',
      name: 'string',
      familyName: 'string',
      birthDate: 'string',
      gender: 'string',
      preferences: 'string',
      performerIn: 'Event[]'
   }
}

let EventSchema = {
  name: 'Event',
  primaryKey: 'identifier',
  properties: {
    identifier: 'string',
    about: 'string',
    attendee: 'User[]',
    startDate: 'string',
    location: 'string',
    duration: 'int'
  }
}

// // // MODULE EXPORTS

let config = {path: './data/blogs.realm', schema: [UserSchema, EventSchema]}

exports.getDB = async () => await Realm.open(config)

// // // // // 

if (process.argv[1] == __filename){ //TESTING PART

  if (process.argv.includes("--create")){ //crear la BD

      Realm.deleteFile({path: './data/blogs.realm'})

      let DB = new Realm({
        path: './data/blogs.realm',
        schema: [UserSchema, EventSchema]
      })
     
      DB.write(() => {
          let v = []
        let user = DB.create('User', {
            identifier: '0',
            name: 'Usuario0',
            familyName: 'Apellido',
            performerIn: v,
            birthDate: new Date('Jul 12 2011').toString(),
            gender: 'Hombre',
            preferences: 'Fiesta, Cine'
        })

        let event = DB.create('Event', {
                                        identifier: '0',
                                        about: 'Cumpleaños',
                                        attendee: [],
                                        startDate: new Date('Jul 12 2022').toString(),
                                        location: 'Castellon',
                                        duration: 30
        })

        console.log('Inserted objects', user, event)
      })
      DB.close()

  }
  else { //consultar la BD

      Realm.open({ path: './data/blogs.realm' , schema: [UserSchema, EventSchema] }).then(DB => {
        let users = DB.objects('User')
        users.forEach(x => console.log(x.name))
        let event = DB.objectForPrimaryKey('Event', '0')
        if (event)
           console.log(event.about, ' in ', event.location)
        DB.close()
      })
  }
  
}
