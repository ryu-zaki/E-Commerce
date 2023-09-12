import REACT, { Component } from 'react';
import NavComp from './NavComp';

/* "start": "node index.js && npm install",
    "build": "npx tailwindcss -i ./build/static/css/custom.css -o ./build/static/css/main/main.css" */

import thumb1 from '../imgs/image-product-1-thumbnail.jpg';
import thumb2 from '../imgs/image-product-2-thumbnail.jpg';
import thumb3 from '../imgs/image-product-3-thumbnail.jpg';
import thumb4 from '../imgs/image-product-4-thumbnail.jpg';
import product1 from '../imgs/image-product-1.jpg';
import product2 from '../imgs/image-product-2.jpg';
import product3 from '../imgs/image-product-3.jpg';
import product4 from '../imgs/image-product-4.jpg';
import nextArrow from '../imgs/icon-next.svg';
import prevArrow from '../imgs/icon-previous.svg';
import subtrSign from '../imgs/icon-minus.svg';
import addSign from '../imgs/icon-plus.svg';
import cartImg from '../imgs/icon-cart copy.svg';


class ContentsComp extends Component {
    constructor(props) {
        super(props);
        this.slideRef = REACT.createRef();
        this.cartCountRef = REACT.createRef();
        this.cartMessRef = REACT.createRef();
        this.thumbnailRef = REACT.createRef();
        this.state = {
            count: 0,
            cartCount: 0,
            cartCount2: 0,
            numItem: 0,
            productName: 'Fall Limited Edition Sneakers'
        }
    }

    addSliderEffect = () => {
        const arr = [product1, product2, product3, product4];
        
        this.setState((prevState) => {
            return {
               count: prevState.count + 1
            }
        }, () => {
           let { count } = this.state;
           if (count >= 4) {
            this.setState({count: 3});
            return;
           }
           this.slideRef.current.src = arr[count];
        })
    }

    prevSliderEffect = () => {
        const arr = [product1, product2, product3, product4];
        
        this.setState((prevState) => {
            return {
               count: prevState.count - 1,
            }
        }, () => {
            let {count} = this.state;
            if (count < 0) {
              this.setState({count: 0});
              return;
            }
            this.slideRef.current.src = arr[count];
        })
    }

    countIncrement = () => {
        this.setState((prevState) => ({
            cartCount: prevState.cartCount + 1
        }), () => {
            const { cartCount } = this.state;
            this.cartCountRef.current.innerText = cartCount;
        })
    }

    countDecrement = () => {
        this.setState((prevState) => ({
            cartCount: prevState.cartCount - 1
        }), () => {
            let { cartCount } = this.state;
            if (this.state.cartCount <= 0) {
                this.setState({cartCount: 0}, () => {
                    cartCount = this.state.cartCount
                    this.cartCountRef.current.innerText = cartCount;        
                });
                return;
            };
            
            this.cartCountRef.current.innerText = cartCount;
        })
    }

    cartChecker =  () => {
       if (this.state.cartCount <= 0) return;


       this.setState((prev) => ({
        numItem: prev.numItem + 1
       }), () => {
        if (this.state.numItem > 1 || localStorage.getItem("numItem")) {
            this.setState({numItem: 1});
            this.cartMessRef.current.style.color = "red";
            this.cartMessRef.current.innerText = "This item was already Added to your cart.";
            this.cartMessRef.current.classList.add('active');

            setTimeout(() => {
              this.cartMessRef.current.classList.remove('active');
            }, 2000)
            return;
        };

        this.setState({
        cartCount2: this.state.cartCount,
        productName: 'Fall Limited Edition Sneakers'
       }, async () => {
        if (this.state.cartCount2 > 0) {
            
            this.cartMessRef.current.style.color = "green";
            this.cartMessRef.current.innerText = "Added to your cart.";
            this.cartMessRef.current.classList.add('active');

            const data = {
                productName: this.state.productName,
                quantity: this.state.cartCount2,
                price: `$${(this.state.cartCount2 * 125.00).toFixed(2)}`,
                numItem: this.state.numItem,
                uniqueId: localStorage.getItem('userUniqueId')
            }
            
                try {
                    const api = await fetch('/add-product', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    const response = await api.json();
                    if (response.mess) {

                        localStorage.setItem('productID', response.productID);
                        setTimeout(() => {
                        this.cartMessRef.current.classList.remove('active');
                        }, 2000)
                    }

                } catch(err) {
                   console.log(err);
                }
        }
    });
       })
    }

    deleteHandler = () => {
       this.setState((prev) => ({
        cartCount2: 0,
        numItem: prev.numItem - 1,
        productName: ''
       }), () => {
          fetch('/delete-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productID: localStorage.getItem('productID')})
          })
          .then(res => res.json())
          .then(data => {
           
          })
          .catch(err => {
            console.log(err)
          })

       })
    }

