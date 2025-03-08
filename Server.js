//implemt update function for number of clicks on add

//IMPORTS
var { Messages_Object, Max_Age_4_cookies, Adverts_contaiment_Stats,
            Seeded_URLs, JWT_Payload, Un_Seeded_URLs, Token_templates, multer, 
                   fs, String_4_Email_Billboard, JWT, JWT_Secret, Token, Third_party_information,
                           Port, app, BodyParser, express, path, bcryptjs, bcryptjs_salt, Objectfied_Data,
                                            data, Path_2_static_files, User_object, cookie,
                                            Current_ads,
                                            DB_result,
                                            Message} = require("./External Variables")

const { IncreaseNOCs, UpdateUser_name, Client, Adverts_picker,
            Dynamic_Variables, Check_Regex, Write_email_2_text_file, Send_Email,
                    Log_error, file_name_function, Increase_clicks_on_advert,
                                          Upadte_linkyard_stats,
                                          Increase_views_on_advert} = require("./External Functions")
const { request, response } = require("express")

//SYSTEM CONFIGURATIONS & FUNCTIONS
const storage = multer.diskStorage( {
        destination:function (req, file, cb) { cb(null, "uploads/") },
        filename: file_name_function } )


const upload = multer( { 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    
    fileFilter:(request, file, cb) => {

   if (request.body.AdvertisementBillBoard == String_4_Email_Billboard) {
        if (file.mimetype.includes("image")) { cb(null, true) } else { cb(null, false) }   
   } else {
     if (file.mimetype.includes("video")) { cb(null, true) } else { cb(null, false) } } }

} )


app.listen(Port , () => {console.log("Server stated on port " + Port + ' on ' + Dynamic_Variables.Get_Date_String() ) } )
app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json())
app.use( express.static( Path_2_static_files ) )
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views") )
app.use( Increase_clicks_on_advert )


//ROUTES...............................................................
//AUTHORIZATION MIDDLEWARE


app.use(  async (request, response, next) => {
    try {
               
        let Url = request.path.toLowerCase()
        let Cokie = request.headers.cookie
        let URLs_list = Seeded_URLs.concat(Un_Seeded_URLs)  
        let Is_GET_method = request.method == "GET"

        Third_party_information.Current_ads =  {
            Ad_for_upper_billboard: Adverts_picker().Upper_Billboard,
            Ad_for_middle_billboard: Adverts_picker().Middle_Billboard,
            Ad_for_lower_billboard: Adverts_picker().Lower_Billboard }
                    
        if ( Is_GET_method && URLs_list.includes(Url) ) { 
            console.log(Url);
            
             Upadte_linkyard_stats(Url)
             Increase_views_on_advert(Third_party_information.Current_ads) }

        if ( Is_GET_method && Seeded_URLs.includes(Url)) {                        

                if (Cokie) {       
                    User_object = Token_templates.Get_user_token()

                    let Encrypted_Cookie = Cokie.slice( "JWT=".length )
                    let Dencrypted_Cookie = JWT.verify(Encrypted_Cookie, JWT_Secret)

                    DB_result =  await Client.db("Link_Yard").collection("Users").findOneAndUpdate(
                         { Email: Dencrypted_Cookie.Email },
                         {$set: {Last_active: Dynamic_Variables.Get_Iso_Date() } } )

                    let No_document_from_DB = DB_result.value == null
                    let Un_authrised_access = Url == "/adminconsole" && DB_result.value.User_name != "Linkyard"
                    
                    if (Un_authrised_access) {
                        response.redirect(`Info?message=${Messages_Object.UNAUTHORISED_ACCESS}&Log out=true`)
                        return }
                    

                    if (No_document_from_DB) {
                         response.redirect(`Info?message=${Messages_Object.CHANGED_SECURITY_DETAILS}&Log out=true`)
                         return }

                    let Number_of_fields_on_user_document = Object.keys(DB_result.value).length
                    let Expeted_number_of_fields_on_user_document = Object.keys( User_object ).length + 1
                    let Document_from_DB_is_incomplete = Number_of_fields_on_user_document != Expeted_number_of_fields_on_user_document
                    let Session_Time_has_not_changed = Dencrypted_Cookie.Session_time == DB_result.value.Session_time

                    
                    if (Document_from_DB_is_incomplete) {                        
                        
                        Client.db("Link_Yard").collection("Users").deleteOne( {_id: DB_result.value._id} )                 
                        response.redirect(`Info?message=${Messages_Object.SOMETHING_WENT_WRONG}.\n But from what has happened, we advise you to create a new account.&Log out=true`)
                        return }
              
                    if ( Session_Time_has_not_changed ) {
                        
                        User_object.Email = DB_result.value.Email
                        User_object.Phone_Number = DB_result.value.PhoneNumber
                        User_object.Date_Initiated = DB_result.value.Date_Initiated
                        User_object.Links = DB_result.value.Links
                        User_object.Number_of_links = DB_result.value.Links.length
                        User_object.User_name = DB_result.value.User_name
                        User_object.Session_time = DB_result.value.Session_time

                        Third_party_information.User_object = User_object
                        request.Third_party_information = Third_party_information
                        next() 
                    } else {  
                     //Else statement if session time has changed
                     response.redirect(`Info?message=${Messages_Object.CHANGED_SECURITY_DETAILS}&Log out=true`)
                     } } else {
                     //Else statement if no cookie is found in the response
                     response.redirect(`Info?message=${Messages_Object.NOT_LOGGED_IN}`) } } else {
                     //Else statement if the accessed URL is not seeded
                      request.Third_party_information = Third_party_information                     
                      next() } 
} catch (error) { next(error) } } )


