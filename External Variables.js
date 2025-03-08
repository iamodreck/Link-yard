//REQUIRE STATATEMENTS
require('dotenv').config()
const fs = require('fs')
const { scheduleJob } = require('node-schedule')
const JWT = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const { JSDOM } = require('jsdom')
const multer = require("multer");
const Email_Auth = { user:"kigoziodreck1@gmail.com", pass:"woav dcvc lxou pvij" }
const express = require('express')
const BodyParser = require('body-parser')
const app = express()
const bcryptjs = require("bcryptjs")
const { MongoClient, } = require('mongodb');
const path = require('path');


class Dynamic_Variables {

    static Get_Advert_ID () {  return Number( Math.random().toString().slice(2,7) ) }

    static Get_ID () { return Number( Math.random().toString().slice(2,7) ) }

    static Get_Subject_Code () { return Number( Math.random().toString().slice(2,7) ) }

    static Get_Date_String () { return Date() }

    static Get_Date_Without_Time () { return ( new Date () ).toDateString() }

    static Get_Iso_Date () { return ( new Date () ) }

    static Get_Iso_Date_from_milliseconds (milliseconds) { return new Date( Number(milliseconds) ) }

 }




 class Token_templates {
  
    static Get_transporter_token () {
        let Six_hours_in_milliseconds = 6 * 60 * 60 * 1000
        let Current_date_in_epoch = Dynamic_Variables.Get_Iso_Date().getTime()

              return {
                Identifier: undefined,
                Subject: undefined,
                Body: {},
                Subject_Code: Dynamic_Variables.Get_Subject_Code(),
                ID: Dynamic_Variables.Get_ID(),
                Has_been_used:false,
                Has_secondary_token:false,
                Expiry_date: Six_hours_in_milliseconds + Current_date_in_epoch,
                Created_At: Dynamic_Variables.Get_Iso_Date(),
                Date_Initiated: Dynamic_Variables.Get_Date_String() } }

    
    static Get_error_token (error) {
        return { 
            cause: error.cause, 
            code: error.code, 
            field: error.field, 
            message: error.message, 
            name: error.name, 
            stack: error.stack, 
            path: error.path } }


    static Get_eMail_token () { 
        return { 
            to:"kigoziodreck@gmail.com",
            from:"kigoziodreck@gmail1.com",
            Subject:"Server operations",
            html:undefined,
            text:undefined} }

    static Get_cookie_token () { 
        return {
            Domain:"linkyard.com",
            Email: undefined,
            Session_time:Dynamic_Variables.Get_Date_String() } }

    static Get_user_token () { 
        return {
            User_name: null,
            Email: null,
            Password: null,
            Phone_Number:null,
            User_Number: null,
            Account_Preferences:{ Stats_Emails: false, Updates:false},
            Links: [ ],
            Last_active:Dynamic_Variables.Get_Iso_Date(),
            Session_time : Dynamic_Variables.Get_Date_String(),
            Date_Initiated: Dynamic_Variables.Get_Date_String() } }


    static Get_advert_token () { 
        return {
            Owner:null,
            Billboard:null,
            Link_2_more_info:null,
            Time_Period:null,
            Path_2_Ad:null,
            ID:Dynamic_Variables.Get_ID(),
            Number_of_views_on_ad:0,
            Number_of_clicks_on_ad_link:0,
            Number_of_views_on_ad_4_today:0,
            Number_of_clicks_on_ad_link_4_today:0,
            Hour_counter_on_update:null,
            Minute_counter_on_update:null,
            Date_Initiated: Dynamic_Variables.Get_Date_String(),            
            Start_Date:null,
            End_Date:null,
            Days_2_play_day:null,
            Iso_Date_of_submission:Dynamic_Variables.Get_Iso_Date() } }

    static Get_adverts_container() {
        return {
            Name:null,
            Upper_Billboard:[],
            Middle_Billboard:[],
            Lower_Billboard:[],
            Email_Billboard:[],
            Date_Initiated: Dynamic_Variables.Get_Date_String(),
            Date_Returned:undefined } }

    static Get_user_link() {
        return { Title: undefined,
                 Href: undefined,
                 Total_clicks: 0,
                 Today_clciks:0,
                 Android:0 ,
                 iPhone:0,
                 Desktop:0,
                 Others:0 } }

}


//ENVIRONMENTAL VARIABLES

