import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { User } from 'lib/interfaces';
import { digestMessage } from 'lib/utilities';
import api from 'api';
import styles from './SignUp.module.scss';

function SignUp() {
    const [signUpUser, updateSignUpUser] = useState<User>({
        id: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });

    function handleSignUpUserFieldUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        const field: string = e.target.dataset.field || '';
        updateSignUpUser({
            ...signUpUser,
            [field]: e.target.value,
        });
    }

    async function handleSignUp() {
        const encryptedPassword = await digestMessage(signUpUser.password);
        api.USERS.post({
            id: signUpUser.id,
            email: signUpUser.email,
            password: encryptedPassword,
            firstName: signUpUser.firstName,
            lastName: signUpUser.lastName,
            phoneNumber: signUpUser.phoneNumber,
        });
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleSignUp();
        }
    }

    return (
        <div className={styles.signupContainer}>
            <h1>Sign Up</h1>
            <div className={styles.requiredFields}>
                <TextField
                    id="login-email"
                    label="Email"
                    required
                    value={signUpUser.email}
                    onKeyDown={handleKeyPress}
                    onChange={handleSignUpUserFieldUpdate}
                    inputProps={{ 'data-field': 'email' }}
                />
                <TextField
                    id="login-password"
                    label="Password"
                    type="password"
                    required
                    value={signUpUser.password}
                    onKeyDown={handleKeyPress}
                    onChange={handleSignUpUserFieldUpdate}
                    inputProps={{ 'data-field': 'password' }}
                />
            </div>
            <div className={styles.optionalFields}>
                <TextField
                    id="login-firstName"
                    label="First Name"
                    value={signUpUser.firstName}
                    onKeyDown={handleKeyPress}
                    onChange={handleSignUpUserFieldUpdate}
                    inputProps={{ 'data-field': 'firstName' }}
                />
                <TextField
                    id="login-lastName"
                    label="Last Name"
                    value={signUpUser.lastName}
                    onKeyDown={handleKeyPress}
                    onChange={handleSignUpUserFieldUpdate}
                    inputProps={{ 'data-field': 'lastName' }}
                />
                <TextField
                    id="login-phoneNumber"
                    label="Phone Number"
                    value={signUpUser.phoneNumber}
                    onKeyDown={handleKeyPress}
                    onChange={handleSignUpUserFieldUpdate}
                    inputProps={{ 'data-field': 'phoneNumber' }}
                />
            </div>

            <Button variant="contained" color="primary" onClick={handleSignUp}>Sign Up</Button>
        </div>
    );
}

export default SignUp;
