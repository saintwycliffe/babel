import React, { useState, useEffect } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
import useRouter from "../useRouter";
import Button from "../components/Button";
import "./pardot.css";
import Snackbar from "../components/Snackbar";
// import {
//   FacebookIcon,
//   PinterestIcon,
//   InstagramIcon,
// } from "../components/Socialicons";
import { ClipLoader } from "react-spinners";
const axios = require("axios");

export default function Print(myprop) {
  const [modal, setModal] = useState(false);
  const [socialmodal, setSocialmodal] = useState(false);
  const [thanks, setThanks] = useState(false);
  const { history } = useRouter();
  const [senddigital, setSenddigital] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [wantemails, setWantemails] = useState(false);
  const [errormessage, setErrormessage] = useState("");
  const [saveimage, setSaveimage] = useState("");
  const [lockmobile, setLockmobile] = useState(false);
  const [mobileLoadingScreen, setMobileLoadingScreen] = useState(
    window.innerWidth < 1040 || window.mobilecheck()
  );

  useEffect(() => {
    console.log("fired");
    if (!myprop) {
      history.replace("/home");
    }
  }, [myprop, history]);

  const imageToState = () => {
    let input = document.querySelector(".print-me");
    html2canvas(input).then((canvas) => {
      setSaveimage(canvas.toDataURL("image/png"));
    });
  };

  // const printme = () => {
  //   let input = document.querySelector(".print-me");
  //   html2canvas(input).then((canvas) => {
  //     let imgData = canvas.toDataURL("image/png");
  //     let pdf = new jsPDF({
  //       orientation: "landscape",
  //       format: "letter",
  //     });
  //     // To Scale, then print ...
  //     // let width = pdf.internal.pageSize.getWidth();
  //     // let height = pdf.internal.pageSize.getHeight();
  //     // pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  //     pdf.addImage(imgData, "PNG", 0, 0);
  //     pdf.autoPrint();
  //     window.open(pdf.output("bloburl"), "_blank");
  //   });
  // };

  const saveme = () => {
    let input = document.querySelector(".print-me");
    html2canvas(input).then((canvas) => {
      let imgData = canvas.toDataURL("image/png");
      // Create PDF
      let pdf = new jsPDF({
        orientation: "landscape",
        format: "letter",
        putOnlyUsedFonts: true,
        compress: false,
      });
      pdf.addImage(imgData, "PNG", 0, 0);
      // pdf.save("download.pdf"); To Save PDF instead
      let thispdf = pdf.output("datauristring", "printout.pdf");
      let myPayLoad = {
        pdf: thispdf,
        printname: `${myprop.inName}`,
        user: {
          email: email,
          fname: fname,
          lname: lname,
        },
      };
      // Send PDF to Backend
      axios
        .post("/print", myPayLoad)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      // EndRoute
    });
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleSocialModal = () => {
    setSocialmodal(!socialmodal);
    if (saveimage) {
      setSaveimage("");
    }
  };

  const SubmitButton = ({ className = "" }) => (
    <Button
      style={{ position: "absolute", left: "2em", top: "2em" }}
      type="button"
      className={`start-over ${className || ""}`}
      onClick={() => {
        myprop.setInput("");
        myprop.setData(null);
        history.replace("/home");
      }}
    >
      Start Over
    </Button>
  );

  const updateFname = (e) => {
    setFname(e.target.value);
  };
  const updateLname = (e) => {
    setLname(e.target.value);
  };
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updateWantEmails = (e) => {
    setWantemails(e.target.checked);
  };

  const queryParams = (source) => {
    const array = [];

    for (const key in source) {
      array.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(source[key])
      );
    }

    return array.join("&");
  };

  const onSubmitPardot = (event) => {
    event.preventDefault();

    // If form incomplete, throw snackbar error
    if (!email || !fname || !lname) {
      setErrormessage("Please complete the form to proceed.");
      return;
    }

    // Send to backend to email user & print
    setSenddigital(true);
    setThanks(true);
    saveme();

    // Submit to Pardot
    let data = { email: email, "First Name": fname, "Last Name": lname };
    if (wantemails) {
      data["list-orlandoevents"] = "Subscribed";
    }
    let uriEncodedParams = queryParams(data);
    let targetUrl =
      "https://www2.wycliffe.org/l/26032/2015-04-17/3rnfly" +
      "?" +
      uriEncodedParams;

    fetch(targetUrl, {
      method: "POST",
      dataType: "jsonp",
      crossDomain: true,
      mode: "no-cors",
    })
      .then((response) => {
        return console.log(response, response.type === "opaque");
      })
      .catch((error) => {
        return console.log(error);
      });
  };

  // const onSubmitPrint = () => {
  // setThanks(true);
  // saveme();
  // };

  // https://stackoverflow.com/questions/29389361/share-quiz-results-on-facebook

  // useEffect(() => {
  //   if (thanks) {
  //     setTimeout(() => {
  //       setModal(false);
  //       setThanks(false);
  //     }, 3000);
  //   }
  // & Remove Print Button / Redirect ?
  // }, [thanks]);

  // Snackbar Reset
  const resetError = () => {
    setErrormessage("");
  };

  const printJob = `${
    senddigital
      ? "Digital version sent."
      : "Print job added and digital version sent."
  }`;

  // When done animating, stop mobile loading screen and open social share modal
  useEffect(() => {
    if (
      (window.innerWidth < 1040 || window.mobilecheck()) &&
      !myprop.animating
    ) {
      imageToState();
      setLockmobile(true);
      setTimeout(() => {
        setMobileLoadingScreen(false);
      }, 200);
    }
  }, [myprop.animating]);

  // Open social modal when image is saved
  useEffect(() => {
    if (saveimage) {
      setSocialmodal(true);
    }
  }, [saveimage]);

  return (
    <Finaldiv>
      <Modal modal={modal} style={{ zIndex: "5" }}>
        <div
          style={{
            position: "absolute",
            height: lockmobile ? "100%" : "80vh",
            width: lockmobile ? "100%" : "50vw",
            background: "white",
            display: lockmobile ? "block" : "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "8px solid rgb(240, 78, 54)",
            boxShadow: "black 5px 5px 20px",
            overflow: lockmobile ? "scroll" : "inherit",
          }}
        >
          <Closer onClick={toggleModal}>
            <svg preserveAspectRatio="none" viewBox="0 0 50 50">
              <title>Close</title>
              <polygon points="50,5 45,0 25,20 5,0 0,5 20,25 0,45 5,50 25,30 45,50 50,45 30,25"></polygon>
            </svg>
          </Closer>
          <RemodalWrapper
            className="remodal remodal-is-initialized remodal-is-opened"
            data-remodal-id="print"
            data-remodal-options="hashTracking: false"
            tabIndex="-1"
            senddigital={senddigital ? "none" : "flex"}
          >
            <CopyContainer
              className="copy"
              senddigital={senddigital ? "none" : "flex"}
            >
              <h2
                className="text--center well--small well--bottom"
                style={{
                  margin: ".3em",
                  padding: "0 1em",
                  color: "#47525a",
                  fontSize: "2.5em",
                  textAlign: "center",
                }}
              >
                {/* Want a digital copy, too? */}
                Want it emailed to you, too?
              </h2>
              <p
                className="text--center well--medium"
                style={{ maxWidth: "400px" }}
              >
                We'll send you a digital copy of your translations and keep you
                updated on all things Wycliffe with periodical emails.
              </p>
              <div className="email-modal form--signup">
                <form
                  className="floatlabels inline row well"
                  autoComplete="nope"
                  onSubmit={onSubmitPardot}
                >
                  <fieldset className="cell cell--1of4 well--tiny well--top">
                    <input
                      autoComplete="nope"
                      className="input__field input__field--isao"
                      type="text"
                      name="First Name"
                      id="First Name"
                      pattern=".{2,}"
                      required=""
                      title="Please enter your full first name."
                      value={fname}
                      onChange={updateFname}
                    />
                    <label
                      className="input__label input__label--isao"
                      data-content="First Name"
                      htmlFor="First Name"
                    >
                      <span className="input__label-content input__label-content--isao">
                        First Name
                      </span>
                    </label>
                  </fieldset>
                  <fieldset className="cell cell--1of4 well--tiny well--top">
                    <input
                      autoComplete="nope"
                      className="input__field input__field--isao"
                      type="text"
                      name="Last Name"
                      id="Last Name"
                      pattern=".{2,}"
                      required=""
                      title="Please enter your full last name."
                      value={lname}
                      onChange={updateLname}
                    />
                    <label
                      className="input__label input__label--isao"
                      data-content="Last Name"
                      htmlFor="Last Name"
                    >
                      <span className="input__label-content input__label-content--isao">
                        Last Name
                      </span>
                    </label>
                  </fieldset>
                  <fieldset className="cell cell--1of4 well--tiny well--top">
                    <input
                      autoComplete="nope"
                      className="input__field input__field--isao"
                      type="email"
                      name="email"
                      id="email"
                      required=""
                      value={email}
                      onChange={updateEmail}
                    />
                    <label
                      className="input__label input__label--isao"
                      data-content="Email Address"
                      htmlFor="email"
                    >
                      <span className="input__label-content input__label-content--isao">
                        Email Address
                      </span>
                    </label>
                  </fieldset>
                  <div style={{ color: "rgb(71, 82, 90)", padding: "1em 0 0" }}>
                    <span style={{ display: "flex" }}>
                      <input
                        id="list-orlandoevents"
                        name="list-orlandoevents"
                        type="checkbox"
                        value="Subscribed"
                        checked={wantemails}
                        onChange={updateWantEmails}
                      />
                      <label
                        className="inline text--white text--bold"
                        htmlFor="list-orlandoevents"
                      >
                        I want emails about local Wycliffe events in Orlando.
                      </label>
                    </span>
                  </div>
                  <fieldset
                    className="cell cell--1of4 well--tiny well--top"
                    style={{ margin: "0 auto" }}
                  >
                    <input
                      value="Yes!"
                      readOnly
                      className="btn btn--secondary btn--full"
                      style={{
                        marginTop: "2em",
                        border: "2px solid #e64c38",
                        textAlign: "center",
                      }}
                      onClick={(e) => {
                        onSubmitPardot(e);
                      }}
                    />
                  </fieldset>
                  <input
                    type="hidden"
                    name="data[_Token][key]"
                    value="16f2ed6d990de796af077358dbc3fcc0a1330b8f"
                  />
                  <p
                    className="text--center well--medium"
                    style={{
                      maxWidth: "400px",
                      alignSelf: "center",
                      fontSize: 10,
                    }}
                  >
                    By submitting this form you confirm that you are 13 years of
                    age or older.
                  </p>
                </form>
              </div>
              <div
                className="cell cell--full well--deep text--center form--thankyou is-hidden"
                style={{ display: "none" }}
              >
                <h2 className="text--white text--bold">Thank You!</h2>
              </div>
            </CopyContainer>
          </RemodalWrapper>
          {thanks && (
            <div
              style={{
                color: "#47525A",
                textAlign: "center",
                fontSize: "2em",
                maxWidth: "600px",
                fontWeight: "600",
              }}
            >
              <p>{printJob}</p>
              <br />
              <p>Thank you for visiting Wycliffe.org!</p>
            </div>
          )}
          {/* <Button
            ghost
            style={{ display: thanks ? "none" : "block" }}
            onClick={onSubmitPrint}
          >
            No thanks, just print
          </Button> */}
        </div>
      </Modal>
      <Modal modal={socialmodal} style={{ zIndex: "4" }}>
        <div
          style={{
            position: "absolute",
            height: lockmobile ? "100vh" : "80vh",
            width: lockmobile ? "100vw" : "50vw",
            background: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "8px solid rgb(240, 78, 54)",
            boxShadow: "black 5px 5px 20px",
            color: "#47525a",
            overflow: "hidden",
          }}
        >
          <Closer
            onClick={toggleSocialModal}
            style={{ display: lockmobile ? "none" : "block" }}
          >
            <svg preserveAspectRatio="none" viewBox="0 0 50 50">
              <title>Close</title>
              <polygon points="50,5 45,0 25,20 5,0 0,5 20,25 0,45 5,50 25,30 45,50 50,45 30,25"></polygon>
            </svg>
          </Closer>
          <SubmitButton className={`${lockmobile ? "" : "share-start-over"}`} />
          <h1 style={{ textAlign: "center" }}>Download and Share!</h1>
          <div
            style={{
              filter: "drop-shadow(2px 4px 6px black)",
              transform: "rotate(-3deg)",
            }}
          >
            <img
              style={{ maxHeight: "300px", maxWidth: "300px" }}
              src={saveimage}
              alt="My Name from Wycliffe"
            />
          </div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              paddingInlineStart: "unset",
            }}
          >
            {/* <FacebookIcon
              fill={"#3e65a3"}
              style={{ margin: "0 0.1em", cursor: "pointer" }}
            />
            <PinterestIcon
              fill={"#bd081c"}
              style={{ margin: "0 0.1em", cursor: "pointer" }}
            />
            <InstagramIcon
              fill={"#42261c"}
              style={{ margin: "0 0.1em", cursor: "pointer" }}
            /> */}
            <div
              style={{
                color: "#47525A",
                backgroundColor: "#47525A",
                height: "40px",
                width: "40px",
                padding: "0.5em",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a
                download={`${myprop.inName}_Wycliffe.png`}
                href={saveimage}
                target="__blank"
              >
                <img
                  src="download.svg"
                  alt="download"
                  style={{ height: "20px" }}
                />
              </a>
            </div>
          </ul>
          {lockmobile && (
            <Button
              style={{ position: "absolute", left: "2em", bottom: "2em" }}
              onClick={() => {
                toggleModal();
              }}
            >
              Email Me
            </Button>
          )}
        </div>
      </Modal>
      <Globe />
      <Controls>
        <SubmitButton />
        <Button
          style={{ position: "absolute", left: "2em", bottom: "2em" }}
          onClick={() => {
            imageToState();
          }}
        >
          Share
        </Button>
        {/* <Button
          onClick={sendStuff}
          style={{ position: "absolute", right: "2em", top: "2em" }}
        >
          Send Stuff!
        </Button> */}
        <Button
          onClick={toggleModal}
          style={{ position: "absolute", right: "2em", bottom: "2em" }}
        >
          Email Me
        </Button>
      </Controls>
      <Finalpage className="print-me">
        <Onediv />
        <Onediv>
          <Translation
            style={{
              fontFamily:
                myprop.print[0].language === "Hieroglyphics"
                  ? "Hieroglyphics"
                  : "",
            }}
          >
            {myprop.print[0].translation}
          </Translation>
          <Language>{myprop.print[0].language}</Language>
        </Onediv>
        <Onediv />
        <Onediv alignMeLeft="true">
          <div>
            <Translation
              style={{
                fontFamily:
                  myprop.print[1].language === "Goauld-Stargate"
                    ? "Goauld-Stargate"
                    : "",
              }}
            >
              {myprop.print[1].translation}
            </Translation>
            <Language>{myprop.print[1].language}</Language>
          </div>
        </Onediv>
        <Onediv />
        <Onediv alignMeLeft="false">
          <div>
            <Translation
              style={{
                fontFamily:
                  myprop.print[2].language === "Tengwar-Lord of the Rings"
                    ? "Tengwar-Lord of the Rings"
                    : "",
              }}
            >
              {myprop.print[2].translation}
            </Translation>
            <Language>{myprop.print[2].language}</Language>
          </div>
        </Onediv>
        <Onediv />
        <Onediv />
        <Onediv />
        <Onediv alignMeLeft="true">
          <div>
            <Translation
              style={{
                fontFamily:
                  myprop.print[3].language === "Kryptonian-Superman"
                    ? "Kryptonian-Superman"
                    : "",
              }}
            >
              {myprop.print[3].translation}
            </Translation>
            <Language>{myprop.print[3].language}</Language>
          </div>
        </Onediv>
        <Onediv />
        <Onediv alignMeLeft="false">
          <div>
            <Translation
              style={{
                fontFamily:
                  myprop.print[4].language === "Klingon-Star Trek"
                    ? "Klingon-Star Trek"
                    : "",
              }}
            >
              {myprop.print[4].translation}
            </Translation>
            <Language>{myprop.print[4].language}</Language>
          </div>
        </Onediv>
        <Onediv />
        <Onediv>
          <Translation
            style={{
              fontFamily:
                myprop.print[5].language === "American Sign Language"
                  ? "American Sign Language"
                  : "",
              fontSize:
                myprop.print[5].language === "American Sign Language"
                  ? "2em"
                  : "1em",
            }}
          >
            {myprop.print[5].translation}
          </Translation>
          <Language>{myprop.print[5].language}</Language>
        </Onediv>
        <Onediv />
        <Name style={{ zIndex: 2 }}>{myprop.inName}</Name>
        <Globe style={{ zIndex: 1 }} />
        <Disclosure>
          This simple translation or transliteration is for entertainment only.
          Wycliffe is an interdenominational, non-sectarian, 501(c)(3)
          tax-exempt, non-profit mission organization, and a charter member of
          the ECFA. ©{new Date().getFullYear()} Wycliffe Bible Translators. All
          rights reserved.
        </Disclosure>
      </Finalpage>
      <MobileOverlay
        style={{
          display: mobileLoadingScreen ? "flex" : "none",
          backgroundColor: "white",
        }}
      >
        <div className="sweet-loading">
          <ClipLoader
            sizeUnit={"px"}
            size={70}
            color={"#123abc"}
            loading={true}
          />
        </div>
      </MobileOverlay>
      <Snackbar errorMessage={errormessage} resetError={resetError} />
    </Finaldiv>
  );
}