const JWT_Secret = process.env.JWT_Secret
const Port = process.env.Port
const Rounds_for_bcrypt_salt = process.env.Rounds_for_bcrypt_salt
const bcryptjs_salt = bcryptjs.genSaltSync( Number(Rounds_for_bcrypt_salt) )
const URI = process.env.Local_host_uri


const Adverts_Containment_Period_in_weeks = process.env.Adverts_Containment_Period_in_weeks
const Adverts_Containment_Period_in_Days = Adverts_Containment_Period_in_weeks * 7


const Daily_Adverts_in_active_container_for_Upper_Billboard = process.env.Daily_Adverts_in_active_container_for_Upper_Billboard
const Daily_Adverts_in_active_container_for_Middle_Billboard = process.env.Daily_Adverts_in_active_container_for_Middle_Billboard
const Daily_Adverts_in_active_container_for_Lower_Billboard = process.env.Daily_Adverts_in_active_container_for_Lower_Billboard
const Daily_Adverts_in_active_container_for_Email_Billboard = process.env.Daily_Adverts_in_active_container_for_Email_Billboard

const Weekly_Adverts_in_active_container_for_Upper_Billboard = process.env.Weekly_Adverts_in_active_container_for_Upper_Billboard
const Weekly_Adverts_in_active_container_for_Middle_Billboard = process.env.Weekly_Adverts_in_active_container_for_Middle_Billboard
const Weekly_Adverts_in_active_container_for_Lower_Billboard = process.env.Weekly_Adverts_in_active_container_for_Lower_Billboard
const Weekly_Adverts_in_active_container_for_Email_Billboard = process.env.Weekly_Adverts_in_active_container_for_Email_Billboard

const Containment_capacity_4_UB = process.env.Containment_capacity_4_UB
const Containment_capacity_4_MB = process.env.Containment_capacity_4_MB
const Containment_capacity_4_LB = process.env.Containment_capacity_4_LB
const Containment_capacity_4_EB = process.env.Containment_capacity_4_EB



const Adverts_contaiment_Stats = {
    Containment_Period: Adverts_Containment_Period_in_weeks,

    Daily:{
        Upper_Billboard:{
             Active_Container: process.env.Daily_Adverts_in_active_container_for_Upper_Billboard,
             General_Container: process.env.Daily_Adverts_in_active_container_for_Upper_Billboard * Adverts_Containment_Period_in_Days,
             Pending_Container: ( process.env.Daily_Adverts_in_active_container_for_Upper_Billboard * Adverts_Containment_Period_in_Days
                                ) - process.env.Daily_Adverts_in_active_container_for_Upper_Billboard },

        Middle_Billboard:{
            Active_Container: process.env.Daily_Adverts_in_active_container_for_Middle_Billboard,
            General_Container: process.env.Daily_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_Days,
            Pending_Container: ( process.env.Daily_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_Days
                               ) - process.env.Daily_Adverts_in_active_container_for_Middle_Billboard },

        Lower_Billboard:{
            Active_Container: process.env.Daily_Adverts_in_active_container_for_Lower_Billboard,
            General_Container: process.env.Daily_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_Days,
            Pending_Container: ( process.env.Daily_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_Days
                               ) - process.env.Daily_Adverts_in_active_container_for_Lower_Billboard },
        
        Email_Billboard:{
            Active_Container: process.env.Daily_Adverts_in_active_container_for_Email_Billboard,
            General_Container: process.env.Daily_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_Days,
            Pending_Container: ( process.env.Daily_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_Days
                               ) - process.env.Daily_Adverts_in_active_container_for_Email_Billboard }, },

    Weekly:{
        Upper_Billboard:{
            Active_Container: process.env.Weekly_Adverts_in_active_container_for_Upper_Billboard,
            General_Container: process.env.Weekly_Adverts_in_active_container_for_Upper_Billboard * Adverts_Containment_Period_in_weeks,
            Pending_Container: ( process.env.Weekly_Adverts_in_active_container_for_Upper_Billboard * Adverts_Containment_Period_in_weeks
                               ) - process.env.Weekly_Adverts_in_active_container_for_Upper_Billboard },

        Middle_Billboard:{
            Active_Container: process.env.Weekly_Adverts_in_active_container_for_Middle_Billboard,
            General_Container: process.env.Weekly_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_weeks,
            Pending_Container: ( process.env.Weekly_Adverts_in_active_container_for_Middle_Billboard * Adverts_Containment_Period_in_weeks
                               ) - process.env.Weekly_Adverts_in_active_container_for_Middle_Billboard },

        Lower_Billboard:{
            Active_Container: process.env.Weekly_Adverts_in_active_container_for_Lower_Billboard,
            General_Container: process.env.Weekly_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_weeks,
            Pending_Container: ( process.env.Weekly_Adverts_in_active_container_for_Lower_Billboard * Adverts_Containment_Period_in_weeks
                               ) - process.env.Weekly_Adverts_in_active_container_for_Lower_Billboard },
        
        Email_Billboard:{
            Active_Container: process.env.Weekly_Adverts_in_active_container_for_Email_Billboard,
            General_Container: process.env.Weekly_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_weeks,
            Pending_Container: ( process.env.Weekly_Adverts_in_active_container_for_Email_Billboard * Adverts_Containment_Period_in_weeks
                               ) - process.env.Weekly_Adverts_in_active_container_for_Email_Billboard },}
}


