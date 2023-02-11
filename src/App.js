import { useEffect, useState } from 'react';
import './App.css';
import convert from 'xml-js';
import styled from 'styled-components';
import { logDOM } from '@testing-library/react';
function App() {
  const [feed, setFeed] = useState(null)
  const [temp, setTemp] = useState(null)
  useEffect(() => {
    getFeed()
    // getProduct()
  }, [])

  const getProduct = async () => {
    // setIsLoading(true)
    doCORSRequest({
      method: 'GET',
      url: 'https://www.inbocoffee.com/products/%E8%A1%A3%E7%B4%A2%E6%AF%94%E4%BA%9E-%E6%BD%94%E8%92%82%E6%99%AE%E9%8E%AE-%E6%B2%83%E5%8D%A1%E6%9D%91-%E8%8D%94%E6%9E%9D%E8%99%95%E7%90%86%E5%A0%B4-%E6%B0%B4%E6%B4%97g1?variation=62db6c8a5a4235000a69436a',
      "Content-Type": "application/html; charset=utf-8"
    }, function printResult(data) {
      const parser = new DOMParser();
      // console.log(data);
      
      const xmlDoc = parser.parseFromString(data, "text/html");
      const docString = new XMLSerializer().serializeToString(xmlDoc);
      const result = convert.xml2js(docString, { compact: true });
      console.log(result);
      
      // setFeed(result)
    });
  }

  const getFeed = async () => {
    // setIsLoading(true)
    doCORSRequest({
      method: 'GET',
      url: 'https://shopline-feeds.s3.amazonaws.com/facebook_featured_products/inbocoffee.xml',
      "Content-Type": "application/xml; charset=utf-8"
    }, function printResult(data) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const docString = new XMLSerializer().serializeToString(xmlDoc);
      const result = convert.xml2js(docString, { compact: true }).rss.channel.item;
      setFeed(result)
    });
  }

  const cors_api_url = 'https://cors-anywhere.herokuapp.com/';
  function doCORSRequest(options, printResult) {
    const x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
      printResult(
        x.responseText
      );
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
  }

  return (
    <Wrapper>
      <h1>Inbo Feed</h1>
      {/* {JSON.stringify(feed)} */}
      {feed && feed.map((item,index) => {
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
  /* width: 40%; */
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
