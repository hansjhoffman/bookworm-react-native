import React from "react";
import { render } from "@testing-library/react-native";

import { Splash } from "./splash";

describe("[routes] splash", function() {
  it("should match snapshot", function() {
    const { baseElement } = render(<Splash />);

    expect(baseElement).toMatchSnapshot();
  });
});
