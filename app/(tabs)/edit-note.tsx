import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { updateNote, deleteNote, getNoteById, Note } from '../../services/storage';

export default function EditNoteScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [type, setType] = useState<'quote' | 'note'>('quote');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [originalNote, setOriginalNote] = useState<Note | null>(null);

    useEffect(() => {
        if (id) {
            loadNote();
        }
    }, [id]);

    const loadNote = async () => {
        setLoading(true);
        const foundNote = await getNoteById(id as string);
        if (foundNote) {
            setOriginalNote(foundNote);
            setType(foundNote.type);
            setBookTitle(foundNote.bookTitle);
            setBookAuthor(foundNote.bookAuthor);
            setText(foundNote.text);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!bookTitle.trim()) {
            Alert.alert('Ошибка', 'Укажите название книги');
            return;
        }
        if (!text.trim()) {
            Alert.alert('Ошибка', 'Введите текст');
            return;
        }

        if (originalNote) {
            const updatedNote: Note = {
                ...originalNote,
                type,
                bookTitle: bookTitle.trim(),
                bookAuthor: bookAuthor.trim(),
                text: text.trim(),
            };
            await updateNote(updatedNote);
            Alert.alert('Успешно', `${type === 'quote' ? 'Цитата' : 'Заметка'} сохранена!`);
            router.push('/(tabs)/notes');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Удалить',
            `Вы уверены, что хотите удалить эту ${type === 'quote' ? 'цитату' : 'заметку'}?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        if (originalNote) {
                            await deleteNote(originalNote.id);
                            Alert.alert('Успешно', 'Запись удалена');
                            router.push('/(tabs)/notes');
                        }
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/notes')}>
                    <Text style={styles.backButton}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Редактировать</Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Тип</Text>
                <View style={styles.typeContainer}>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'quote' && styles.typeActive]}
                        onPress={() => setType('quote')}>
                        <Text style={[styles.typeButtonText, type === 'quote' && styles.typeActiveText]}>
                            📝 Цитата
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'note' && styles.typeActive]}
                        onPress={() => setType('note')}>
                        <Text style={[styles.typeButtonText, type === 'note' && styles.typeActiveText]}>
                            💭 Заметка
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Название книги</Text>
                <TextInput
                    style={styles.input}
                    value={bookTitle}
                    onChangeText={setBookTitle}
                    placeholder="Название книги"
                    placeholderTextColor="#999999"
                />

                <Text style={styles.label}>Автор</Text>
                <TextInput
                    style={styles.input}
                    value={bookAuthor}
                    onChangeText={setBookAuthor}
                    placeholder="Автор"
                    placeholderTextColor="#999999"
                />

                <Text style={styles.label}>
                    {type === 'quote' ? 'Текст цитаты' : 'Текст заметки'}
                </Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={text}
                    onChangeText={setText}
                    placeholder={type === 'quote' ? 'Введите цитату из книги...' : 'Введите заметку...'}
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Сохранить изменения</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5EFE7', paddingTop: 60, paddingHorizontal: 20 },
    loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    backButton: { fontSize: 16, color: '#8B6F47', fontFamily: 'Inter' },
    headerTitle: { fontSize: 18, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626' },
    deleteButton: { fontSize: 22, color: '#FF6B6B' },
    content: { flex: 1 },
    label: { fontSize: 14, fontFamily: 'Inter', fontWeight: '500', color: '#282626', marginBottom: 8, marginTop: 16 },
    typeContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
    typeButton: { flex: 1, paddingVertical: 12, borderRadius: 25, backgroundColor: '#FFFFFF', alignItems: 'center', borderWidth: 1, borderColor: '#E8DCC8' },
    typeActive: { backgroundColor: '#8B6F47', borderColor: '#8B6F47' },
    typeButtonText: { fontSize: 14, fontFamily: 'Inter', color: '#666666' },
    typeActiveText: { color: '#FFFFFF' },
    input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter', color: '#333333', borderWidth: 1, borderColor: '#E8DCC8' },
    textArea: { minHeight: 150, textAlignVertical: 'top' },
    saveButton: { backgroundColor: '#8B6F47', borderRadius: 25, paddingVertical: 16, alignItems: 'center', marginTop: 32, marginBottom: 40 },
    saveButtonText: { fontSize: 16, fontFamily: 'Inter', color: '#FFFFFF', fontWeight: '600' },
});