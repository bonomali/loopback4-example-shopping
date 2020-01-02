const api = {
  addToCart(body, successCb, errCb) {
    const userId = localStorage.getItem('shoppyUserId');
    const url = apiUrl + `/shoppingCarts/${userId}/items`;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      success: successCb,
      error: errCb
    });
  },

  getShoppingCartItems(successCb, errCb) {
    const userId = localStorage.getItem('shoppyUserId');
    if (userId) {
      const url = apiUrl + '/shoppingCarts/' + userId;
      $.get(url, successCb);
    }
  },

  signUp(body, successCb, errCb) {
    const url = apiUrl + '/users';
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      success: successCb,
      error: errCb
    });
  },

  logIn(body, successCb, errCb) {
    const url = apiUrl + '/users/login';
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      success: successCb,
      error: errCb
    });
  },

  me(token, successCb, errCb) {
    const url = apiUrl + '/users/me';
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      success: successCb,
      error: errCb
    });
  },

  getProducts(cb, skip = 0, limit = 4) {
    const url = apiUrl + `/products?filter[skip]=${skip}&filter[limit]=${limit}`;
    $.get(url, cb);
  },

  getProduct(id, cb) {
    const url = apiUrl + '/products/' + id;
    $.get(url, cb);
  }
}