//ADVETISEMENT PLAN & STRUCTURE
app.get( "/Adminconsole", (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads    
        response.render("Adminconsole", { Current_ads, Adverts_contaiment_Stats})
        Current_ads = null
} catch (error) { next(error) } } )

app.post("/Adminconsole", (request, response, next) => {  } )


//HOME PAGE ROUTER ( LinkYard )
app.get("/", (request, response, next) => {
    try {

         Current_ads = request.Third_party_information.Current_ads

         let A = Current_ads.Ad_for_upper_billboard

         

         response.render("LinkYard" , {Current_ads, Message:"Hello Welcome to LinkYard"} )
         Current_ads = null

} catch (error) { next(error) } } )

app.post("/", (request, response, next) => {  } )


//CONFIRMATION ROUTE
app.get("/Confirmation1" , (request, response, next) => {
    try {

        Current_ads = request.Third_party_information.Current_ads
        let Subject = request.query.Subject
        response.render("Confirmation1" , {Current_ads, Subject} )  

} catch (error) { next(error) } } )



//Info PAGE
app.get("/Info" ,(request, response, next) => {
    try {        
        Current_ads = request.Third_party_information.Current_ads

        Message = request.query.message
        if (Message == undefined) { Message = Messages_Object.ORIGINAL_MESSAGE }  
        response.render("Info" , { Current_ads, Message } ) 
} catch (error) { next(error) } } )

app.post("/Info", (request, response, next) => {  } )


app.post("/Confirmation1" ,async (request, response, next) => {
    try {
        let Identifier = request.body.Identifier
        Token = Token_templates.Get_transporter_token()
    

    
        switch ( Identifier ) {
            case "PhoneNumber":
                let IdentifierValue = request.body.IdentifierValue
                DB_result = await Client.db("Link_Yard").collection("Users").findOne( {Phone_Number: IdentifierValue} )
    
                if ( DB_result ) { 
                        Token.Identifier = DB_result.Email
                         //await Client.db("Link_Yard").collection("Tokens").insertOne(Token)
                         fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
                        //SEND MESSAGE TO PN
                        response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
          
              } else {
                  Message = Messages_Object.PHONE_NUMBER_NOT_FOUND
                  response.redirect(`Info?message=${Message}`) }
                break;
        
            case "Email":
                IdentifierValue = request.body.IdentifierValue
                DB_result = await Client.db("Link_Yard").collection("Users").findOne( {Email: IdentifierValue.toLowerCase()} )
    
                if (DB_result) {
                        Token.Identifier = Email.toLowerCase()
                         //await Client.db("Link_Yard").collection("Tokens").insertOne(Token)
                         fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
                        //SEND MESSAGE TO EMAIL
                        response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
    
                } else {
                    Message = Messages_Object.EMAIL_NOT_FOUND
                    response.redirect(`Info?message=${Message}`) }
                break; }
} catch (error) { next(error) } } ) 

