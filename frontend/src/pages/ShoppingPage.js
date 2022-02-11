import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import {requestAllItems} from "../redux/actions/item";
import {ShoppingPageComponent} from "../components/ShoppingPageComponent"
import {updateItemsBasket} from "../redux/actions/basket";
import { useHistory } from "react-router-dom";



const ShoppingPage=({items, itemsInBasket, userIsAuthenticated, requestAllItems,user,updateItemsBasket})=> {
    const [availableItems,setAvailableItems] = useState([]);
    const fetchItems = useCallback(() => {requestAllItems()  
        const available = items.filter(item => item.stock) 
        setAvailableItems([...available])}, [])
    const history=useHistory();
    // requestAllItems();
    useEffect( () => {
        //gets all items and then filters and sets only the available for purchase
        fetchItems();
        console.log(availableItems);
        if (user.cart){
            console.log("User.cart", user.cart)
            updateItemsBasket(user.cart)
        }
    }, [fetchItems])
    const goBack=()=>{
        history.goBack();
    }
    return (
        <ShoppingPageComponent goBack={goBack} items={availableItems} itemsInBasket={itemsInBasket} userIsAuthenticated={userIsAuthenticated}>
        </ShoppingPageComponent>
             //<Grid  container alignItems="stretch" spacing={3}>
              /* {items.data.map((item) => (
                     <Grid key={item._id} item xs={12} sm={6}>
                        <Item item={item} />
                    </Grid>      
                  ))} */
            //</Grid>
       

    )
}

const mapStateToProps = (state) => {
    return {
        items: state.items.items,
        itemsInBasket: state.basket.itemsInBasket, 
        userIsAuthenticated: state.user.isAuthenticated,
        user: state.user
    };
};
    
export default connect(mapStateToProps,{requestAllItems,updateItemsBasket})(ShoppingPage)