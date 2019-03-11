import { gql } from "apollo-boost"

export default gql`
  query languages($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      createdAt
      repositories(first: 100) {
        nodes {
          isFork
          nameWithOwner
          languages(first: 20) {
            edges {
              node {
                name
              }
              size
            }
          }
        }
      }
    }
  }
`
