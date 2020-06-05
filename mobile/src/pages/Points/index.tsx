import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
    id: number,
    title: string;
    image_url: string;
}
interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
}
interface Params{
    uf: string;
    city: string;
}

const Points = () => {
    // Armazenar itens do banco
    const [items, setItems] = useState<Item[]>([]);
    // Para armazenar os itens que foram selecionados
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    // Salvar pontos
    const [points, setPoints] = useState<Point[]>([]);
    // Salvar localização atual do usuário
    const [initialPostion, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();

    // Utilizado para pegar os parâmetros da tela anterior
    // neste caso: UF e ciddade
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        async function loadPostion() {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Ops', 'Precisamos de sua permissão para obter a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;
            setInitialPosition([
                latitude,
                longitude
            ]);
        }

        loadPostion();
    }, []);

    useEffect(() => {
        api.get('/items').then(response => {
            setItems(response.data);
        })
    }, []);

    // useEffects para carregar os pontos
    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data);
        })
    }, [selectedItems]);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        // Passa como parâmetro o id do ponto selecionado
        navigation.navigate('Detail', {point_id: id});
    }

    function handleSelectItem(id: number) {
        //Verifica se possui o id selecionado em selected item
        // caso tenha, retorna um valor maior que 1
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            // Item já estava na lista
            // Pega todos os itens, menos o igual o id
            const filtredItems = selectedItems.filter(item => item != id);
            setSelectedItems(filtredItems);
        } else {
            // Significa que o item selecionado não estava na lista de
            // selectedItems e será adicionado
            setSelectedItems([...selectedItems, id]);
        }

    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    { // Condição para carregar o mapa somente se tiver a posição
                        // em latitude e longitude
                        initialPostion[0] !== 0 && (
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: initialPostion[0],
                                    longitude: initialPostion[1],
                                    latitudeDelta: 0.014,
                                    longitudeDelta: 0.014,
                                }}
                            >
                                {points.map(point => (
                                    <Marker
                                        key={String(point.id)}
                                        style={styles.mapMarker}
                                        onPress={() => handleNavigateToDetail(point.id)}
                                        coordinate={{
                                            latitude: point.latitude,
                                            longitude: point.longitude,
                                        }}
                                    >
                                        <View style={styles.mapMarkerContainer}>
                                            <Image
                                                style={styles.mapMarkerImage}
                                                source={{ uri: point.image_url }}
                                            />
                                            <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                        </View>
                                    </Marker>
                                ))}
                            </MapView>
                        )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity
                            key={String(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]}
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.6}
                        >
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;