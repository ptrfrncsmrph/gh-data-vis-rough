import React, { setState } from "react"
import { InMemoryCache } from "apollo-boost"
import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { ApolloProvider, Query } from "react-apollo"
import languagesQuery from "./queries/languages"

const headers = {
  authorization: `Bearer ${process.env.REACT_APP_GH_KEY}`
}
const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
  headers
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
})

const App = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <Query
        query={languagesQuery}
        variables={{
          login: "ptrfrncsmrph"
        }}
      >
        {({ data, loading, error }) =>
          loading ? (
            <>
              <h3>LOADING...</h3>
              <p>Please bear with us, we are doing all that we can</p>
            </>
          ) : error ? (
            <>
              <h3>ERROR</h3>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </>
          ) : (
            <>
              <h3>SUCCESSS</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </>
          )
        }
      </Query>
    </div>
  </ApolloProvider>
)

export default App
