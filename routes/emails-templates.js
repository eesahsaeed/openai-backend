
function getInitialEmail(name, companyName){
  return ` 
    <html>
      <body>
        <p>
          Hi ${name},
        </p>
        <p>
          We see that you are currently hiring software developers for your company.
        </p>
        <p>
          Is it an arduous process to find the right candidate?
        </p>
        <p>
          We are ready to work along with you to get the right talent.
        </p>

        <p>
          40% of respondents said that the most challenging phase of the recruitment life cycle is sourcing candidates. (Statista, 2020)
        </p>
        <p>
          With Good Staffing, we ensure to have the right people, with the right skills, at the right price.\nWe work with an existing network of talented designers, developers and sales professionals.
        </p>
        <p>
          We make the process of onboarding a fantastic experience for candidates and a simplified process for ${companyName}.
        </p>
        <p>
          Would you like to join hands?
        </p>
        <br/>
        <p>
          Regards,
          <br/>
          Austin Lewis
          <br/>
          Founder
          <br/>
          Good Staffing 
        </p>
        <br/>
        <p>
          If you want to unsubscribe - <a href="#unsub-link">Click here</a>
        </p>
      </body>
    </html>

  `;
}

function getFollowUp1Email(name, companyName){
  return ` 
    <html>
      <body>
        
      <p>
      Hi ${name},
    </p>
    <p>
      Did you read my previous mail regarding getting the right candidates for ${companyName}?
    </p>
    <p>
      Our services will help you find a good candidate as:
    </p>
    <ul>
      <li>We're better at finding software engineers in 30 days or less.</li>
      <li>If the search goes over 30 days, we will reduce our fees.</li>
      <li>With very few meetings and without any hassle, we begin the search.</li>
      <li>One point of contact per client.</li>
      <li>Competitive pricing.</li>
    </ul>

    <p>
      Respond with a ‘Yes’, if you are interested.
    </p>
    <p>
      Need more clarity? We’re just a <a href="tel:123456789">call</a> away.
    </p>
    <br/>
    <p>
      Regards,
      <br/>
      Austin Lewis
      <br/>
      Founder
      <br/>
      Good Staffing 
    </p>
    <br/>
    <p>
      If you want to unsubscribe - <a href="#unsub-link">Click here</a>
    </p>
  
      </body>
    </html>
  `;
}

function getFollowUp2Email(name, companyName){
  return `
    <html>
      <body>      
        <p>
          Hi ${name},
        </p>
        <p>
          What’s your take on getting the right candidates for ${companyName}?
        </p>
        <p>
          We also help you in getting Full Time Employees and Freelancers.
        </p>
        <p>
          We take up the initial work of finding the right candidates, setting interviews, and completing the onboarding process.
        </p>

        <p>
          You need to pay only when they start at your company.
        </p>
        <p>
          Wondering how? Book a <a href="tel:123456789">call</a> with us to know more.
        </p>
        <br/>
        <p>
          Regards,
          <br/>
          Austin Lewis
          <br/>
          Founder
          <br/>
          Good Staffing 
        </p>
        <br/>
        <p>
          If you want to unsubscribe - <a href="#unsub-link">Click here</a>
        </p>
      
      </body>
    </html>
  `;
}

function getFollowUp3Email(name, companyName){
  return ` 
    <html>
      <body>
        <p>
          Hi ${name},
        </p>
        <p>
          This will be my last message regarding staffing.
        </p>
        <p>
          Contact us when you are facing difficulties to hire for a toughest role in ${companyName}.
        </p>
        <p>
          We are ready to work along with you to get the right talent.
        </p>

        <p>
          Until then, I wish you the best!
        </p>
        <br/>
        <p>
          Regards,
          <br/>
          Austin Lewis
          <br/>
          Founder
          <br/>
          Good Staffing 
        </p>
      </body>
    </html>
  `;
}

module.exports = {getInitialEmail};
