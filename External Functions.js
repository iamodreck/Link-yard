var { 
    scheduleJob, 

    Daily_Adverts_in_active_container_for_Upper_Billboard,
    Daily_Adverts_in_active_container_for_Middle_Billboard,
    Daily_Adverts_in_active_container_for_Lower_Billboard,
    Daily_Adverts_in_active_container_for_Email_Billboard,
    
    Weekly_Adverts_in_active_container_for_Upper_Billboard,
    Weekly_Adverts_in_active_container_for_Middle_Billboard,
    Weekly_Adverts_in_active_container_for_Lower_Billboard,
    Weekly_Adverts_in_active_container_for_Email_Billboard,

    Adverts_Containment_Period_in_weeks,
    Adverts_Containment_Period_in_Days,

    String_4_Upper_Billboard,
    String_4_Middle_Billboard,
    String_4_Lower_Billboard,
    String_4_Email_Billboard,
    string_4_1_Day,
    string_4_7_Days,
    Client,
     
    string_4_Active_Adverts,
    Path_2_emails_text_file,
    Objectfied_Data, 
    _12$00,
    _12$10,
    _12$20,
    _12$30,
    _12$40,
    Hour,
    Path_2_Adverts_container,
    Adverts_Counter_Converter_for_Middle_Billboard,
    Adverts_Counter_Converter_for_Upper_Billboard,
    Adverts_Counter_Converter_for_Lower_Billboard,
    Base_Ad_for_upper_billboard,
    Base_Ad_for_middle_billboard,
    Base_Ad_for_lower_billboard,
    Base_Ad_for_Email_Billboard,
    Dynamic_Variables,
    fs,
    Regex,
    _12$50,
    JSDOM,
    Path_2_text_files_4_1_Email_Bodies,
    Token_templates,
    Number_of_adverts_in_active_container_for_Upper_Billboard,
    Number_of_adverts_in_active_container_for_Middle_Billboard,
    Number_of_adverts_in_active_container_for_Lower_Billboard,
    Number_of_adverts_in_active_container_for_Email_Billboard,
    JWT, data, Adverts,
    JWT_Secret,
    Third_party_information,
    Token,
    Adverts_Container,
    Advert_object,
    Linkyard_stats_object
 } = require('./External Variables')


 function Log_error (error) {
    Token = Token_templates.Get_transporter_token()
    Token.Body = Token_templates.Get_error_token(error)
    Token.Identifier = "kigoziodreck@gmail.com"
    Token.Subject = `Error message on ${Dynamic_Variables.Get_Date_String()}`

    console.log(Token, "from log error function");

    Send_Email(Token)
}


