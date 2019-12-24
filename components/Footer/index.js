import React from 'react';

class AdAside extends React.Component {

  constructor(){
    super();
  }

  render(){

    return (
      <div className="footer">
        <div className="footer-links-wrapper">

          <ul className="footer-link-section">
            <h3>About</h3>
            <li><a href="https://jadeapp.live/contact">Contact us</a></li>
          </ul>

          <ul className="footer-link-section">
            <h3>Links</h3>
            <li><a href='https://prt.wvu.edu/'>PRT Website</a></li>
            <li><a href='https://twitter.com/wvuprtstatus/'>PRT Twitter</a></li>
          </ul>

          <div className="footer-masthead">
            <p>Made by Jonas Reynolds and Curtis Ward</p>
          </div>

        </div>
        <p className="disclaimer">© {new Date().getFullYear()} Jade App Inc. All Rights Reserved. The Flying WV is a registered trademark of West Virginia Univeristy. All statistics presented by this site are provided by public APIs, and are not externally verified. Jade App Inc. is not liable for any incorrect or misrepresented information on this site.</p>
      </div>
    );
  }
}

export default AdAside;
