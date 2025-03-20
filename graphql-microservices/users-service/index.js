const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (_, { id }) => prisma.user.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      try {
        return await prisma.user.create({ data: { name, email } });
      } catch (error) {
        if (error.code === "P2002") {
          throw new Error("A user with this email already exists.");
        }
        throw error;
      }
    },
    updateUser: async (_, { id, name, email }) => {
      try {
        return await prisma.user.update({
          where: { id: Number(id) },
          data: { name, email },
        });
      } catch (error) {
        if (error.code === "P2025") {
          throw new Error("User not found.");
        }
        throw error;
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        return await prisma.user.delete({ where: { id: Number(id) } });
      } catch (error) {
        if (error.code === "P2025") {
          throw new Error("User not found.");
        }
        throw error;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Users service running at ${url}`);
});
