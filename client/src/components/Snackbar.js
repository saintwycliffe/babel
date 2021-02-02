import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Snackbar = (myprop) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (myprop.errorMessage) {
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
        setTimeout(() => {
          myprop.resetError();
        }, 410);
      }, 3000);
    }
  }, [myprop]);

  return <Snackity isActive={isActive}>{myprop.errorMessage}</Snackity>;
};

const Snackity = styled.div`
  visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
  transition: 0.4s ease;
  transform: ${(props) =>
    props.isActive ? "translateY(-8vh)" : "translateY(10vh)"};
  background-color: #333;
  box-shadow: black 5px 5px 20px;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 16px;
  position: fixed;
  z-index: 9999;
  bottom: 30px;
  font-size: 1rem;
  font-weight: 300;
  position: absolute;
`;

export default Snackbar;