const Details_for_advert_info_table = {

    Daily_Budget: { Upper_Billboard: process.env.Daily_Budget_for_Upper_Billboard,
                    Middle_Billboard: process.env.Daily_Budget_for_Middle_Billboard,
                    Lower_Billboard: process.env.Daily_Budget_for_Lower_Billboard },

    Weekly_Budget: { Upper_Billboard: process.env.Weekly_Budget_for_Upper_Billboard,
                     Middle_Billboard: process.env.Weekly_Budget_for_Middle_Billboard,
                     Lower_Billboard: process.env.Weekly_Budget_for_Lower_Billboard },

    Rate_of_play_per_hour:{ Upper_Billboard: 60 / process.env.Number_of_adverts_in_container_for_Upper_Billboard ,
                            Middle_Billboard: 60 / process.env.Number_of_adverts_in_container_for_Middle_Billboard,
                            Lower_Billboard: 60 / process.env.Number_of_adverts_in_container_for_Lower_Billboard },

    Plays_per_hour:{ Upper_Billboard: 60 / process.env.Number_of_adverts_in_container_for_Upper_Billboard,
                     Middle_Billboard: 60 / process.env.Number_of_adverts_in_container_for_Middle_Billboard,
                     Lower_Billboard:60 / process.env.Number_of_adverts_in_container_for_Lower_Billboard }
}




var transporter = nodemailer.createTransport( { service: 'gmail', auth:  Email_Auth } );
const Client = new MongoClient(URI , { useUnifiedTopology: true } )

const Max_Age_4_cookies = 2592000000

const _12$00 = "0 0  * * *"
const _12$10 = "10 0  * * *"
const _12$20 = "20 0  * * *"
const _12$30 = "30 0  * * *"
const _12$40 = "40 0  * * *"
const _12$50 = "50 0  * * *"
const Hour = "0 * * * *"

const key_finder_for_epoch_in_advert_file_name = "Epo"
const String_4_Upper_Billboard = "Upper_Billboard"
const String_4_Middle_Billboard = "Middle_Billboard"
const String_4_Lower_Billboard = "Lower_Billboard"
const String_4_Email_Billboard = "Email_Billboard"
const string_4_1_Day = "1_Day"
const string_4_7_Days = "7_Days"
const string_4_Active_Adverts = "Active_Adverts"
const string_4_Pending_Adverts = "Pending_Adverts"

const Regex = [ "%", "*" , "&" , "!", "/" , "#" , '$' , "@" , "<" , ">" , "^" , "(" , ")"]
const Seeded_URLs = ["/account", "/adminconsole", "/analysis", "/deleteaccount", "/profile", "/promotions", "/settings"]
const Un_Seeded_URLs = [ "/", "/inquiries", "/me", "/signin", "/signup", "/info", "/confirmation1", "/confirmation2"]
const Adverts = []


//FILE PATHS
const Path_2_emails_text_file = `Text_Files/Users_Emails.txt`
const Path_2_text_files_4_1_Email_Bodies = `Text_Files/Email Bodies/#File_Name.html`
const Path_2_Adverts_container = `Text_Files/Adverts_Container.txt`
const Path_2_test_output_for_email_bodies= "Text_Files/Test_output_for_email_bodies.html"
const Path_2_static_files = path.join(__dirname, "Static")
const Linkyard_stats_object = { "/account":0,"/adminconsole":0,"/analysis":0,"/confirmation2":0,"/confirmation1":0,"/deleteaccount":0,"/info":0,"/inquries":0, "/me":0,"/profile":0,"/promotions":0,"/settings":0,"/signin":0,"/signup":0, "/":0}

