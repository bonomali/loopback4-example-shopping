const productTemplate = `
<div id="details-#ID#"  class="container">
  <div class="row">
    <div class="col-md">
      <img src="#IMAGE#" class="card-img-top details-img" alt="#NAME#">
    </div>
    <div class="col-sm">
      <div class="container" id="product-header">
        <div class="row">
          <div class="col col-8">
            <h3 class="card-title">#NAME#</h3>
            <h5>$#PRICE#</h5>
          </div>
          <div class="col col-3">
            <a href="javascript:addToCart('#ID#', '#NAME#', '#PRICE#', #UNFORMATTED-PRICE#, '#IMAGE#')" class="btn btn-primary">Add to Cart</a>
          </div>
        </div>
      </div>
      <p class="card-text details">#DETAILS#</p>
    </div>
  </div>
</div>
`;

$(function () {
  const id = getProductId();
  if (id) {
    api.getProduct(id, function (product) {
      if (product) {
        const productHtml = productTemplate.replace(/#NAME#/ig, product.name)
                            .replace(/#PRICE#/ig, new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(product.price))
                            .replace(/#UNFORMATTED-PRICE#/g, product.price)
                            .replace(/#IMAGE#/ig, product.image)
                            .replace(/#DESCRIPTION#/ig, product.description)
                            .replace(/#DETAILS#/ig, parseYml(product.details))
                            .replace(/#ID#/ig, product.productId);
        $('#product').append(productHtml);
        $('#product').append(addToCartTemplate);
      }
    });
  } else {
    alert('Product ID missing');
  }
});
