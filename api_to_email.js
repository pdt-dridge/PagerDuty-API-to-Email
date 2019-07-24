const AWS = require("aws-sdk");

exports.handler = function(event, context) {
  AWS.config.update({ region: "us-east-1" });
  console.log('Handling confirmation email to', event);
  

/** 
 NOTE: The 'event' object has EVERYTHING in the Payload.
 You can select the subsections you want using the relevant path
*/

   const content = event.detail.incident;

  // Format the Incident Payload into pretty/indented JSON
  const textBody = JSON.stringify(content, null, 2);


  // Create sendEmail params
  const params = {
  
	Destination: { /* required */

	    ToAddresses: ['EMAIL_ADDRESS',
	    			  /* more items */
	    			 ],
		
	    CcAddresses: ['EMAIL_ADDRESS',
	      			  /* more items */
	    			 ]
		
	  },
  
    Message: {
      Body: {
        
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
  
      Subject: {
        Charset: "UTF-8",
        Data: "PagerDuty Incident: " +event.detail.incident.summary
      }
    },
  
    Source: "FROM_EMAIL_ADDRESS_HERE",
	
	ReplyToAddresses: ['REPLY_TO_EMAIL_ADDRESS',
	    				/* more items */
	  				  ]
	  
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
   	 				.sendEmail(params)
   				 	.promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(data => {
      console.log(data.MessageId);
      context.done(null, "Success");
    })
    .catch(err => {
      console.error(err, err.stack);
      context.done(null, "Failed");
    });
};
