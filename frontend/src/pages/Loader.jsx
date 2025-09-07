import React, { useState, useEffect } from 'react';
import '../styles/loader.css';

const jokes = [
  "Why don't skeletons fight each other? They don't have the guts.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don’t eggs tell jokes? They might crack up.",
  "I’m reading a book on anti-gravity. It’s impossible to put down.",
  "I used to play piano by ear, but now I use my hands.",
  "Why do cows wear bells? Because their horns don't work.",
  "Did you hear about the mathematician who’s afraid of negative numbers? He’ll stop at nothing to avoid them.",
  "I asked the librarian if the library had any books on paranoia. She whispered, 'They’re right behind you.'",
  "I told my computer I needed a break, and now it won’t stop sending me Kit-Kats.",
  "Why did the scarecrow win an award? Because he was outstanding in his field."
];
const Loader = () => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setJoke(randomJoke);
  }, []);

  return (
    <div className="loader-container">
      <div className="banter-loader">
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
      </div>
      <p className="dad-joke">{joke}</p>
    </div>
  );
};

export default Loader;