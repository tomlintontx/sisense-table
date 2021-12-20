import { jaql, printResult } from "./JAQLHelpers";
import { SisenseContext } from "./SisenseContext";

const j = jaql("Training", (dimension, formula) => {
  const country = dimension("Customers.Country")
    .filter({
      members: ["USA", "Canada"],
    })
    .title("Country");

  const customerCount = dimension("Customers.CustomerID")
    .agg("count")
    .filter({
      from: 1,
    })
    .title("Customer Count");

  const productFilter = dimension("Products.ProductName")
    .filter({
      members: ["Tofu"],
    })
    .hide();

  const orderYears = dimension("Orders.OrderDate (Calendar)").level("years");
  const orders = dimension("Orders.OrderID").agg("count");

  const avgOrdersPerYear = formula`AVG(${orderYears}, ${orders})`;
  avgOrdersPerYear.title = "Average Orders Per Year";

  return [country, customerCount, avgOrdersPerYear];
});

async function main() {
  const context = new SisenseContext("https://ashton.sisensepoc.com");
  await context.loginPrompt();
  const resp = await context.query(j);

  printResult(resp);
}

main();
