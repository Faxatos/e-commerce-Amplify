import React, { useState, useEffect } from "react";
import "./style.css"

function Snackbar(props) {
  const [classNames, setClassNames] = useState([]);
  const [active, isActive] = useState(null);

  let animationIn = "snackbar-in-from-side";
  let animationOut = "snackbar-out-from-side";
  let animationFull = "snackbar-full-from-side";

  if (props.animation === "fromTop") {
    animationIn = "snackbar-in-from-top";
    animationOut = "snackbar-out-from-top";
    animationFull = "snackbar-full-from-top";
  }

  const removeSnack = () => {
    console.log(animationOut);
    let buildClassNames = [];
    buildClassNames.push(animationOut);
    setClassNames(buildClassNames);

    setTimeout(() => {
      const item = props.removeSnack(props.id);
      if (!!item) {
        isActive(false); // only deactivate if already deleted
      }
    }, 300);
  };

  useEffect(() => {
    let buildClassNames = [];
    if (props.variant === "error") buildClassNames.push("snackbar-error");
    else if (props.variant === "success")
      buildClassNames.push("snackbar-success");
    else if (props.variant === "warning")
      buildClassNames.push("snackbar-warning");
    else {
      buildClassNames.push("snackbar-default");
    }

    if (props.dismiss) buildClassNames.push(animationIn);
    else if (!props.dismiss) buildClassNames.push(animationFull);

    setClassNames(buildClassNames);

    if (!props.dismiss) {
      setTimeout(() => {
        console.log(classNames);
        const item = props.removeSnack(props.id);
        if (!!item) {
          isActive(false); // only deactivate if already deleted
        }
      }, 1800);
    }
    if (active === null) isActive(true);
  }, []);

  return (
    active && (
      <div
        id={props.id}
        className={
          "snackbar-inner" +
          classNames
            .map(name => {
              return " " + name;
            })
            .join("")
        }
      >
        <p>{props.message}</p>
        {props.dismiss && (
          <button className="snackbar-dismiss" onClick={() => removeSnack()}>
            Dismiss
          </button>
        )}
      </div>
    )
  );
}

export default Snackbar;
