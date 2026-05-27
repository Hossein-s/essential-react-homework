import { Ionicons } from '@expo/vector-icons';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Fab } from '../components/Fab';
import useLotteries from '../hooks/useLotteries';
import { useRegisteredLotteries } from '../hooks/useRegisteredLotteries';
import { stackHeaderOptions } from '../navigation/headerOptions';
import type { RootStackParamList } from '../types';
import { Lottery } from '../types';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const [search, setSearch] = useState('');
  const [selectedLotteries, setSelectedLotteries] = useState<Array<Lottery>>(
    [],
  );

  const { data: lotteries, loading, fetchLotteries } = useLotteries();
  const {
    data: registeredLotteryIds,
    getRegisteredLotteries,
  } = useRegisteredLotteries();

  const lotteryRegistered = route.params?.lotteryRegistered;

  useLayoutEffect(() => {
    navigation.setOptions({
      ...stackHeaderOptions,
      title: 'Lotteries',
    });
  }, [navigation]);

  useEffect(() => {
    if (lotteryRegistered) {
      setSelectedLotteries([]);
      navigation.setParams({ lotteryRegistered: undefined });
    }
  }, [lotteryRegistered, navigation]);

  useEffect(() => {
    setSelectedLotteries((prev) =>
      prev.filter((l) => !registeredLotteryIds.includes(l.id)),
    );
  }, [registeredLotteryIds]);

  useFocusEffect(
    useCallback(() => {
      fetchLotteries();
      getRegisteredLotteries();
    }, [fetchLotteries, getRegisteredLotteries]),
  );

  const filteredLotteries = useMemo(() => {
    return lotteries.filter((lottery) =>
      lottery.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, lotteries]);

  const toggleSelectedLottery = (lottery: Lottery) => {
    setSelectedLotteries((prev) =>
      prev.includes(lottery)
        ? prev.filter((l) => l.id !== lottery.id)
        : [...prev, lottery],
    );
  };

  const isLotterySelected = (lottery: Lottery) => {
    return selectedLotteries.some((l) => l.id === lottery.id);
  };

  const isLotteryRegistered = (lottery: Lottery) =>
    registeredLotteryIds.includes(lottery.id);

  return (
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        {selectedLotteries.length > 0 ? (
          <Pressable
            onPress={() => {
              navigation.navigate('RegisterToLottery', {
                lotteries: selectedLotteries,
              });
            }}
            style={styles.registerButton}
          >
            <Text>Register</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Lotteries</Text>
        <Ionicons name="dice" size={34} color="black" />
      </View>
      {loading ? (
        <Ionicons name="sparkles" size={34} color="black" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              onChangeText={setSearch}
            />
          </View>
          <FlatList
            style={styles.list}
            data={filteredLotteries}
            renderItem={({ item }) => {
              const registered = isLotteryRegistered(item);
              return (
                <Pressable
                  key={item.id}
                  disabled={registered}
                  onPress={() => {
                    if (!registered) {
                      toggleSelectedLottery(item);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.lotteryContainer,
                      isLotterySelected(item) && styles.selectedLotteryContainer,
                      registered && styles.registeredLotteryContainer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.lotteryName,
                        registered && styles.lotteryTextRegistered,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.lotteryPrize,
                        registered && styles.lotteryTextRegistered,
                      ]}
                    >
                      {item.prize}
                    </Text>
                    <Text
                      style={[
                        styles.lotteryId,
                        registered && styles.lotteryTextRegistered,
                      ]}
                    >
                      {item.id}
                    </Text>

                    <View style={styles.lotteryCheckboxContainer}>
                      {registered ? (
                        <Ionicons name="checkmark-done-outline" size={24} color="#888" />
                      ) : isLotterySelected(item) ? (
                        <Ionicons name="checkmark-outline" size={24} />
                      ) : (
                        <Ionicons name="square-outline" size={24} />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lotteriesContainer}
            ItemSeparatorComponent={() => (
              <View style={styles.lotterySeparator} />
            )}
            ListEmptyComponent={<Text>No lotteries found</Text>}
          />
        </>
      )}
      <Fab
        accessibilityLabel="Add lottery"
        onPress={() => {
          navigation.navigate('AddLottery');
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginRight: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderRadius: 8,
  },
  list: {
    flex: 1,
  },
  lotteriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 88,
  },
  lotteryContainer: {
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  lotteryName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lotteryPrize: {
    fontSize: 16,
    marginBottom: 4,
  },
  lotteryId: {
    fontSize: 14,
    color: '#999',
  },
  lotterySeparator: {
    height: 1,
    marginVertical: 4,
  },
  selectedLotteryContainer: {
    backgroundColor: '#f0f0f0',
  },
  registeredLotteryContainer: {
    opacity: 0.65,
    backgroundColor: '#e8e8e8',
    borderColor: '#bbb',
  },
  lotteryTextRegistered: {
    color: '#888',
  },
  lotteryCheckboxContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  registerContainer: {
    height: 30,
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#c5c6c7',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
  },
});
