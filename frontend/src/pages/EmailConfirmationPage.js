import { useParams } from "react-router-dom";
import {Typography} from "@mui/material";
import {useEffect} from "react";
import { connect } from "react-redux";
import { emailConfirmationRequest } from "../redux/actions/auth";
import {Loader} from "../components/Loader";
 const EmailConfirmationPage= ({requesting,successful,emailConfirmationRequest}) =>{
    const hash = useParams().hash;
    //gets the hash from the route
    console.log(hash);
    useEffect(()=>{
        //after rendering it will confirm the profile
        emailConfirmationRequest({hash});
    },[])
    if(requesting){
       return(
        <Loader></Loader>
       ) 
    }

        return(
            <div>
                <Typography>Your Email confirmation was successful!</Typography>
            </div>
        )
 
}

const mapStateToProps = (state) => {
    return {
        successful:state.auth.successful,
        requesting:state.auth.requesting,
    };
  };
  
export default connect(mapStateToProps,{emailConfirmationRequest})(EmailConfirmationPage)