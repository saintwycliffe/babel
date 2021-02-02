import { createGlobalStyle } from "styled-components";
import myPhoenician from "./fonts/Earlprg_-webfont.woff2";
import myGotham from "./fonts/GothamSSm-Book.ttf";
import myAmericanSign from "./fonts/americansign-webfont.woff2";
import myKlingon from "./fonts/klingon_font-webfont.woff2";
import myKryptonian from "./fonts/kryptonian-webfont.woff2";
import myTengwar from "./fonts/tngan-webfont.woff2";
import myGoauld from "./fonts/stargate__sg1_goauld-webfont.woff2";
import myHiero from "./fonts/AncientEgyptianHieroglyphs-webfont.woff2";

export default createGlobalStyle`
  @font-face {
    font-family: 'Gotham SSm';
    src: local('Gotham SSm'), local('Gotham'),
      url('${myGotham}') format('ttf');
  }
  @font-face {
    font-family: 'phoenician';
    src: url('${myPhoenician}') format('woff2');
  }
  @font-face {
    font-family: 'American Sign Language';
    src: url('${myAmericanSign}') format('woff2');
  }
  @font-face {
    font-family: 'Klingon-Star Trek';
    src: url('${myKlingon}') format('woff2');
  }
  @font-face {
    font-family: 'Kryptonian-Superman';
    src: url('${myKryptonian}') format('woff2');
  }
  @font-face {
    font-family: 'Tengwar-Lord of the Rings';
    src: url('${myTengwar}') format('woff2');
  }
  @font-face {
    font-family: "Goauld-Stargate";
    src: url('${myGoauld}') format('woff2');
  }
  @font-face {
    font-family: 'Hieroglyphics';
    src: url('${myHiero}') format('woff2');
    font-size: 2em; 
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: white;
    -webkit-font-smoothing: antialiased; 
    -moz-osx-font-smoothing: grayscale; 
  }

  body {
    font-family: Gotham SSm, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica,
      ubuntu, roboto, noto, segoe ui, arial, sans-serif;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    color: #ffffff;
  }
`;
