import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getBookById, Book } from '../../../services/storage';

export const unstable_settings = { href: null };

export default function BookScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    // Загружаем книгу при фокусе на экране (когда возвращаемся из редактирования)
    useFocusEffect(
        useCallback(() => {
            loadBook();
        }, [id])
    );

    const loadBook = async () => {
        setLoading(true);
        const foundBook = await getBookById(id as string);
        setBook(foundBook || null);
        setLoading(false);
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'reading': return 'Читаю';
            case 'read': return 'Прочитано';
            case 'planned': return 'В планах';
            default: return 'Читаю';
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#8B6F47" />
                <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
        );
    }

    if (!book) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.errorText}>Книга не найдена</Text>
                <Text style={styles.errorSubtext}>ID: {id}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Обложка */}
                {book.coverImage ? (
                    <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
                ) : (
                    <View style={styles.bookImagePlaceholder}>
                        <Text style={styles.bookImageText}>📖</Text>
                    </View>
                )}

                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <Text style={styles.bookGenre}>{book.genre}</Text>

                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{getStatusText(book.status)}</Text>
                </View>

                {book.rating > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Моя оценка</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Text key={star} style={[styles.star, book.rating >= star && styles.starActive]}>★</Text>
                            ))}
                        </View>
                    </>
                )}

                {book.review ? (
                    <>
                        <Text style={styles.sectionTitle}>Моя рецензия</Text>
                        <Text style={styles.sectionText}>{book.review}</Text>
                    </>
                ) : null}

                {book.notes.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Мои заметки и мысли</Text>
                        {book.notes.map((note, index) => (
                            <View key={index} style={styles.noteCard}>
                                <Text style={styles.noteText}>• {note}</Text>
                            </View>
                        ))}
                    </>
                )}

                {book.quotes.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Цитаты</Text>
                        {book.quotes.map((quote, index) => (
                            <View key={index} style={styles.quoteCard}>
                                <Text style={styles.quoteText}>«{quote}»</Text>
                            </View>
                        ))}
                    </>
                )}

                {book.atmosphere ? (
                    <>
                        <Text style={styles.sectionTitle}>Атмосфера книги</Text>
                        <View style={styles.atmosphereCard}>
                            <Text style={styles.atmosphereText}>{book.atmosphere}</Text>
                        </View>
                    </>
                ) : null}

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/edit-book/${book.id}`)}>
                    <Text style={styles.editButtonText}>Редактировать</Text>
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
        paddingBottom: 100,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#FF6B6B',
    },
    errorSubtext: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
        color: '#999',
    },
    backButton: {
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        fontSize: 16,
        color: '#8B6F47',
        fontFamily: 'Inter',
    },
    bookCover: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    bookImagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#E8DCC8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    bookImageText: {
        fontSize: 60,
    },
    bookTitle: {
        fontSize: 32,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '700',
        color: '#282626',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 18,
        fontFamily: 'Montserrat Alternates',
        color: '#666666',
        marginBottom: 8,
    },
    bookGenre: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#8B6F47',
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: '#8B6F47',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        color: '#282626',
        marginTop: 24,
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#333333',
        lineHeight: 22,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
    },
    star: {
        fontSize: 28,
        color: '#CCCCCC',
    },
    starActive: {
        color: '#FFD700',
    },
    noteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    noteText: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#333333',
        lineHeight: 20,
    },
    quoteCard: {
        backgroundColor: '#E8DCC8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    quoteText: {
        fontSize: 15,
        fontFamily: 'Inter',
        fontStyle: 'italic',
        color: '#282626',
        lineHeight: 22,
    },
    atmosphereCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
    },
    atmosphereText: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#666666',
        lineHeight: 20,
    },
    editButton: {
        backgroundColor: '#8B6F47',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    editButtonText: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        fontWeight: '600',
    },
});