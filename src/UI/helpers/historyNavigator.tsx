import { useHistory, Redirect } from "react-router-dom"
import { useState, useEffect } from "react";
import React from 'react';
import { connect } from 'react-redux';
import { IState } from "../store/core/core";
import { setRoute, eraseRoute } from "../store/Actions/actionCreator";

const mapStateToProps = (state : IState) => {
    return {route : state.routing}
};

const mapDispatchToProps = dispatch => {
    return {
        gotoRoute : (where : string) => dispatch(setRoute(where)),
        eraseRoute : () => dispatch(eraseRoute())
    }
}



const HistoryNavigator = ({route, gotoRoute, eraseRoute}) =>
{
    const history = [];

    useEffect(() => {
        if (route !== '')
        {
            goto();
        }
    }, [route])

    // setUrl(newUrl : String)
    // {
    //     history.push(newUrl.toString());
    //     this.setState({urls : newUrl});
    // }
    
    const goto = () =>
    {
        const p = '/' + route;
        eraseRoute();
        return (<Redirect to={p} />);
    }

    // console.log('######### RECEIVED ' + route)
    if (route !== '')
    {
        const p = '/' + route;
        eraseRoute();
        return (<Redirect to={p} />);
    }
    else{
        return null;
    }
}

const history = Array<string>();

export default  connect(mapStateToProps, mapDispatchToProps)(HistoryNavigator);