import React, { useState, useEffect } from "react";
import useRouter from "../useRouter";
import Page from "../components/Page";
import Button from "../components/Button";
import { css } from "@emotion/core";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

const Thanks = (myprop) => {
  const { history } = useRouter();
  const [list, setList] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [toolong, setToolong] = useState(false);
  const [isMobile] = useState(window.innerWidth < 1040 || window.mobilecheck());
  // const frame = useRef(); // For Kate-runner (also import useRef)

  const SubmitButton = () => (
    <Button
      style={{ marginBottom: "2em" }}
      type="button"
      onClick={() => {
        history.push("/choose");
      }}
    >
      Next Page
    </Button>
  );

  const StartOver = (props) => (
    <Button
      style={{
        display: props.displ ? "inherit" : "none",
        position: props.blockit === "true" ? "static" : "absolute",
        left: "2em",
        top: "2em",
        border: "none",
        margin: props.blockit === "true" ? "1em 0 2em" : "inherit",
      }}
      type="button"
      onClick={() => {
        myprop.setInput("");
        myprop.setData(null);
        history.replace("/home");
      }}
    >
      Start Over
    </Button>
  );

  useEffect(() => {
    if (list) {
      setLoading(false);
    }
  }, [list]);

  useEffect(() => {
    if (myprop.results) {
      setList(myprop.results);
      // if (
      //   myprop.results.translations &&
      //   myprop.results.translations.length > 0
      // ) {
      //   history.push("/choose"); // For Dev: Mitigate Wait & Clicking
      // }
    }
  }, [myprop.results]);

  // useEffect(() => { // For Kate Runner auto-focus
  //   if (!myprop.animating) {
  //     document.querySelector("iframe").focus();
  //   }
  // }, [myprop.animating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToolong(true);
    }, 60000); // 60000 1min
    // }, 180000); // 180000 3min
    // }, 3000); // 3s, For Development
    return () => clearTimeout(timer);
  });

  return (
    <Page
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        background: isMobile ? "" : "url('kate-mack-web.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "20% 20%",
        backgroundPosition: "bottom left",
        backgroundColor: "#F2F2F2",
      }}
    >
      <Thankscontainer className="thanks-content">
        <StartOver blockit="true" displ={isMobile} />
        <h2 style={{ margin: "0 auto" }}>{`Hi ${myprop.inName}!`}</h2>
        <div
          className="fillerup"
          style={{
            display: "block",
            fontSize: "16px",
            maxWidth: "600px",
            marginBottom: "1.5em",
          }}
        >
          Thank you for visiting wycliffe.org.
          <br />
          <br />
          <h3>
            While you wait on your translation, please join us in praying.
          </h3>
          <ul
            style={{
              textAlign: "left",
              fontWeight: "normal",
            }}
          >
            <li style={{ margin: "1em 0" }}>
              Pray for those still waiting for Scripture in a language and
              format they can clearly understand.
            </li>
            <li style={{ margin: "1em 0" }}>
              Pray for quality translations that speak meaningfully to the
              hearts of Bibleless people.
            </li>
            <li style={{ margin: "1em 0" }}>
              Pray that the integrity of God's Word is maintained as it's
              translated.
            </li>
          </ul>
          {/* <Runnertext loading={loading.toString()}></Runnertext> */}
        </div>
        {toolong || !loading ? (
          <>
            <SubmitButton />
          </>
        ) : (
          <>
            <div className="sweet-loading">
              <ClipLoader
                css={override}
                sizeUnit={"px"}
                size={70}
                color={"#123abc"}
                loading={loading}
              />
            </div>
          </>
        )}
        {/* <div
          className="waiting-loader"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "800px",
            padding: "1em",
          }}
        >
          <Katerunner
            title="t-rex-runner"
            src="t-rex-runner/"
            width="800px"
            height="220px"
            ref={frame}
          />
        </div> */}
      </Thankscontainer>
      <StartOver displ={!isMobile} blockit="false" />
    </Page>
  );
};

const device = {
  mobileish: `(max-width: 700px)`,
  notDesktop: `(max-width: 1050px)`,
  sideScroller: `(max-width: 1445px)`,
};

const Thankscontainer = styled.div`
  background: white;
  padding: 1em;
  border-top: 8px solid #f04e36;
  box-shadow: 5px 5px 20px black;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${device.mobileish} {
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    display: block;
    max-width: 100%;
    overflow: scroll;
    font-size: large;
  }
`;

// const Runnertext = styled.span`
//   ::after {
//     content: "While we translate your name, help Kate overcome any obstacles in the
//     translation race!";

//     @media ${device.sideScroller} {
//       content: "${(props) =>
//         props.loading === "true" ? "Please wait while we translate!" : ""}";
//     }
//   }
// `;

// const Katerunner = styled.iframe`
//   background: white;
//   border: none;

//   @media ${device.sideScroller} {
//     display: none;
//   }
// `;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default Thanks;
