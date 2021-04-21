import { useState, useEffect } from 'react';
import './App.css';

interface Props {
  id: number;
  shortened_url: string;
  original_url: string
};

function App() {

  const [shortenedURL, setShortenedURL] = useState<string>()
  const [linksArray, setLinksArray] = useState<Props[]>();
  const [error, setError] = useState<Error>();

  const handleInput = async (e: any) => {
    e.preventDefault();
    try {
      console.log(e.target[0].value)
      console.log(e.target[2].value)
      const originalURL = e.target[0].value;
      const customURL = e.target[2].value;
      const resOfPost = await fetch("https://arya-url.herokuapp.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({originalURL, customURL}),
      });
      if (resOfPost.status === 500) {
        throw await resOfPost.json()
      }      
      const newRow = await resOfPost.json()
      setShortenedURL(newRow.shortened_url)
    }
    catch (err) {
      console.log(err.message)
    }
  }

  const getLastTenLinks = async () => {
    try {
      const resOfPost = await fetch("https://arya-url.herokuapp.com", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const linksArr = await resOfPost.json();
      console.log(linksArr);
      setLinksArray(linksArr);
    }
    catch (err) {
      console.error(err.message)
    }
  }

  useEffect (() => {
    getLastTenLinks();
  }, [shortenedURL]);
  

  return (
    <>
    <form className="form_top" id="usrform" onSubmit={(e) => handleInput(e)}>
        <div className="text_area">
          <textarea id="post_content" className="form_text_area" name="post" form="usrform" placeholder="Enter URL here..." required={true}></textarea>
          <button className="copy_button" onClick={() => {navigator.clipboard.writeText((document.getElementById("post_content") as HTMLInputElement).value)}}>Copy</button>
        </div>
        <input className="form_input" type="text" name="customURL" placeholder="Custom URL"/>
        <input className="form_submit"type="submit" />
    </form>
    <div className="text_area">
      { shortenedURL ? <h3>Your latest shortened URL: <a href={`https://arya-url.herokuapp.com/${shortenedURL}`}>https://arya-url.herokuapp.com/{shortenedURL}</a></h3> : <></>}
      <br />
      { linksArray ? linksArray.map(({id, shortened_url, original_url}) => {
        return (
          <div key={id}>
            <div className="text_area"><br />
              Shortened URL: <a href={`https://arya-url.herokuapp.com/${shortened_url}`}>https://arya-url.herokuapp.com/{shortened_url}</a> <br/>
              Original URL: <a href={`${original_url}`}>{original_url}</a>
            </div>
            <br />
          </div>
        );
      }) : <></>}
    </div>
    </>
  );
}

export default App;