const Disclosure = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 10px;
  font-weight: normal;
  color: lightgrey;
  text-align: center;
`;

const RemodalWrapper = styled.div`
  display: ${(props) => props.senddigital};
  justify-content: center;
  height: 100vh;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CopyContainer = styled.div`
  display: ${(props) => props.senddigital};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MobileOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const Finaldiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Controls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: bold;
  color: #47525a;
  padding: 1em;
  z-index: 2;
`;

const Globe = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(globe.png) no-repeat;
  background-size: cover;
  height: 410px;
  width: 466px;
`;

const Finalpage = styled.main`
  position: relative;
  min-width: 279.4mm;
  min-height: 215.9mm;
  max-width: 279.4mm;
  max-height: 215.9mm;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: bold;
  color: #47525a;
  padding: 1em;
  z-index: 1;
`;

const Onediv = styled.div`
  width: calc(100% / 3);
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) =>
    props.alignMeLeft
      ? props.alignMeLeft === "true"
        ? "baseline"
        : "flex-end"
      : "center"};
  padding: ${(props) => (props.alignMeLeft ? ".5em" : "none")};
`;

const Translation = styled.p`
  font-size: 1em;
  margin-top: 0;
  margin-bottom: 0.1em;
  font-weight: 300;
  text-align: center;
  color: black;
`;

const Language = styled.p`
  color: #9b9b9b;
  font-size: 0.3em;
  font-weight: 600;
  margin: 0;
  margin-top: 0.1em;
  padding-bottom: 0.5em;
  text-align: center;
`;

const Name = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  font-size: 1.2em;
  justify-content: center;
  align-items: center;
  // color: #47525a;
  color: black;
`;

const Modal = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.modal ? "flex" : "none")}
  background-color: rgba(0, 0, 0, 0.8);
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Closer = styled.div`
  color: black;
  position: absolute;
  font-size: 2em;
  top: 2%;
  right: 4%;
  cursor: pointer;
  height: 25px;
  width: 25px;
`;