const Third_party_information = {booleon:undefined, info:undefined, User_object: undefined, Current_ads:undefined}
let Advert_object  = null
let Token = null
let Adverts_Container = null
let User_object = null
let cookie = null
let Objectfied_Data = null
let data = null
let JWT_Payload = null
let DB_result = null
let Message = null
let Current_ads = null

const Base_Ad_for_upper_billboard = {
    Owner:"Link_Yard",
    Billboard:String_4_Upper_Billboard,
    Link_2_more_info:undefined,
    Time_Period:undefined,
    Path_2_Ad:"Media/InitialAdverts/CryptoVid.mp4",
    Ad_ID:1,
    Number_of_views_on_ad:undefined,
    Number_of_clicks_on_ad_link:undefined,
    Date_Initiated:undefined
}

const Base_Ad_for_middle_billboard = {
    Owner:"Link_Yard",
    Billboard:String_4_Middle_Billboard,
    Link_2_more_info:"Media/InitialAdverts/CMD.mp4",
    Time_Period:undefined,
    Path_2_Ad:undefined,
    Ad_ID:2,
    Number_of_views_on_ad:undefined,
    Number_of_clicks_on_ad_link:undefined,
    Date_Initiated:undefined
}

const Base_Ad_for_lower_billboard = {
    Owner:"Link_Yard",
    Billboard:String_4_Lower_Billboard,
    Link_2_more_info:undefined,
    Time_Period:undefined,
    Path_2_Ad:"Media/InitialAdverts/linkie.mp4",
    Ad_ID:3,
    Number_of_views_on_ad:undefined,
    Number_of_clicks_on_ad_link:undefined,
    Date_Initiated:undefined
}

const Base_Ad_for_Email_Billboard = {
    Owner:"Link_Yard",
    Billboard:String_4_Email_Billboard,
    Link_2_more_info:undefined,
    Time_Period:undefined,
    Path_2_Ad:"Media/InitialAdverts/TikTok.mp4",
    Ad_ID:4,
    Number_of_views_on_ad:undefined,
    Number_of_clicks_on_ad_link:undefined,
    Date_Initiated:undefined
}

const Adverts_Counter_Converter_for_Upper_Billboard = {
    0:0, 1:1, 2:2, 3:3, 4:4,
    5:0, 6:1, 7:2, 8:3, 9:4,
    10:0, 11:1, 12:2, 13:3, 14:4, 
    15:0, 16:1, 17:2, 18:3, 19:4, 
    20:0, 21:1, 22:2, 23:3, 24:4,
    25:0, 26:1, 27:2, 28:3, 29:4,
    30:0, 31:1, 32:2, 33:3, 34:4,
    35:0, 36:1, 37:2, 38:3, 39:4,
    40:0, 41:1, 42:2, 43:3, 44:4,
    45:0, 46:1, 47:2, 48:3, 49:4,
    50:0, 51:1, 52:2, 53:3, 54:4,
    55:0, 56:1, 57:2, 58:3, 59:4
}

const Adverts_Counter_Converter_for_Middle_Billboard = {
    0:0, 1:1, 2:2, 3:3, 4:4, 5:5,
    6:0, 7:1, 8:2, 9:3, 10:4, 11:5,
    12:0, 13:1, 14:2, 15:3, 16:4, 17:5,
    18:0, 19:1, 20:2, 21:3, 22:4, 23:5,
    24:0, 25:1, 26:2, 27:3, 28:4, 29:5,
    30:0, 31:1, 32:2, 33:3, 34:4, 35:5,
    36:0, 37:1, 38:2, 39:3, 40:4, 41:5,
    42:0, 43:1, 44:2, 45:3, 46:4, 47:5, 
    48:0, 49:1, 50:2, 51:3, 52:4, 53:5,
    54:0, 55:1, 56:2, 57:3, 58:4, 59:5
}

const Adverts_Counter_Converter_for_Lower_Billboard = {
    0:0,  1:1,  2:2,  3:3,  4:4,  5:5,  6:6,  7:7,  8:8,  9:9,
    10:0, 11:1, 12:2, 13:3, 14:4, 15:5, 16:6, 17:7, 18:8, 19:9,
    20:0, 21:1, 22:2, 23:3, 24:4, 25:5, 26:6, 27:7, 28:8, 29:9,
    30:0, 31:1, 32:2, 33:3, 34:4, 35:5, 36:6, 37:7, 38:8, 39:9,
    40:0, 41:1, 42:2, 43:3, 44:4, 45:5, 46:6, 47:7, 48:8, 49:9,
    50:0, 51:1, 52:2, 53:3, 54:4, 55:5, 56:6, 57:7, 58:8, 59:9,
}

