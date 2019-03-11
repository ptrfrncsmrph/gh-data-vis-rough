import React from "react"
import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme } from "victory"
import formatDistance from "date-fns/formatDistance"

import "./ProfileView.scss"

const languageWeight = data => {
  const { repositories } = data.user
  const _byLanguage = repositories.nodes
    .filter(({ isFork }) => !isFork)
    .flatMap(({ languages }) =>
      languages.edges.flatMap(e => ({
        language: e.node.name,
        color: e.node.color,
        size: e.size
      }))
    )

  const _sizeByLang = _byLanguage.reduce(
    (byLang, { language, size }) =>
      Object.assign({}, byLang, { [language]: (byLang[language] || 0) + size }),
    {}
  )

  const _colorByLang = _byLanguage.reduce(
    (byLang, { language, color }) =>
      Object.assign({}, byLang, { [language]: color }),
    {}
  )

  const byLanguage = Object.entries(_sizeByLang).map(([language, size]) => ({
    language,
    size
  }))
  return byLanguage
}

const sumProp = prop => xs => xs.reduce((acc, x) => acc + x[prop], 0)

const ProfileView = ({ data }) => {
  const totalSize = sumProp("size")(languageWeight(data))
  return (
    <>
      <span className="rate-limit">
        Rate limit remainder: {data.rateLimit.remaining}
      </span>
      <section className="profile">
        <img className="avatar" src={data.user.avatarUrl} />
        <h2>{data.user.name}</h2>
        <span className="created-at">
          Member since{" "}
          {formatDistance(new Date(data.user.createdAt), new Date())} ago.
        </span>
      </section>
      <h3>Language Usage</h3>
      <ul>
        {languageWeight(data).map(({ language, size }) => (
          <li>
            <strong>{language}:</strong> {((size * 100) / totalSize).toFixed(2)}
            %
          </li>
        ))}
      </ul>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryBar
          data={languageWeight(data).map(({ language, size }) => ({
            x: language,
            y: size
          }))}
        />
      </VictoryChart>
      <VictoryPie
        theme={VictoryTheme.material}
        data={languageWeight(data).map(({ language, size }) => ({
          x: language,
          y: size
        }))}
      />
    </>
  )
}

export default ProfileView
