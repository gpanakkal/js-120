/* eslint-disable no-inner-declarations */
/**
 * 1.
 */
{
  function createProduct({
    id, type, name, stock, price,
  }) {
    return {
      id,
      type,
      name,
      stock,
      price,

      setPrice(newPrice) {
        if (newPrice < 0) {
          console.log(`New price ${newPrice} is invalid.`);
          return;
        }
        this.price = newPrice;
      },

      describe() {
        const stringPrefix = '=>';
        ['Name', 'ID', 'Price', 'Stock'].forEach((prop) => {
          const valuePrefix = prop === 'Price' ? '$' : '';
          const propString = `${stringPrefix} ${prop}: ${valuePrefix}${this[prop.toLowerCase()]}`;
          console.log(propString);
        });
      },
    };
  }
  const scissors = createProduct({
    id: 0,
    type: 'scissors',
    name: 'Scissors',
    stock: 8,
    price: 10,
  });

  const drill = createProduct({
    id: 1,
    type: 'drill',
    name: 'Cordless Drill',
    stock: 15,
    price: 45,
  });

  // console.log({ scissors });
  // console.log({ drill });
  scissors.describe();
  drill.describe();
}
