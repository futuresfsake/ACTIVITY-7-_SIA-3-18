const { ApolloServer, gql } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();
const POST_ADDED = "POST_ADDED";

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    userId: ID!
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, userId: ID!): Post
  }

  type Subscription {
    postAdded: Post
  }
`;

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_, { id }) => prisma.post.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createPost: async (_, { title, content, userId }) => {
      const newPost = await prisma.post.create({ data: { title, content, userId: Number(userId) } });
      pubsub.publish(POST_ADDED, { postAdded: newPost });
      return newPost;
    },
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/graphql",
  },
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Posts service running at ${url}`);
});
