import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styled from "styled-components";
import useRouter from "../useRouter";
import Page from "../components/Page";
import Button from "../components/Button";
import Snackbar from "../components/Snackbar";

const maybeFocusRef = (ref) => {
  if (ref.current && document.activeElement !== ref.current) {
    ref.current.focus();
  }
};

const Home = (myprop) => {
  const { history } = useRouter();
  const [input, setInput] = useState("");
  const [errormessage, setErrormessage] = useState("");

  // Error-out OR Navigate
  const moveToNextPage = () => {
    if (!navigator.onLine) {
      setErrormessage(
        "You are not connected to the internet. Please ask for assistance."
      );
    } else if (!input) {
      setErrormessage("Field is empty. Please enter your first name.");
    } else {
      if (input.length > 16) {
        setErrormessage("Name is too long. Please re-enter your first name.");
        setInput("");
      } else {
        myprop.inSub(input);
        history.push("/thanks");
      }
    }
  };

  const SubmitInput = () => {
    const ref = useRef();

    useLayoutEffect(() => {
      !myprop.animating && maybeFocusRef(ref);
      return () => (ref.current = null);
    });

    // autoComplete="off"
    return (
      <Input
        type="text"
        id="myInput"
        value={input}
        ref={ref}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            moveToNextPage();
          }
        }}
      />
    );
  };

  const SubmitButton = () => (
    <Button
      type="button"
      onClick={() => {
        moveToNextPage();
      }}
    >
      That's my name!
    </Button>
  );

  // Snackbar Reset
  const resetError = () => {
    setErrormessage("");
  };

  useEffect(() => {
    if (myprop.skipThanks) {
      history.push("/choose");
    }
  }, [myprop.skipThanks, history]);

  return (
    <Page
      style={{
        background: "url('backing.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowY: "hidden",
      }}
    >
      <Container>
        <Entername>Enter your first name to begin.</Entername>
        <SubmitInput />
        <SubmitButton />
      </Container>
      <Logo />
      <Snackbar errorMessage={errormessage} resetError={resetError} />
    </Page>
  );
};

const device = {
  mobileish: `(max-width: 700px)`,
  notDesktop: `(max-width: 1050px)`,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 50%;
  background-color: white;
  padding: 2em;
  border-top: 8px solid #f04e36;
  box-shadow: 5px 5px 20px black;

  // @media ${device.notDesktop} {
  //  height: 100%;
  //  width: 100%;
  //  padding: 3em;
  // }

  @media ${device.mobileish} {
    padding: 1em;
  }
`;

const Logo = styled.div`
  background: url(Wycliffe_BibleTranslators_wht.png) no-repeat;
  background-size: cover;
  position: absolute;
  height: 60px;
  top: ${device.notDesktop ? "10%" : "15%"};
  width: 170px;

  // @media ${device.notDesktop} {
  //  filter: invert(1);
  //  top: 5%;
  // }
`;

const Entername = styled.h3`
  text-align: center;
  margin: 0;

  @media ${device.notDesktop} {
    font-size: large;
  }
`;

const Input = styled.input`
  padding: 0.4em 0.25em !important;
  width: 100% !important;
  font-size: 1em;
  position: relative;
  display: block;
  float: right;
  padding: 0.8em;
  width: 60%;
  border: none;
  border-radius: 0;
  color: #aaa;
  font-weight: bold;
  -webkit-appearance: none;
  text-align: center;

  :focus {
    outline: none;
  }

  @media ${device.notDesktop} {
    border: 1px solid lightgray;
    border-radius: 3px;
  }

  @media ${device.notDesktop} {
    font-size: large;
  }
`;

export default Home;
