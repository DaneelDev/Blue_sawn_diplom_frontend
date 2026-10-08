import React from 'react'

import discount1 from "../scss/assets/img/discount1.jpg";
import discount2 from "../scss/assets/img/discount2.jpg";
import discount3 from "../scss/assets/img/discount3.jpg";

function Discount() {
  return (
    <div className="discounts">
                <h1>Скидки для вас</h1>
            <div className="discounts__wrapper2">
                <div className="discounts__wrapper2__item"><a href="#"><img src={discount1}/></a></div>
                <div className="discounts__wrapper2__item"><img src={discount2}/></div>
                <div className="discounts__wrapper2__item"><img src={discount3}/></div>
    
            </div>
    </div>
  )
}

export default Discount