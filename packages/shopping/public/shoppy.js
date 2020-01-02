const productTemplate = `
<div class="card" style="width: 18rem;">
  <img src="#IMAGE#" class="card-img-top product-img" alt="#NAME#">
  <div class="card-body">
    <h4 class="card-title">#NAME#</h4>
    <h5>$#PRICE#</h5>
    <p class="card-text description">#DESCRIPTION#</p>
    <div class="action-buttons">
      <a href="javascript: addToCart('#ID#', '#NAME#', '#PRICE#', #UNFORMATTED-PRICE#, '#IMAGE#')" class="btn btn-primary">Add to Cart</a>
      <a href="/product.html?id=#ID#" class="btn btn-primary">Details</a>
    </div>
  </div>
</div>
`;

$(function () {
  const skip = (getCurrentPageNumber() - 1) * 4;
  api.getProducts(function (products) {
    if (products) {
      products.forEach(product => {
        const productHtml = productTemplate.replace(/#NAME#/ig, product.name)
                            .replace(/#PRICE#/ig, new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(product.price))
                            .replace(/#UNFORMATTED-PRICE#/g, product.price)
                            .replace(/#IMAGE#/ig, product.image)
                            .replace(/#DESCRIPTION#/ig, product.description)
                            .replace(/#DETAILS#/ig, product.details)
                            .replace(/#ID#/ig, product.productId);
        $('#products').append(productHtml);
      });
      $('#products').append(addToCartTemplate);
    }
  }, skip, itemsPerPage);

  addPagination();
});
