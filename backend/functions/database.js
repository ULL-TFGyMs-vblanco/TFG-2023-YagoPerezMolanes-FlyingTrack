const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://alu0101254678:Z8aKR8cP@cluster0.6wih6s4.mongodb.net/?retryWrites=true&w=majority",
    {useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => console.log("Database is connected"))
    .catch((err) => console.log(err));
