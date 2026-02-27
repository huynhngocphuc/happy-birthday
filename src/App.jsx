import React, { useEffect, useState, useRef  } from 'react'
import './App.css'
import './LoveLetter.css'
import './BookCanvas.css'
import './ImageSlider.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import LoveLetter from './pages/LoveLetter'
import Test from './pages/Test'
import OpeningAnimation from './components/OpeningAnimation'
import music from "./assets/music/phodalenden.mp3";


const App = () => {

  const MyRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path='love-Letter' element={<LoveLetter />}></Route>
        <Route path='test' element={<Test />}></Route>
      </Route>
    </Route>
  ))


  // ------------------Cake loader 
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false); // New state for animation
  const audioRef = useRef(null);

  useEffect(() => {
    const startMusic = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.play().catch(() => {});
      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);

    return () => {
      window.removeEventListener("click", startMusic);
    };
  }, []);

  useEffect(() => {
    const handlePageLoad = () => {
      // setTimeout(() => setAnimateOut(true), 8400);
      // setTimeout(() => setLoading(false), 9000);
      setTimeout(() => setShowContent(true), 0);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={music} loop />


      {/* {
        loading && <OpeningAnimation animateOut={animateOut}/>
      } */}
      {
        showContent && <RouterProvider router={MyRoute} />
      }
    </>
  )
}

export default App