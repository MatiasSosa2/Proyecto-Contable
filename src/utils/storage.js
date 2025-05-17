export const createStorage = (key) => {
  const get = () => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const set = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { get, set };
};

export const productsStorage = createStorage('products');
export const transactionsStorage = createStorage('transactions');