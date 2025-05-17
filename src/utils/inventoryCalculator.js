export const calculateInventory = (products, transactions) => {
  const inventoryMap = {};

  // Inicializar productos
  products.forEach(product => {
    inventoryMap[product.id] = {
      productId: product.id,
      productName: product.name,
      quantity: 0,
      totalCost: 0,
      averageCost: 0,
      totalValue: 0
    };
  });

  // Procesar transacciones
  transactions.forEach(transaction => {
    const item = inventoryMap[transaction.productId];
    
    if (transaction.type === 'purchase') {
      const newTotalCost = item.totalCost + (transaction.quantity * transaction.unitPrice);
      const newQuantity = item.quantity + transaction.quantity;
      
      item.quantity = newQuantity;
      item.totalCost = newTotalCost;
      item.averageCost = newQuantity > 0 ? newTotalCost / newQuantity : 0;
    } else if (transaction.type === 'sale') {
      item.quantity -= transaction.quantity;
      item.totalCost -= transaction.quantity * item.averageCost;
    }
    
    item.totalValue = item.quantity * item.averageCost;
  });

  return Object.values(inventoryMap);
};