app.get("/Confirmation2" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        let Identifier = request.query.Identifier
        let Subject = request.query.Subject
        
        if (Identifier == undefined) {
            response.redirect(`info?message=${Messages_Object.UNAUTHORISED_ACCESS}`)
            return }

        response.render("Confirmation2" , { Current_ads, Message, Subject, Identifier } )  
} catch (error) { next(error) } } )


app.post("/Confirmation2" , async (request, response, next) => { 
    try {
        Token = Token_templates.Get_transporter_token()

        let Identifier = request.query.Identifier
        let ID = request.query.ID
        let Subject = request.query.Subject
        let InputCode = request.body.Code

        let Is_form_1 =   request.body.Which_form == "form_1"
        let Is_form_2 =   request.body.Which_form == "form_2"

        data = fs.readFileSync(`Text_Files/Tokens/${request.query.ID}.txt`, "utf8")
        Objectfied_Data = JSON.parse(data)
        
        let InputCode_is_correct = Objectfied_Data.Subject_Code == InputCode
        let Code_has_been_used =  Objectfied_Data.Has_been_used
        let Token_has_secondary_token = Objectfied_Data.Has_secondary_token
        
        
        if (Is_form_2) {
              if (Code_has_been_used) {
                response.redirect(`Info?message=${Messages_Object.HAS_ALREADY_USED_CODE_FROM_PREVIOUS_TOKEN}` )
              } else {
            //Else statement if user has not used code from previous token
                //await Client.db("Link_Yard").collection("Tokens").updateOne( {ID:Number(ID), Identifier:Identifier}, {$set: {Has_secondary_token: true } } )

                Objectfied_Data.Has_secondary_token = true
                fs.writeFileSync(`Text_Files/Tokens/${request.query.ID}.txt`, JSON.stringify(Objectfied_Data))
                
                Token.Identifier = Identifier
                Token.Subject = Objectfied_Data.Subject
                Token.Body = Objectfied_Data.Body
    
                //await Client.db("Link_Yard").collection("Tokens").insertOne(Token)
                fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
                Send_Email(Token)            
                response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`) } }


    if (Is_form_1) {        

            if (InputCode_is_correct) {
                
                if (Token_has_secondary_token) {
                    response.redirect(`Info?message=${Messages_Object.TOKEN_HAS_SECONDARY_TOKEN}`)
                    } else {
                    //Else statement if token has no secondary token  
                   if ( Code_has_been_used ) {
                    response.redirect(`Info?message=${Messages_Object.DUPLICATE_ACTION}`) 

                   } else {
                    //Else satement if token is not yet used
                    //await Client.db("Link_Yard").collection("Tokens").updateOne( {ID:Number(ID), Identifier:Identifier}, {$set: {Has_been_used: true } } ) 

                        Objectfied_Data.Has_been_used = true
                        fs.writeFileSync(`Text_Files/Tokens/${request.query.ID}.txt`, JSON.stringify(Objectfied_Data))
     
            if ( Subject == "Account Verification" ) {  
                 
                 JWT_Payload = Token_templates.Get_cookie_token()
                 JWT_Payload.Email = Objectfied_Data.Body.Email
                 JWT_Payload.Session_time = Objectfied_Data.Body.Session_time
                
                let cookie = JWT.sign(JWT_Payload , JWT_Secret )            
                response.cookie("JWT" , cookie , {maxAge: Max_Age_4_cookies} )
                console.log(Objectfied_Data.Body);
                
                await Client.db("Link_Yard").collection("Users").insertOne( Objectfied_Data.Body )
                Write_email_2_text_file(Objectfied_Data.Body.Email)
                response.redirect("Profile") }
    

            if ( Subject == "User name Update" ) { 
                    await Client.db("Link_Yard").collection("Users").updateOne( {User_name:Token.Identifier } , {$set: {User_name: Token.Body.User_name } } ) 
                    response.redirect("Profile") }

            if ( Subject == "Email Update" ) { 
                await Client.db("Link_Yard").collection("Users").updateOne( {Email:Token.Identifier } , {$set: {Email: Token.Body.Email } } ) 
                response.redirect("Profile") }
    
    
            if ( Subject == "PhoneNumber Verification" ) {
                await Client.db("Link_Yard").collection("Users").updateOne( {Email: User_object.Email } , {$set: {PhoneNumber: Token.Body.Phone_Number } } )  
                response.redirect("Profile") }
        
    
            if (Subject == "Account Deletion") {
                await Client.db("Link_Yard").collection("Users").deleteOne(Token.Body.User_name)
                response.redirect("/?Log out=true")
                }
    
            if ( Subject == "Advert Confirmation" ) { 

/////REQUIRES REBUILD
}
    
    
                    if ( Subject == "Password Reset") {
                        let pw1 = request.body.pw1
                        let pw2 = request.body.pw2
                         if (pw1 == pw2) {
                            let password = bcryptjs.hashSync(pw1 , bcryptjs_salt)
                            Client.db("Link_Yard").collection("Users").updateOne( {Email:Identifier} , { $set:{Password:password} } )
                            response.redirect("SignIn") 
                    } else {
                    //Else statement if new paswords do not match during pass word reset
                    Message = Messages_Object.PASSWORDS_MISMATCH
                    response.redirect(`Info?message=${Message}`) } } } }

                    } else {
                    //Else statement if code provided is wrong
                    Message = Messages_Object.WRONG_CODE
                    response.redirect(`Info?message=${Message}`) } 
 } 
} catch (error) {    
    
  let Error_conditions_1 = error.code == "ENOENT" 
  let Error_conditions_2 = error.path.startsWith("Text_Files/Tokens")      

  if (Error_conditions_1 && Error_conditions_2) {
    Message = Messages_Object.EXPIRED_TOKEN
    response.redirect(`Info?message=${Message}`)
  } else {  next(error) } } } ) 


//INQURIES ROUTER
app.get("/Inquries" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        response.render("Inquries" , {Current_ads, Message } ) 
} catch (error) { next(error) } } )

app.post("/Inquries", (request, response, next) => {  } )


//SIGNUP ROUTER
app.get("/SignUp" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        response.render("SignUp" , { Current_ads, Message } ) 
} catch (error) { next(error) } } )

app.post("/SignUp" , async (request, response, next) => {
    try {
        let Provided_User_name = request.body.SUUN
        let Provided_Email = request.body.SUE
        let Provided_Password = request.body.SUP
        let Harshed_Password = bcryptjs.hashSync(Provided_Password , bcryptjs_salt)
    
        let Current_number_of_users = await Client.db("Link_Yard").collection("Users").estimatedDocumentCount()
    
        User_object = Token_templates.Get_user_token()
    
        User_object.User_name = Provided_User_name
        User_object.Email = Provided_Email.toLowerCase()
        User_object.Password = Harshed_Password
        User_object.User_Number = Current_number_of_users+1
        User_object.Links = [ {Title:'Link Yard' , Href:"linkyard.com/me."+Provided_User_name , TCs: 0 , DCs: 0 , Android:0 , iPhone:0 , Desktop:0 , Others:0} ]
    
        Token = Token_templates.Get_transporter_token()
        Token.Subject = "Account Verification"
        Token.Identifier  = Provided_Email.toLowerCase()
        Token.Body = User_object
    
        Email = await Client.db("Link_Yard").collection("Users").findOne({Email: Provided_Email.toLowerCase()})  
        User_name = await Client.db("Link_Yard").collection("Users").findOne({ User_name: Provided_User_name })
        let Email_doesnot_exist = Email == null
        let User_name_doesnot_exist = User_name == null
    
    
           if (Email) {
            Message = Messages_Object.EMAIL_ALREADY_EXISTS
            response.redirect(`Info?message=${Message}`) }else {
                if (User_name) {
                    Message = Messages_Object.USER_NAME_ALREADY_EXISTS
                    response.redirect(`Info?message=${Message}`) } }    
    
           if ( Check_Regex(Provided_User_name) ) {
                Message = Messages_Object.INVALID_USER_NAME
                response.redirect(`Info?message=${Message}`) } 
    
    
           if (Email_doesnot_exist && User_name_doesnot_exist) { 
            //await Client.db("Link_Yard").collection("Tokens").insertOne(Token)
            fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
            Send_Email(Token)
            response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
           }
} catch (error) { next(error) } } )


 //SIGNIN ROUTER
 app.get("/SignIn" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        response.render("SignIn" , {Current_ads, Message } )
} catch (error) { next(error) } } )

 app.post("/SignIn" ,   (request, response, next) => {
    try {
        let email = request.body.SIE.toLowerCase()
        let password = request.body.SIP
       
        async function VerifyUser_LI () {
           let A = email
           let DB_result = await Client.db("Link_Yard").collection("Users").findOne( { Email:A } )    
       
           if (DB_result) {
                 let user_password = DB_result.Password
                 let password_comparison = bcryptjs.compareSync(password , user_password)
       
           if ( password_comparison ) {
               JWT_Payload = Token_templates.Get_cookie_token()
               JWT_Payload.Email = email
               JWT_Payload.Session_time = DB_result.Session_time
               let cookie = JWT.sign(JWT_Payload , JWT_Secret )
               response.cookie("JWT" , cookie , {maxAge: 2592000000} )
               response.redirect("Profile")
           } else {
       
               Message = Messages_Object.WRONG_PASSWORD
               response.redirect(`Info?message=${Message}`) } 
           } else { 
               Message = Messages_Object.EMAIL_NOT_FOUND
               response.redirect(`Info?message=${Message}`) } }
       
               
        if (!email) { response.redirect("Confirmation1?Subject=Password Reset") } else { VerifyUser_LI() }
} catch (error) { next(error) } } )


//MIDDLEWARE FOR FILTERING MULTER UPLOADS



//PROMOTIONS ROUTER
app.get("/Promotions", (request, response, next) => {
    Current_ads = request.Third_party_information.Current_ads

    try { response.render("Promotions" , {Current_ads, Message } ) 
} catch (error) { next(error) } } )

app.post("/Promotions", upload.single("file"), async (request, response, next) => {
    try {        

        if (request.body.AdvertisementBillBoard == String_4_Email_Billboard) {
            if ( !request.file ) {
                  response.redirect(`info?message=${Messages_Object.INVALID_FILE_TYPE_FOR_PHOTOS}`)
                  return }    
           } else {
            if ( !request.file ) {
                response.redirect(`info?message=${Messages_Object.INVALID_FILE_TYPE_VIDEOS}`)
                return } }

            if (request.third_party_information.booleon) {
                //await Client.db("Link_Yard").collection("Tokens").insertOne(request.third_party_information.info)
                fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(request.third_party_information.info))
                response.redirect(`http://localhost:5005/views/payments.html`)
            } else {
                fs.readdir("Static/uploads", "utf8", (error, data) => { if (error) { Log_error(error) 
                            } else {
                            data.forEach( item => { 
                            if ( item.startsWith('NaN') ) { 
                                fs.unlink(`Staic/uploads/${item}`, (error) => { if (error) { Log_error(error) } } ) } } ) } } )
                response.redirect(`info?message=${Messages_Object.CONTAINER_FULL}`)            }
                
            
        //REDIRECT TP PAYMENTS PAGE
} catch (error) { next(error) } } )


//ANALYTICS ROUTER
app.get("/Analysis" , async (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads

        response.render("analysis" , {Current_ads, Message } ) 
} catch (error) { next(error) } } )

