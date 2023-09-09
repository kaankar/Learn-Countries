import fs from 'node:fs';
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
// import puppeteer from 'puppeteer';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    const commonOfficial = JSON.parse(
      fs.readFileSync('./commonOfficial.json', 'utf-8'),
    );
    res.render('index.ejs', {
      countries: Object.keys(commonOfficial),
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.post('/search', async (req, res) => {
  try {
    const commonOfficial = JSON.parse(
      fs.readFileSync('./commonOfficial.json', 'utf-8'),
    );
    const commonObject = Object.keys(commonOfficial);
    const officialObject = Object.values(commonOfficial);
    const officialIndex = commonObject.indexOf(req.body.selectedCountry);
    const officialName = officialObject[officialIndex];
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${officialName}?fields=name,capital,languages,currencies,population,flags,maps`,
    );
    let responseObject = response.data[0];
    const mapSrcObject = JSON.parse(fs.readFileSync('./countriesEmbed.json'));
    const mapSrc = Object.values(mapSrcObject);
    const countryName = Object.keys(mapSrcObject);
    const countryIndex = countryName.indexOf(officialName);
    if (officialName === 'Republic of Niger') {
      responseObject = response.data[1];
    }
    res.render('index.ejs', {
      result: responseObject,
      countries: commonObject,
      iframe: mapSrc[countryIndex],
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*let embedMap = [];
let values;
let keys;
let time = 1;

app.get('/', async (req, res) => {
  try {
    const jsonData = JSON.parse(fs.readFileSync('./countries1.json', 'utf-8'));
    keys = Object.keys(jsonData);
    values = Object.values(jsonData);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (let i = 0; i < keys.length; i++) {
      console.log(time);
      time++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.goto(values[i]);
      try {
        await page.waitForSelector(
          '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
          { timeout: 35000 },
        );
      } catch (error) {
        console.log('Error:' + error.message);
        await page.reload();
        try {
          await page.waitForSelector(
            '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
            { timeout: 35000 },
          );
        } catch (error) {
          console.log('Error:' + error.message);
          await page.reload();
          try {
            await page.waitForSelector(
              '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
              { timeout: 35000 },
            );
          } catch (error) {
            console.log('Error:' + error.message);
            await page.reload();
            try {
              await page.waitForSelector(
                '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
                { timeout: 35000 },
              );
            } catch (error) {
              console.log('Error:' + error.message);
              await page.goto(values[i]);
              await page.reload();
              await page.waitForSelector(
                '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
                { timeout: 35000 },
              );
            }
          }
        }
      }

      await page.click(
        '#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div.control-share.leaflet-control > a',
      );
      await page.waitForSelector(
        '#map-ui > div.share-ui > div.section.share-link > form > div.btn-group.btn-group-sm.mb-2 > a:nth-child(3)',
      );
      await page.click(
        '#map-ui > div.share-ui > div.section.share-link > form > div.btn-group.btn-group-sm.mb-2 > a:nth-child(3)',
      );
      await page.waitForSelector('#embed_html');
      embedMap[i] = await page.$eval('#embed_html', (element) => element.value);

      if (i === 10 || i === 15) {
        console.log(embedMap[i] + ' ' + values[i] + ' ' + keys[i]);
      }
      if (i === keys.length - 1) {
        for (let j = 0; j < keys.length; j++) {
          fs.appendFileSync(
            './countriesEmbed.json',
            `'${keys[j]}': '${embedMap[j]}', \n`,
          );
        }
        await page.close();
        await browser.close();
      }
    }
    res.send('a');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});*/
