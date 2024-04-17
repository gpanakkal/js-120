/**
 * 1. Methods are copied to every returned object, and there is no way to determine the type of an object.
 * 2. 
 */
// function makeObj() {
//   return {
//     propA: 10,
//     propB: 20,
//   }
// }
/**
 * 3. 
 */
function createInvoice(lineItems = {}) {
  return {
    phone: lineItems.phone ?? 3000,
    internet: lineItems.internet ?? 5500,
    payments: [],

    total() {
      return this.phone + this.internet;
    },

    addPayment(payment) {
      this.payments.push(payment);
    },

    addPayments(payments) {
      this.payments.push(...payments);
    },

    amountPaid() {
      return this.payments.reduce((sum, payment) => sum + payment.total(), 0);
    },

    amountDue() {
      return this.total() - this.amountPaid();
    },
  }
} 

function createPayment(obj) {
  return {
    phone: obj?.phone ?? 0,
    internet: obj?.internet ?? 0,
    amount: obj?.amount,

    total() {
      return this.amount ?? this.phone + this.internet;
    },
  }
}

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());       // this should return 0