    imageHandler = ({target}) => {

        const img = document.querySelectorAll('.thumbnails-con > img');
        img.forEach(el => {
            el.classList.remove('active');
        })
        target.classList.add('active');

        let src = null;
        switch(target.src) {
            case thumb1:
                src =  product1;
            break;

            case thumb2:
                src =  product2;
            break;

            case thumb3:
                src =  product3;
            break;

            case thumb4:
                src =  product4;
            break;
        }

        this.slideRef.current.src = src;
    }

    logoutAcc = () => {
        const ques = window.confirm("Are you sure you want to logout ?");
       if (ques) {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: "logout"})
           })
           .then(res => res.json())
           .then(data => {
            if (data.logout) {
                window.location.assign('/login');
            }
           })
           .catch(err => {
            console.log(err);
           })
        return;
       } 
           
        return;
    }

    componentDidMount() {

        const productId = localStorage.getItem('productID');

        if (productId) {
            fetch('/check-item', {
                method: 'POST',
                headers: {
                    'Conteent-Type': 'application/json'
                },
                body: JSON.stringify({id: productId})
            })
            .then(res => res.json())
            .then(data => {
               
                if (data.hasProduct == 'false') {
                    localStorage.removeItem('productName');
                    localStorage.removeItem('numItem');
                    localStorage.removeItem('quantity');
                    return
                } 
            })
            .catch(err => {
                console.log(err);
            })

        }

        const bgImg = document.querySelector('.img-bg');
        bgImg.classList.add('active')
       
        return true;

    }

    checkout = () => {
        window.location.assign('/checkout-page');
    } 

    render() {

        let num;
        if (this.state.numItem > 0) {
          num = 1;
        }

        if (this.state.productName == '') {
            localStorage.removeItem('productName');
            localStorage.removeItem('quantity');
            localStorage.removeItem('numItem');
        }
        
        return(
        <>
            <NavComp quantity={this.state.cartCount2} numItem={num} deleteHandler={this.deleteHandler} productName={this.state.productName} logoutHandler={this.logoutAcc} checkout={this.checkout}/>
            <div className="content-wrapper">

              {/* Pictures Section */}
              <div className='product-options'>
                {/* Actual Product */}
                <div>
                <div className='blur-background'>
                <div className='img-bg'>
                  <img ref={this.slideRef} loading='lazy' className='actual-product' src={product1} />
                </div>
                </div>
                <button onClick={this.addSliderEffect} ><img src={nextArrow}/></button>
                <button onClick={this.prevSliderEffect}className='prev'><img src={prevArrow}/></button>
                </div>
                 {/* Thumbnails */}
                 <div className='thumbnails-con'>
                    <img onClick={this.imageHandler} src={thumb1}/>
                    <img onClick={this.imageHandler} src={thumb2}/>
                    <img onClick={this.imageHandler} src={thumb3}/>
                    <img onClick={this.imageHandler} src={thumb4}/>
                 </div>
              </div>

              {/* Description Section */}
              <div className='desc-con'>
                <p>Sneaker Company</p>
                <h2>Fall Limited Edition Sneakers</h2>
                <p>These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can</p>
                <div>
                    <div>
                        <p>$125.00</p>
                        <p>50%</p>
                    </div>
                    <p><s>$250.00</s></p>
                </div>

                <div className='addCartBtnCon'>
                <div className='quantity-con'>
                    <img onClick={this.countDecrement} src={subtrSign}/>
                    <span ref={this.cartCountRef}>0</span>
                    <img onClick={this.countIncrement} src={addSign}/>
                </div>
                <button onClick={this.cartChecker}><img src={cartImg}/>Add to cart</button>
                </div>
                <p ref={this.cartMessRef} className='cartMess'>Added to your cart</p>
              </div>
            </div>
        </>
        )
    }
}

export default ContentsComp;