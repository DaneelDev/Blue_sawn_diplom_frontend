import React from 'react'

import { Categories, SortPopup, ProductBlock, ProductLoadingBlock, Discount } from "../components";

import {useSelector, useDispatch} from 'react-redux';

import { setCategory, setSortBy } from '../redux/actions/filters';

import {fetchProducts} from '../redux/actions/products';

import {addProductToCart} from '../redux/actions/cart';

const categoryNames = ['Детские','Быт. химимя','Продукты питания','Бип-боп']

const sortItems = [
  {name: "цене", type: "price"},
  {name: "алфавиту", type: 'name'}]

function Home() {
  const items = useSelector((state)=> state.products.items);
  const cartItems = useSelector(({cart})=> cart.items);
  const isLoaded = useSelector((state)=> state.products.isLoaded);
  const {category, sortBy} = useSelector((state)=> state.filters);


  const dispatch = useDispatch();

  React.useEffect(() =>{
      dispatch(fetchProducts(sortBy,category));
  }, [category, sortBy])

  const onSelectCategory = React.useCallback((index) =>{
    dispatch(setCategory(index))
  }, [])

  const onSelectSortType = React.useCallback((type) =>{
    dispatch(setSortBy(type))
  }, [])


  const handleAddProductToCart = obj =>{
    dispatch(addProductToCart(obj));
  }


  

  return (
    <div>
      <Discount/>
      <div className="container">
      <div className="content__top">
            <Categories 
            activeCategory = {category}
            onClickCategory = {onSelectCategory }
            items = {categoryNames}/>
            <SortPopup 
            activeSortType = {sortBy} 
            items = {sortItems}
            onClickSortType = {onSelectSortType}
            />
          </div>
          <h2 className="content__title">Все товары</h2>
          <div className="content__items">
          {isLoaded ? 
          items.map((obj)=> (
          <ProductBlock onClickAddProduct= {handleAddProductToCart} key = {obj.id} 
            addedCount ={cartItems[obj.id] && cartItems[obj.id].items.length} {...obj}  />)) 
          : Array(12).fill(0).map((_, index) =><ProductLoadingBlock key={index}/>)}
          </div>
      </div>
          
    </div>
  )
}

export default Home