function Send_Email ( Info_Object ) {

    try {
            let Current_Date = Dynamic_Variables.Get_Date_Without_Time() 
            let mailOptions = Token_templates.Get_eMail_token()
            let Email_Subject = Info_Object.Subject
            let Modifed_Email_Body
            let Email_body
            let dom
            
            
            
             if (Email_Subject == "Server operations") {
                mailOptions.to = Info_Object.to
                mailOptions.Subject = Email_Subject
                mailOptions.text = Info_Object.text
                
                Modifed_Email_Body = Info_Object.text
                Log_output(Modifed_Email_Body);
                //transporter.sendMail(mailOptions, function(error, info){ if (error) { Log_error(error) } } )        
                return    
             }
    
             if (Email_Subject == "Link yard stats") {
                File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
                Email_body = fs.readFileSync(File_Path, "utf8") 
                dom = new JSDOM (Email_body)

                dom.window.document.getElementById("date").textContent = Dynamic_Variables.Get_Date_String()
                dom.window.document.getElementById("account").textContent = Info_Object.Body["/account"]
                dom.window.document.getElementById("adminconsole").textContent = Info_Object.Body["/adminconsole"]
                dom.window.document.getElementById("analysis").textContent = Info_Object.Body["/analysis"]
                dom.window.document.getElementById("confirmation2").textContent = Info_Object.Body["/confirmation2"]
                dom.window.document.getElementById("confirmation1").textContent = Info_Object.Body["/confirmation1"]
                dom.window.document.getElementById("deleteaccount").textContent = Info_Object.Body["/deleteaccount"]
                dom.window.document.getElementById("info").textContent = Info_Object.Body["/info"]
                dom.window.document.getElementById("inquries").textContent = Info_Object.Body["/inquries"]
                dom.window.document.getElementById("linkyard").textContent = Info_Object.Body["/linkyard"]
                dom.window.document.getElementById("me").textContent = Info_Object.Body["/me"]
                dom.window.document.getElementById("profile").textContent = Info_Object.Body["/profile"]
                dom.window.document.getElementById("promotions").textContent = Info_Object.Body["/promotions"]
                dom.window.document.getElementById("settings").textContent = Info_Object.Body["/settings"]
                dom.window.document.getElementById("signin").textContent = Info_Object.Body["/signin"]
                dom.window.document.getElementById("signup").textContent = Info_Object.Body["/signup"]
                dom.window.document.getElementById("index").textContent = Info_Object.Body["/"]

                Modifed_Email_Body = dom.serialize()
             }
        
        
             if ( Email_Subject == "Account Verification") { 
        
              File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
              Email_body = fs.readFileSync(File_Path, "utf8") 
              dom = new JSDOM (Email_body)
          
              dom.window.document.getElementById("Verification_Code").textContent = Info_Object.Subject_Code
              dom.window.document.getElementById("Action_Date").textContent = Info_Object.Body.Date_Initiated
              dom.window.document.getElementById("User_name").textContent = Info_Object.Body.User_name 
          
              Modifed_Email_Body = dom.serialize()
            }
          
              if ( Email_Subject == "Account Deletion") { 
                File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
                Email_body = fs.readFileSync(File_Path, "utf8") 
                dom = new JSDOM (Email_body)
          
                dom.window.document.getElementById("Verification_Code").textContent = Info_Object.Subject_Code
                dom.window.document.getElementById("Action_Date").textContent = Info_Object.Date_Initiated
          
                Modifed_Email_Body = dom.serialize()
              }
          
              if ( Email_Subject.startsWith("Error message") ) {         
                Email_body = fs.readFileSync("Text_Files/Email Bodies/Error messages.html", "utf8") 
                dom = new JSDOM (Email_body)

                dom.window.document.getElementById("cause").textContent = Info_Object.Body.cause
                dom.window.document.getElementById("field").textContent = Info_Object.Body.field
                dom.window.document.getElementById("code").textContent = Info_Object.Body.code
                dom.window.document.getElementById("message").textContent = Info_Object.Body.message
                dom.window.document.getElementById("stack").textContent = Info_Object.Body.stack
                dom.window.document.getElementById("name").textContent = Info_Object.Body.name
                dom.window.document.getElementById("path").textContent = Info_Object.Body.path

                Modifed_Email_Body = dom.serialize()                  
            }
        
          
              if ( Email_Subject == "Advert Notice") { 
                File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
                Email_body = fs.readFileSync(File_Path, "utf8") 
                dom = new JSDOM (Email_body)
          
                dom.window.document.getElementById("Owner").textContent = Info_Object.Owner
                dom.window.document.getElementById("Billboard").textContent = Info_Object.Billboard.replace("_", " ")
                dom.window.document.getElementById("Link_2_more_info").textContent = Info_Object.Link_2_more_info
                dom.window.document.getElementById("Time_Period").textContent = Info_Object.Time_Period.replace("_", " ")
                dom.window.document.getElementById("Date_Initiated").textContent = Info_Object.Date_Initiated
                dom.window.document.getElementById("Start_Date").textContent = Info_Object.Start_Date
                dom.window.document.getElementById("End_Date").textContent = Info_Object.End_Date
          
                Modifed_Email_Body = dom.serialize() }
          
              if ( Email_Subject == "Advert Stats") { 
                File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
                Email_body = fs.readFileSync(File_Path, "utf8") 
                dom = new JSDOM (Email_body)
          
          
                dom.window.document.getElementById("Action_Date").textContent = Info_Object.Body.Date_Initiated
                dom.window.document.getElementById("Start_Date").textContent = Info_Object.Body.Start_Date
                dom.window.document.getElementById("End_Date").textContent = Info_Object.Body.End_Date
                dom.window.document.getElementById("Current_date").textContent = Current_Date
                dom.window.document.getElementById("Number_of_views_on_ad").textContent =  Info_Object.Body.Number_of_views_on_ad
                dom.window.document.getElementById("Number_of_views_on_ad_4_today").textContent = Info_Object.Body.Number_of_views_on_ad_4_today
                dom.window.document.getElementById("Number_of_views_on_ad_4_today_per_hour").textContent = Info_Object.Body.Number_of_views_on_ad_4_today / Info_Object.Body.Hour_counter_on_update
                dom.window.document.getElementById("Number_of_views_on_ad_4_today_per_minute").textContent = Info_Object.Body.Number_of_views_on_ad_4_today / Info_Object.Body.Minute_counter_on_update
                dom.window.document.getElementById("Number_of_clicks_on_ad_link").textContent = Info_Object.Body.Number_of_clicks_on_ad_link
                dom.window.document.getElementById("Number_of_clicks_on_ad_link_4_today").textContent = Info_Object.Body.Number_of_clicks_on_ad_link_4_today
                dom.window.document.getElementById("Number_of_clicks_on_ad_link_4_today_per_hour").textContent = Info_Object.Body.Number_of_clicks_on_ad_link_4_today / Info_Object.Body.Hour_counter_on_update
                dom.window.document.getElementById("Number_of_clicks_on_ad_link_4_today_per_minute").textContent = Info_Object.Body.Number_of_clicks_on_ad_link_4_today / Info_Object.Body.Minute_counter_on_update 
          
                Modifed_Email_Body = dom.serialize()       
              }
          

              if ( Email_Subject == "Account Stats") {
                File_Path = Path_2_text_files_4_1_Email_Bodies.replace("#File_Name", Email_Subject)
                Email_body = fs.readFileSync(File_Path, "utf8") 
                dom = new JSDOM (Email_body)      
          
                Info_Object.Body.forEach( link => {
          
                  //TEXT NODES
                  const Link_Title = dom.window.document.createTextNode(link.Title)
                  const Link_Total_Visits = dom.window.document.createTextNode(link.TCs)
                  const Link_ToDay_Visits = dom.window.document.createTextNode(link.DCs)
                  const Link_Visits_Per_Hour = dom.window.document.createTextNode( Math.ceil( Math.floor( link.DCs ) / Dynamic_Variables.Get_Iso_Date().getHours() ) )
                  const Link_Visits_Per_Minute = dom.window.document.createTextNode(Math.ceil( Math.floor( link.DCs ) / Dynamic_Variables.Get_Iso_Date().getMinutes() ) ) 
          
          
                  //
                  const Visits_Table_Body = dom.window.document.getElementById('Visits_Table')
                  const Table_Row_4_Visits = dom.window.document.createElement('tr')
          
                  //TABLE ELEMENTS
                  const Table_Element_4_Link_Title = dom.window.document.createElement('td')
                  const Table_Element_4_Link_Total_Visits = dom.window.document.createElement('td')
                  const Table_Element_4_Link_ToDay_Visits = dom.window.document.createElement('td')
                  const Table_Element_4_Link_Visits_Per_Hour = dom.window.document.createElement('td')
                  const Table_Element_4_Link_Visits_Per_Minute = dom.window.document.createElement('td')
          
                  //TEXT NODES TO TABLE ELEMENTS
                  Table_Element_4_Link_Title.appendChild(Link_Title)
                  Table_Element_4_Link_Total_Visits.appendChild(Link_Total_Visits)
                  Table_Element_4_Link_ToDay_Visits.appendChild(Link_ToDay_Visits)
                  Table_Element_4_Link_Visits_Per_Hour.appendChild(Link_Visits_Per_Hour)
                  Table_Element_4_Link_Visits_Per_Minute.appendChild(Link_Visits_Per_Minute)
          
                  
          
                  //APPENDING TABLE ELEMENTS TO TABLE ROW
                  Table_Row_4_Visits.appendChild(Table_Element_4_Link_Title)
                  Table_Row_4_Visits.appendChild(Table_Element_4_Link_Total_Visits)
                  Table_Row_4_Visits.appendChild(Table_Element_4_Link_ToDay_Visits)
                  Table_Row_4_Visits.appendChild(Table_Element_4_Link_Visits_Per_Hour)
                  Table_Row_4_Visits.appendChild(Table_Element_4_Link_Visits_Per_Minute)
          
                  //APPENDING TABLE ROW TO TABLE BODY
                  Visits_Table_Body.appendChild(Table_Row_4_Visits) } )
          
                  Info_Object.Body.forEach( link => {
          
                    //TEXT NODES
                    const Link_Title = dom.window.document.createTextNode(link.Title)
                    const Android_visits = dom.window.document.createTextNode(link.Android)
                    const iPhone_visits = dom.window.document.createTextNode(link.iPhone)
                    const Desktop_visits = dom.window.document.createTextNode( link.Desktop )
                    const Others_visits = dom.window.document.createTextNode( link.Others ) 
            
            
                    //
                    const Visits_Table_Body = dom.window.document.getElementById("Devices_Table")
                    const Table_Row_4_Visits = dom.window.document.createElement('tr')
            
                    //TABLE ELEMENTS
                    const Table_Element_4_Link_Title = dom.window.document.createElement('td')
                    const Table_Element_4_Link_Total_Visits = dom.window.document.createElement('td')
                    const Table_Element_4_Link_ToDay_Visits = dom.window.document.createElement('td')
                    const Table_Element_4_Link_Visits_Per_Hour = dom.window.document.createElement('td')
                    const Table_Element_4_Link_Visits_Per_Minute = dom.window.document.createElement('td')
            
                    //TEXT NODES TO TABLE ELEMENTS
                    Table_Element_4_Link_Title.appendChild(Link_Title)
                    Table_Element_4_Link_Total_Visits.appendChild(Android_visits)
                    Table_Element_4_Link_ToDay_Visits.appendChild(iPhone_visits)
                    Table_Element_4_Link_Visits_Per_Hour.appendChild(Desktop_visits)
                    Table_Element_4_Link_Visits_Per_Minute.appendChild(Others_visits)
            
            
                    //APPENDING TABLE ELEMENTS TO TABLE ROW
                    Table_Row_4_Visits.appendChild(Table_Element_4_Link_Title)
                    Table_Row_4_Visits.appendChild(Table_Element_4_Link_Total_Visits)
                    Table_Row_4_Visits.appendChild(Table_Element_4_Link_ToDay_Visits)
                    Table_Row_4_Visits.appendChild(Table_Element_4_Link_Visits_Per_Hour)
                    Table_Row_4_Visits.appendChild(Table_Element_4_Link_Visits_Per_Minute)
            
                    //APPENDING TABLE ROW TO TABLE BODY
                    Visits_Table_Body.appendChild(Table_Row_4_Visits) } )
          
                   dom.window.document.getElementById("Current_date").textContent = Dynamic_Variables.Get_Date_String()
                
                   Modifed_Email_Body = dom.serialize() }
        
            
            mailOptions.to = Info_Object.Identifier
            mailOptions.Subject = Email_Subject
            mailOptions.html = Modifed_Email_Body
              
            Log_output(Modifed_Email_Body);
            //transporter.sendMail(mailOptions, function(error, info){ if (error) { Log_error(error) } } ) 
    
} catch (error) { Log_error(error) } }


