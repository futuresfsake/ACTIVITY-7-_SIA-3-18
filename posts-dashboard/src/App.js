import React, { useEffect, useState } from "react";
import { ApolloProvider, useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import client from "./apolloClient";

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      userId
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $userId: ID!) {
    createPost(title: $title, content: $content, userId: $userId) {
      id
      title
      content
      userId
    }
  }
`;

const POST_ADDED = gql`
  subscription {
    postAdded {
      id
      title
      content
      userId
    }
  }
`;

const PostList = () => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST);
  const { data: subData } = useSubscription(POST_ADDED);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data) setPosts(data.posts);
  }, [data]);

  useEffect(() => {
    if (subData) setPosts((prevPosts) => [...prevPosts, subData.postAdded]);
  }, [subData]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <div>
      <h2>Posts</h2>
      <button
        onClick={() =>
          createPost({ variables: { title: "New Post", content: "This is a new post", userId: "1" } })
        }
      >
        Add Post
      </button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.content}</td>
              <td>{post.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <PostList />
  </ApolloProvider>
);

export default App;
