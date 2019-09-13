import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { NavigationContainerProps } from "react-navigation";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { BOOK_FRAGMENT } from "./book_detail";
import { Card, Error, Loading } from "../components";
import { Colors, Layout } from "../constants";
import { Book } from "../types";

export const BOOKS_QUERY = gql`
  query bookList {
    books {
      id
      ...BookDetail
    }
  }
  ${BOOK_FRAGMENT}
`;

export function BookList({ navigation }: NavigationContainerProps) {
  const { data, error, loading } = useQuery(BOOKS_QUERY);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  function _keyExtractor(item: Book): string {
    return item.id;
  }

  function _renderItem({ item }: { item: Book }) {
    return (
      <Card
        key={item.id}
        book={item}
        onPress={() =>
          navigation &&
          navigation.navigate({
            routeName: "book_detail",
            params: { id: item.id },
          })
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.columnWrapper}
        columnWrapperStyle={styles.multiColumns}
        data={data.books}
        initialNumToRender={6}
        keyExtractor={_keyExtractor}
        numColumns={2}
        renderItem={_renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    paddingTop: 100,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.margin_lg,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  menuIcon: {
    width: 23,
    height: 23,
    marginLeft: Layout.margin_lg,
    resizeMode: "contain",
    tintColor: Colors.iconSelected,
  },
  multiColumns: {
    justifyContent: "space-evenly",
  },
});
