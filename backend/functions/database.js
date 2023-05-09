const mongoose = require("mongoose");

// mongoose es la libreria que permite conectarnos a una base de datos de
// mongodb, y permite modelar los datos, aqui lo usamos para conectarnos
// a la base de datos de mongodb, alojada en la nube(mongodb atlas)

// se llama a una funcion que devuleve una promesa
mongoose.connect("mongodb+srv://alu0101254678:Z8aKR8cP@cluster0.6wih6s4.mongodb.net/?retryWrites=true&w=majority",
    {useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => console.log("Database is connected"))
    .catch((err) => console.log(err));
