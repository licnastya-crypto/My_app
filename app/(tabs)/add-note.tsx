import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { addNote, Note } from '../../services/storage';

export default function AddNoteScreen() {
    const router = useRouter();
    const [type, setType] = useState<'quote' | 'note'>('quote');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [text, setText] = useState('');

    const handleSave = async () => {
        if (!bookTitle.trim()) {
            Alert.alert('Ошибка', 'Укажите название книги');
            return;
        }
        if (!text.trim()) {
            Alert.alert('Ошибка', 'Введите текст');
            return;
        }

        const newNote: Note = {
            id: Date.now().toString(),
            type,
            bookTitle: bookTitle.trim(),
            bookAuthor: bookAuthor.trim(),
            text: text.trim(),
            createdAt: new Date().toISOString(),
        };

        await addNote(newNote);
        Alert.alert('Успешно', `${type === 'quote' ? 'Цитата' : 'Заметка'} добавлена!`);

        // Переход с параметром refresh
        router.push({
            pathname: '/(tabs)/notes',
            params: { refresh: Date.now().toString() }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/notes')}>
                    <Text style={styles.backButton}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Добавить {type === 'quote' ? 'цитату' : 'заметку'}
                </Text>
                <View style={{ width: 50 }} />
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
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5EFE7', paddingTop: 60, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    backButton: { fontSize: 16, color: '#8B6F47', fontFamily: 'Inter' },
    headerTitle: { fontSize: 18, fontFamily: 'Montserrat Alternates', fontWeight: '600', color: '#282626' },
    content: { flex: 1 },
    label: { fontSize: 14, fontFamily: 'Inter', fontWeight: '500', color: '#282626', marginBottom: 8, marginTop: 16 },
    typeContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
    typeButton: { flex: 1, paddingVertical: 12, borderRadius: 25, backgroundColor: '#FFFFFF', alignItems: 'center', borderWidth: 1, borderColor: '#E8DCC8' },
    typeActive: { backgroundColor: '#8B6F47', borderColor: '#8B6F47' },
    typeButtonText: { fontSize: 14, fontFamily: 'Inter', color: '#666666' },
    typeActiveText: { color: '#FFFFFF' },
    input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter', color: '#333333', borderWidth: 1, borderColor: '#E8DCC8' },
    textArea: { minHeight: 150, textAlignVertical: 'top' },
    saveButton: { backgroundColor: '#8B6F47', borderRadius: 25, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
    saveButtonText: { fontSize: 16, fontFamily: 'Inter', color: '#FFFFFF', fontWeight: '600' },
});