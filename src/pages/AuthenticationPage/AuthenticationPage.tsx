import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api'
import { digestMessage } from '../../lib/utilities';
import { User } from '../../lib/interfaces';

interface LogInUser {
    email: string,
    password: string
}

export default function AuthenticationPage() {
    useEffect(() => {
        // localStorage.removeItem('user')
    }, [])

    const [ signUpUser, updateSignUpUser ] = useState<User>({
        id: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    })
    const [ logInUser, updateLogInUser ] = useState<LogInUser>({
        email: 'email',
        password: 'password'
    })
    const [ mode, setMode ] = useState<string>('login')
    let history = useHistory()

    function handleSignUpUserFieldUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        const field: string = e.target.dataset.field || ''
        updateSignUpUser(Object.assign({}, signUpUser, {
            [field]: e.target.value
        }))
    }

    function handleLogInUserFieldUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        const field: string = e.target.dataset.field || ''
        updateLogInUser(Object.assign({}, logInUser, {
            [field]: e.target.value
        }))
    }

    async function handleLogin() {
        const encryptedPassword = await digestMessage(logInUser.password);
        const { data } = await api.USERS.login(logInUser.email, encryptedPassword);

        localStorage.setItem('user', JSON.stringify(data))

        history.push('/movies')
    }

    async function handleSignUp() {
        const encryptedPassword = await digestMessage(signUpUser.password);
        api.USERS.post({
            id: signUpUser.id,
            email: signUpUser.email,
            password: encryptedPassword,
            firstName: signUpUser.firstName,
            lastName: signUpUser.lastName,
            phoneNumber: signUpUser.phoneNumber
        });
    }

    console.log(localStorage.getItem('user'));
    console.log(!!localStorage.getItem('user'));

    return (
        <div>
            { mode === 'login'
                ? (
                    <div>
                        <h1>Log In</h1>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" value={logInUser.email} data-field="email" onChange={handleLogInUserFieldUpdate} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={logInUser.password} data-field="password" onChange={handleLogInUserFieldUpdate} />
                        </div>
                        <button onClick={handleLogin}>Log In</button>
                    </div>
                )
                : (
                    <div>
                        <h1>Sign Up</h1>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" value={signUpUser.email} data-field="email" onChange={handleSignUpUserFieldUpdate} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={signUpUser.password} data-field="password" onChange={handleSignUpUserFieldUpdate} />
                        </div>
                        <div>
                            <label htmlFor="firstName">firstName</label>
                            <input id="firstName" value={signUpUser.firstName} data-field="firstName" onChange={handleSignUpUserFieldUpdate} />
                        </div>
                        <div>
                            <label htmlFor="lastName">lastName</label>
                            <input id="lastName" value={signUpUser.lastName} data-field="lastName" onChange={handleSignUpUserFieldUpdate} />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber">phoneNumber</label>
                            <input id="phoneNumber" value={signUpUser.phoneNumber} data-field="phoneNumber" onChange={handleSignUpUserFieldUpdate} />
                        </div>
                        <button onClick={handleSignUp}>Sign Up</button>
                    </div>
                )
            }
        </div>
    )
}