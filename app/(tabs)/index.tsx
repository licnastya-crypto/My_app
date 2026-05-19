import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadBooks, saveBooks, updateBook, deleteBook, Book } from '../../services/storage';
import { useState, useCallback } from 'react';

type FilterType = 'all' | 'reading' | 'read' | 'planned';

export default function LibraryScreen() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadBooksData();
        }, [])
    );

    const loadBooksData = async () => {
        setLoading(true);
        const loadedBooks = await loadBooks();
        setBooks([...loadedBooks]);
        setLoading(false);
    };

    const getFilteredBooks = () => {
        if (activeFilter === 'reading') return books.filter(book => book.status === 'reading');
        if (activeFilter === 'read') return books.filter(book => book.status === 'read');
        if (activeFilter === 'planned') return books.filter(book => book.status === 'planned');
        return books;
    };

    const filteredBooks = getFilteredBooks();

    const handleBookPress = (bookId: string) => {
        router.push(`/book/${bookId}`);
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
            <Text style={styles.headerTitle}>Моя библиотека</Text>
            <View style={styles.headerLine} />

            {/* Фильтры (без цифр) */}
            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === 'all' && styles.filterActive]}
                    onPress={() => setActiveFilter('all')}>
                    <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Все книги</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === 'reading' && styles.filterActive]}
                    onPress={() => setActiveFilter('reading')}>
                    <Text style={[styles.filterText, activeFilter === 'reading' && styles.filterTextActive]}>Читаю</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === 'read' && styles.filterActive]}
                    onPress={() => setActiveFilter('read')}>
                    <Text style={[styles.filterText, activeFilter === 'read' && styles.filterTextActive]}>Прочитано</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === 'planned' && styles.filterActive]}
                    onPress={() => setActiveFilter('planned')}>
                    <Text style={[styles.filterText, activeFilter === 'planned' && styles.filterTextActive]}>В планах</Text>
                </TouchableOpacity>
            </View>

            {/* Список книг */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.booksRow}>
                    {filteredBooks.map((book) => (
                        <TouchableOpacity
                            key={book.id}
                            style={styles.bookCard}
                            onPress={() => handleBookPress(book.id)}>
                            {book.coverImage ? (
                                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
                            ) : (
                                <View style={styles.bookImagePlaceholder}>
                                    <Text style={styles.bookImageText}>📖</Text>
                                </View>
                            )}
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book.title}</Text>
                                <Text style={styles.bookAuthor}>{book.author}</Text>
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Text key={star} style={[styles.star, book.rating >= star && styles.starActive]}>★</Text>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredBooks.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📚</Text>
                        <Text style={styles.emptyStateText}>Нет книг в этой категории</Text>
                    </View>
                )}
            </ScrollView>
             
            {/* Кнопка добавления */}
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-book')}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFE7',
        paddingTop: 55,
        paddingHorizontal: 20,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 29,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        color: '#282626',
        textAlign: 'center',
    },
    headerLine: {
        height: 2,
        backgroundColor: '#8B6F47',
        marginTop: 8,
        marginBottom: 20,
        width: 50,
        alignSelf: 'center',
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 5,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
    },
    filterActive: {
        backgroundColor: '#8B6F47',
    },
    filterText: {
        fontSize: 12,
        fontFamily: 'Inter',
        color: '#000000',
    },
    filterTextActive: {
        color: '#F9F4F4',
    },
    booksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    bookCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bookImagePlaceholder: {
        width: '100%',
        height: 170,
        backgroundColor: '#E8DCC8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    bookImageText: {
        fontSize: 50,
    },
    bookInfo: {
        alignItems: 'center',
    },
    bookTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
    },
    bookAuthor: {
        fontSize: 11,
        fontFamily: 'Montserrat Alternates',
        color: '#666666',
        marginTop: 4,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 2,
    },
    star: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    starActive: {
        color: '#FFD700',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyStateIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#666666',
        textAlign: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#8B6F47',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 10,
    },
    addButtonText: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    bookCover: {
        width: '100%',
        height: 170,
        borderRadius: 8,
        marginBottom: 10,
    },

});