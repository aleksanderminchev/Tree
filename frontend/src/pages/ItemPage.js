import React, { useEffect,  useState } from "react";
import { Typography, Button,Paper,  Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {addItemToBasket, updateItemsBasket} from "../redux/actions/basket";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import {saveCartAction} from "../redux/actions/order";

const useStyles=makeStyles(()=>({
    paper:{
        height:"90vh",
        width:"100%",
        margin: '1.5%', 
        padding: "20px", 
        display:"flex",
        justifyContent:"space-evenly"   
    },
    image:{
        minWidth:"50%",
        maxHeight:"100%",
        width:"100vw"
    },
    buttons:{
        marginTop:"20%",
    }
}))

const ItemPage=({items, currentItem, user,itemsInBasket,saveCartAction,addItemToBasket,updateItemsBasket})=> {
    console.log("ItemInBasket in ItemOage", itemsInBasket)
    const history = useHistory();
    const classes=useStyles();

    const [isItemInBasket, setIsItemInBasket] = useState(false);
    
    const checkIfItemInBasket = () => {
        let isItemInArray = [];
        if (itemsInBasket){
            isItemInArray = itemsInBasket.filter(itemInBasket => itemInBasket._id === currentItem._id);
        }
        if (isItemInArray.length !== 0){
            return true;
        }else{
           return false;
        } 
    }
   
    useEffect( () => {
        const returnedValue = checkIfItemInBasket()
        console.log("returnedValue", returnedValue)
        
        setIsItemInBasket(returnedValue);
    }, [currentItem])
    
    const addToCartPressed = (e) => {
        e.preventDefault();
        const index = itemsInBasket.indexOf(currentItem);
        if (index === -1){
            itemsInBasket.push(currentItem);
        }else{
            itemsInBasket.splice(index, 0, currentItem);
        }
        addItemToBasket(itemsInBasket);
        setIsItemInBasket(true);
        saveCartAction(itemsInBasket,user.token, user.exp, "ADD");
    }

    const removeItem = () => {
        const updatedItemsInBasket = itemsInBasket.filter(itemFromBasket => currentItem._id !== itemFromBasket._id);
        console.log("updatedItemsInBasket", updatedItemsInBasket)
        updateItemsBasket(updatedItemsInBasket); 
        console.log("Delete: ", currentItem);
        setIsItemInBasket(false);
        saveCartAction(updatedItemsInBasket, user.token, user.exp, "REMOVE");
    }
    const goBack = ()=>{
        history.goBack();
    }
    
    return (
        <div>
        <Paper className={classes.paper} style={{background:"#D7CD79"}} >
            <div >
                <img  style={{ minWidth:"50%",maxHeight:"80vh",width:"100%"}} src={currentItem.picturesArray[0]} 
                alt=""
                >
                </img>
            </div>
            <div>
            <Typography variant="h1">{currentItem.name}</Typography>
            <Typography variant="h5">Description: </Typography>
            <Typography variant="body1">{currentItem.description}</Typography>
            <Typography variant="h5">Suitable for: </Typography>
            <Typography variant="body1">{currentItem.categoryArray.join(', ')}</Typography>
            <Typography variant="h5">Made of: </Typography>
            <Typography variant="body1">{currentItem.materialArray.join(', ')}</Typography>
            <Typography variant="h5">Warranty:</Typography>
            <Typography variant="body1"> {currentItem.hasWarranty ? "Yes" : "No"}</Typography>
            <Typography variant="h5">Rating:</Typography>
            <Typography variant="body1">{currentItem.ratings.medianValueRating}/5</Typography>
            <Typography variant="h5">Price: {currentItem.price} DKK</Typography>
            <div className={classes.buttons}>
            {user.isAuthenticated  && !isItemInBasket? 
                
                <Button variant="contained" color="primary" onClick={addToCartPressed}><Typography style={{textAlign:"center"}} variant="h6">ADD <AddShoppingCartIcon  fontSize="default"/></Typography></Button>
                : <></>
            } 
                        {user.isAuthenticated  && isItemInBasket ? 
                <>
                <Button variant="contained" color="primary" disabled><Typography style={{textAlign:"center"}} variant="h6">ADDED <DoneOutlineIcon  fontSize="default"/></Typography></Button>
                <Tooltip title="Remove Item from Basket" arrow>
                <Button variant="contained" color="primary"  onClick={() => removeItem() }>Remove<RemoveShoppingCartIcon/></Button>
                </Tooltip>
                </>
                : <></>
            }
            </div>
             </div>
            </Paper>
         <Button sx={{ marginLeft: '15px'}} variant="outlined" onClick={goBack}>Back</Button>
         </div>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.items.items,
        currentItem: state.items.currentItem,
        user: state.user,
        itemsInBasket: state.basket.itemsInBasket
    };
};
    
export default connect(mapStateToProps,{saveCartAction,addItemToBasket,updateItemsBasket})(ItemPage)