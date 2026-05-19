import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { addBook, Book } from '../../services/storage';
import ImagePickerComponent from '../../components/ImagePicker';



export default function AddBookScreen() {
    const router = useRouter();

    // Данные новой книги
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [status, setStatus] = useState<'reading' | 'read' | 'planned'>('reading'); // reading, read, planned
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [atmosphere, setAtmosphere] = useState('');

    // Заметки и цитаты
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState('');
    const [quotes, setQuotes] = useState<string[]>([]);
    const [newQuote, setNewQuote] = useState('');

    const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

    const addNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, newNote.trim()]);
            setNewNote('');
        }
    };

    const removeNote = (index: number) => {
        setNotes(notes.filter((_, i) => i !== index));
    };

    const addQuote = () => {
        if (newQuote.trim()) {
            setQuotes([...quotes, newQuote.trim()]);
            setNewQuote('');
        }
    };

    const removeQuote = (index: number) => {
        setQuotes(quotes.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Ошибка', 'Введите название книги');
            return;
        }
        if (!author.trim()) {
            Alert.alert('Ошибка', 'Введите автора');
            return;
        }

        const newBook: Book = {
            id: Date.now().toString(),
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            status,
            rating,
            review: review.trim(),
            notes,
            quotes,
            atmosphere: atmosphere.trim(),
            coverImage: coverImage,
            createdAt: new Date().toISOString(),
        };

        await addBook(newBook);
        Alert.alert('Успешно', 'Книга добавлена!');
        router.push('/(tabs)'); // Возврат на главную, где список обновится
    };

    return (
        <View style={styles.container}>
            {/* Заголовок */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Добавить книгу</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Основная информация */}

                <Text style={styles.sectionTitle}>Обложка книги</Text>
                <ImagePickerComponent
                    onImageSelected={setCoverImage}
                    currentImage={coverImage}
                />

                <Text style={styles.sectionTitle}>Основная информация</Text>

                <Text style={styles.label}>Название книги *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Например: 1984"
                    placeholderTextColor="#999999"
                />

                <Text style={styles.label}>Автор *</Text>
                <TextInput
                    style={styles.input}
                    value={author}
                    onChangeText={setAuthor}
                    placeholder="Например: Джордж Оруэлл"
                    placeholderTextColor="#999999"
                />

                <Text style={styles.label}>Жанр</Text>
                <TextInput
                    style={styles.input}
                    value={genre}
                    onChangeText={setGenre}
                    placeholder="Например: Антиутопия"
                    placeholderTextColor="#999999"
                />

                {/* Рейтинг */}
                <Text style={styles.label}>Моя оценка</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <Text style={[styles.star, rating >= star && styles.starActive]}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Статус */}
                <Text style={styles.label}>Статус</Text>
                <View style={styles.statusContainer}>
                    <TouchableOpacity
                        style={[styles.statusButton, status === 'reading' && styles.statusActive]}
                        onPress={() => setStatus('reading')}>
                        <Text style={[styles.statusButtonText, status === 'reading' && styles.statusActiveText]}>
                            Читаю
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.statusButton, status === 'read' && styles.statusActive]}
                        onPress={() => setStatus('read')}>
                        <Text style={[styles.statusButtonText, status === 'read' && styles.statusActiveText]}>
                            Прочитано
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.statusButton, status === 'planned' && styles.statusActive]}
                        onPress={() => setStatus('planned')}>
                        <Text style={[styles.statusButtonText, status === 'planned' && styles.statusActiveText]}>
                            В планах
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Рецензия */}
                <Text style={styles.sectionTitle}>Моя рецензия</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={review}
                    onChangeText={setReview}
                    placeholder="Поделитесь мыслями о книге..."
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                {/* Заметки и мысли */}
                <Text style={styles.sectionTitle}>Заметки и мысли</Text>
                {notes.map((note, index) => (
                    <View key={index} style={styles.listItem}>
                        <Text style={styles.listItemText}>• {note}</Text>
                        <TouchableOpacity onPress={() => removeNote(index)}>
                            <Text style={styles.deleteButton}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.addRow}>
                    <TextInput
                        style={styles.addInput}
                        placeholder="Новая заметка..."
                        placeholderTextColor="#999999"
                        value={newNote}
                        onChangeText={setNewNote}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addNote}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Цитаты */}
                <Text style={styles.sectionTitle}>Цитаты</Text>
                {quotes.map((quote, index) => (
                    <View key={index} style={styles.listItem}>
                        <Text style={styles.quoteItemText}>«{quote}»</Text>
                        <TouchableOpacity onPress={() => removeQuote(index)}>
                            <Text style={styles.deleteButton}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.addRow}>
                    <TextInput
                        style={styles.addInput}
                        placeholder="Новая цитата..."
                        placeholderTextColor="#999999"
                        value={newQuote}
                        onChangeText={setNewQuote}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addQuote}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Атмосфера книги */}
                <Text style={styles.sectionTitle}>Атмосфера книги</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={atmosphere}
                    onChangeText={setAtmosphere}
                    placeholder="Опишите атмосферу книги, добавьте фото позже..."
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Кнопка сохранения */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Добавить книгу</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFE7',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        fontSize: 16,
        color: '#8B6F47',
        fontFamily: 'Inter',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        color: '#282626',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        color: '#282626',
        marginTop: 24,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: '500',
        color: '#282626',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E8DCC8',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    star: {
        fontSize: 32,
        color: '#CCCCCC',
    },
    starActive: {
        color: '#FFD700',
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8DCC8',
    },
    statusActive: {
        backgroundColor: '#8B6F47',
        borderColor: '#8B6F47',
    },
    statusButtonText: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#666666',
    },
    statusActiveText: {
        color: '#FFFFFF',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E8DCC8',
    },
    listItemText: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#333333',
        flex: 1,
    },
    quoteItemText: {
        fontSize: 14,
        fontFamily: 'Inter',
        fontStyle: 'italic',
        color: '#333333',
        flex: 1,
    },
    deleteButton: {
        fontSize: 18,
        marginLeft: 10,
    },
    addRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
        marginBottom: 16,
    },
    addInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Inter',
        borderWidth: 1,
        borderColor: '#E8DCC8',
    },
    addButton: {
        backgroundColor: '#8B6F47',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#8B6F47',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 20,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        fontWeight: '600',
    },
});