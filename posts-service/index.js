const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Post
  }
`;

const resolvers = {
  Query: {
    posts: async () => {
      try {
        return await prisma.post.findMany();
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
    post: async (_, { id }) => {
      try {
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });
        if (!post) {
          throw new Error("Post not found");
        }
        return post;
      } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Failed to fetch post");
      }
    },
  },
  Mutation: {
    createPost: async (_, { title, content }) => {
      try {
        return await prisma.post.create({ data: { title, content } });
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
      }
    },
    updatePost: async (_, { id, title, content }) => {
      try {
        return await prisma.post.update({
          where: { id: Number(id) },
          data: { title, content },
        });
      } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
      }
    },
    deletePost: async (_, { id }) => {
      try {
        return await prisma.post.delete({ where: { id: Number(id) } });
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Posts service running at ${url}`);
});

// Handle Prisma cleanup on shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
