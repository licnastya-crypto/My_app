import { TouchableOpacity, Text, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface Props {
    onImageSelected: (uri: string | undefined) => void;
    currentImage?: string;
}

export default function ImagePickerComponent({ onImageSelected, currentImage }: Props) {
    const [image, setImage] = useState<string | null>(currentImage || null);

    const pickImage = async () => {
        // Запрашиваем разрешение
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Нужно разрешение для доступа к фото');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [2, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            onImageSelected(uri);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={pickImage}>
            {image ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>📷 Добавить фото</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    image: {
        width: 150,
        height: 200,
        borderRadius: 12,
    },
    placeholder: {
        width: 150,
        height: 200,
        borderRadius: 12,
        backgroundColor: '#E8DCC8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 14,
        color: '#8B6F47',
        fontFamily: 'Inter',
    },
});