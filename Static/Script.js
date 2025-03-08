const params = new URLSearchParams( window.location.search )
const URL_has_logout_indicator =  params.has("Log out")

if (URL_has_logout_indicator) { LogOut() }

var Browser_Height = window.innerHeight
var Browser_Width = window.innerWidth
var Screen_Width = screen.width
var Screen_Height = screen.heightz

document.documentElement.style.cssText = "--BrowserWidth:"+Browser_Width


function LogOut () {
  var Cookie = document.cookie
  document.cookie = Cookie +"; max-age=0"
  setTimeout( () => {
     const Logout_confirmation = confirm("You have been loged out, would you like to login again") 
     if (Logout_confirmation) { window.location.href = "/signin" } }, 3000 )
}


//sharetext
function CopyLink () { navigator.clipboard.writeText(link)
  DisplayCopyText()
  setTimeout(RemoveCopyText , 5000)
}

function DisplayCopyText () {
  var CopyText = document.getElementById("CopyText")
  CopyText.style.visibility = "visible"
}

function RemoveCopyText () {
  var CopyText = document.getElementById("CopyText")
  CopyText.style.visibility = "hidden"
}


//SETTINGS
function DisplayChangeEmailBlock() { CEB.style.display = "block" }

function RemoveChangeEmailBlock() { CEB.style.display = "none" }

function DisplayChangePasswordBlock() { CPB.style.display = "block" }

function RemoveChangePasswordBlock() { CPB.style.display = "none" }

function DisplayChangeUserNameBlock() { CUNB.style.display = "block" }

function RemoveChangeUserNameBlock() { CUNB.style.display = "none" }

function DisplayPhoneNumberBlock() { CPNB.style.display = "block" }

function RemovePhoneNumberBlock() { CPNB.style.display = "none" }

function AccountDetailsBlockDisplay() { if ( ADB.style.display == "none") { ADB.style.display = "block" } else { ADB.style.display = "none" } }
 
function DisplayShareBlock() {
  document.getElementById("AddLinkBlock").style.display = "none"
  SLB.style.display = "block"
  MenuOptions.style.display = "none" }


function DisplayAddLinkBlock () {
  SLB.style.display = "none"
  document.getElementById("AddLinkBlock").style.display = "block"
  var MO = document.getElementById("MenuOptions")
  MO.style.display = "none"
  
}


function ChangeVisibility () { 
   varMenuOptions = document.getElementById("MenuOptions")
 if (MenuOptions.style.display == "none") { MenuOptions.style.display = "block"}
 else { MenuOptions.style.display = "none"}
 document.getElementById("AddLinkBlock").style.display = "none" 

}

