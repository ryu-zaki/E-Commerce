window.addEventListener('load', () => {
    const formBg = document.querySelector('.container .overlay-bg');
    const formBtns = document.querySelectorAll('[data-formBtn]');
    formBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          formBg.classList.toggle('reverse');
          
        })
    })


    /* Signup */
    const signForm = document.querySelector('body .register-form');
    
    /* Input element values */
    const regUsername = document.querySelector('#regUsername');
    const regEmail = document.querySelector('#regEmail'); 
    const regPassword = document.querySelector('#regPassword');

    /* Modal Overlay */
    const continueBtn = document.querySelector('[data-continueBtn]');
    const modalOverlay = document.querySelector('.modal-overlay');

    signForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('CCSC')
      const errEmail = document.querySelector('.err-email');
      const errUsername = document.querySelector('.err-username');
      const errMess = document.querySelectorAll('.errMess');
      errMess.forEach(el => {
        el.classList.remove('active');
      })

      const userData = {
        username: regUsername.value,
        email: regEmail.value,
        password: regPassword.value 
      }

      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.added == true) {
          modalOverlay.classList.add('active');
          regUsername.value = "";
          regEmail.value = "";
          regPassword.value = "";
        } else {
          const {username, email} = data.userInfo;
          console.log(username, email);
          if (username) {
            errUsername.classList.add('active');
          }

          if (email) {
            errEmail.classList.add('active');
          }
        }
      })
      .catch(err => console.log(err));
 
    })

    continueBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      formBg.classList.toggle('reverse');
    })
    

    /* login Functionality */
    const loginForm = document.querySelector('.container .login-form');
    const logUsername = document.querySelector('.login-form #username');
    const logPassword = document.querySelector('.login-form #password');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const userInfo = {
        username: logUsername.value, 
        password: logPassword.value
      }

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.login == true) {
          localStorage.setItem('username', data.username);
          localStorage.setItem('userUniqueId', data.uniqueId)
          if (data.userInfo) {
            const { productName, quantity, price, num_item } = data.userInfo;
            localStorage.setItem('productName', productName);
            localStorage.setItem('quantity', quantity);
            localStorage.setItem('price', price);
            localStorage.setItem('numItem', num_item);
          }

         location.assign('/loading');
        } else {
          alert('Error');

        }
      })
      .catch(err => {
        console.log(err);
      })

      
    })
})