function getCurrentPageNumber() {
  const pageNumber = new URL(location.href).searchParams.get('page');
  if (pageNumber) {
    return pageNumber;
  } else {
    return 1;
  }
}

function getProductId() {
  return new URL(location.href).searchParams.get('id');
}

function addPagination() {
  $.get(apiUrl + '/products/count', function (result) {
    const totalPages = Math.ceil(result.count / itemsPerPage);
    const currentPageNumber = getCurrentPageNumber();

    let pages = '';
    for (let i =0; i < totalPages; i++) {
      const pageNumber = i + 1;
      if (currentPageNumber == pageNumber) {
        pages += `<li class="page-item"><a class="page-link">${pageNumber}</a></li>`;
      } else {
        pages += `<li class="page-item"><a class="page-link" href="${homePage}?page=${pageNumber}">${pageNumber}</a></li>`;
      }
    }
    $('#pagination').append(pages);
  });
}

// Very very simple YML "parser"
function parseYml(string) {
  let parsed = '';
  let ul = false;
  string.split(/\n/g).forEach(para => {

    if (para.startsWith('-')) {
      parsed += '<ul>';
      para.split('-').forEach(li => {
        if (li) {
          parsed += '<li>' + li + '</li>';
        }
      });
      ul = true;
    } else if (ul) {
      parsed += '</ul>';
      parsed += '<p>' + para + '</p>';
      ul = false;
    } else {
      parsed += '<p>' + para + '</p>';
    }
  });
  return parsed;
}

function isLoggedIn(cb) {
  const token = localStorage.getItem('shoppyToken');
  if (token) {
    api.me(function(user) {
      cb(user);
    }, function(fail) {
      cb(false);
    });
  } else {
    return cb(false);
  }
}

function refreshLogInStatus() {
  isLoggedIn(function(user) {
    if (user) {
      localStorage.setItem('shoppyUserName', user.name);
      localStorage.setItem('shoppyUserId', user.id);
      applyLoggedInUi(user);
      updateCartDetails();
    } else {
      applyLoggedOutUi();
    }
  });
}

function updateCartDetails() {
  api.getShoppingCartItems(function(result) {
    const itemsCount = result.items.length;
    if (itemsCount) {
      $('#itemsInCart').text(itemsCount).show();
      result.items.forEach(item => {
        $('#card-' + item.productId + ' .cart-action-button').text('Update Cart');
        $('#details-' + item.productId + ' .btn-primary').text('Update Cart');
      });
    }
  }, function(err) {
    console.log(err);
  });
}

function applyLoggedInUi(user) {
  $('#logIn, #signUp').hide();
  $('#user strong').text(user.name);
  $('#user, #logOut').show();
}

function applyLoggedOutUi() {
  $('#logIn, #signUp').show();
  $('#user, #logOut').hide();
  $('#itemsInCart').hide();
}

function logOut() {
  localStorage.removeItem('shoppyToken');
  localStorage.removeItem('shoppyUserId');
  localStorage.removeItem('shoppyUserName');
  refreshLogInStatus();
}

function logIn() {
  const email = $('#logInEmail').val();
  const password = $('#logInPassword').val();
  api.logIn({email, password}, function(res) {
    const token = res.token;
    localStorage.setItem('shoppyToken', token);
    refreshLogInStatus();
    $('#logInModal').modal('toggle');
  }, function(xhr) {
    $('#logInTitle').text('Invalid credentials');
  });
  return false;
}

function signUp() {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#signUpEmail').val();
  const password = $('#signUpPassword').val();
  api.signUp({firstName, lastName, email, password}, function(res) {
    api.logIn({email, password}, function(res) {
      $('#signUpModal').modal('toggle');
      const token = res.token;
      localStorage.setItem('shoppyToken', token);
      refreshLogInStatus();
    }, function(err) {
      alert(err);
    });
  }, function(xhr) {
    $('#signUpTitle').text(xhr.responseJSON.error.message);
  });
  return false;
}

function addToCart(id, name, price, unformattedPrice, image) {
  isLoggedIn(function(user) {
    if (user) {
      api.getShoppingCartItems(function(cart) {
        const items = cart.items;
        let product;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (id === item.productId) {
            product = item;
            break;
          }
        }

        $('#addToCart').hide();
        $('#updateCart').hide();
        $('#productImage').attr('src', image);
        $('#productId').val(id);
        $('#productName').text(name);
        $('#productPrice').text(price);
        $('#unformattedPrice').val(unformattedPrice);
        $('#itemQuantity').val(1);
        document.querySelector('#itemQuantity').dataset.id = id;
        document.querySelector('#removeFromCart').dataset.id = id;
        $('#addToCartModal').modal('toggle');
        $('#removeFromCart').addClass('disabled');

        // Product already added to cart
        if (product) {
          $('#itemQuantity').val(product.quantity);
          updatePrice(product.quantity);
          $('#removeFromCart').removeClass('disabled');
        } else {
          $('#addToCart').show();
        }
      });
    } else {
      $('#logInModal').modal('toggle');
    }
  });
}

function addToCartApi() {
  const productId = $('#productId').val();
  const quantity = +$('#itemQuantity').val();
  api.addToCart({productId, quantity}, function() {
    updateCartDetails();
    $('#addToCartModal').modal('toggle');
  }, function(err) {

  });
}

function displayShoppingCart() {
  api.getShoppingCartItems(function(cart) {
    const items = cart.items;
    $('#shoppingCart .list-group').empty();
    items.forEach(item => {
      api.getProduct(item.productId, function(product) {
        const productElement = itemInCart
                        .replace(/#ID#/g, product.productId)
                        .replace(/#IMAGE#/g, product.image)
                        .replace(/#NAME#/g, product.name)
                        .replace(/#PRICE#/g, product.price);
        $('#shoppingCart .list-group').append(productElement);
        $('#list-' + product.productId + ' select').val(item.quantity);
      });
    });
    $('#shoppingCart').modal('toggle');
  });
}

function updateCount(productId, quantity) {
  api.getShoppingCartItems(function(result) {
    result.items.forEach(item => {
      if (item.productId === productId) {
        item.quantity = +quantity;
      }
    });
    api.updateCart(result.items, function() {
      updatePrice(quantity);
    });
  });
}

function updatePrice(quantity) {
  const unitPrice = $('#unformattedPrice').val();
  const total = unitPrice * quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(total);
  $('#productPrice').text(formattedPrice);
}

function removeFromCart(items) {
  if (!Array.isArray(items)) items = [items];
  const updatedItems = [];
  api.getShoppingCartItems(function(result) {
    result.items.forEach(item => {
      if (!items.includes(item.productId)) {
        updatedItems.push(item);
      }
    });
    api.updateCart(updatedItems, function() {
      items.forEach(productId => {
        $('#addToCartModal').modal('hide');
        $('#card-' + productId + ' .cart-action-button').text('Add to Cart');
        $('#details-' + productId + ' .btn-primary').text('Add to Cart');
      });
      updateCartDetails();
    });
  });
}

function removeItems() {
  const items = [];
  const selected = $('#shoppingCart input[type=checkbox]:checked');
  selected.each((i, checkbox) => {
    const id = checkbox.dataset.id;
    items.push(id);
    $('#list-' + id).remove();
  });
  removeFromCart(items);
}

// Render the initial UI
$(function () {
  $('#navBar').append(navBarTemplate);
  $('body').append(shoppingCartTemplate);
  refreshLogInStatus();
  updateCartDetails();
});
