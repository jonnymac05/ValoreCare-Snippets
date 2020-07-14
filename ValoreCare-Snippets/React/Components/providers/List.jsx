import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
});

export const List = () => <Text style={styles.bulletPoint}>•</Text>;

export default List;
