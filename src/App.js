import { useEffect, useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { logDOM } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import ReactCountryFlag from "react-country-flag"
import commaNumber from 'comma-number'
import downloadComponentInPDF from './savePDF'
import Pdf from "react-to-pdf";
function App() {
  const [feed, setFeed] = useState({})
  const ref = React.createRef();
  const inboLink = 'https://www.inbocoffee.com/products/'
  useEffect(() => {
    getFeed()
    // getProduct()
  }, [])

  const getFeed = async () => {
    // setIsLoading(true)
    axios
      .get("https://sheets.googleapis.com/v4/spreadsheets/1B11qmEYVdmbaAxCpLw-Gobodi5g8IYsps8q1H-_IIUk/values/Worksheet1?key=AIzaSyA9cxITlFQrAEGXHFPRK7-b5w2BepFcz8g", {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(data => {
        // console.log(data.data.values);
        // debugger
        let arr = []
        const result = data.data.values
        result.map((firstLevel) => {
          // index === item &&
          // console.log(firstLevel);
          // debugger
          let obj = {
            id: null,
            name_zh: null,
            name_eng: null,
            country: null,
            amount: null,
            package: null,
            price: null,
            country_zh: null
          }
          if (firstLevel[2] && firstLevel[38]) {
            firstLevel.map((resultItem, index) => {
              // console.log(resultItem);
              // pickArray.map((item) => {
              //   if (index === item) {
              //     arrTemp.push(resultItem)
              //   }
              // })

              // debugger
              switch (true) {
                case index === 0:
                  obj.id = resultItem
                  break;
                case index === 1:
                  obj.name_eng = resultItem
                  obj.country = resultItem.split(" ")[0]
                  break;
                case index === 2:
                  obj.country_zh = resultItem.split(" ")[0]
                  break;
                case index === 6:
                  obj.name_zh = resultItem
                  break;
                case index === 28:
                  obj.amount = resultItem
                  break;
                case index === 35:
                  obj.package = resultItem
                  break;
                case index === 38:
                  obj.price = resultItem
                  break;
                default:
                  break;
              }

            })
          } else {
            return
          }
          // arrTemp.push(obj)
          arr.push(obj)
        })
        let CountryCategory = {}
        arr.slice(2).map(item => {
          let countryName = item?.country
          // debugger
          let val = []
          val.push(item)
          if (CountryCategory[countryName]) {
            CountryCategory[countryName].push(...val)
          } else {
            CountryCategory[countryName] = [...val]
          }
          // let stuff = {item?.country: item}
          // console.log(item);
          // CountryCategory.country = item?.country
          // CountryCategory.country = item
        })
        // console.log(CountryCategory);


        // arr.push(arrTemp1, arrTemp2)
        // console.log(arr);

        setFeed(CountryCategory)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getCountryCode = (str) => {
    switch (str) {
      case 'El':
        return 'SV'
      case 'Ethiopia':
        return 'ET'
      case 'Guatemala':
        return 'GT'
      case 'Papua':
        return 'PG'
      case 'Ecuador':
        return 'EC'
      case 'Rwanda':
        return 'RW'
      case 'Costa':
        return 'CR'
      default:
        break;
    }
  }

  const isVisible = (arr) => {
    let result = 0
    arr.map(item => {
      // console.log(item);
      parseInt(item?.amount) === 0 && result++
    })
    // debugger
    return arr.length !== result
  }

  return (
    <Wrapper ref={ref}>
      {/* <h1>Inbo Feed</h1> */}
      {/* {JSON.stringify(feed.slice(2))} */}
      {/* {JSON.stringify(feed)} */}
      {/* {renderData()} */}
      <button
        style={{
          position: 'fixed',
          right: 20,
          top: 20
        }}
        onClick={() => {
          let el = document.getElementById("root");
          downloadComponentInPDF(el)
        }}
      >
        下載豆單
      </button>
      {/* <Pdf targetRef={ref} filename="code-example.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf> */}
      <Grid container >
        {
          Object.keys(feed).map((key, index) => {
            if (isVisible(feed[key])) {
              return (
                <Grid key={key} item xs={12} lg={12}>
                  <div key={index}>
                    <div style={{ display: 'flex' }}>
                      <ReactCountryFlag countryCode={getCountryCode(key)} style={{ fontSize: '64px', marginRight: '16px' }} />
                      <h1>{feed[key][0].country_zh}</h1>
                    </div>
                    <Grid className="row" container spacing={2}>
                      <Grid item xs={4}>
                        <b>品項</b>
                      </Grid>
                      <Grid item xs={8} style={{textAlign:'right', paddingRight:'16px'}}>
                        <b>價格(點選商品連結，價格內詳)</b>
                      </Grid>
                    </Grid>
                    {feed[key]?.map(item => {
                      if (item?.amount > 0) {
                        return (
                          <a href={inboLink + item?.id} key={item?.name_eng} target="_blank">
                            <Grid key={item?.name_eng} className="row" container spacing={2}>
                              <Grid item xs={9} >
                                {item?.name_zh} <br />
                                {item?.name_eng}
                              </Grid>
                              {/* <Grid item xs={6} md={4} lg={5}>
                                {item?.amount}
                              </Grid> */}
                              <Grid item xs={3} style={{ textAlign: 'right' ,paddingRight:'16px'}}>
                                {commaNumber(item?.price)}/KG
                              </Grid>
                            </Grid>
                          </a>
                        )
                      } else {
                        return
                      }

                    })}
                    <hr style={{ margin: '60px 0 60px' }} />
                  </div>
                </Grid>
              )
            } else {
              return
            }
          })
        }

      </Grid>
    </Wrapper >
  );
}

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 24px;
  /* display: flex;
  flex-direction: column; */
  font-size: 14px;
  .row{
    margin: 16px 0;
  }
  a{
    text-decoration: none;
    color: black;
  }

  @media only screen and (max-width: 960px) {
    button{
      display: none;
    }
  }
`
const Card = styled.a`
  width: 20%;
  color: black;
  border: 1px solid #000;
  padding: 16px;
  display: inline-block;
  margin: 0 16px 16px;
  h5{
    /* display: inline-block; */
    overflow-wrap: break-word;
  }
  h1,h2{
    text-decoration: none;
  }
  img{
    max-width: 500px;
  }
`

export default App;
