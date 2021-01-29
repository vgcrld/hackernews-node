const { ApolloServer } = require("apollo-server");
const GpeClickhouse = require("./clickhouse")


ch = new GpeClickhouse('data__atsgroup');

const fs = require("fs");
const path = require("path");

const resolvers = {}

function items(parent, args, context, info) {
  console.log(clickhouse.sql.items)
  return {};
}

resolvers.Query = {
  item: (parent,args,context,info) => {
    return ch.query(`select * from __items where item_id = ${args.item_id}`)
  },
  items: (parent,{limit},context,info) => {
    if (typeof limit === "undefined" ) {
      sql = `select * from __items`
    } else {
      sql = `select * from __items limit ${limit}`
    }
    return ch.query(sql)
  }
}


const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ch
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
