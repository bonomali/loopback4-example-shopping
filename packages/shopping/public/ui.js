function getCurrentPageNumber() {
  const arr = location.href.split('?');
  if (arr.length > 1) {
    const params = new URLSearchParams(arr[1]);
    return params.get('page');
  } else {
    return 1;
  }
}

function getProductId() {
  const arr = location.href.split('?');
  if (arr.length > 1) {
    const params = new URLSearchParams(arr[1]);
    return params.get('id');
  }
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
      updateShoppingCartNotification();
    } else {
      applyLoggedOutUi();
    }
  });
}

function updateShoppingCartNotification() {
  api.getShoppingCartItems(function(result) {
    const items = result.items.length;
    if (items) {
      $('#itemsInCart').text(items).show();
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
      $('#productImage').attr('src', image);
      $('#productId').val(id);
      $('#productName').text(name);
      $('#productPrice').text(price);
      $('#unformattedPrice').val(unformattedPrice);
      $('#itemQuantity').val(1);
      $('#addToCartModal').modal('toggle');
    } else {
      $('#logInModal').modal('toggle');
    }
  });
}

function addToCartApi() {
  const productId = $('#productId').val();
  const quantity = +$('#itemQuantity').val();
  api.addToCart({productId, quantity}, function() {
    updateShoppingCartNotification();
    $('#addToCartModal').modal('toggle');
  }, function(err) {

  });
}

function updatePrice(quantity) {
  const unitPrice = $('#unformattedPrice').val();
  const total = unitPrice * quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(total);
  $('#productPrice').text(formattedPrice);
}

$(function () {
  $('#navBar').append(navBarTemplate);
  refreshLogInStatus();
  updateShoppingCartNotification();
});