app.post("/Analysis", (request, response, next) => {  } )


//ACCOUNT ROUTER
app.post("/Account" , async (request, response, next) => {
    try {
        let password = request.body._Password
        let new_email = request.body.new_email
        let new_User_name = request.body.new_User_name
        let new_phonenumber = request.body.new_phonenumber
        let password_1 = request.body.new_password1
        let password_2 = request.body.new_password2
        let SessionCanceller = request.body.SC
        Message = Messages_Object[113]
        Token = Token_templates.Get_transporter_token()
    
        
        if (SessionCanceller) {
            JWT_Payload = Token_templates.Get_cookie_token()
            JWT_Payload.Email = new_email
            
            cookie = JWT.sign(JWT_Payload , JWT_Secret )
            response.cookie("JWT" , cookie , {maxAge: Max_Age_4_cookies} )
            Client.db("Link_Yard").collection("Users").updateOne( { User_name:User_name } , { $set:{ SessionTime: Dynamic_Variables.Get_Iso_Date() } } )
            response.redirect("Profile") }
    
    
        if (new_email) {
            let A = new_email.toLowerCase()
            let B = await Client.db("Link_Yard").collection("Users").findOne( { Email: A } )
                   if ( B ) { response.render("Info" , { Message:"Email already exists" ,Current_ads
    } ) } else {
                        if ( bcryptjs.compareSync(password , Password) ) { 
                          Token.Subject = "Email Update"
                          Token.Identifier = request.Third_party_information.Email
                          Token.Body = new_email
    

                    
                     //await Client.db("Link_Yard").collection("Tokens").insertOne(Email_Token)
                     fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
                     response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
                    } else { response.redirect(`Info?message=${Message}`) } } } 
       
          
        if (password_1 || password_2) { if (password_1 == password_2 ) {
           if ( bcryptjs.compareSync(password , Password) ) { 
                  await Client.db("Link_Yard").collection("Users").updateOne( {UserName: User_object.User_name } , {$set: {Password: bcryptjs.hashSync(password_1 , 10) } } ) 

                  response.redirect("Account") } else { response.redirect(`Info?message=${Message}`) } } else {
        Message = Messages_Object[124]
        response.redirect(`Info?message=${Message}`) } } 
       
       
       
        if (new_User_name) { 
            let B = await Client.db("Link_Yard").collection("Users").findOne( { User_name: new_User_name } )
                 if (B) { 
                    Message = Messages_Object.User_name_ALREADY_EXISTS
                    response.redirect(`Info?message=${Message}`)
                 } else {
                     if ( bcryptjs.compareSync(password , Password) ) { 
                        UpdateUser_name(new_User_name , User_name) 
                        response.redirect("Account") } else { response.redirect(`Info?message=${Message}`) } } }
       
       
       
        if ( new_phonenumber) {
            let B = await Client.db("Link_Yard").collection("Users").findOne( { PhoneNumber: new_phonenumber } )
              if (B) { 
                Message = Messages_Object.PHONE_NUMBER_ALREADY_EXISTS
                response.redirect(`Info?message=${Message}`) } else {
                 if ( bcryptjs.compareSync(password , Password) ) {   

                    Token.Subject = "PhoneNumber Verification"
                    Token.Identifier = request.Third_party_information.User_object.Email
                    Token.Body = new_phonenumber
    
    
                     //await Client.db("Link_Yard").collection("Tokens").insertOne(PN_Token)
                     fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(PN_Token))
                     response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
                    } else { response.redirect(`Info?message=${Message}`) } } }
} catch (error) { next(error) } } )


