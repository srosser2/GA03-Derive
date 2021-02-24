import React, { useEffect } from 'react'
import axios from 'axios'


const wikiScraper = () => {

  axios.get('https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population')
    .then(function(html) {
      console.log(html)
    })
    .catch(function(err) {
      console.log(err)
    })
}

export default wikiScraper