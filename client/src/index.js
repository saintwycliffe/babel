import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import useRouter from "./useRouter";
import GlobalStyles from "./styles";
import Home from "./pages/Home";
import Thanks from "./pages/Thanks";
import Choose from "./pages/Choose";
import Print from "./pages/Print";
import mobileAndTabletCheck from "./components/Mobiletabletcheck";

const App = () => {
  const { history } = useRouter();
  const { location } = useRouter();
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const [print, setPrint] = useState([]);
  const [skipthanks, setSkipthanks] = useState(false);
  const [animating, setAnimating] = useState(false);
  const transitions = useTransition(location, (location) => location.pathname, {
    from: { opacity: 0, transform: "translate3d(100vw, 0, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(-100vw, 0, 0)" },
    onStart: (_, phase) => phase === "enter" && setAnimating(true),
    onRest: (_) => setAnimating(false),
  });

  const updateData = async (inName) => {
    const response = await fetch(`/lingolab?name=${inName}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  const removeSkip = () => {
    setSkipthanks(false);
  };

  const inSub = function (hinput) {
    let trimName = hinput.trim().toLowerCase();
    let editName = trimName.charAt(0).toUpperCase() + trimName.slice(1);
    if (hinput && trimName) {
      setInput(editName);
      updateData(editName)
        .then((res) => {
          if (res.skipThanks) {
            setSkipthanks(true);
          }
          setData(res.express);
        })
        .catch((err) => console.log(err));
    }
  };

  window.mobilecheck = mobileAndTabletCheck;

  useEffect(() => {
    history.replace("/home");
  }, [history]);

  return (
    <>
      <GlobalStyles />
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Switch location={item}>
            <Route
              exact
              path="/home"
              render={(props) => (
                <Home
                  {...props}
                  inSub={inSub}
                  results={data ? data : null}
                  skipThanks={skipthanks}
                  animating={animating}
                />
              )}
            />
            <Route
              exact
              path="/thanks"
              render={(props) => (
                <Thanks
                  {...props}
                  inName={input}
                  results={data ? data : null}
                  setInput={setInput}
                  setData={setData}
                  animating={animating}
                />
              )}
            />
            <Route
              exact
              path="/choose"
              render={(props) => (
                <Choose
                  {...props}
                  inName={input}
                  results={data ? data : null}
                  setPrint={setPrint}
                  removeSkip={removeSkip}
                  setInput={setInput}
                  setData={setData}
                />
              )}
            />
            <Route
              exact
              path="/print"
              render={(props) => (
                <Print
                  {...props}
                  inName={input}
                  print={print}
                  setInput={setInput}
                  setData={setData}
                  animating={animating}
                />
              )}
            />
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