app.get("/Account" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        const User_object = request.Third_party_information.User_object

        console.log(User_object, `from ${request.url}`);
        

        response.render("Account" , { Current_ads, Message, User_object} )
} catch (error) { next(error) } } )

//SETTINGS ROUTER
app.get("/Settings" , (request, response, next) => {
    try {
        Current_ads = request.Third_party_information.Current_ads
        response.render("Settings" , {Current_ads, Message } )
} catch (error) { next(error) } } )

app.post("/Settings", (request, response, next) => {  } )


//DELETE ACCOUNT ROUTER
app.get("/DeleteAccount" , (request, response, next) => {
    try { 
        Current_ads = request.Third_party_information.Current_ads
        response.render("DeleteAccount" , {Current_ads, Message } )
} catch (error) { next(error) } } )

app.post( "/DeleteAccount" , async (request, response, next) => {
    try {
        let password = request.body.DAP
        Token = Token_templates.Get_transporter_token()
        Token.Identifier = Email
        Token.Subject = "Account Deletion"
        
         if ( bcryptjs.compareSync(password , Password) ) {
             Send_Email(Token)
              //await Client.db("Link_Yard").collection("Tokens").insertOne(Token)
              fs.writeFileSync(`Text_Files/Tokens/${Token.ID}Epo${Token.Expiry_date}.txt`, JSON.stringify(Token))
              response.redirect(`Confirmation2?Subject=${Token.Subject}&Identifier=${Token.Identifier}&ID=${Token.ID}Epo${Token.Expiry_date}`)
 
               } else {
                     Message = Messages_Object.WRONG_PASSWORD
                     response.redirect(`Info?message=${Message}`) }
} catch (error) { next(error) } } )

