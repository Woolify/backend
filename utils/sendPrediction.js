// function to calculate the predicted price
async function calculatePredictedPrice() {
  try {
    // Retrieve transaction data from MongoDB
    const transactions = await Transaction.find(); //assume transaction is a collection

    const kgValues = [];
    let predict = 0;
    let predictedPrice = 0;

    transactions.forEach((transaction) => {
      const amount = transaction.amount;
      const kg = transaction.kg;
      const total = amount / kg;

      predict += total;
      kgValues.push(transaction.kg);
      predictedPrice = predict / kgValues.length;
    });

    res.send(predictedPrice);
  } catch (error) {
    console.error(
      "An error occurred while calculating the predicted price:",
      error
    );
  }
}

app.get("/calculate-predicted-price", async (req, res) => {
  await calculatePredictedPrice();
  res.status(200).json({ message: "Predicted price calculation complete" });
});
