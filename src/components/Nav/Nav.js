import React from 'react'
import './Nav.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { MemoryBlocks } from '../MemoryBlocks/MemoryBlocks';
import { Approximity } from '../Approximity/Approximity';
import { DotsHunter } from '../DotsHunter/DotsHunter';
import { Sorter } from '../Sorter/Sorter';
// import { useChallenge } from '../../hooks/challenge.context';

export const Nav = ({ children }) => {

    // const challenge = useChallenge()
    // const currentChallenge = challenge ? challenge.currentChallenge : undefined

    return (
        <Router>
            <div>
                {children}
                {/* {!currentChallenge && <Redirect to='/' />} */}
                <Switch>
                    <Route path="/sorter">
                        <Sorter />
                    </Route>
                    <Route path="/dotshunter">
                        <DotsHunter />
                    </Route>
                    <Route path="/memory">
                        <MemoryBlocks />
                    </Route>
                    <Route path="/approximity">
                        <Approximity />
                    </Route>
                    <Route path="/">
                        <div></div>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
