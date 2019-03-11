import React, { useState } from "react"
import { InMemoryCache } from "apollo-boost"
import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { ApolloProvider, Query } from "react-apollo"

import ProfileView from "./components/ProfileView"
import languagesQuery from "./queries/languages"

import "./App.scss"

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

const UsernameForm = ({ handleSubmit, handleChange, username }) => (
  <form onSubmit={handleSubmit}>
    <input
      className="form-control"
      value={username}
      onChange={handleChange}
      type="text"
      placeholder="Enter a GitHub username"
      aria-label="Search by GitHub username"
    />
    <button className="btn">Go</button>
  </form>
)

const App = () => {
  const [username, setUsername] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = ({ target: { value } }) => {
    setUsername(value)
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <UsernameForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          username={username}
        />
        {submitted && (
          <Query query={languagesQuery} variables={{ login: username }}>
            {({ data, loading, error }) =>
              loading ? (
                <h3>LOADING...</h3>
              ) : error ? (
                <>
                  <h3>ERROR</h3>
                  <pre>{JSON.stringify(error, null, 2)}</pre>
                </>
              ) : (
                <ProfileView data={data} />
              )
            }
          </Query>
        )}
      </div>
    </ApolloProvider>
  )
}

export default App