//PROFILE ROUTER ( Profile.html )
app.get("/Profile" , (request, response, next) => {        
    try {        
        Current_ads = request.Third_party_information.Current_ads
        const User_object = request.Third_party_information.User_object
        
        let Preview = "linkyard.com/me."+User_object.User_name
        response.render("Profile" , {Current_ads, Message, User_object } )
} catch (error) { next(error) } } )

app.post("/Profile" , async (request, response, next) => {
    try {
        const User_object = request.Third_party_information.User_object
        const User_link = Token_templates.Get_user_link()
        let B = request.body.Title
        let User_name = request.body.LUN 
        const Title = request.body.LinkOptions
        const HREF = Title +".com/" + User_name
        const CustomLinkName = request.body.CLN
        User_link.Href = HREF
        User_link.Title = Title
                
        
    
       if ( Title == "CustomLink" ) {
           await Client.db("Link_Yard").collection("Users").updateOne( { UserName: User_object.User_name } , { $push: { Links: { Title:CustomLinkName , Icon:"1" , Href: HREF , TCs: 0 ,DCs: 0 , Android:0 , iPhone:0 , Desktop:0 , Others:0} } } ) 
           response.redirect("Profile") 
        } else {
        if (B) { 
           if (B == "linkyard.com/me."+User_name) {
            Message = Messages_Object.UNDELETABLE_LINK
            response.redirect(`Info?message=${Message}`)
        } else {
            await Client.db("Link_Yard").collection("Users").updateOne( { UserName:User_object.User_name } , {$pull: {Links: { Href: B } } } ) 
                response.redirect("Profile") } } else {
          if (CustomLinkName) {
            await Client.db("Link_Yard").collection("Users").updateOne( { UserName: User_object.User_name } , { $push: { Links: { Title:CustomLinkName , Href: HREF , TCs: 0 ,DCs: 0 , Android:0 , iPhone:0 , Desktop:0 , Others:0} } } ) 
            response.redirect("Profile") } else {
                    
            await Client.db("Link_Yard").collection("Users").updateOne( {Email: User_object.Email}, { $push: {Links:User_link} } )
            response.redirect("Profile") } } }
} catch (error) { next(error) } } )

