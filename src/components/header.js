import React, { Component } from "react"
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBContainer
} from "mdbreact"

export default function Index() {
  return (
    <MDBNavbar className="elegant-color-dark" expand="md">
      <MDBContainer>
       <MDBNavbarBrand className="pb-0">
         <h5 className="white-text font-weight-bold">
           <img className="mr-2" src={require('../../images/railgun_logo.png')} width="90" />

           <span>Quake 3 NoGhost</span>
         </h5>
       </MDBNavbarBrand>
     </MDBContainer>
     </MDBNavbar>
  )
}