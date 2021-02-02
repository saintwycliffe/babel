import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useRouter from "../useRouter";
import Cards from "../components/Cards";
import Button from "../components/Button";

const Choose = (myprop) => {
  const { history } = useRouter();
  const [list, setList] = useState(undefined);
  const [choice, setChoice] = useState([]);
  const [count, setCount] = useState(0);
  const [unflip, setUnflip] = useState(false);
  const [movement, setMovement] = useState(false);
  const [ismobile] = useState(window.innerWidth < 1040 || window.mobilecheck());
  const transliterations = [
    "Hieroglyphics",
    "Goauld-Stargate",
    "Tengwar-Lord of the Rings",
    "Kryptonian-Superman",
    "Klingon-Star Trek",
    "American Sign Language",
  ];
  let myTranslitArray = [];
  transliterations.forEach((translit) => {
    let translitObj = {};
    translitObj.language = translit;
    translitObj.translation = myprop.inName;
    myTranslitArray.push(translitObj);
  });

  const filterByChoice = (item) => {
    if (choice.includes(item.language)) {
      return true;
    }
    return false;
  };

  const SubmitButton = () => (
    <Button
      style={{ right: "1em", position: "absolute" }}
      type="button"
      onClick={() => {
        history.replace("/print");
      }}
    >
      Next Page
    </Button>
  );

  const StartOver = () => (
    <Button
      style={{ position: "absolute", left: "2em", top: "2em", border: "none" }}
      type="button"
      onClick={() => {
        setMovement(true);
        myprop.setInput("");
        myprop.setData(null);
        history.replace("/home");
      }}
    >
      Start Over
    </Button>
  );

  const clickedCounter = (newCount) => {
    setCount(newCount);
  };

  useEffect(() => {
    if (myprop.results) {
      setList(myprop.results);
      myprop.removeSkip();
    } else {
      if (!movement) {
        console.log(movement, "Wha");
        myprop.setPrint(myTranslitArray);
        history.replace("/print");
      }
    }
  }, [myprop, history, movement, myTranslitArray]);

  useEffect(() => {
    if (count === 6) {
      if (list) {
        let filteredArray = list.translations.filter(filterByChoice);
        myprop.setPrint(filteredArray);
      } else {
        myprop.setPrint(myTranslitArray);
      }
    }
  }, [count]);

  useEffect(() => {
    if (!unflip) {
      setCount(0);
    }
  }, [unflip]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontSize: "50px",
        fontWeight: "bold",
        color: "#47525A",
        overflow: "auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "block",
          backgroundColor: "#F2F2F2",
        }}
      >
        <Topcopy>
          <h2 style={{ marginBottom: 0 }}>{`Hi ${myprop.inName}!`}</h2>
          <p style={{ fontSize: ".4em", fontWeight: "300" }}>
            See your name in all these languages?
            <br />
            Choose six for your custom download.
            <br />
          </p>
          {!list && (
            <>
              <br />
              <h3 style={{ margin: "0 auto" }}>Transliterations:</h3>
            </>
          )}
        </Topcopy>
        <div
          className="fillerup"
          style={{ display: "block", fontSize: "12px", padding: "0 4em" }}
        >
          <div
            className="card-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {list && (
              <>
                {list.translations.map((item, index) => (
                  <Cards
                    key={index.toString()}
                    id={"card-" + index.toString()}
                    cardprop={item}
                    cardsNumbered={count}
                    choice={choice}
                    setChoice={setChoice}
                    countit={clickedCounter}
                    unflip={unflip}
                    setUnflip={setUnflip}
                  />
                ))}
              </>
            )}
            {!list && (
              <>
                {myTranslitArray.map((item, index) => (
                  <Cards
                    aTransliteration="true"
                    passStyle={{ fontFamily: item.translation }}
                    key={index.toString()}
                    id={"card-" + index.toString()}
                    cardprop={item}
                    cardsNumbered={count}
                    choice={choice}
                    setChoice={setChoice}
                    countit={clickedCounter}
                    unflip={unflip}
                    setUnflip={setUnflip}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <Navbar count={count} mobile={ismobile}>
          <Button
            style={{ left: "1em", position: "absolute" }}
            onClick={() => setUnflip(true)}
          >
            {"Deselect all".toUpperCase()}
          </Button>
          <Circle>{count}</Circle>
          <Bottomcopy>
            LANGUAGES SELECTED.{" "}
            <SelectMore count={count}>
              PLEASE SELECT {6 - count} MORE.
            </SelectMore>
          </Bottomcopy>
          {count === 6 && <SubmitButton />}
        </Navbar>
      </div>
      <StartOver />
    </div>
  );
};

const device = {
  mobileish: `(max-width: 700px)`,
  notDesktop: `(max-width: 1050px)`,
};

const Topcopy = styled.div`
  padding: 1em;
  max-width: 50%;
  margin: 0 auto;

  @media ${device.mobileish} {
    max-width: none;
    font-size: xx-large;
    padding: 2em;
  }
`;

const Circle = styled.div`
  border-radius: 50%;
  width: 35px;
  height: 35px;
  padding: 6px;
  background: #006168;
  color: white;
  text-align: center;
  font-size: 1.2em;

  @media ${device.mobileish} {
    display: none;
  }
`;

const Navbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 0;
  width: 100%;
  height: ${(props) => (props.ismobile ? "15vh" : "8vh")};
  background: white;
  box-shadow: 0px 0px 13px -4px;
  transition: 0.3s ease;
  transform: ${(props) =>
    props.count > 0 ? "translateY(0vh)" : "translateY(8vh)"};
  font-size: 0.3em;
`;

const Bottomcopy = styled.p`
  padding: 1em;

  @media ${device.mobileish} {
    display: none;
  }
`;

// Add React Spring Fade!
const SelectMore = styled.span`
  transition: 0.25s;
  opacity: ${(props) => (props.count < 6 ? 1 : 0)};
  display: ${(props) => (props.count < 6 ? "inline-block" : "none")};
`;

export default Choose;
