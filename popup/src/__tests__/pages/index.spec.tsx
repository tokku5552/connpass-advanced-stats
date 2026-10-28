import { render, screen } from "@testing-library/react";
import type { AppProps } from "next/app";
import App from "@/pages/_app";
import Home from "@/pages/index";

// pages/ 配下に置くと Next がページとしてビルドするため、__tests__ に置く
describe("popup page", () => {
  test("renders the home page through the custom App (ChakraProvider)", () => {
    render(
      <App
        Component={Home}
        pageProps={{}}
        router={{} as AppProps["router"]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "connpass advanced stats" })
    ).toBeTruthy();
  });
});
