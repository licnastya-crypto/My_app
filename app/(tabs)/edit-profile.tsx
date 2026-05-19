import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { loadProfile, saveProfile, Profile } from '../../services/storage';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
    const [favoriteQuote, setFavoriteQuote] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | undefined>(undefined);
    const [newGenre, setNewGenre] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        const profile = await loadProfile();
        setName(profile.name);
        setFavoriteGenres(profile.favoriteGenres);
        setFavoriteQuote(profile.favoriteQuote);
        setAvatarImage(profile.avatarImage);
        setLoading(false);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Нужно разрешение для доступа к фото');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatarImage(result.assets[0].uri);
        }
    };

    const addGenre = () => {
        if (newGenre.trim() && !favoriteGenres.includes(newGenre.trim())) {
            setFavoriteGenres([...favoriteGenres, newGenre.trim()]);
            setNewGenre('');
        }
    };

    const removeGenre = (genre: string) => {
        setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Ошибка', 'Введите имя');
            return;
        }

        const updatedProfile: Profile = {
            name: name.trim(),
            favoriteGenres,
            favoriteQuote: favoriteQuote.trim(),
            avatarImage,
            theme: 'cozy',
            notifications: true,
        };
        await saveProfile(updatedProfile);
        Alert.alert('Успешно', 'Профиль обновлён!');
        router.push('/(tabs)/profile');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Редактировать профиль</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Фото профиля */}
                <Text style={styles.label}>Фото профиля</Text>
                <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                    {avatarImage ? (
                        <Image source={{ uri: avatarImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>📷 Добавить фото</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Имя */}
                <Text style={styles.label}>Имя</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ваше имя"
                    placeholderTextColor="#999999"
                />

                {/* Любимая цитата */}
                <Text style={styles.label}>Любимая цитата о чтении</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={favoriteQuote}
                    onChangeText={setFavoriteQuote}
                    placeholder="Ваша любимая цитата..."
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />

                {/* Любимые жанры */}
                <Text style={styles.label}>Любимые жанры</Text>
                <View style={styles.genresContainer}>
                    {favoriteGenres.map((genre, index) => (
                        <View key={index} style={styles.genreTag}>
                            <Text style={styles.genreText}>{genre}</Text>
                            <TouchableOpacity onPress={() => removeGenre(genre)}>
                                <Text style={styles.removeGenre}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.addRow}>
                    <TextInput
                        style={styles.addInput}
                        placeholder="Новый жанр"
                        placeholderTextColor="#999999"
                        value={newGenre}
                        onChangeText={setNewGenre}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addGenre}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Сохранить изменения</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5EFE7', paddingTop: 60, paddingHorizontal: 20 },
    scrollContent: { paddingBottom: 100 },
    loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    backButton: { fontSize: 16, color: '#8B6F47', fontFamily: 'Inter' },
    headerTitle: { fontSize: 18, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626' },
    label: { fontSize: 14, fontFamily: 'Inter', fontWeight: '500', color: '#282626', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter', color: '#333333', borderWidth: 1, borderColor: '#E8DCC8' },
    textArea: { minHeight: 80, textAlignVertical: 'top' },

    // Фото профиля
    avatarContainer: { alignItems: 'center', marginTop: 8, marginBottom: 8 },
    avatar: { width: 120, height: 120, borderRadius: 60 },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E8DCC8', justifyContent: 'center', alignItems: 'center' },
    avatarPlaceholderText: { fontSize: 14, color: '#8B6F47', textAlign: 'center' },

    // Жанры
    genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, marginBottom: 16 },
    genreTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E8DCC8', gap: 8 },
    genreText: { fontSize: 14, fontFamily: 'Inter', color: '#8B6F47' },
    removeGenre: { fontSize: 14, color: '#FF6B6B' },
    addRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 16 },
    addInput: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter', borderWidth: 1, borderColor: '#E8DCC8' },
    addButton: { backgroundColor: '#8B6F47', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { fontSize: 24, color: '#FFFFFF', fontWeight: '600' },
    saveButton: { backgroundColor: '#8B6F47', borderRadius: 25, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
    saveButtonText: { fontSize: 16, fontFamily: 'Inter', color: '#FFFFFF', fontWeight: '600' },
});