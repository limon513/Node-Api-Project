                                                UP TIME MONITORING API
The whole context of this project is it's an API for monitoring a website if its up or down,
if the state of the website or server changes the user who has the check gets a alert notification in his corresponding number.
Main Features:
1. The API has Three main Routes. ( 1. user 2. token 3. check )
2. every route has their respective endpoints ( POST, GET, PUT, DELETE )
3. "USER" route features: 1. one can create user by providing Phone number, Password, FirstName, LastName ( all fields have respective validations ).
                          2. as Soon as a user creates profile they should go to the "TOKEN" route and create a token for them using post ( phone, password ) requirs.
                          3. then with the token user can do GET, PUT, DELETE on "user".
4. "token" route features ( after creating a token for user on POST user gets a unique token with a validity, user can extend his token validity time using PUT,
                            and also can GET and DELETE token)
5. "check" route features ( authinticated user can set atmost 5 websites to checks at a time ,
                            user can GET, PUT , DELETE check info 
                            if the given websites change their state means if they go down from up or up from down then the user gets a sms on users corresponding 
                            phone number )
6. For SMS Twilio API is used.
