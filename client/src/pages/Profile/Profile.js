import React from "react";
import { useParams } from "react-router";
import AddPostModal from "../../components/AddPostModal/AddPostModal";
import Post from "../../components/Post/Post";
import { gql, useQuery } from "@apollo/client";

const GET_PROFILE = gql`
  query GetProfile($userId: ID!) {
    profile(userId: $userId) {
      bio
      isMyProfile
      user {
        id
        name
        posts {
          id
          title
          content
          createdAt
          published
        }
      }
    }
  }
`;

export default function Profile() {
  const { id } = useParams();

  const { data, error, loading } = useQuery(GET_PROFILE, {
    variables: {
      userId: id,
    },
  });

  if (error) return <div>Error page</div>;
  if (loading) return <div>loading...</div>;

  const { profile } = data;

  return (
    <div>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex ",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>{profile.user.name}</h1>
          <p>{profile.bio}</p>
        </div>
        <div>{profile.isMyProfile ? <AddPostModal /> : null}</div>
      </div>
      <div>
        {profile.user.posts.map((post) => {
          return (
            <Post
              key={post.id}
              title={post.title}
              content={post.content}
              date={post.createdAt}
              id={post.id}
              user={profile.user.name}
              published={post.published}
              isMyProfile={profile.isMyProfile}
            />
          );
        })}
      </div>
    </div>
  );
}
