import React, {  useEffect, useState } from "react";
import { ListItemButton,Tooltip, Checkbox, Radio,ListItem, ListItemIcon,ListItemText,Toolbar, List, Drawer, Grid, Box, Badge, Divider, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {Loader} from "./Loader"
import Fab from '@mui/material/Fab';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useHistory } from "react-router-dom";

import Item from "../components/Item"; 

const useStyles=makeStyles(()=>({
    back:{
        margin:"2%",
        backgroundColor:"#D7CD79",
        flexGrow:2,
        width: '600px',
        height: '100%',
        paddingBottom:"7%",
    },
    card:{
        marginTop:"10%",
        marginLeft:"5%",
        width:"90%",
    },
    fab:{
        margin: "3%",
    },
    items:{
        display:"flex",
    },

}))

export const ShoppingPageComponent=({goBack,items, itemsInBasket, userIsAuthenticated, addItemToBasket})=>{
    const classes=useStyles();
    const drawerWidth = 240;
    
    const history = useHistory()
    
    const [checked, setChecked] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [emptyBasket, setEmptyBasket] = useState(false); 
    const [emptyFilteredItemsList, setEmptyFilteredItemsList] = useState(false);
    useEffect( () => {
      setFilteredItems([...items]);  
    }, [items])
  
    const basketButtonClicked = () => {
        if (itemsInBasket.length){
            setEmptyBasket(false);
            history.push("/basket")
        }else{
            setEmptyBasket(true);
        }
    }

    const filterItems = (filterOption) => {
        //local items to use for some operations
        const itemsInStock = [...items]
        setFilteredItems([...items]);
        console.log(`Checkbox pressed ${filterOption}`);
        // const currentIndex = checked.indexOf(filterOption);
        const newChecked = [...checked];
        //filter out the options based on string or number
        //used for the radio and check buttons
        if ((typeof filterOption) === 'string'){
            const currentIndex = checked.indexOf(filterOption);
            if (currentIndex === -1) {
                newChecked.push(filterOption);
            } else {
                newChecked.splice(currentIndex, 1);
            }

        }
        if ((typeof filterOption) === 'number'){
            if ((typeof newChecked[0]) === 'number' && newChecked[0] === filterOption){
                newChecked.shift(); 
            }else if ((typeof newChecked[0]) === 'number' && newChecked[0] !== filterOption){
                newChecked.splice(0, 1, filterOption);
            }else if (newChecked.length === 0 || (typeof newChecked[0]) === 'string'){
                newChecked.unshift(filterOption); 
            }
        }
        setChecked(newChecked);
        console.log(newChecked);
        const filtered = [];
        if (newChecked.length){
            //if any string option is selected, run 2 arrays 1 for getting all options selected
            //the other to filter the items if the options is string and is in the category array of the item
            // already included options are not excepted
            newChecked.forEach(optionChecked => {
            const filteredItemsOnOption = itemsInStock.filter((item) => {
                if (filtered.includes(item)) {
                    return false;
                }else {
                    if ((typeof optionChecked) === 'string' && item.categoryArray.includes(optionChecked)){
                        return true;
                    }
                    return false;
                }
            })
            console.log(filtered);
            filtered.push(...filteredItemsOnOption);
        })

        if (!filtered.length && ((typeof newChecked[0]) !== 'number')){
            //if no price is selected
            setFilteredItems(filtered) 
            setEmptyFilteredItemsList(true);
        }else if ((typeof newChecked[0]) === 'number'){
            let arrayToCheck;
            //if a price is selected
            // depending on if its only the price or other filtering
            // we assign a diffrent array to the arrayToCheck
            // we filter with arrayToCheck and then setFilteredItems
            if (filtered.length === 0){
                arrayToCheck = itemsInStock;
            }else {
                arrayToCheck = filtered;
            }
            const filteredItemsOnPrice = arrayToCheck.filter((item) => item.price < newChecked[0]);
            console.log("filteredItemsOnPrice ", filteredItemsOnPrice);
            setFilteredItems(filteredItemsOnPrice)
            //empty filtered Items is used for displaying a snackbar notifying that nothing matches
            if (!filteredItemsOnPrice.length) setEmptyFilteredItemsList(true);
        }else {
            setFilteredItems(filtered) 
            if (!filtered.length) setEmptyFilteredItemsList(true);
        }

        }

    }

    const capitalizeString = (initialStr) => {
        return initialStr
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    };

    const priceFilter = [1000, 2000, 5000];
    const categoryFilter=["bedroom", "kitchen", "living room", "dinning room"];

    return (       
        (!filteredItems.length && !items) ? <Loader></Loader> : ( //if posts.length is 0 then is false, !false => true
        <div className={classes.items}>         
        <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Divider/>
          <List>
          <ListItem>Filter items on Category</ListItem>
          {categoryFilter.map((filterOption) => {
        const labelId = `checkbox-list-label-${filterOption}`;
        return (
            <ListItem
            key={filterOption}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={()=>{filterItems(filterOption)}} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(filterOption)}  
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={capitalizeString(filterOption)} />
            </ListItemButton>
          </ListItem>
        );
        })}
        <Divider/>
        <ListItem>Filter items on Price</ListItem>
        {priceFilter.map((filterOption) => {
        const labelId = `radio-list-label-${filterOption}`;
        return (
            <ListItem
            key={filterOption}
            disablePadding
            >
            <ListItemButton role={undefined} onClick={()=>{filterItems(filterOption)}} dense>
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={checked.includes(filterOption)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`Price below ${filterOption}`} />
            </ListItemButton>
          </ListItem>
        );
        })}
          </List>
        </Box>
      </Drawer>
            <Grid container spacing={3} alignItems="stretch" >
                {filteredItems.map((item) => ( 
                    <Grid item key={item._id} xs={12} sm={12} md={4} xl={4} lg={4}>
                        <Item item={item} />  
                    </Grid>      
                ))}
              

                {(emptyFilteredItemsList) 
                    ?   <Snackbar
                            open={() => {setOpenSnackbar(true)}}
                            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                            autoHideDuration={2000}
                            onClose={() => {setOpenSnackbar(false); setEmptyFilteredItemsList(false);}}
                            // message={`${item.name} item was added to Basket!`}
                            // action={action}
                        >
                            <Alert severity="error" sx={{ width: '100%' }}>
                                <b>No items found with these filters. Try choosing other ones.</b>
                            </Alert>
                        </Snackbar>
                    :   (<> </>)

                }
            </Grid>
           
            {userIsAuthenticated ? 
                <Badge className={classes.fab} color="secondary" badgeContent={itemsInBasket.length}>
                     <Tooltip className={classes.fab} title="See added items in Basket" arrow>
                         <Fab className={classes.fab} onClick={basketButtonClicked} color="primary" aria-label="Shopping Bag" >
                             <ShoppingBasketIcon />
                         </Fab>
                         </Tooltip>
                     </Badge>
                     
                : <></>
            }

            
                     
            </div>
    ))
}

