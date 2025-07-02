// const STORAGE_KEY = 'seedInventory';

// export const seedStorage = {
//   getAll() {
//     const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//     return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
//   },

//   getById(id) {
//     const entries = this.getAll();
//     return entries.find(entry => entry.id === id);
//   },

//   create(entry) {
//     const entries = this.getAll();
//     const newEntry = { ...entry, id: Date.now().toString() };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify([...entries, newEntry]));
//     return newEntry;
//   },

//   update(id, updatedEntry) {
//     const entries = this.getAll();
//     const updatedEntries = entries.map(entry => 
//       entry.id === id ? { ...updatedEntry, id } : entry
//     );
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
//   },

//   delete(id) {
//     const entries = this.getAll();
//     const filteredEntries = entries.filter(entry => entry.id !== id);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
//   }
// };