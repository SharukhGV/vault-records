class StorageService {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.initialize();
  }

  initialize() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(item) {
    const items = this.getAll();
    const newItem = { ...item, id: Date.now().toString() };
    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return newItem;
  }

  update(id, updates) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  delete(id) {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
    return filteredItems.length !== items.length;
  }
}

export const cashStorage = new StorageService('cashData');
export const metalsStorage = new StorageService('metalsData');