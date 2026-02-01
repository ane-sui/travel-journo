const STORAGE_KEY = 'travel_journal_entries';

export const getEntries = () => {
    if (typeof window === 'undefined') return [];
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
};

export const saveEntry = (entry) => {
    const entries = getEntries();
    const newEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    return newEntry;
};

export const updateEntry = (id, updatedData) => {
    const entries = getEntries();
    const updatedEntries = entries.map(entry =>
        entry.id === id ? { ...entry, ...updatedData } : entry
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
};

export const deleteEntry = (id) => {
    const entries = getEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
};

export const getEntryById = (id) => {
    const entries = getEntries();
    return entries.find(entry => entry.id === id);
};
