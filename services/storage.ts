import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: 'reading' | 'read' | 'planned';
    rating: number;
    review: string;
    notes: string[];
    quotes: string[];
    atmosphere: string;
    coverImage?: string;
    createdAt: string;
}

export interface Note {
    id: string;
    type: 'quote' | 'note';
    bookTitle: string;
    bookAuthor: string;
    text: string;
    createdAt: string;
}

export interface Profile {
    name: string;
    favoriteGenres: string[];
    favoriteQuote: string;
    avatarImage?: string;
    theme: 'cozy' | 'dark' | 'light';
    notifications: boolean;
}

const KEYS = {
    BOOKS: '@books',
    NOTES: '@notes',
    PROFILE: '@profile',
};

// ========== КНИГИ ==========
export const loadBooks = async (): Promise<Book[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.BOOKS);
        if (data) {
            return JSON.parse(data);
        }
        const initialBooks: Book[] = [
            {
                id: '1',
                title: '1984',
                author: 'George Orwell',
                genre: 'Dystopia',
                status: 'reading',
                rating: 4,
                review: 'Книга, которая тревожит особенно сильно.',
                notes: ['Общество разделено на части'],
                quotes: ['Свобода — это возможность сказать, что дважды два — четыре.'],
                atmosphere: 'Мрачная атмосфера тотального контроля',
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                title: 'After the quake',
                author: 'Haruki Murakami',
                genre: 'Short Stories',
                status: 'reading',
                rating: 5,
                review: 'Сборник рассказов о жизни после землетрясения.',
                notes: ['Землетрясение как метафора перемен'],
                quotes: ['Он вспомнил запахи и звуки...'],
                atmosphere: 'Меланхоличная, но с надеждой',
                createdAt: new Date().toISOString(),
            },
            {
                id: '3',
                title: 'The Great Gatsby',
                author: 'Fitzgerald',
                genre: 'Classic',
                status: 'read',
                rating: 4,
                review: 'История о богатстве и потерянной любви',
                notes: ['Американская мечта'],
                quotes: ['So we beat on, boats against the current.'],
                atmosphere: 'Роскошь и пустота',
                createdAt: new Date().toISOString(),
            },
        ];
        await saveBooks(initialBooks);
        return initialBooks;
    } catch (error) {
        console.error('Ошибка загрузки книг:', error);
        return [];
    }
};

export const saveBooks = async (books: Book[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
    } catch (error) {
        console.error('Ошибка сохранения книг:', error);
    }
};

export const addBook = async (book: Book): Promise<Book[]> => {
    const books = await loadBooks();
    const newBooks = [...books, book];
    await saveBooks(newBooks);
    return newBooks;
};

export const updateBook = async (updatedBook: Book): Promise<Book[]> => {
    const books = await loadBooks();
    const newBooks = books.map(book => book.id === updatedBook.id ? updatedBook : book);
    await saveBooks(newBooks);
    return newBooks;
};

export const deleteBook = async (bookId: string): Promise<Book[]> => {
    const books = await loadBooks();
    const newBooks = books.filter(book => book.id !== bookId);
    await saveBooks(newBooks);
    return newBooks;
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
    const books = await loadBooks();
    return books.find(book => book.id === id);
};

// ========== ЗАМЕТКИ ==========
export const loadNotes = async (): Promise<Note[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.NOTES);
        if (data) {
            return JSON.parse(data);
        }
        const initialNotes: Note[] = [
            {
                id: '1',
                type: 'quote',
                bookTitle: '1984',
                bookAuthor: 'George Orwell',
                text: 'Свобода — это возможность сказать, что дважды два — четыре.',
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                type: 'note',
                bookTitle: '1984',
                bookAuthor: 'George Orwell',
                text: 'Общество разделено на части. Внутренняя партия управляет страхом.',
                createdAt: new Date().toISOString(),
            },
        ];
        await saveNotes(initialNotes);
        return initialNotes;
    } catch (error) {
        console.error('Ошибка загрузки заметок:', error);
        return [];
    }
};

export const saveNotes = async (notes: Note[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
        console.error('Ошибка сохранения заметок:', error);
    }
};

export const addNote = async (note: Note): Promise<Note[]> => {
    const notes = await loadNotes();
    const newNotes = [...notes, note];
    await saveNotes(newNotes);
    return newNotes;
};

export const updateNote = async (updatedNote: Note): Promise<Note[]> => {
    const notes = await loadNotes();
    const newNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
    await saveNotes(newNotes);
    return newNotes;
};

export const deleteNote = async (noteId: string): Promise<Note[]> => {
    const notes = await loadNotes();
    const newNotes = notes.filter(note => note.id !== noteId);
    await saveNotes(newNotes);
    return newNotes;
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    const notes = await loadNotes();
    return notes.find(note => note.id === id);
};

// ========== ПРОФИЛЬ ==========
export const saveProfile = async (profile: Profile): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
    }
};

export const loadProfile = async (): Promise<Profile> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.PROFILE);
        if (data) return JSON.parse(data);
        return {
            name: 'Читатель',
            favoriteGenres: ['Fiction', 'Philosophy'],
            favoriteQuote: 'A reader lives a thousand lives before he dies.',
            avatarImage: undefined,
            theme: 'cozy',
            notifications: true,
        };
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        return {
            name: 'Читатель',
            favoriteGenres: ['Fiction', 'Philosophy'],
            favoriteQuote: 'A reader lives a thousand lives before he dies.',
            avatarImage: undefined,
            theme: 'cozy',
            notifications: true,
        };
    }
};