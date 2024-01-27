async function retrieveReceiptDetails() {
  try {
    const response = await fetch(
      "https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching receipt details:", error.message);
    return null;
  }
}

function groupAndSortProducts(products, value) {
  const groupedProducts = products.filter(
    (product) => product.domestic === value
  );
  const sortedProducts = groupedProducts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return sortedProducts;
}

function calculateTotals(products) {
  const totalPrice = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  return totalPrice;
}

function getCount(products) {
  return products.length;
}

function printProductDetails(products, category) {
  const productDetails = products.map(
    (product) => `
    <p>...&nbsp;Name: ${product.name}</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;Price: ${product.price}</p>
    ${
      product.description
        ? `<p>&nbsp;&nbsp;&nbsp;&nbsp;Description: ${product.description.slice(
            0,
            10
          )}...</p>`
        : ""
    }
    <p>&nbsp;&nbsp;&nbsp;&nbsp;Weight: ${
      product.weight && product.weight.value
        ? product.weight.value + "g"
        : "N/A"
    }</p>
  `
  );

  return `<p>.&nbsp;${category}</p>${productDetails.join("")}`;
}

function printResults(receipt, domesticProducts, imprtedProducts) {
  receipt.innerHTML += `
        ${printProductDetails(domesticProducts, "Domestic")}
        ${printProductDetails(imprtedProducts, "Imported")}

          <p>Domestic Cost: ${calculateTotals(domesticProducts)}</p>
          <p>Imported Cost: ${calculateTotals(imprtedProducts)}</p>
          <p>Domestic Count: ${getCount(domesticProducts)}</p>
          <p>Imported Count: ${getCount(imprtedProducts)}</p>
        `;
}

async function runApplication() {
  const products = await retrieveReceiptDetails();

  if (products) {
    const receipt = document.getElementById("receipt");

    const domesticProducts = groupAndSortProducts(products, true);
    const importedProducts = groupAndSortProducts(products, false);
    printResults(receipt, domesticProducts, importedProducts);
  }
}

runApplication();
