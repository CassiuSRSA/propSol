const express = require("express");

const db = require("../data/database");

const router = express.Router();

//////////////////// DASHBOARD GET  ////////////////////

router.get("/dashboard", async (req, res) => {
  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }

  const transactions = await db
    .getDb()
    .collection("transactions")
    .find()
    .toArray();

  // INCOME EXPENSE BARGRAPGH
  let income = 0;
  let expenses = 0;

  IncomeTransactions = transactions.map((transaction) => {
    if (transaction.transactionType === "in") {
      income += Number(transaction.amount);
    } else if (transaction.transactionType === "out") {
      expenses += Number(transaction.amount);
    }
  });

  // TRENDLINE GRAPGH
  const transactionsByMonth = await db
    .getDb()
    .collection("transactions")
    .aggregate([
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          transactionType: "$transactionType",
          amount: "$amount",
        },
      },
    ])
    .toArray();

  const constructTrendlineObject = (transactionsByMonth) => {
    const trendLineObject = {};
    transactionsByMonth.forEach((transaction) => {
      if (!trendLineObject.hasOwnProperty(transaction.month)) {
        trendLineObject[transaction.month] = { in: 0, out: 0 };
        trendLineObject[transaction.month][transaction.transactionType] +=
          Number(transaction.amount);
      } else {
        trendLineObject[transaction.month][transaction.transactionType] +=
          Number(transaction.amount);
      }
    });
    return trendLineObject;
  };

  const trendlineObject = constructTrendlineObject(transactionsByMonth);

  const trendlineKeys = Object.keys(trendlineObject);

  const trendIncome = [];
  const trendExpenses = [];

  for (const month of trendlineKeys) {
    trendIncome.push(trendlineObject[month].in);
    trendExpenses.push(trendlineObject[month].out);
  }

  const trendlineData = {
    months: trendlineKeys.toString(),
    income: trendIncome.toString(),
    expenses: trendExpenses.toString(),
  };

  res.render("dashboard", {
    income: income,
    expenses: expenses,
    trendlineData: trendlineData,
    page_name: "dashboard",
  });
});

module.exports = router;
