import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Cards = (cardsprop) => {
  const [flipped, setFlipped] = useState(false);
  let thisCard = cardsprop.cardprop;
  let aTranslit = cardsprop.aTransliteration;

  const cardClick = (e) => {
    // console.log('clicked', e.target, cardsprop);
    if (
      cardsprop.choice.includes(cardsprop.cardprop.language) ||
      cardsprop.cardsNumbered < 6
    ) {
      setFlipped(!flipped);
      let setCard = thisCard.language;
      let aNewArray = cardsprop.choice;
      if (aNewArray.includes(setCard)) {
        let choiceIndex = aNewArray.indexOf(setCard);
        aNewArray.splice(choiceIndex, 1);
        cardsprop.setChoice(aNewArray);
      } else {
        aNewArray.push(setCard);
        cardsprop.setChoice(aNewArray);
      }
      cardsprop.countit(cardsprop.choice.length);
    }
  };

  useEffect(() => {
    if (cardsprop.unflip) {
      setFlipped(false);
      cardsprop.setChoice([]);
      cardsprop.setUnflip(false);
    }
  }, [cardsprop]);

  return (
    <Card id={cardsprop.id} onClick={cardClick} flip={flipped}>
      <p
        style={{
          fontSize: "3em",
          marginBottom: "0",
          color: flipped ? "white" : "black",
          fontWeight: "300",
          fontFamily: aTranslit ? thisCard.language : "",
        }}
      >
        {thisCard.translation}
        <br />
        <span
          style={{
            color: flipped ? "white" : "#9B9B9B",
            fontSize: ".4em",
            fontWeight: "600",
            fontFamily: "Gotham SSm",
          }}
        >
          {thisCard.language.toUpperCase()}
        </span>
      </p>
      <span
        style={{
          position: "absolute",
          visibility: flipped ? "visible" : "hidden",
          top: ".3em",
          right: ".3em",
          height: "20px",
          width: "20px",
          borderRadius: "100%",
          fontSize: "1.5em",
          background: "white",
        }}
      >
        ✓
      </span>
    </Card>
  );
};

const device = {
  notDesktop: `(max-width: 1050px)`,
};

const Card = styled.div`
  background: ${(props) => (props.flip ? "#006168" : "white")};
  width: 23%;
  height: 150px;
  cursor: pointer;
  box-shadow: 0 0 10px #00000026;
  border-top: ${(props) => (props.flip ? "none" : "8px solid #F04E36")};
  border-radius: 0.4em;
  margin: 1em;
  transition: 0.3s ease;
  transform: none;
  filter: ${(props) =>
    props.flip ? "drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.3))" : "none"};
  :hover {
    transform: scale(1.05);
    filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.3));
    transition: 0.3s ease;
  }

  @media ${device.notDesktop} {
    min-width: 100%;
  }
`;

export default Cards;
