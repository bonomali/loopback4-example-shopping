const navBarTemplate = `
      <a id="logo" class="navbar-brand" href="/shoppy.html">Shoppy</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigationBar" aria-controls="navigationBar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navigationBar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/shoppy.html">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Shopping Cart<span style="display:none" id="itemsInCart" class="badge badge-notify">0</span></a>
          </li>
          <li id="signUp" class="nav-item">
            <a class="nav-link" href="#" data-toggle="modal" data-target="#signUpModal" tabindex="-1">Sign Up</a>
          </li>

<div class="modal" id="signUpModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="signUpTitle">Shoppy Sign Up</h5>
      </div>
      <div class="modal-body">

<form id="signUpForm" onsubmit="return signUp()">
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="firstName">First name</label>
      <input type="text" class="form-control" id="firstName">
    </div>
    <div class="form-group col-md-6">
      <label for="lastName">Last name</label>
      <input type="text" class="form-control" id="lastName">
    </div>
  </div>
  <div class="form-group">
    <label for="signUpEmail">Email address</label>
    <input type="email" class="form-control" id="signUpEmail" autocomplete="new-email">
  </div>
  <div class="form-group">
    <label for="signUpPassword">Password</label>
    <input type="password" class="form-control" id="signUpPassword" autocomplete="new-password">
    <small class="form-text text-muted">Password should be minimum eight characters</small>
  </div>
  <div class="text-center">
    <button type="submit" class="btn btn-primary">Sign Up</button>
  </div>
</form>
      </div>
    </div>
  </div>
</div>
          <li id="logOut" class="nav-item">
            <a class="nav-link" href="javascript:logOut()">Log Out</a>
          </li>
          <li id="logIn" class="nav-item">
            <a class="nav-link" href="#" data-toggle="modal" data-target="#logInModal" tabindex="-1">Log In</a>
          </li>
        </ul>
<div class="modal" id="logInModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logInTitle">Shoppy Log In</h5>
      </div>
      <div class="modal-body">
        <form id="logInForm" onsubmit="return logIn()">
          <div class="form-group">
            <label for="logInEmail">Email address</label>
            <input type="email" class="form-control" id="logInEmail" value="john@example.com">
          </div>
          <div class="form-group">
            <label for="logInPassword">Password</label>
            <input type="password" class="form-control" id="logInPassword" value="john12345678">
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Log In</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
        <div class="nav-item" id="user">
          <img src="/user.png">
          <strong class="nav-item"></strong>
        </div>

        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
`;

const addToCartTemplate = `
<div class="modal fade" id="addToCartModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <img id="productImage">
        <h4 id="productName" class="modal-title"></h4>
        <h5 class="modal-title">$<span id="productPrice"></span></h5>
      </div>
      <div class="modal-body">
<form class="form-inline" style="justify-content: center">
  <label class="my-1 mr-2" for="itemQuantity">Qauntity</label>
  <input type="hidden" id="unformattedPrice">
  <input type="hidden" id="productId">
  <select class="custom-select my-1 mr-sm-2" id="itemQuantity" onchange="updatePrice(this.value)">
    <option selected value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
  </select>
</form>
      </div>
      <div class="modal-footer" style="justify-content: center">
        <button id="removeFromCart" type="button" class="btn btn-primary" onclick="removeFromCartApi()">Remove from Cart</button>
        <button id="addToCart" type="button" class="btn btn-primary" onclick="addToCartApi()">Add to Cart</button>
      </div>
    </div>
  </div>
</div>
`;
