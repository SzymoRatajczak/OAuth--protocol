//Node is able to leverage HTTP request without help any third pary modules
//I chose reqest( in the server) implementation over manually reqest implementation for simplicity and better readibility

var express=require('express');
var router=express.Router();
var uuid=require('node-uuid');
var request=require('request');

var SERVER_URL='Your server url';
var REDIRECT_SERVER_URL='redirect url';

var CLIENT_ID='Your CLIENT_ID';

router.get('/', function(req,res,next)
{
	var state=uuid.v4();
	req.session.state=state;
	
	
	var options={
		
		url:SERVER_URL+'/authorize',
		client_id:CLIENT_ID,
		redirect_uri:REDIRECT_SERVER_URL+'/callback',
		state:state,
		response_type='code',
		user_id:1
	};
	
	
	var authorizationUrl=options.url+'?redirect_uri='+options.redirect_uri+'&user_id='+options.user_id+'&client_id='+options.client_id+'/&response_type='+options.response_type+'/&state='+options.state;
res.render('index',{
	
	authorizationUrl:authorizationUrl
});
	//we render template called index and provide  authorizationUrl in order to hardcoind client's details into the template itself
	
});



router.get('/callback',function(req,res,next))
{
	var state=req.query.state;
	var code=req.query.code;
	
	//compare state with the session's state
	if(state!==req.session.state)
	{
		next(new Error('session does not match'));
		
	}
	request.post(
	{
		url:SERVER_URL+'/token',
		form:{
			code:code,
			grant_type:'authorization_code',
			redirect_uri:'REDIRECT_SERVER_URL'+'/callback',
			client_id:CLIENT_ID
			
		}},function (err,response,body)
		{
			if(err)
			{
				next(err);
			}
			var resp=JSON.parse(body);
			var accessToken=resp.access_token;
			//use accessToken for a protected resource request
			
			
			
			
		}
		
		
		
		);
	
	
	
	
}