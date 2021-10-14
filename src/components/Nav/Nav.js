import React from 'react'
import PropTypes from 'prop-types'
import './Nav.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MemoryBlocks } from '../games/MemoryBlocks/MemoryBlocks'
import { Approximity } from '../games/Approximity/Approximity'
import { DotsHunter } from '../games/DotsHunter/DotsHunter'
import { Sorter } from '../games/Sorter/Sorter'

export const Nav = ({ children }) => (
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

Nav.propTypes = {
  children: PropTypes.array,
}
