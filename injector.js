(async function () {
  
  fillForm();

  function fillForm() {
    // fillField(document.querySelector('input[name="firstName"]'), profile.firstName);
    // fillField(document.querySelector('input[name="lastName"]'), profile.lastName);
    // fillField(document.querySelector('input[name="email"]'), profile.email);
    fillField(document.querySelector('input[name="firstName"]'), 'Mohsin');
    fillField(document.querySelector('input[name="lastName"]'), 'Shaikh');
    fillField(document.querySelector('input[name="email"]'), 'mohsin@email.com');
    fillField(document.querySelector('input[name="phone"]'), '9999999999');
    fillField(document.querySelector('input[name="streetAddress"]'), '111 Main St.');
    fillField(document.querySelector('input[name="address"]'), '111 Main St.');
    fillField(document.querySelector('input[name="city"]'), 'Pune');
  }
  
  function fillField(selector, value) {
    var field = selector;
    if (field) {
      field.value = value;
    }
  }  
})();