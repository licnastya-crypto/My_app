import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { loadNotes, Note, deleteNote } from '../../services/storage';


type FilterType = 'all' | 'quotes' | 'notes';

export default function NotesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);

    const [refreshKey, setRefreshKey] = useState(0);
    useFocusEffect(
        useCallback(() => {
            loadNotesData();
        }, [])
    );

const loadNotesData = async () => {
    setLoading(true);
    const loadedNotes = await loadNotes();
    setNotes([...loadedNotes]);
    setRefreshKey(prev => prev + 1); // ← добавляем
    setLoading(false);
};

    const getFilteredItems = () => {
        if (activeFilter === 'quotes') return notes.filter(item => item.type === 'quote');
        if (activeFilter === 'notes') return notes.filter(item => item.type === 'note');
        return notes;
    };

    const filteredItems = getFilteredItems();

    const handleDeleteNote = (id: string, text: string) => {
        Alert.alert(
            'Удалить запись',
            `Вы уверены, что хотите удалить "${text.slice(0, 50)}..."?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteNote(id);
                        await loadNotesData(); // перезагружаем список
                        Alert.alert('Успешно', 'Запись удалена');
                    }
                },
            ]
        );
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
            <Text style={styles.headerTitle}>Заметки и цитаты</Text>
            <View style={styles.headerLine} />

            <View style={styles.filtersContainer}>
                <TouchableOpacity style={[styles.filterButton, activeFilter === 'all' && styles.filterActive]} onPress={() => setActiveFilter('all')}>
                    <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Все</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, activeFilter === 'quotes' && styles.filterActive]} onPress={() => setActiveFilter('quotes')}>
                    <Text style={[styles.filterText, activeFilter === 'quotes' && styles.filterTextActive]}>📝 Цитаты</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, activeFilter === 'notes' && styles.filterActive]} onPress={() => setActiveFilter('notes')}>
                    <Text style={[styles.filterText, activeFilter === 'notes' && styles.filterTextActive]}>💭 Заметки</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📭</Text>
                        <Text style={styles.emptyStateText}>Ничего не найдено</Text>
                        <Text style={styles.emptyStateSubtext}>
                            {activeFilter === 'quotes'
                                ? 'У вас пока нет цитат. Добавьте первую! ✨'
                                : activeFilter === 'notes'
                                    ? 'У вас пока нет заметок. Добавьте первую! 📝'
                                    : 'Добавьте цитаты и заметки о книгах'}
                        </Text>
                    </View>
                ) : (
                    filteredItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.noteCard}
                            onPress={() => router.push(`/edit-note?id=${item.id}&type=${item.type}&bookTitle=${encodeURIComponent(item.bookTitle)}&bookAuthor=${encodeURIComponent(item.bookAuthor)}&text=${encodeURIComponent(item.text)}`)}>
                            <View style={styles.noteHeader}>
                                <Text style={styles.noteType}>{item.type === 'quote' ? '📝 Цитата' : '💭 Заметка'}</Text>
                                <TouchableOpacity onPress={() => handleDeleteNote(item.id, item.text)}>
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noteBookTitle}>{item.bookTitle}</Text>
                            <Text style={styles.noteBookAuthor}>{item.bookAuthor}</Text>
                            <Text style={item.type === 'quote' ? styles.quoteText : styles.noteText}>
                                {item.type === 'quote' ? `«${item.text}»` : item.text}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-note')}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5EFE7', paddingTop: 55, paddingHorizontal: 20 },
    loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
    headerTitle: { fontSize: 29, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626', textAlign: 'center' },
    headerLine: { height: 2, backgroundColor: '#8B6F47', marginTop: 8, marginBottom: 20, width: 50, alignSelf: 'center' },
    filtersContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
    filterButton: { flex: 1, paddingVertical: 10, borderRadius: 50, backgroundColor: '#FFFFFF', alignItems: 'center' },
    filterActive: { backgroundColor: '#8B6F47' },
    filterText: { fontSize: 14, fontFamily: 'Inter', color: '#000000' },
    filterTextActive: { color: '#FFFFFF' },
    scrollContent: { paddingBottom: 100 },
    noteCard: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    noteType: { fontSize: 12, fontFamily: 'Inter', fontWeight: '600', color: '#8B6F47' },
    deleteIcon: { fontSize: 16, color: '#FF6B6B' },
    noteBookTitle: { fontSize: 18, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626', marginBottom: 4 },
    noteBookAuthor: { fontSize: 14, fontFamily: 'Inter', color: '#666666', marginBottom: 12 },
    noteText: { fontSize: 14, fontFamily: 'Inter', color: '#333333', lineHeight: 20 },
    quoteText: { fontSize: 15, fontFamily: 'Inter', fontStyle: 'italic', color: '#333333', lineHeight: 22 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyStateIcon: { fontSize: 60, marginBottom: 20 },
    emptyStateText: { fontSize: 18, fontFamily: 'Montserrat Alternates', color: '#666666', textAlign: 'center', marginBottom: 8 },
    emptyStateSubtext: { fontSize: 14, fontFamily: 'Inter', color: '#999999', textAlign: 'center' },
    addButton: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B6F47', justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 10 },
    addButtonText: { fontSize: 28, color: '#FFFFFF', fontWeight: '600' },
});