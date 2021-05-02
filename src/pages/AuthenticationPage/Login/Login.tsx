import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import api from 'api';
import { digestMessage } from 'lib/utilities';
import styles from './Login.module.scss';

interface LogInUser {
    email: string,
    password: string
}

export default function Login() {
    useEffect(() => {
        // localStorage.removeItem('user')
    }, []);
    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const history = useHistory();

    async function handleLogin() {
        const encryptedPassword = await digestMessage(password);
        const { data } = await api.USERS.login(email, encryptedPassword);

        localStorage.setItem('user', JSON.stringify(data));

        history.push('/');
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    return (
        <div className={styles.login}>
                <h1>Log In</h1>
                <div className={styles.form}>
                    <div>
                        <TextField id="login-email" label="Email" value={email} onKeyDown={handleKeyPress} onChange={(e) => setEmail(e.target.value)}  />
                    </div>
                    <div>
                        <TextField id="login-password" label="Password" type="password" value={password} onKeyDown={handleKeyPress} onChange={(e) => setPassword(e.target.value)}  />
                    </div>
                </div>
                <Button variant="contained" color="primary" onClick={handleLogin}>Log In</Button>
        </div>
    );
}