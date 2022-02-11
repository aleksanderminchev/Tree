import React, {  useEffect, useState } from "react";
import { Card, CardActionArea, CardActions, CardContent,  Typography, Button, Tooltip, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { connect } from "react-redux";
import { setCurrentItem} from "../redux/actions/item";
import {addItemToBasket, updateItemsBasket} from "../redux/actions/basket";
import {Link} from "react-router-dom"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import {saveCartAction} from "../redux/actions/order";



const useStyles=makeStyles(()=>({
    card:{
        minWidth:"10%",
        maxWidth:"100vw",
        borderRadius: '15',
        margin: '15px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

})) 

const Item =({items,item,itemsInBasket, userIsAuthenticated, setCurrentItem,addItemToBasket, updateItemsBasket, user,saveCartAction})=>{

    const [isItemInBasket, setIsItemInBasket] = useState(false);
    
    const checkIfItemInBasket = () => {
        
        const isItemInArray = itemsInBasket.filter(itemInBasket => itemInBasket._id === item._id);
        if (isItemInArray.length !== 0){
            return true;
        }else{
           return false;
        } 
    }
   
    useEffect( () => {
        const returnedValue = checkIfItemInBasket();
        setIsItemInBasket(returnedValue);
    }, [itemsInBasket])

    const classes = useStyles();

    const [itemRemovedSnackbar, setItemRemovedSnackbar] = useState(false);
    const [itemAddedSnackbar, setItemAddedSnackbar] = useState(false);
    

    const addToCartPressed = (e) => {
        e.preventDefault();
        const index = itemsInBasket.indexOf(item);
        if (index === -1){
            itemsInBasket.push(item);
        }else{
            itemsInBasket.splice(index, 0, item);
        }
        addItemToBasket(itemsInBasket);
        setItemAddedSnackbar(true);
        setIsItemInBasket(true);
        saveCartAction(itemsInBasket,user.token,user.exp,"ADD");
    }

    const capitalizeString = (initialStr) => {
        return initialStr
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    };

 

    const removeItem = () => {
        const updatedItemsInBasket = itemsInBasket.filter(itemFromBasket => item._id !== itemFromBasket._id);
        console.log("updatedItemsInBasket", updatedItemsInBasket)
        updateItemsBasket(updatedItemsInBasket); 
        console.log("Delete: ", item);
        setItemRemovedSnackbar(true);
        setIsItemInBasket(false);
        saveCartAction(updatedItemsInBasket,user.token,user.exp,"REMOVE");
    }

    return(
        <>
            <Card style={{backgroundColor:"#C4C4C4"}} className={classes.card}>
                <img src={item.picturesArray[0]} alt="" style={{width:"100%",height:"95%",maxHeight:"25vh"}}></img>
                <CardActionArea style={{backgroundColor:"#FDFFEE"}} component={Link} to="/item" onClick={() => {setCurrentItem(items,item,user.token)}}>
                    <CardContent>
                        <div>
                            <Typography variant="h5">{item.name}</Typography>
                        </div>
                        <Typography variant="body1">{item.description}</Typography>
                        <Typography variant="body1" style = {{display: 'flex',flexDirection:'column',alignItems:'flex-end'}}>{item.price} DKK</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                {userIsAuthenticated && !isItemInBasket? 
                    
                    <Button onClick={addToCartPressed}><Typography style={{textAlign:"center"}} variant="h6">ADD <AddShoppingCartIcon  fontSize="default"/></Typography></Button>
                    : <></>
                }
                {userIsAuthenticated && isItemInBasket ? 
                    <>
                    <Button disabled><Typography style={{textAlign:"center"}} variant="h6">ADDED <DoneOutlineIcon  fontSize="default"/></Typography></Button>
                    <Tooltip title="Remove Item from Basket" arrow>
                        <Button onClick={() => removeItem() }><RemoveShoppingCartIcon/></Button>
                    </Tooltip>
                    </>
                    : <></>
                }
                {/* {
                    isItemInBasket ? 
                    <>
                    <Button onClick={addToCartPressed}><Typography style={{textAlign:"center"}} variant="h6">ADD <AddShoppingCartIcon  fontSize="default"/></Typography></Button>
                    
                    </>

                } */}
                
                </CardActions>
                
            </Card>
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        itemsInBasket: state.basket.itemsInBasket, 
        userIsAuthenticated: state.user.isAuthenticated,
        user: state.user,
        items:state.items.items
    };
};

export default connect(mapStateToProps, {setCurrentItem, addItemToBasket, updateItemsBasket,saveCartAction})(Item);