app.get("/me",  async (request, response, next ) => {
    try {
        let Inputted_user_name = Object.keys(request.query)[0]
        let Link_Yard_link = `linkyard.com/me/${Inputted_user_name}`

         
        Current_ads = request.Third_party_information.Current_ads
        let Android = request.header("user-agent").search(/Android/i) != -1
        let iPhone = request.header("user-agent").search(/iPhone/i) != -1
        let windows = request.header("user-agent").search(/windows/i) != -1
        let Mac =  request.header("user-agent").search(/Mac/i) != -1
        let Device 
    
        if (Android) { Device = "Android" } else { 
            if (iPhone ) { Device = "iPhone" } else { 
                if (windows || Mac ) { Device = "Desktop" } else { Device = "Other" } } }
    
        User_object = await Client.db("Link_Yard").collection("Users").findOne( {User_name:Inputted_user_name} )        

        if (User_object) {

            let userlinks = User_object.Links
            let CustomLinks = []
            let NormalLinks = []
            userlinks.forEach(link => { if (link.Icon) { CustomLinks.push(link) } else { NormalLinks.push(link) } } )
            IncreaseNOCs(Link_Yard_link , Inputted_user_name , Device)
            
            response.render("Preview" , { Current_ads, Message, NormalLinks, User_object, CustomLinks } ) 
            } else {
            return response.redirect(`Info?message=${Inputted_user_name}......${Messages_Object.LINK_YARD_USER_NOT_FOUND}`) }


} catch (error) { next(error) } } )