const Messages_Object = {
    EMAIL_ALREADY_EXISTS:"Email already exists, stop copying",
    UNSTABLE_PASSWORD:"Be smart and choose a stong password",
    PHONE_NUMBER_ALREADY_EXISTS:"Phone number already exists, get yos",
    USER_NAME_ALREADY_EXISTS:"User name already exists, be creative and find another one",
    INVALID_USER_NAME:"User name contains invalid characters, yo not writting your ussual yada yada here",
    UNKNOWN_ERROR:"Somthing went wrong, try again",
    PASSWORDS_MISMATCH:"The passwords you have provided do not match",
    EMAIL_NOT_FOUND:"Email not found",
    WRONG_PASSWORD:"Provided password is wrong",
    PHONE_NUMBER_NOT_FOUND:"Phone Number not found",
    USER_NAME_NOT_FOUND:"User Name not found ",
    CONTAINER_FULL: "Container full",
    LARGE_ADVERT_SIZE:"Selected file is too large, remenber that size limit is 10 mbs",
    SUCCESFULL_ADVERT_SUBMISSSION: " Your advert has been submitted, check your email for more information",
    LINK_YARD_USER_NOT_FOUND:"Link Yard user with the above name not found",
    UNDELETABLE_LINK:"The link you selected cannot be deleted, for more information, check inquries page",
    EXPIRED_TOKEN:"Code  is expired",
    INVALID_FILE_TYPE_VIDEOS:"Only videos are allowed here",
    INVALID_FILE_TYPE_FOR_PHOTOS:"Only photos are allowed here",
    WRONG_CODE:"Code provided is wrong",
    NOT_LOGGED_IN:"Hello it looks like your not logged in to Link Yard",
    CHANGED_SECURITY_DETAILS:"It looks like the account you are trying to access has changed some security details therefore, you will have to log in again",
    DUPLICATE_ACTION:"The code provided has already been used",
    ORIGINAL_MESSAGE:"Helllo, this is where Link Yard directs you inacase of an error with in your operations and activity",
    TOKEN_HAS_SECONDARY_TOKEN:"You have requested for another code",
    HAS_ALREADY_USED_CODE_FROM_PREVIOUS_TOKEN:"You have already used previous code to succesfully complete this action",
    UNKNOWN_URL: "Un knownk url",
    UNAUTHORISED_ACCESS:"Currently, ou do not have permission to view the page you were trying to acces",
    SOMETHING_WENT_WRONG:"Something went wrong, but this is not your fault. \n A report of this incident has been sent to Link yard's creator. \n Try gain after one minute"
}



 module.exports = {
    scheduleJob,
    fs,
    multer,
    JSDOM,
    BodyParser,
    express,
    JWT,
    nodemailer,
    path,
    bcryptjs,


    JWT_Secret,
    Advert_object,
    Regex,
    _12$00,
    _12$10,
    _12$20,
    _12$30,
    _12$40,
    _12$50,
    Hour,
    Token,

    Adverts_Counter_Converter_for_Upper_Billboard,
    Adverts_Counter_Converter_for_Middle_Billboard,
    Adverts_Counter_Converter_for_Lower_Billboard,

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
    string_4_Active_Adverts,
    string_4_Pending_Adverts,

    Messages_Object,
    data,
    Adverts,

    Base_Ad_for_upper_billboard,
    Base_Ad_for_middle_billboard,
    Base_Ad_for_lower_billboard,
    Base_Ad_for_Email_Billboard,

    Path_2_emails_text_file,
    Path_2_text_files_4_1_Email_Bodies,
    Path_2_Adverts_container,
    Path_2_test_output_for_email_bodies,
    Path_2_static_files,
    Objectfied_Data,
    Linkyard_stats_object,




    JWT_Secret,
    Max_Age_4_cookies,
    Port,
    bcryptjs_salt,
    key_finder_for_epoch_in_advert_file_name,
    JWT_Payload,

    Email_Auth,
    Dynamic_Variables,
    Token_templates,
    Adverts_contaiment_Stats,
    Details_for_advert_info_table,
    Seeded_URLs,
    Un_Seeded_URLs,
    app,

    Third_party_information,
    Client,
    transporter,
    Containment_capacity_4_UB,
    Containment_capacity_4_MB,
    Containment_capacity_4_LB,
    Containment_capacity_4_EB,
    Adverts_Container,
    User_object,
    cookie,
    DB_result,
    Current_ads,
    Message
 }
