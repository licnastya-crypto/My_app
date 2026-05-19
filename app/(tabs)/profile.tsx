import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { loadBooks, loadProfile, loadNotes, saveProfile, Profile } from '../../services/storage';
import * as Clipboard from 'expo-clipboard';

export default function ProfileScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        reading: 0,
        read: 0,
        planned: 0,
    });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setLoading(true);
        const loadedProfile = await loadProfile();
        setProfile(loadedProfile);

        const books = await loadBooks();
        setStats({
            total: books.length,
            reading: books.filter(b => b.status === 'reading').length,
            read: books.filter(b => b.status === 'read').length,
            planned: books.filter(b => b.status === 'planned').length,
        });
        setLoading(false);
    };

    const exportNotes = async () => {
        try {
            const notes = await loadNotes();

            if (notes.length === 0) {
                Alert.alert('Экспорт', 'У вас пока нет заметок для экспорта');
                return;
            }

            let exportText = '📚 МОИ ЗАМЕТКИ И ЦИТАТЫ 📚\n';
            exportText += '='.repeat(50) + '\n\n';

            notes.forEach((note, index) => {
                exportText += `${index + 1}. ${note.type === 'quote' ? ' ЦИТАТА' : ' ЗАМЕТКА'}\n`;
                exportText += ` Книга: ${note.bookTitle}\n`;
                exportText += ` Автор: ${note.bookAuthor}\n`;
                exportText += ` Текст: ${note.text}\n`;
                exportText += ` Дата: ${new Date(note.createdAt).toLocaleDateString()}\n`;
                exportText += '-'.repeat(50) + '\n\n';
            });

            await Clipboard.setStringAsync(exportText);
            Alert.alert(
                '✅ Готово!',
                'Заметки скопированы в буфер обмена.\n\nВы можете вставить их куда угодно (Заметки, Telegram, WhatsApp)',
                [{ text: 'OK' }]
            );

        } catch (error) {
            console.error('Ошибка экспорта:', error);
            Alert.alert('Ошибка', 'Не удалось экспортировать заметки');
        }
    };

    if (loading || !profile) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileHeader}>
                {profile.avatarImage ? (
                    <Image source={{ uri: profile.avatarImage }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>📖</Text>
                    </View>
                )}
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.bookCount}>{stats.total} книг в библиотеке</Text>
                <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/edit-profile')}>
                    <Text style={styles.editProfileText}>✏️ Редактировать профиль</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Любимые жанры</Text>
                <View style={styles.genresContainer}>
                    {profile.favoriteGenres.map((genre, index) => (
                        <View key={index} style={styles.genreTag}>
                            <Text style={styles.genreTagText}>{genre}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {profile.favoriteQuote ? (
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>"{profile.favoriteQuote}"</Text>
                    <Text style={styles.quoteAuthor}>— {profile.name}</Text>
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reading Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.read}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.reading}</Text>
                        <Text style={styles.statLabel}>Reading</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.planned}</Text>
                        <Text style={styles.statLabel}>To Read</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.settingButton} onPress={exportNotes}>
                    <Text style={styles.settingButtonText}>Export Notes </Text>
                    <Text style={styles.settingButtonArrow}>→</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5EFE7' },
    scrollContent: { paddingTop: 55, paddingBottom: 100, paddingHorizontal: 20 },
    loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
    profileHeader: { alignItems: 'center', marginBottom: 32 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8DCC8', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
    avatarText: { fontSize: 50 },
    name: { fontSize: 24, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626', marginBottom: 4 },
    bookCount: { fontSize: 14, fontFamily: 'Inter', color: '#666666', marginBottom: 12 },
    editProfileButton: { backgroundColor: '#8B6F47', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    editProfileText: { fontSize: 14, fontFamily: 'Inter', color: '#FFFFFF' },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 18, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626', marginBottom: 16 },
    genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    genreTag: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E8DCC8' },
    genreTagText: { fontSize: 14, fontFamily: 'Inter', color: '#8B6F47' },
    quoteCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 28 },
    quoteText: { fontSize: 15, fontFamily: 'Inter', fontStyle: 'italic', color: '#333333', lineHeight: 22, marginBottom: 12 },
    quoteAuthor: { fontSize: 13, fontFamily: 'Inter', color: '#8B6F47', textAlign: 'right' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    statNumber: { fontSize: 28, fontFamily: 'Montserrat Alternates', fontWeight: '700', color: '#8B6F47', marginBottom: 8 },
    statLabel: { fontSize: 12, fontFamily: 'Inter', color: '#666666' },
    settingButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#E8DCC8' },
    settingButtonText: { fontSize: 15, fontFamily: 'Inter', color: '#282626' },
    settingButtonArrow: { fontSize: 18, color: '#8B6F47' },
});