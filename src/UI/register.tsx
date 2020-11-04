import React, {Component, useState, useEffect} from 'react';
import ReactDOM  from 'react-dom';

import { Form, FormGroup, Label,
    Input, Col, Button,
} from 'reactstrap'; 

import axios from 'axios';

import globals from './helpers/globals';
import { Route, Redirect, Link } from 'react-router-dom';
import './styles/forms.css';

import * as actionCreator from './store/Actions/actionCreator';

import {connect} from 'react-redux';
import { IState } from './store/core/core';


const mapStateToProps = (state : IState) => {
    return {
        usernameExist : state.usernameExist,
        registeredUser : state.registeringUser,
        registerSuccess : state.registerSuccess,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        doesUsernameExist : (username) => dispatch(actionCreator.usernameExist(username)),
        register : (user) => dispatch(actionCreator.register(user)),
    }
}

const Register = (
                    {
                    usernameExist , registeredUser, registerSuccess, 
                    doesUsernameExist , register 
                    }
                ) => {


    const redStyle = {
        'color' : 'red'
    }    

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userNameTaken, setUserNameTaken] = useState(true);
    const [goto, setGoto] = useState('');

    useEffect(() => {
        // console.log(usernameExist.toString())
        setUserNameTaken(usernameExist);
    }, [usernameExist])

    useEffect(() => {
        // redirect to register successfull page
        if (registerSuccess){
            // ok
            setGoto('registerSuccess')
        }
    }, [registerSuccess])

    const onIDChange = (e:any) =>
    {
        var v = String("");
        v = e.target.value;
        v = v.toUpperCase();
        
        var user = {
            name : v
        }     

        usernameExist = true;
        doesUsernameExist(v);
        
        setIdentifier(v);
    }
    
    const onPASSChange = (e:any) =>
    {
        var v = String("");
        v = e.target.value;
        v = v.toUpperCase(); 
        
        setPassword(v);
    }

    function validatePass() :  {result : boolean, reason : string}
    {
        // check pass phrase 
        // 
        if (password.length < 8)
        {
            return {
                result : false,
                reason : 'Length must be at least 8 characters.'
            };
        }

        var spaceRegex = /\s+/;
        if (spaceRegex.test(password.toString()))
        {
            return {
                result : false,
                reason : 'White space and tabulations are not allowed.'
            };
        }

        var passRegex = /^(?=.*\W)(?=.*\d)[a-zA-Z\d\W]{8,}$/;

        if (!passRegex.test(password.toString()))
        {
            return {
                result : false,
                reason : 'There should be at least one special character.'
            };
        }

        return {result : true, reason : ''};
    }

    function validateEmail() : {result : boolean , reason : string}
    {
        // check email
        var emailRegex = /^[a-zA-Z0-9]{3,}@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
        if (! emailRegex.test(email.toString()))
        {
            return {
                result : false,
                reason : 'Invalid email. Valid format : SOMEONE@PLACE.COM'
            }
        }
        return {
            result : true,
            reason : ''
        };
    }


    const onEmailChange = (e:any) =>
    {
        var v = String("");
        v = e.target.value;
        setEmail(v);
    }

    const sendData = () =>
    {
        // some checks TODO

        const user = {
            name : identifier,
            password : password,
            email : email,
            account_created : '',
            picture : '',
        }

        register(user);
    }

    
    if (goto.toString() != '')
    {  
            return <Redirect to={goto.toString()} />
    }

    return (
            <div className="keepSmall">
                <Form>
                    <FormGroup row>
                        <Label size="lg" xs={12} sm={12} for="ide"><b>Identifier </b></Label>
                        <Col>
                            <Input xs={12} sm={12} bsSize="lg"  
                                type="text" 
                                name="ide" 
                                id="ide" 
                                placeholder="ID" 
                                value={identifier.toString()}
                                onChange={(e:any) => onIDChange(e)}
                             />
                        </Col>
                        {
                            userNameTaken === true ? 
                            <Label style={redStyle} size="lg" xs={12} sm={12} for="ide"><b>Username is taken.</b></Label>
                            :
                            null
                        }
                    </FormGroup>
                    <FormGroup row hidden={identifier.length < 3 || userNameTaken}>
                        <Label size="lg" sm={12} for="password">Pass Phrase</Label>
                        <Col>
                            <Input sm={8} bsSize="lg"  
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="" 
                                value={password.toString()}
                                onChange={(e:any) => onPASSChange(e)}
                             />
                        </Col>
                        <Label style={redStyle} size="lg" sm={12} for="">{validatePass()['reason']}</Label>
                    </FormGroup>
                    <FormGroup row hidden={!validatePass()['result']}>
                        <Label size="lg" sm={4} for="email">Email</Label>
                        <Col>
                            <Input sm={8} bsSize="lg"
                                type="text"
                                name="email"
                                id="email"
                                placeholder="@E"
                                value={email.toString()}
                                onChange={(e : any) => onEmailChange(e)}
                            />

                        </Col>
                        <Label style={redStyle} size="lg" sm={12} for="">{validateEmail()['reason']}</Label>
                    </FormGroup>
                    <div  className="row">
                        <Button size="lg" 
                            className="col-12"
                            onClick={sendData} hidden={!validateEmail()['result']} color="primary">Register</Button>
                    </div>
                    <div className="row fixed-bottom w-50 m-auto align-center">
                        <hr className="row col-12 bg-secondary" />
                        <div className="row">
                            <Label className="col-12 text-secondary text-center">
                                By clicking on "Register", you acknowledge having read and accepted our <Link to="/terms">Conditions and terms of usage.</Link>
                            </Label>
                        </div>
                    </div>
                </Form>
                
            </div>
        );
}


export default connect(mapStateToProps, mapDispatchToProps)(Register)