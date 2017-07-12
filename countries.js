'use strict'

const fetch = require('node-fetch')
const pick = require('lodash.pick')
const round = require('lodash.round')

// const remove = [ // todo: necessary? add more
//     'GG', 'HM', 'GU', 'GD'
// ]

const transformCountry = (c) => {
    const country = pick(c, ['capital', 'population', 'area', 'flag'])
    country.code = c.alpha2Code
    // country.name = c.translations.de
    country.name = c.name
    country.density = round(c.population / c.area, 1)
    return country
}

const countries = () =>
    fetch('https://restcountries.eu/rest/v2/all', {method: 'get'})
    .then((res) => res.json())
    .then((list) => list.filter((c) => !!c.alpha2Code))
    .then((list) => list.map(transformCountry))
    // .then((list) => list.filter((c) => remove.indexOf(c.code)<0))
    .then((list) => list.filter((e) => e.name && e.flag && e.population && e.density && e.area && e.name.length<=15)) // todo: shady shit

countries().then((cs) => process.stdout.write(JSON.stringify(cs)))
