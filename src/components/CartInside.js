import REACT from 'react';
import pro1Thumb from '../imgs/image-product-1-thumbnail.jpg';
import deleteBtn from '../imgs/icon-delete.svg';

const CartInside = (props) => {

  console.log(props.quantity);
    return (
        <>
            <div>
             <div>
              <img src={pro1Thumb} width='50' height='50'/>
                <div>
                  <span>{props.productName}</span><br />
                  <span>x{props.quantity} <b>${(Number(props.quantity) * 125.00).toFixed(2)}</b></span>
              </div>
              </div>
              <img onClick={props.deleteItem} src={deleteBtn}  width='20' height='20'/>
            </div>
              <button>Checkout</button>
        </>
    )
}
export default CartInside;