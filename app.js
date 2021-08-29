const pup = require('puppeteer');
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const urlBase = 'https://www.imdb.com'
const siteUrl = `${urlBase}/chart/top`;
movieObjects = [];

const getWithAxios = async () => {
  try {
    const {data} = await axios({
      method: 'GET',
      url: siteUrl
    });

    const $ = cheerio.load(data);
    const elemSelector = 'table.chart tbody.lister-list';

    $(elemSelector).children().each((movieIndex, movieElem) => {
      let movieObject = {};
      $(movieElem).children().each((movieFieldIndex, movieFieldElem) => {
        if($(movieFieldElem).hasClass('titleColumn')) {
          const [posterLink] = $(movieFieldElem).children().filter((index, child) => child.name === 'a');
          const [movieYear] = $(movieFieldElem).children().filter((index, child) => child.name === 'span');
          movieObject.posterLink = posterLink.attribs.href;
          movieObject.title = $(posterLink).text();
          movieObject.year = $(movieYear).text().replace('(', '').replace(')', '');
        } else if($(movieFieldElem).hasClass('imdbRating')) {
          movieObject.rating = $($(movieFieldElem).children()[0]).text();
        }
      })
      movieObjects.push(movieObject);
    });
    console.log(movieObjects);
  } catch {
    console.error(err);
  }
}

getWithAxios();