async function Create_Indexes () {
        await Client.db('Link_Yard').collection("Users").createIndex( {Email:1} )
        //await Client.db('Link_Yard').collection("Tokens").createIndex( {Subject_Code:1} )
        await Client.db('Link_Yard').collection("Pending_Adverts").createIndex( {Name:1} )
        await Client.db('Link_Yard').collection("Active_Adverts").createIndex( {Name:1} )
        //await Client.db('Link_Yard').collection("Tokens").createIndex( {Created_At:1}, {expireAfterSeconds:43200})
    
}


async function IncreaseNOCs (href  , UserName , Device) {
  try {
     switch (Device) {
      case "Android":
          await Client.db("Link_Yard").collection("Users").updateOne( {UserName: UserName } ,
              {$inc: {"Links.$[item].TCs": 1 , "Links.$[item].DCs": 1 , "Links.$[item].Android": 1 } },
              { arrayFilters: [ { "item.Href": href } ] } 
              )
      break;
  
      case "iPhone":
          await Client.db("Link_Yard").collection("Users").updateOne( {UserName: UserName } ,
              {$inc: {"Links.$[item].TCs": 1 , "Links.$[item].DCs": 1 , "Links.$[item].iPhone": 1 } },
              { arrayFilters: [ { "item.Href": href } ] } 
              )
      break;
  
      case "Desktop":
          await Client.db("Link_Yard").collection("Users").updateOne( {UserName: UserName } ,
              {$inc: {"Links.$[item].TCs": 1 , "Links.$[item].DCs": 1 , "Links.$[item].Desktop": 1  } },
              { arrayFilters: [ { "item.Href": href } ] } 
              )
      break
  
      case "Others":
          await Client.db("Link_Yard").collection("Users").updateOne( {UserName: UserName } ,
              {$inc: {"Links.$[item].TCs": 1 , "Links.$[item].DCs": 1 , "Links.$[item].Others": 1 } },
              { arrayFilters: [ { "item.Href": href } ] } 
              )
      break;
     }


} catch (error) { Log_error(error) } }
  


async function ResetDCs () {
try {
          await Client.db("Link_Yard").collection("Users").updateMany( { } , {$set: {"Links.$[item].DCs": 0 } 
        } , { arrayFilters:[{ "item.DCs": {$exists: true} } ] } ) 
    
        let eMail_info = Token_templates.Get_eMail_token()
        eMail_info.text = "Resetted Daily  click counts at " + Dynamic_Variables.Get_Date_String()
        Send_Email(eMail_info)

} catch (error) { Log_error(error) } }



async function Add_advert(advert) {

try {
        if (advert.Time_Period == string_4_1_Day ) {
            if (advert.Billboard == String_4_Upper_Billboard) {
                await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_1_Day }, {$push: {Upper_Billboard:advert} } )
            }
            if (advert.Billboard == String_4_Middle_Billboard) {
                await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_1_Day }, {$push: {Middle_Billboard:advert} } )
            }
            if (advert.Billboard == String_4_Lower_Billboard) {
                await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_1_Day }, {$push: {Lower_Billboard:advert} } )
            }
            if (advert.Billboard == String_4_Email_Billboard) {
                await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_1_Day }, {$push: {Email_Billboard:advert} } )
            } }
    
    
            if (advert.Time_Period == string_4_7_Days ) {
                if (advert.Billboard == String_4_Upper_Billboard) {
                    await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_7_Days }, {$push: {Upper_Billboard:Complete_advert} } )
                }
                if (advert.Billboard == String_4_Middle_Billboard) {
                    await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_7_Days }, {$push: {Middle_Billboard:Complete_advert} } )
                }
                if (advert.Billboard == String_4_Lower_Billboard) {
                    await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_7_Days }, {$push: {Lower_Billboard:Complete_advert} } )
                }
                if (advert.Billboard == String_4_Email_Billboard) {
                    await Client.db("Link_Yard").collection("Pending_Adverts").updateOne( { Name:string_4_7_Days }, {$push: {Email_Billboard:Complete_advert} } )
                } }


} catch (error) { Log_error(error) } }