app.post("/me",  async (request, response, next ) => {
    try {
        let Android = request.header("user-agent").search(/Android/i) != -1
        let iPhone = request.header("user-agent").search(/iPhone/i) != -1
        let windows = request.header("user-agent").search(/windows/i) != -1
        let Mac =  request.header("user-agent").search(/Mac/i) != -1
        let Device 
    
        if (Android) { Device = "Android" } else { 
            if (iPhone ) { Device = "iPhone" } else { 
                if (windows || Mac ) { Device = "Desktop" } else { Device = "Other" } } }
    
        let A = request.body.Title
        let User_name = request.url.slice(4)
        
        IncreaseNOCs(A.slice(8) , User_name , Device)
        
        response.redirect(A)
} catch (error) { next(error) } } )



app.use( (error, request, response, next) => {
    Log_error(error)
    console.log(error, "from error middleware");
    

    if (error instanceof multer.MulterError) {
        if (error.code == 'LIMIT_FILE_SIZE' ) {
            response.redirect(`Info?message=${Messages_Object.LARGE_ADVERT_SIZE}`) }
    } else {
         response.redirect(`Info?message=${Messages_Object.SOMETHING_WENT_WRONG}`) }

         
} )

 /* Upper_Billboard_$$_1_Day_$$_Pending_Adverts
 Middle_Billboard_$$_1_Day_$$_Pending_Adverts
 Lower_Billboard_$$_1_Day_$$_Pending_Adverts
 Email_Billboard_$$_1_Day_$$_Pending_Adverts

 Upper_Billboard_$$_7_Days_$$_Pending_Adverts
 Middle_Billboard_$$_7_Days_$$_Pending_Adverts
 Lower_Billboard_$$_7_Days_$$_Pending_Adverts
 Email_Billboard_$$_7_Days_$$_Pending_Adverts

 Upper_Billboard_$$_1_Day_$$_Active_Adverts 
 Middle_Billboard_$$_1_Day_$$_Active_Adverts 
 Lower_Billboard_$$_1_Day_$$_Active_Adverts 
 Email_Billboard_$$_1_Day_$$_Active_Adverts 

 Upper_Billboard_$$_7_Days_$$_Active_Adverts
 Middle_Billboard_$$_7_Days_$$_Active_Adverts 
 Lower_Billboard_$$_7_Days_$$_Active_Adverts 
 Email_Billboard_$$_7_Days_$$_Active_Adverts 

 */




