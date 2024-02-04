import React from "react";
import { render } from "@react-email/render";

import LoginCode from "./emails/login-code";

export const renderLoginCode = wrap(LoginCode);

function wrap<T extends (...args: any) => JSX.Element>(Comp: T) {
  return (props: Parameters<T>[0]) => {
    // @ts-ignore
    return render(<Comp {...(props || {})} />);
  };
}