async function Add_7_Days_advert ( Advert_token ) {
try {
        let Days_2_play_day
    
        const Pending_Adverts_for_7_Days = await Client.db("Link_Yard").collection("Pending_Adverts").find( {Name:"7_Days"} ).toArray()
        
        const Number_of_Upper_Billboard_Pending_Adverts_for_7_Days = Pending_Adverts_for_7_Days[0].Upper_Billboard.length
        const Number_of_Middle_Billboard_Pending_Adverts_for_7_Days = Pending_Adverts_for_7_Days[0].Middle_Billboard.length
        const Number_of_Lower_Billboard_Pending_Adverts_for_7_Days = Pending_Adverts_for_7_Days[0].Lower_Billboard.length
        const Number_of_Email_Billboard_Pending_Adverts_for_7_Days = Pending_Adverts_for_7_Days[0].Email_Billboard.length
    
        const Maximum_number_of_Upper_Billboard_Weekly_adverts_in_possession = Weekly_Adverts_in_active_container_for_Upper_Billboard * Adverts_Containment_Period_in_weeks
        const Maximum_number_of_Middle_Billboard_Weekly_adverts_in_possession = Weekly_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_weeks
        const Maximum_number_of_Lower_Billboard_Weekly_adverts_in_possession = Weekly_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_weeks
        const Maximum_number_of_Email_Billboard_Weekly_adverts_in_possession = Weekly_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_weeks
        
        
        const Maximum_number_of_Weekly_Adverts_in_pending_container_for_Upper_Billboard = Maximum_number_of_Upper_Billboard_Weekly_adverts_in_possession - Weekly_Adverts_in_active_container_for_Upper_Billboard
        const Maximum_number_of_Weekly_Adverts_in_pending_container_for_Middle_Billboard = Maximum_number_of_Middle_Billboard_Weekly_adverts_in_possession - Weekly_Adverts_in_active_container_for_Middle_Billboard
        const Maximum_number_of_Weekly_Adverts_in_pending_container_for_Lower_Billboard = Maximum_number_of_Lower_Billboard_Weekly_adverts_in_possession - Weekly_Adverts_in_active_container_for_Lower_Billboard
        const Maximum_number_of_Weekly_Adverts_in_pending_container_for_Email_Billboard = Maximum_number_of_Email_Billboard_Weekly_adverts_in_possession - Weekly_Adverts_in_active_container_for_Email_Billboard
    
        if ( Advert_token.Body.Billboard == String_4_Upper_Billboard) {
            Days_2_play_day = ( Number_of_Upper_Billboard_Pending_Adverts_for_7_Days / Number_of_adverts_in_active_container_for_Upper_Billboard ) + 1
    
           if ( Number_of_Upper_Billboard_Pending_Adverts_for_7_Days < Maximum_number_of_Weekly_Adverts_in_pending_container_for_Upper_Billboard ) {
                   return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
        }
    
    
    
        if ( Advert_token.Body.Billboard == String_4_Middle_Billboard) {
            Days_2_play_day = ( Number_of_Middle_Billboard_Pending_Adverts_for_7_Days / Number_of_adverts_in_active_container_for_Middle_Billboard ) + 1    
    
            if ( Number_of_Middle_Billboard_Pending_Adverts_for_7_Days < Maximum_number_of_Weekly_Adverts_in_pending_container_for_Middle_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }
    
        if ( Advert_token.Body.Billboard == String_4_Lower_Billboard) {
            Days_2_play_day = ( Number_of_Lower_Billboard_Pending_Adverts_for_7_Days / Number_of_adverts_in_active_container_for_Lower_Billboard ) + 1  
            
            if ( Number_of_Lower_Billboard_Pending_Adverts_for_7_Days < Maximum_number_of_Weekly_Adverts_in_pending_container_for_Lower_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }
    
        if ( Advert_token.Body.Billboard == String_4_Email_Billboard) {
            Days_2_play_day = ( Number_of_Email_Billboard_Pending_Adverts_for_7_Days / Number_of_adverts_in_active_container_for_Email_Billboard ) + 1
    
            if ( Number_of_Email_Billboard_Pending_Adverts_for_7_Days < Maximum_number_of_Weekly_Adverts_in_pending_container_for_Email_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }


} catch (error) { Log_error(error) } }



async function Add_1_Day_advert ( Advert_token ) {
try {
        let Days_2_play_day
    
        const Pending_Adverts_for_1_Day = await Client.db("Link_Yard").collection("Pending_Adverts").find( {Name:"1_Day"} ).toArray()
    
        const Number_of_Upper_Billboard_Pending_Adverts_for_1_Day = Pending_Adverts_for_1_Day[0].Upper_Billboard.length
        const Number_of_Middle_Billboard_Pending_Adverts_for_1_Day = Pending_Adverts_for_1_Day[0].Middle_Billboard.length
        const Number_of_Lower_Billboard_Pending_Adverts_for_1_Day = Pending_Adverts_for_1_Day[0].Lower_Billboard.length
        const Number_of_Email_Billboard_Pending_Adverts_for_1_Day = Pending_Adverts_for_1_Day[0].Email_Billboard.length
    
        const Maximum_number_of_Upper_Billboard_Daily_adverts_in_possession = Daily_Adverts_in_active_container_for_Upper_Billboard  * Adverts_Containment_Period_in_Days
        const Maximum_number_of_Middle_Billboard_Daily_adverts_in_possession = Daily_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_Days
        const Maximum_number_of_Lower_Billboard_Daily_adverts_in_possession = Daily_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_Days
        const Maximum_number_of_Email_Billboard_Daily_adverts_in_possession = Daily_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_Days
    
        const Maximum_number_of_Daily_Adverts_in_pending_container_for_Upper_Billboard = Maximum_number_of_Upper_Billboard_Daily_adverts_in_possession - Daily_Adverts_in_active_container_for_Upper_Billboard
        const Maximum_number_of_Daily_Adverts_in_pending_container_for_Middle_Billboard = Maximum_number_of_Middle_Billboard_Daily_adverts_in_possession - Daily_Adverts_in_active_container_for_Middle_Billboard
        const Maximum_number_of_Daily_Adverts_in_pending_container_for_Lower_Billboard = Maximum_number_of_Lower_Billboard_Daily_adverts_in_possession - Daily_Adverts_in_active_container_for_Lower_Billboard
        const Maximum_number_of_Daily_Adverts_in_pending_container_for_Email_Billboard = Maximum_number_of_Email_Billboard_Daily_adverts_in_possession - Daily_Adverts_in_active_container_for_Email_Billboard
    
    
        if ( Advert_token.Body.Billboard == String_4_Upper_Billboard) {
            Days_2_play_day = ( Number_of_Upper_Billboard_Pending_Adverts_for_1_Day /   Number_of_adverts_in_active_container_for_Upper_Billboard) + 1
    
            if ( Number_of_Upper_Billboard_Pending_Adverts_for_1_Day < Maximum_number_of_Daily_Adverts_in_pending_container_for_Upper_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }
    
        if ( Advert_token.Body.Billboard == String_4_Middle_Billboard) {
            Days_2_play_day = ( Number_of_Middle_Billboard_Pending_Adverts_for_1_Day / Number_of_adverts_in_active_container_for_Middle_Billboard ) + 1
    
            if ( Number_of_Middle_Billboard_Pending_Adverts_for_1_Day < Maximum_number_of_Daily_Adverts_in_pending_container_for_Middle_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }
    
        if ( Advert_token.Body.Billboard == String_4_Lower_Billboard) {
            Days_2_play_day = ( Number_of_Lower_Billboard_Pending_Adverts_for_1_Day / Number_of_adverts_in_active_container_for_Lower_Billboard ) + 1
    
            if ( Number_of_Lower_Billboard_Pending_Adverts_for_1_Day < Maximum_number_of_Daily_Adverts_in_pending_container_for_Lower_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }
    
        if ( Advert_token.Body.Billboard == String_4_Email_Billboard) {
            Days_2_play_day = ( Number_of_Email_Billboard_Pending_Adverts_for_1_Day /  Number_of_adverts_in_active_container_for_Email_Billboard) + 1
    
            if ( Number_of_Email_Billboard_Pending_Adverts_for_1_Day < Maximum_number_of_Daily_Adverts_in_pending_container_for_Email_Billboard ) {
                return {Boolean: true, Days_2_play_day: Days_2_play_day} } else { return false }
    
        }


} catch (error) { Log_error(error) } }



async function Create_Collection ( Collection_Name ) {
try {
        await Client.db("Link_Yard").createCollection(Collection_Name)
        let eMail_info = Token_templates.Get_eMail_token()
        eMail_info.text = `Collection created with name ${Collection_Name}`
        Send_Email(eMail_info)


} catch (error) { Log_error(error) } }



async function Create_Document ( Collection_Name, Document_to_be_created) {
try {
        await Client.db("Link_Yard").collection(Collection_Name).insertOne(Document_to_be_created)
        console.log(`A document with name: ${Document_to_be_created.Name} has been created in the collection of ${Collection_Name} on `+ Dynamic_Variables.Get_Date_String())


} catch (error) { Log_error(error) } }





async function Select_Daily_Active_Adverts () {
try {
        Delete_used_media_from_Server()
    

        Adverts_Container = Token_templates.Get_adverts_container()
        Adverts_Container.Name = string_4_1_Day
        const Pending_Adverts = await Client.db("Link_Yard").collection("Pending_Adverts").find( {Name:string_4_1_Day} ).toArray()
    
        Adverts_Container.Upper_Billboard = Pending_Adverts[0].Upper_Billboard.slice(0,3)
        Adverts_Container.Middle_Billboard = Pending_Adverts[0].Middle_Billboard.slice(0,3)
        Adverts_Container.Lower_Billboard = Pending_Adverts[0].Lower_Billboard.slice(0,5)
        Adverts_Container.Email_Billboard = Pending_Adverts[0].Email_Billboard.slice(0,1)
        Adverts_Container.Date_Initiated = Dynamic_Variables.Get_Date_String()
        
        await Client.db("Link_Yard").collection("Active_Adverts").replaceOne( {Name:string_4_1_Day}, Adverts_Container, {upsert:true} )
    
        await Client.db('Link_Yard').collection("Pending_Adverts").updateOne( { Name:string_4_1_Day } , {$pullAll:{
            Upper_Billboard:Adverts_Container.Upper_Billboard,
            Middle_Billboard:Adverts_Container.Middle_Billboard,
            Lower_Billboard:Adverts_Container.Lower_Billboard,
            Email_Billboard:Adverts_Container.Email_Billboard } } )
    
            let eMail_info = Token_templates.Get_eMail_token()
            eMail_info.text = "Selected daily adverts on "+ Dynamic_Variables.Get_Date_String()
            Send_Email(eMail_info)


} catch (error) { Log_error(error) } }



async function Select_Weekly_Active_Adverts () {
try {
        Adverts_Container.Name = string_4_7_Days
    
        const Pending_Adverts = await Client.db("Link_Yard").collection("Pending_Adverts").find({Name:string_4_7_Days}).toArray()
    
        Adverts_Container.Upper_Billboard = Pending_Adverts[0].Upper_Billboard.slice(0,2)
        Adverts_Container.Middle_Billboard = Pending_Adverts[0].Middle_Billboard.slice(0,3)
        Adverts_Container.Lower_Billboard = Pending_Adverts[0].Lower_Billboard.slice(0,5)
        Adverts_Container.Email_Billboard = Pending_Adverts[0].Email_Billboard.slice(0,1)
        Adverts_Container.Date_Initiated = Dynamic_Variables.Get_Date_String()
    
        await Client.db("Link_Yard").collection("Active_Adverts").replaceOne( {Name:string_4_7_Days}, Adverts_Container, {upsert:true} )
    
        await Client.db('Link_Yard').collection("Pending_Adverts").updateOne( { Name:string_4_7_Days } , {$pullAll:{
            Upper_Billboard:Adverts_Container.Upper_Billboard,
            Middle_Billboard:Adverts_Container.Middle_Billboard,
            Lower_Billboard:Adverts_Container.Lower_Billboard,
            Email_Billboard:Adverts_Container.Email_Billboard } } )
        
            let eMail_info = Token_templates.Get_eMail_token()
            eMail_info.text = "Selected weekly adverts on "+ Dynamic_Variables.Get_Date_String()
            Send_Email(eMail_info)


} catch (error) { Log_error(error) } }


 
async function Get_Active_Adverts_from_batabase_to_text_file ( ) {
try {
        let Document = await Client.db("Link_Yard").collection(string_4_Active_Adverts).find( ).toArray()    
        let Adverts_4_1_day = Document.find( object => object.Name == string_4_1_Day )
        let Adverts_4_7_days = Document.find( object => object.Name == string_4_7_Days )    
        
        let Upper_Billboard_ads = Adverts_4_1_day.Upper_Billboard.concat( Adverts_4_7_days.Upper_Billboard ) 
        let Middle_Billboard_ads = Adverts_4_1_day.Middle_Billboard.concat( Adverts_4_7_days.Middle_Billboard )
        let Lower_Billboard_ads = Adverts_4_1_day.Lower_Billboard.concat( Adverts_4_7_days.Lower_Billboard )
        let Email_Billboard_ads = Adverts_4_1_day.Email_Billboard.concat( Adverts_4_7_days.Email_Billboard )
    
        let Ads_Container = {
            Upper_Billboard: Upper_Billboard_ads,
            Middle_Billboard: Middle_Billboard_ads,
            Lower_Billboard: Lower_Billboard_ads,
            Email_Billboard: Email_Billboard_ads }
    
        fs.writeFile(Path_2_Adverts_container, JSON.stringify(Ads_Container), (error) => {if (error) { console.error(error) } } )
    
            let eMail_info = Token_templates.Get_eMail_token()
            eMail_info.text = `Extracted active adverts from database to text file on ${Dynamic_Variables.Get_Iso_Date()}`
            Send_Email(eMail_info)

} catch (error) { Log_error(error) } }

const  Increase_clicks_on_advert =   (request, response, next) =>  {

    if ( request.method == "POST" ) {
        if (request.body.Advert) {
            console.log("in Increase_clicks_on_advert func");
            
            data = fs.readFileSync(Path_2_Adverts_container, "utf-8")
            Objectfied_Data = JSON.parse(data)
        
            let Advert_from_server = JSON.parse(request.body.Advert)
            
            let Ads_from_selected_billboard = Objectfied_Data[Advert_from_server[0]]
            let Ad_2_update = Ads_from_selected_billboard.find( (object) => object.ID == Advert_from_server[1] )
        
            Ad_2_update.Number_of_clicks_on_ad_link_4_today ++ 
            Ad_2_update.Number_of_clicks_on_ad_link  ++
            
            fs.writeFileSync(Path_2_Adverts_container, JSON.stringify(Objectfied_Data) )    
            return response.redirect(`https://${Ad_2_update.Link_2_more_info}`)
        } else { next() } } else { next() }

}

function Increase_views_on_advert ( Adverts) {

try {
        data = fs.readFileSync(Path_2_Adverts_container, "utf-8")
        Objectfied_Data = JSON.parse(data)
    
        let Adverts_array = Object.keys(Adverts)   
        Adverts_array.forEach(billboard => {
                  let Advert_from_server = Adverts[billboard]    
                  let Ads_from_selected_billboard = Objectfied_Data[Advert_from_server.Billboard]
                  let Ad_2_update = Ads_from_selected_billboard.find( (object) => object.ID == Advert_from_server.ID )
       
                  Ad_2_update.Number_of_views_on_ad_4_today ++ 
                  Ad_2_update.Number_of_views_on_ad  ++ } )  

        
        fs.writeFileSync(Path_2_Adverts_container, JSON.stringify(Objectfied_Data) )

} catch (error) { Log_error(error) } }


async function Send_User_Stats( ) { 

try {
          let Users = await Client.db("Link_Yard").collection("Users").find( {}, { projection:{Email:1, _id:0, Links:1} } ).toArray()
        
          Users.forEach( User => {
                Token = Token_templates.Get_transporter_token()
                Token.Subject = "Account Stats"
                Token.Identifier = User.Email
                Token.Body = User.Links
                    
                Send_Email(Token) } )
    
         let eMail_info = Token_templates.Get_eMail_token()
         eMail_info.text = `Sent user stats on ${Dynamic_Variables.Get_Date_String()}`
         Send_Email(eMail_info)

} catch (error) { Log_error(error) } }



function Send_Advert_Stats ( ) {

try {
        fs.readFile(Path_2_Adverts_container, "utf8", (error, data ) => { if (error) { console.error(error); } else { 
            Objectfied_Data = JSON.parse(data)
    
            Objectfied_Data.Upper_Billboard.forEach(advert => Adverts.push( advert ) )
            Objectfied_Data.Middle_Billboard.forEach(advert => Adverts.push( advert ) )
            Objectfied_Data.Lower_Billboard.forEach(advert => Adverts.push( advert ) )
            Objectfied_Data.Email_Billboard.forEach(advert => Adverts.push( advert ) )
     
            Adverts.forEach( advert => {
                Token.Subject = "Advert Stats"
                Token.Identifier = advert.Owner
                Token.Body = advert
                    
                Send_Email(Token)  } ) } } )

} catch (error) { Log_error(error) } }



function Weekly_functions( ) {

try {
     if (Dynamic_Variables.Get_Iso_Date().getDay() == 0) {
        Select_Weekly_Active_Adverts() 
        Send_linkyard_stats()
        } else {
        Send_linkyard_stats()
        Send_Adverts_Back_2_DB() }
    
        let eMail_info = Token_templates.Get_eMail_token()
        eMail_info.text = `weekly funcs on ${Dynamic_Variables.Get_Date_String()}`
        Send_Email(eMail_info)

} catch (error) { Log_error(error) } }



function Send_Adverts_Back_2_DB ( ) {
try {
          Adverts_Container = Token_templates.Get_adverts_container()
          fs.readFile(Path_2_Adverts_container, "utf8", (error, data ) => { if (error) { console.error(error); } else {
          Objectfied_Data = JSON.parse(data)        
    
            Objectfied_Data.Upper_Billboard.forEach( advert => { if ( advert.Time_Period == string_4_7_Days ) {
    
                advert.Number_of_views_on_ad_4_today = 0
                advert.Number_of_clicks_on_ad_link_4_today = 0
                Adverts_Container.Upper_Billboard.push( advert ) } } )
    
            Objectfied_Data.Middle_Billboard.forEach( advert => { if ( advert.Time_Period == string_4_7_Days ) {
                advert.Number_of_views_on_ad_4_today = 0
                advert.Number_of_clicks_on_ad_link_4_today = 0
                Adverts_Container.Middle_Billboard.push( advert ) } } )
    
            Objectfied_Data.Lower_Billboard.forEach( advert => { if ( advert.Time_Period == string_4_7_Days ) {
                advert.Number_of_views_on_ad_4_today = 0
                advert.Number_of_clicks_on_ad_link_4_today = 0
                Adverts_Container.Lower_Billboard.push( advert ) } } )
    
            Objectfied_Data.Email_Billboard.forEach( advert => { if ( advert.Time_Period == string_4_7_Days ) {
                advert.Number_of_views_on_ad_4_today = 0
                advert.Number_of_clicks_on_ad_link_4_today = 0
                Adverts_Container.Email_Billboard.push( advert ) } } )
    
            Adverts_Container.Date_Returned = Dynamic_Variables.Get_Date_String()
            Adverts_Container.Name = string_4_7_Days
    
            Client.db("Link_Yard").collection("Active_Adverts").replaceOne( {Name:string_4_7_Days}, Adverts_Container, {upsert:true} ) } } )

} catch (error) { Log_error(error) } }


function Write_email_2_text_file (Email) {
try {
    fs.appendFile(Path_2_emails_text_file, `\n${Email}`, (error) => { if (error) { throw error }  } ) 
        
} catch (error) { Log_error(error) } }





function Adverts_picker( ) {  
try {
      let Adverts_Container = Token_templates.Get_adverts_container(string_4_1_Day)
      let Counter = Dynamic_Variables.Get_Iso_Date().getMinutes()
    
      data = fs.readFileSync(Path_2_Adverts_container, "utf-8")
    
      Objectfied_Data = JSON.parse(data)
    
      Adverts_Container.Upper_Billboard = Objectfied_Data.Upper_Billboard[Adverts_Counter_Converter_for_Upper_Billboard [Counter] ]
      Adverts_Container.Middle_Billboard = Objectfied_Data.Middle_Billboard[Adverts_Counter_Converter_for_Middle_Billboard [Counter] ]
      Adverts_Container.Lower_Billboard = Objectfied_Data.Lower_Billboard[Adverts_Counter_Converter_for_Lower_Billboard [Counter] ]
      Adverts_Container.Email_Billboard = Objectfied_Data.Email_Billboard
    
      if ( Adverts_Container.Upper_Billboard == undefined ) { Adverts_Container.Upper_Billboard = Base_Ad_for_upper_billboard}
      if ( Adverts_Container.Middle_Billboard == undefined ) { Adverts_Container.Middle_Billboard = Base_Ad_for_middle_billboard}
      if ( Adverts_Container.Lower_Billboard == undefined ) { Adverts_Container.Lower_Billboard = Base_Ad_for_lower_billboard}
      if ( Adverts_Container.Email_Billboard == undefined ) { Adverts_Container.Email_Billboard = Base_Ad_for_Email_Billboard}
      
      return Adverts_Container

} catch (error) { Log_error(error) } }

function Check_Regex (expression) {
try {
        let regex_result = []
        let i = 0
        while (i <  expression.length ) {
            regex_result.push( Regex.includes( expression.charAt(i) ) ) 
            i++ }
        if (regex_result.includes(true)) { return true } else{ return false }

} catch (error) { Log_error(error) } }

function Adverts_start$$end_date_genrator ( advert ) {    
try {
        let Date_of_submission_in_milliseconds  = advert.Iso_Date_of_submission.getTime()
        let Days_2_play_day = advert.Days_2_play_day
        let Days_2_add
        
       if (advert.Time_Period == string_4_1_Day) { Days_2_add = 1 }
       if (advert.Time_Period == string_4_7_Days) { Days_2_add = 7 }   
    
        let Days_2_play_day_in_milliseconds = 1000 * 60 * 60 * (Math.floor(Days_2_play_day) * Days_2_add * 24)
        let Total_milliseconds_4_start_date = Date_of_submission_in_milliseconds + Days_2_play_day_in_milliseconds
        let Start_date_in_ISO = new Date(Total_milliseconds_4_start_date)
    
        let Days_2_add_in_milliseconds = 1000 * 60 * 60 * (Days_2_add * 24)
        let Total_milliseconds_4_end_date = Total_milliseconds_4_start_date + Days_2_add_in_milliseconds
        let End_date_in_ISO = new Date(Total_milliseconds_4_end_date)
    
        advert.Start_Date = ""+Start_date_in_ISO+""
        advert.End_Date = ""+End_date_in_ISO+""
        return {Ad: advert, End_Date: Total_milliseconds_4_end_date}

} catch (error) { Log_error(error) } }



function Log_output(output) {        
    fs.writeFile("Text_Files/Test_output_for_email_bodies.html", output, (error) => {if (error) { Log_error(error) } } )    
}




function Add_advert_name_to_text_file (advert_name) {
try {
        data = fs.readFileSync("Text_Files/file_names_for_adverts.txt", "utf-8")
        Objectfied_Data = JSON.parse(data)
        Objectfied_Data.push(advert_name)
        fs.writeFile("Text_Files/file_names_for_adverts.txt", JSON.stringify(Objectfied_Data), (error) => { if (error) { Log_error(error) } } )


} catch (error) { Log_error(error) } }



const file_name_function =  (request, file, cb) => {
try {
        //RANDOM.NUMBER_DATE_BILLBOARD_TIME.PERIOD
        let mimetype = file.mimetype
        let index_of_stroke = mimetype.indexOf('/')
        let file_extension = mimetype.slice(index_of_stroke+1)
        
        let Cokie = request.headers.cookie
        let Encrypted_Cookie = Cokie.slice( "JWT=".length )
        let Dencrypted_Cookie = JWT.verify(Encrypted_Cookie, JWT_Secret)
    
        Advert_object.Billboard = request.body.AdvertisementBillBoard
        Advert_object.Time_Period = request.body.TimePeriod
        Advert_object.Link_2_more_info = request.body.ProductLink
        Advert_object.Owner = Dencrypted_Cookie.Email
    
        Third_party_information.info = Token
    
        Token.Identifier = Dencrypted_Cookie.Email
        Token.Body = Advert_object
        Token.Subject = "Advert confirmation"  
    
    
        if (request.body.TimePeriod == string_4_1_Day ) {
            Add_1_Day_advert(Token).then( (data) => {
                Advert_object.Days_2_play_day = data.Days_2_play_day
                let Generator = Adverts_start$$end_date_genrator( Advert_object )
                let full_advert_name = `${Generator.End_Date}${key_finder_for_epoch_in_advert_file_name}_${Dynamic_Variables.Get_Date_Without_Time()}_${request.body.AdvertisementBillBoard}_${request.body.TimePeriod}.${file_extension}`
                Generator.Ad.Path_2_Ad = `uploads/${full_advert_name}`
                Token.Body = Generator.Ad
                Third_party_information.booleon = data.Boolean
                request.Third_party_information = Third_party_information
                cb(null, full_advert_name)
                if (data.Boolean == false) { fs.unlink(`Static/uploads/${full_advert_name}`, (error) => { if (error) { Log_error(error) } } ) } } ) }
                
          if (request.body.TimePeriod == string_4_7_Days ) {    
            Add_7_Days_advert(Token).then( (data)  => {              
                Advert_object.Days_2_play_day = data.Days_2_play_day
                let Generator = Adverts_start$$end_date_genrator( Advert_object )
                let full_advert_name = `${Generator.End_Date}${key_finder_for_epoch_in_advert_file_name}_${Dynamic_Variables.Get_Date_Without_Time()}_${request.body.AdvertisementBillBoard}_${request.body.TimePeriod}.${file_extension}`
                Generator.Ad.Path_2_Ad = `uploads/${full_advert_name}`
                Token.Body = Generator.Ad
                Third_party_information.booleon = data.Boolean
                request.Third_party_information = Third_party_information            
                cb(null, full_advert_name)
             } ) }


} catch (error) { Log_error(error) } }



function Delete_used_media_from_Server () {
try {
        let Epoch_milliseconds_in_current_date = Dynamic_Variables.Get_Iso_Date().getTime()
        data = fs.readdirSync("Static/uploads", "utf8")
    
        data.forEach( item => {
                let index_for_milliseconds_in_advert_file_name = item.indexOf(key_finder_for_epoch_in_advert_file_name)
                let milliseconds_in_advert_file_name = Number( item.slice(0,index_for_milliseconds_in_advert_file_name) )
                let Advert_is_expired = milliseconds_in_advert_file_name < Epoch_milliseconds_in_current_date
               
                if (Advert_is_expired) { fs.unlinkSync(`Static/uploads/${item}` ) } } )
       data = null


} catch (error) { Log_error(error) } }


function Remove_expired_tokens () { 
try {
        let Current_date_in_epoch = Dynamic_Variables.Get_Iso_Date().getTime()
    
        fs.readdir("Text_Files/Tokens", (error, data) => { 
            if (error) { Log_error(error) } else {
                    data.forEach(token => {
                         let Index_of_Epo_in_token_name = token.indexOf("Epo") 
                         let Index_of_file_extension_in_token_name = token.indexOf(".txt")   
                         let Starting_index_for_Token_expiry_date = Index_of_Epo_in_token_name + 3            
                         let Token_expiry_date = token.slice(Starting_index_for_Token_expiry_date, Index_of_file_extension_in_token_name)
                         let token_is_expired = Current_date_in_epoch > Number(Token_expiry_date)
                         
                         if (token_is_expired) { fs.unlinkSync(`Text_Files/Tokens/${token}`)  } } ) } } )
    
        let eMail_info = Token_templates.Get_eMail_token()
        eMail_info.text = `Checked for expired tokens on ${Dynamic_Variables.Get_Date_String()}`
        Send_Email(eMail_info)


} catch (error) { Log_error(error) } }



function Upadte_linkyard_stats (path) {
   
try {
        data = fs.readFileSync("Text_Files/Stats.txt", 'utf8')
        Objectfied_Data = JSON.parse(data)
        Objectfied_Data[ path ] ++
        fs.writeFileSync("Text_Files/Stats.txt", JSON.stringify(Objectfied_Data))
        
        data = Objectfied_Data = null
} catch (error) { Log_error(error) } }


function Send_linkyard_stats () {
try {
       data = fs.readFileSync("Text_Files/Stats.txt", 'utf8')
       Token.Body = JSON.parse(data)
       Token.Identifier = "kigoziodreck@gmail.com"
       Token.Subject = "Link yard stats"
    
       Send_Email(Token)
       fs.writeFileSync("Text_Files/Stats.txt", JSON.stringify(Linkyard_stats_object))
       Token = data = Objectfied_Data = null
} catch (error) { Log_error(error) } }




//CRON JOBS
scheduleJob(Hour, Remove_expired_tokens)
scheduleJob(_12$00, Select_Daily_Active_Adverts)
scheduleJob(_12$10, Send_Advert_Stats)
scheduleJob(_12$20, Weekly_functions)
scheduleJob(_12$30, Get_Active_Adverts_from_batabase_to_text_file)
scheduleJob(_12$40, Send_User_Stats)
scheduleJob(_12$50, ResetDCs)



function name() {
//Remove_expired_tokens()
//Select_Daily_Active_Adverts()
//Send_Advert_Stats()
//Weekly_functions()
//Get_Active_Adverts_from_batabase_to_text_file()
//Send_User_Stats()
//ResetDCs()




}
name()


module.exports = {    

Upadte_linkyard_stats,
IncreaseNOCs,
Client,
Add_1_Day_advert,
Add_7_Days_advert,
Increase_clicks_on_advert,
Increase_views_on_advert,
Adverts_picker,
Dynamic_Variables,
Write_email_2_text_file,
Check_Regex,
Send_Email,
Log_error,
Add_advert,
Add_advert_name_to_text_file,
file_name_function,

} 
