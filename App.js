import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";

export default function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const response = await fetch(
      "http://retailsapi.us-east-2.elasticbeanstalk.com/api/feedapp/getfeed",
      {
        method: "GET",
      }
    );

    const data = await response.json();
    setFeedData(data.products);
    setIsLoading(false);
  };
  const changeViewState = () => {
    const isVisible = isFormVisible;
    if (isVisible) {
      setIsFormVisible(false);
    } else {
      setIsFormVisible(true);
    }
  };

  const addNewProduct = async () => {
    const publisherUser = {
      name: "Bar suisa",
      id: "3984793",
      email: "Bars@funatix.club",
      mobile: "058-5220702",
    };
    //Check if state variables are not empty
    const response = await fetch(
      "http://retailsapi.us-east-2.elasticbeanstalk.com/api/feedapp/addfeed",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productName,
          productPrice: productPrice,
          productImage: productImage,
          publisher: publisherUser,
        }),
      }
    );
    const data = await response.json();
    loadData(data);
    setIsFormVisible(false);
  };

  return (
    <View style={styles.container}>
      {isFormVisible ? (
        <View style={styles.mainView}>
          <Text style={styles.title}>Post</Text>
          <TextInput
            placeholder="name"
            value={productName}
            autoCapitalize="none"
            onChangeText={(text) => setProductName(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="price"
            value={productPrice}
            onChangeText={(text) => setProductPrice(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Image"
            value={productImage}
            autoCapitalize="none"
            onChangeText={(text) => setProductImage(text)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.add} onPress={addNewProduct}>
            <Text style={styles.btntext2}>add</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainView}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#99cc00" />
          ) : (
            <View style={styles.viewFeed}>
              {feedData.length > 0 ? (
                <FlatList
                  data={feedData}
                  keyExtractor={(item) => item._id}
                  renderItem={(itemData) => (
                    <View style={{ width: "100%", marginVertical: 35 }}>
                      <View>
                        <Image
                          source={itemData.item.productImage}
                          style={styles.image1}
                        ></Image>
                      </View>
                      <Text style={styles.name}>
                        {itemData.item.productName}
                      </Text>
                      <Text>{itemData.item.productPrice}$</Text>
                    </View>
                  )}
                />
              ) : (
                <Text>No Data</Text>
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.menuView}>
        <TouchableOpacity onPress={changeViewState} style={styles.feedBtn}>
          <Text style={styles.btnText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={changeViewState} style={styles.addButton}>
          <Text style={styles.btnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  viewFeed: {
    width: "100%",
    marginLeft: 20,
  },
  input: {
    width: "10%",
    height: 40,
    backgroundColor: "#ebebeb",
  },
  btntext2: {
    borderWidth: 2,
    fontSize: 20,
    fontWeight: 600,
  },
  title: {
    fontSize: 60,
    marginTop: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 600,
  },
  image1: {
    width: 100,
    height: 100,
  },
  feedBtn: { width: "50%", backgroundColor: "#ffefdb", height: 50 },
  addButton: { width: "50%", backgroundColor: "#ebcdff", height: 50 },
  mainView: {
    height: "90%",
    width: "100%",
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnText: { color: "#000", fontSize: 20 },
  menuView: { height: "10%", flexDirection: "row", alignItems: "flex-end" },
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#ebebee",
    alignItems: "center",
  },
});
