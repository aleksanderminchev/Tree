import React from "react";
import { makeStyles } from "@mui/styles";
import { connect } from "react-redux";
import BasketPageComponent from "../components/BasketPageComponent"
import {saveCartAction} from "../redux/actions/order";
import { useHistory } from "react-router-dom";


const BasketPage=({itemsInBasket, items, user,saveCartAction})=> {
    const history=useHistory();
    const goBack=()=>{
        history.goBack();
    }
    return (
        <BasketPageComponent 
        goBack={goBack} 
        itemsInBasket={itemsInBasket} 
        items={items} 
        user={user} 
        saveCartAction={saveCartAction}
        >
        </BasketPageComponent>    
    )
}

const mapStateToProps = (state) => {
    return {
        itemsInBasket: state.basket.itemsInBasket, 
        items: state.items.items,
        user: state.user
    };
};
    
export default connect(mapStateToProps,{saveCartAction})(BasketPage)