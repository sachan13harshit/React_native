import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Alert,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authApi, productApi } from "@/utils/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
  stock?: number;
}

const home = () => {
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = "";
      if (selectedCategory) {
        query = `?category=${selectedCategory}`;
      }
      const data = await productApi.getAllProducts(query);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await authApi.logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  // Minimal placeholder data (UI only)
  const categories = [
    { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100" },
    { id: 2, name: "Vegetables", icon: "🥬", color: "bg-green-100" },
    { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100" },
    { id: 4, name: "Electronics", icon: "🥛", color: "bg-blue-100" },
    { id: 5, name: "Clothes", icon: "🥛", color: "bg-blue-100" },
    { id: 6, name: "Snacks", icon: "🥛", color: "bg-blue-100" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View className="bg-emerald-600 px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-white text-xs opacity-90">Delivery to</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-base font-bold mr-1">
                  Home (v2)
                </Text>
                <Text className="text-white text-lg">▼</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-white/20 px-3 py-2 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  📍 Change
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white/20 px-3 py-2 rounded-full"
                onPress={handleLogout}
              >
                <Text className="text-white text-xs font-semibold">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-white rounded-xl px-4 py-3 flex-row items-center">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Search for products..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Delivery Banner */}

        <View className="bg-emerald-50 px-4 py-3 flex-row items-center justify-between border-b border-emerald-100">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">⚡</Text>
            <View>
              <Text className="text-emerald-800 font-bold text-sm">
                Delivery in 10-15 mins
              </Text>
              <Text className="text-emerald-600 text-xs">
                Express delivery available
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text className="text-emerald-600 font-semibold text-xs">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}

        <View className="px-4 py-4 bg-white">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                className="items-center mr-4"
              >
                <View
                  className={`w-16 h-16 rounded-full ${item.color} items-center justify-center mb-2 ${selectedCategory === item.name ? 'border-2 border-emerald-600' : ''}`}
                >
                  <Text className="text-3xl">{item.icon}</Text>
                </View>
                <Text className={`text-xs font-medium ${selectedCategory === item.name ? 'text-emerald-600 font-bold' : 'text-gray-700'}`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">
              {selectedCategory ? `${selectedCategory}` : 'Best Sellers'}
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text className="text-emerald-600 font-semibold text-sm">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="p-4">
              <Text>Loading products...</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  className="bg-white rounded-xl p-3 mr-3 shadow-sm border border-gray-100"
                  style={{ width: 150 }}
                >
                  <View className="w-full h-24 bg-gray-50 rounded-lg items-center justify-center mb-2">
                    {item.imageUrl && item.imageUrl.startsWith('http') ? (
                      <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
                    ) : (
                      <Text className="text-5xl">📦</Text>
                    )}
                  </View>

                  <Text
                    className="text-sm font-semibold text-gray-800"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.category}</Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-lg font-bold text-emerald-600">
                      ₹{item.price}
                    </Text>
                    <TouchableOpacity className="bg-emerald-600 px-3 py-1 rounded-lg">
                      <Text className="text-white text-xs font-semibold">
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <View className="p-4">
                  <Text>No products found in this category.</Text>
                </View>
              }
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
