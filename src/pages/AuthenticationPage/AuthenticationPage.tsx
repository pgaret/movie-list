import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import logo from 'assets/checklist-logo-1-2.png';
import styles from './AuthenticationPage.module.scss';

export default function AuthenticationPage() {
    useEffect(() => {
        // localStorage.removeItem('user')
    }, []);
    const [mode, setMode] = useState('login');

    return (
        <div className={styles.authenticationPage}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <h2>Movie-Checklist.com</h2>
            { mode === 'login' ? <Login /> : <SignUp /> }
            <div className={styles.modeButtons}>
                <ButtonGroup color="primary" aria-label="contained primary button group">
                    <Button
                        disabled={mode === 'login'}
                        onClick={() => setMode('login')}
                    >Log In</Button>
                    <Button
                        disabled={mode === 'signup'}
                        onClick={() => setMode('signup')}
                    >Sign Up</Button>
                </ButtonGroup>
            </div>
        </div>
    );
}
