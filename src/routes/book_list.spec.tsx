import React from "react";
import { render, wait, waitForElement } from "@testing-library/react-native";
import { MockedProvider } from "@apollo/react-testing";
import { GraphQLError } from "graphql";

import { BookList, BOOKS_QUERY } from "./book_list";

describe("[routes] book_list", function() {
  let mockedRequest;

  const withNav: any = {
    navigation: {
      navigate: jest.fn(),
    },
  };

  it("should handle loading state", function() {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BookList {...withNav} />
      </MockedProvider>,
    );

    getByText("Loading...");
  });

  it("should handle error state", async function() {
    mockedRequest = {
      request: {
        query: BOOKS_QUERY,
      },
      result: {
        errors: [new GraphQLError("Custom error!")],
      },
    };

    const { getByText } = render(
      <MockedProvider mocks={[mockedRequest]} addTypename={false}>
        <BookList {...withNav} />
      </MockedProvider>,
    );

    await waitForElement(() => getByText("GraphQL error: Custom error!"));
  });

  it("should match snapshot", async function() {
    mockedRequest = {
      request: {
        query: BOOKS_QUERY,
      },
      result: {
        data: {
          books: [
            {
              id: "1",
              authors: "Ayn Rand",
              description:
                "Peopled by larger-than-life heroes and villains, charged with towering \
                          questions of good and evil, Atlas Shrugged is Ayn Rand’s magnum opus: \
                          a philosophical revolution told in the form of an action \
                          thriller—nominated as one of America’s best-loved novels by PBS’s \
                          The Great American Read.",
              rating: 3,
              thumbnail: "https://images-na.ssl-image.jpg",
              title: "Atlas Shrugged",
            },
          ],
        },
      },
    };

    const { baseElement } = render(
      <MockedProvider mocks={[mockedRequest]} addTypename={false}>
        <BookList {...withNav} />
      </MockedProvider>,
    );

    await wait(() => expect(baseElement).toMatchSnapshot());
  });
});
