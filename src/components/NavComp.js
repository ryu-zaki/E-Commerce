import REACT, { Component } from 'react';

/* Images */
import cartImage from '../imgs/icon-cart.svg';
import avatar from '../imgs/image-avatar.png';
import logo from '../imgs/logo.svg';
import menu from '../imgs/icon-menu.svg';
import exitBtn from '../imgs/icon-close.svg'
import CartInside from './CartInside';

class NavComp extends Component {
    constructor(props) {
        super(props);
        this.navRefs = REACT.createRef(); 
        this.cartRefs = REACT.createRef();
        this.avtModalRef = REACT.createRef();
    }

    menuNav = () => {
      this.navRefs.current.classList.add('active');
    }

    menuDeac = () => {
      this.navRefs.current.classList.remove('active');
    }

    addToCart = () => {
      this.cartRefs.current.classList.toggle('active');
    }

    avatarModal = () => {

    }

    render() {
        let element = null;
        let cartItem = null;
        const {productName, deleteHandler,  logoutHandler ,quantity, numItem} = this.props;

        console.log(quantity, localStorage.getItem('productName'));
        if (quantity) {
          localStorage.setItem('productName', productName);
          localStorage.setItem('quantity', quantity);
          localStorage.setItem('numItem', numItem);

          cartItem = <CartInside deleteItem={deleteHandler} quantity={quantity} productName={productName} />;
          element = <div className='cart-counter'>{numItem}</div>;
        } else if (localStorage.getItem('productName')) {
          cartItem = <CartInside deleteItem={deleteHandler} quantity={localStorage.getItem('quantity')} productName={localStorage.getItem('productName')} />;
          element = <div className='cart-counter'>{localStorage.getItem('numItem')}</div>;
        }

        return(
            <header className='header'>

                  <div ref={this.cartRefs} className='cart-inside'>
                    <div>
                      <h2>Cart</h2>
                      <img loading='lazy' src={exitBtn} onClick={this.addToCart} />
                    </div>  
                    <div>
                      {cartItem ? cartItem : <center><h3><i>No item</i></h3></center>}
                    </div>
                  </div>

                  <div className='logo-header'>
                  <img onClick={this.menuNav} src={menu} width='25' height='20'/>
                  <img src={logo}/>

                  <nav ref={this.navRefs}> 
                  <div className="btns-decor absolute top-5 left-5 flex gap-2">
                    <div className="bg-red w-2 h-2 rounded-full"></div>
                    <div className="bg-yellow w-2 h-2 rounded-full"></div>
                    <div className="bg-green w-2 h-2 rounded-full"></div>
                  </div>
                  <div className='nav-header'>
                     <h2><i>{localStorage.getItem('username')}</i></h2>
                    <img onClick={this.menuDeac} src={exitBtn} width='20' height='20'/>
                  </div>
                  
                    <div className='category'>
                    <span>Collections</span>
                    <a className='first' href="#">Men</a>
                    <a className='second' href="#">Women</a>
                    </div>

                    <div className='category'>
                    <span>About</span>
                    <a className='third' href="#">Contact</a>
                    <a className='fourth' href="#">Guides</a>
                    </div>

                    <div className='category'>
                    <span>Account</span>
                    <a href="#" className='sixth' onClick={logoutHandler}>Logout</a>
                    </div>
                  </nav>
                  <div className='overlay' onClick={this.menuDeac}></div>
                  </div>

                  
                  <div className='person-cart'>
                    <div onClick={this.addToCart}>
                      <img className='cart-icon' src={cartImage} width='20' height='20' alt='cart icon'/>
                      {element}
                    </div>
                    <i className="fa-regular fa-circle-user avatar-img"></i>
                  </div>
            </header>
        )
    }
}

export default NavComp;

