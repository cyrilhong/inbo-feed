import { useEffect, useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { logDOM } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
function App() {
  const [feed, setFeed] = useState([])
  useEffect(() => {
    getFeed()
    // getProduct()
  }, [])

  const pickArray = [0, 2, 17, 28, 35]

  const getFeed = async () => {
    // setIsLoading(true)
    axios
      .get("https://sheets.googleapis.com/v4/spreadsheets/1B11qmEYVdmbaAxCpLw-Gobodi5g8IYsps8q1H-_IIUk/values/Worksheet1?key=AIzaSyA9cxITlFQrAEGXHFPRK7-b5w2BepFcz8g", {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(data => {
        console.log(data.data.values);
        // debugger
        let arr = []
        let arrTemp1 = []
        let arrTemp2 = []
        const result = data.data.values
        pickArray.map((item) => {
          result[0].map((resultItem, index) => {
            let arrTemp = []
            // debugger
            console.log({ resultItem, index, item });

            return index === item && arrTemp1.push(resultItem)
          })
          result[2].map((resultItem, index) => {

            // debugger
            console.log({ resultItem, index, item });

            return index === item && arrTemp2.push(resultItem)
          })
        })
        arr.push(arrTemp1, arrTemp2)
        console.log(arr);

        setFeed(arr)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <Wrapper>
      <h1>Inbo Feed</h1>
      <Grid container spacing={4}>
        {feed[0]?.map((item) => {
          return (
            <Grid item xs={8} md={4} lg={2}>
              {item}
            </Grid>
          )
        })}

      </Grid>
      <Grid container spacing={4}>
        {feed[1]?.map((item) => {
          return (
            <Grid item xs={8} md={4} lg={2}>
              {item}
            </Grid>
          )
        })}

      </Grid>
      {/* {JSON.stringify(feed[1])} */}
      {/* {feed && feed?.map((item,index) => {
        return (
          <Card
            href={item['g:link']._text}
            target="_blank"
            key={index}
          >
            <h4>{item['g:title']._text}</h4>
            <h5>{item['g:description']._text}</h5>
            <h5>{item['g:link']._text}</h5>
            <h5>{item['g:price']._text}</h5>
            <h5>condition: {item['g:condition']._text}</h5>
            <h5>availability: {item['g:availability']._text}</h5>
            <h5>brand: {item['g:brand']._text}</h5>
            <h5>age_group: {item['g:age_group']._text}</h5>
            <h5>age_group: {item['g:age_group']._text}</h5>
            <h5>product_type: {item['g:product_type']._text}</h5>
          </Card>
        )


      })} */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 24px;
  /* display: flex;
  flex-direction: column; */
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
