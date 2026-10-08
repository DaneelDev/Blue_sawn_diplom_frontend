import axios from "axios";

export const setLoaded = payload =>({
    type: "SET_LOADED",
    payload
})

export const setProducts = (items) =>({
    type: 'SET_PRODUCTS',
    payload: items


});

export const fetchProducts = (sortBy, category) => (dispatch) =>{
    dispatch(setLoaded(false));
    axios.get(
        `/products?${category!==null?`category=${category}`:''}
        &_sort=${sortBy}&_order=desc`).then(({data}) =>{
        dispatch(setProducts(data));
      })
}