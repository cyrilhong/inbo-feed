import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import convert from 'xml-js';
import styled from 'styled-components';
function App() {
  const [feed, setFeed] = useState(null)
  useEffect(() => {
    getFeed()
  }, [])

  const getFeed = async () => {
    // setIsLoading(true)
    axios
      .get("https://shopline-feeds.s3.amazonaws.com/facebook_featured_products/inbocoffee.xml", {
        "Content-Type": "application/xml; charset=utf-8"
      })
      .then(data => {
        console.log(data);
        const result = convert.xml2js(data.data, { compact: true }).rss.channel.item;
        // debugger
        console.log(result);
        setFeed(result)
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  return (
    <Wrapper>
      <h1>Inbo Feed</h1>
      {/* {JSON.stringify(feed)} */}
      {feed && feed.map(item => {
        return (
          <Card
            href={item['g:link']._text}
            target="_blank"
          >
            <h4>{item['g:title']._text}</h4>
            <h5>{item['g:description']._text}</h5>
            <h5>{item['g:link']._text}</h5>
            <h5>{item['g:price']._text}</h5>
            <img src={item['g:image_link']._text} alt="" />
            {/* {JSON.stringify(item)} */}
          </Card>
        )


      })}
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
  width: 40%;
  color: black;
  border: 1px solid #000;
  padding: 16px;
  display: inline-block;
  margin: 0 16px 16px;
  h1,h2{
    text-decoration: none;
  }
  img{
    max-width: 500px;
  }
`

export default App;
